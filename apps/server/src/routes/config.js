const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateJWT } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const prisma = new PrismaClient();

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../public/uploads/pix');
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'qrcode-' + uniqueSuffix + ext);
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado. Use apenas JPG, PNG, GIF ou WebP.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Obter configurações (público)
router.get('/', async (req, res) => {
  try {
    let config = await prisma.config.findFirst();
    
    if (!config) {
      // Criar configuração padrão se não existir
      config = await prisma.config.create({
        data: {
          siteTitle: 'Marília & Iago',
          weddingDate: '',
          pixKey: '',
          pixDescription: '',
          mercadoPagoToken: '',
          pixQrCodeImage: ''
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

// Upload de QR Code PIX (protegido)
router.post('/upload-qrcode', authenticateJWT, upload.single('qrcode'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado' });
    }
    
    // Caminho relativo para o arquivo (para salvar no banco)
    const relativePath = `/uploads/pix/${req.file.filename}`;
    
    res.json({
      message: 'Upload realizado com sucesso',
      imagePath: relativePath
    });
  } catch (error) {
    console.error('Erro ao fazer upload do QR Code:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Atualizar configurações (protegido)
router.put('/', authenticateJWT, async (req, res) => {
  try {
    const { siteTitle, weddingDate, pixKey, pixDescription, mercadoPagoToken, pixQrCodeImage } = req.body;
    
    let config = await prisma.config.findFirst();
    
    if (config) {
      config = await prisma.config.update({
        where: { id: config.id },
        data: {
          siteTitle,
          weddingDate,
          pixKey,
          pixDescription,
          mercadoPagoToken,
          pixQrCodeImage
        }
      });
    } else {
      config = await prisma.config.create({
        data: {
          siteTitle: siteTitle || 'Marília & Iago',
          weddingDate: weddingDate || '',
          pixKey: pixKey || '',
          pixDescription: pixDescription || '',
          mercadoPagoToken: mercadoPagoToken || '',
          pixQrCodeImage: pixQrCodeImage || ''
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
