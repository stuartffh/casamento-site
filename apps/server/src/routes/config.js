const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Obter configurações (público)
router.get('/', async (req, res) => {
  try {
    let config = await prisma.config.findFirst();
    
    if (!config) {
      // Criar configuração padrão se não existir
      config = await prisma.config.create({
        data: {
          pixKey: '',
          pixDescription: '',
          mercadoPagoToken: ''
        }
      });
    }
    
    // Remover token do Mercado Pago para requisições públicas
    if (!req.user) {
      config.mercadoPagoToken = undefined;
    }
    
    res.json(config);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Atualizar configurações (protegido)
router.put('/', authenticateJWT, async (req, res) => {
  try {
    const { pixKey, pixDescription, mercadoPagoToken, pixQrCodeImage } = req.body;
    
    let config = await prisma.config.findFirst();
    
    if (config) {
      config = await prisma.config.update({
        where: { id: config.id },
        data: {
          pixKey,
          pixDescription,
          mercadoPagoToken,
          pixQrCodeImage
        }
      });
    } else {
      config = await prisma.config.create({
        data: {
          pixKey,
          pixDescription,
          mercadoPagoToken,
          pixQrCodeImage
        }
      });
    }
    
    res.json(config);
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;
