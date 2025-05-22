const express = require('express');
const { PrismaClient } = require('@prisma/client');
const mercadopago = require('mercadopago');
const router = express.Router();
const prisma = new PrismaClient();

// Função para obter as configurações do Mercado Pago
async function getMercadoPagoConfig() {
  const config = await prisma.config.findFirst();
  
  if (!config || !config.mercadoPagoAccessToken) {
    throw new Error('Configurações do Mercado Pago não encontradas');
  }
  
  return {
    accessToken: config.mercadoPagoAccessToken,
    publicKey: config.mercadoPagoPublicKey,
    webhookUrl: config.mercadoPagoWebhookUrl,
    notificationUrl: config.mercadoPagoNotificationUrl
  };
}

// Inicializar o SDK do Mercado Pago com o token de acesso
async function initMercadoPago() {
  try {
    const { accessToken } = await getMercadoPagoConfig();
    mercadopago.configure({
      access_token: accessToken
    });
    return true;
  } catch (error) {
    console.error('Erro ao inicializar Mercado Pago:', error);
    return false;
  }
}

// Criar preferência de pagamento para um presente
router.post('/create-preference', async (req, res) => {
  try {
    const { presentId, customerName, customerEmail } = req.body;
    
    if (!presentId || !customerName) {
      return res.status(400).json({ message: 'ID do presente e nome do cliente são obrigatórios' });
    }
    
    // Inicializar o SDK do Mercado Pago
    const initialized = await initMercadoPago();
    if (!initialized) {
      return res.status(500).json({ message: 'Erro ao inicializar Mercado Pago' });
    }
    
    // Buscar o presente no banco de dados
    const present = await prisma.present.findUnique({
      where: { id: parseInt(presentId) }
    });
    
    if (!present) {
      return res.status(404).json({ message: 'Presente não encontrado' });
    }
    
    // Verificar se o presente ainda está disponível
    if (present.stock <= 0) {
      return res.status(400).json({ message: 'Este presente não está mais disponível' });
    }
    
    // Obter configurações do site
    const config = await prisma.config.findFirst();
    const siteTitle = config?.siteTitle || 'Casamento';
    
    // Obter URLs de notificação
    const { notificationUrl, webhookUrl } = await getMercadoPagoConfig();
    
    // Criar um pedido no banco de dados
    const order = await prisma.order.create({
      data: {
        presentId: present.id,
        customerName,
        customerEmail: customerEmail || '',
        status: 'pending'
      }
    });
    
    // Criar a preferência de pagamento no Mercado Pago
    const preference = {
      items: [
        {
          id: `present-${present.id}`,
          title: present.name,
          description: present.description || `Presente para ${siteTitle}`,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: present.price
        }
      ],
      payer: {
        name: customerName,
        email: customerEmail || 'cliente@exemplo.com'
      },
      external_reference: `order-${order.id}`,
      back_urls: {
        success: `${req.protocol}://${req.get('host')}/presentes/confirmacao?status=success&order_id=${order.id}`,
        failure: `${req.protocol}://${req.get('host')}/presentes/confirmacao?status=failure&order_id=${order.id}`,
        pending: `${req.protocol}://${req.get('host')}/presentes/confirmacao?status=pending&order_id=${order.id}`
      },
      auto_return: 'approved',
      notification_url: notificationUrl || `${req.protocol}://${req.get('host')}/api/mercadopago/webhook`,
      statement_descriptor: siteTitle
    };
    
    const response = await mercadopago.preferences.create(preference);
    
    // Atualizar o pedido com o ID de pagamento
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentId: response.body.id
      }
    });
    
    res.json({
      id: response.body.id,
      init_point: response.body.init_point,
      sandbox_init_point: response.body.sandbox_init_point,
      orderId: order.id
    });
  } catch (error) {
    console.error('Erro ao criar preferência de pagamento:', error);
    res.status(500).json({ message: 'Erro ao processar pagamento', error: error.message });
  }
});

// Webhook para receber notificações do Mercado Pago
router.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;
    
    // Verificar se é uma notificação de pagamento
    if (type === 'payment') {
      const paymentId = data.id;
      
      // Inicializar o SDK do Mercado Pago
      const initialized = await initMercadoPago();
      if (!initialized) {
        return res.status(500).json({ message: 'Erro ao inicializar Mercado Pago' });
      }
      
      // Buscar informações do pagamento
      const payment = await mercadopago.payment.get(paymentId);
      
      if (payment && payment.body) {
        const { external_reference, status } = payment.body;
        
        // Extrair o ID do pedido do external_reference
        const orderId = external_reference.replace('order-', '');
        
        // Atualizar o status do pedido
        await prisma.order.update({
          where: { id: parseInt(orderId) },
          data: {
            status: status === 'approved' ? 'paid' : status
          }
        });
        
        // Se o pagamento foi aprovado, reduzir o estoque do presente e registrar a venda
        if (status === 'approved') {
          const order = await prisma.order.findUnique({
            where: { id: parseInt(orderId) },
            include: { present: true }
          });
          
          if (order && order.present) {
            // Reduzir o estoque do presente
            await prisma.present.update({
              where: { id: order.present.id },
              data: {
                stock: Math.max(0, order.present.stock - 1)
              }
            });
            
            // Registrar a venda na nova tabela Sale
            await prisma.sale.create({
              data: {
                presentId: order.present.id,
                customerName: order.customerName,
                customerEmail: order.customerEmail,
                amount: order.present.price,
                paymentMethod: 'mercadopago',
                paymentId: payment.body.id.toString(),
                status: 'paid',
                notes: `Pagamento aprovado via Mercado Pago. ID do pedido: ${orderId}`
              }
            });
          }
        }
      }
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Erro ao processar webhook do Mercado Pago:', error);
    res.status(500).json({ message: 'Erro ao processar notificação', error: error.message });
  }
});

// Verificar status de um pedido
router.get('/order/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: { present: true }
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({ message: 'Erro ao buscar pedido', error: error.message });
  }
});

module.exports = router;
