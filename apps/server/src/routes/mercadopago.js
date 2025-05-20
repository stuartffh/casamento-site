const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Webhook para receber notificações do Mercado Pago
router.post('/', async (req, res) => {
  try {
    const { data } = req.body;
    
    // Verificar se é uma notificação de pagamento
    if (data && data.id) {
      const paymentId = data.id;
      
      // Buscar pedido com este paymentId
      const order = await prisma.order.findFirst({
        where: { paymentId: String(paymentId) },
        include: { present: true }
      });
      
      if (order) {
        // Atualizar status do pedido (em um caso real, verificaríamos o status no Mercado Pago)
        // Aqui estamos apenas simulando a atualização
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'paid' }
        });
        
        // Atualizar estoque do presente
        if (order.present.stock > 0) {
          await prisma.present.update({
            where: { id: order.present.id },
            data: { stock: order.present.stock - 1 }
          });
        }
        
        // Aqui seria implementado o envio de e-mail de confirmação
        // usando SendGrid ou outro serviço
      }
    }
    
    res.status(200).json({ message: 'Webhook recebido com sucesso' });
  } catch (error) {
    console.error('Erro no webhook do Mercado Pago:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Criar pedido e iniciar pagamento
router.post('/create-payment', async (req, res) => {
  try {
    const { presentId, customerName, customerEmail } = req.body;
    
    // Verificar se o presente existe
    const present = await prisma.present.findUnique({
      where: { id: Number(presentId) }
    });
    
    if (!present) {
      return res.status(404).json({ message: 'Presente não encontrado' });
    }
    
    // Criar pedido no banco de dados
    const order = await prisma.order.create({
      data: {
        presentId: present.id,
        customerName,
        customerEmail,
        status: 'pending',
        paymentId: `test_${Date.now()}` // Em produção, seria o ID retornado pelo Mercado Pago
      }
    });
    
    // Em um ambiente real, aqui seria feita a integração com a API do Mercado Pago
    // para criar a preferência de pagamento e obter o link de checkout
    
    // Simulando resposta do Mercado Pago para ambiente de teste
    const checkoutUrl = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${order.paymentId}`;
    
    res.json({
      order,
      checkoutUrl
    });
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;
