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

// Função auxiliar para garantir que exista apenas um registro de configuração
async function ensureSingleConfig() {
  // Contar quantos registros existem
  const count = await prisma.config.count();
  
  // Se não existir nenhum, criar um padrão
  if (count === 0) {
    return await prisma.config.create({
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
  
  // Se existir mais de um, manter apenas o primeiro e excluir os demais
  if (count > 1) {
    // Buscar todos os registros ordenados por ID
    const configs = await prisma.config.findMany({
      orderBy: { id: 'asc' }
    });
    
    // Manter o primeiro e excluir os demais
    const primaryConfig = configs[0];
    const idsToDelete = configs.slice(1).map(c => c.id);
    
    if (idsToDelete.length > 0) {
      await prisma.config.deleteMany({
        where: { id: { in: idsToDelete } }
      });
      
      console.log(`Removidos ${idsToDelete.length} registros de configuração duplicados.`);
    }
    
    return primaryConfig;
  }
  
  // Se existir exatamente um, retorná-lo
  return await prisma.config.findFirst();
}

// Obter configurações (público)
router.get('/', async (req, res) => {
  try {
    // Garantir que exista apenas um registro de configuração
    const config = await ensureSingleConfig();
    
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
    
    // Garantir que exista apenas um registro de configuração
    const existingConfig = await ensureSingleConfig();
    
    // Atualizar o registro existente
    const config = await prisma.config.update({
      where: { id: existingConfig.id },
      data: {
        siteTitle: siteTitle || existingConfig.siteTitle,
        weddingDate: weddingDate || existingConfig.weddingDate,
        pixKey: pixKey || existingConfig.pixKey,
        pixDescription: pixDescription || existingConfig.pixDescription,
        mercadoPagoToken: mercadoPagoToken || existingConfig.mercadoPagoToken,
        pixQrCodeImage: pixQrCodeImage || existingConfig.pixQrCodeImage
      }
    });
    
    res.json(config);
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;
