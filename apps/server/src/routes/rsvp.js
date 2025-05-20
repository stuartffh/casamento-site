const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { protectNonGetRoutes } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Obter todos os RSVPs (protegido)
router.get('/', protectNonGetRoutes, async (req, res) => {
  try {
    const rsvps = await prisma.rSVP.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(rsvps);
  } catch (error) {
    console.error('Erro ao buscar RSVPs:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Registrar novo RSVP (público)
router.post('/', async (req, res) => {
  try {
    const { name, companions, email, phone, message } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Nome é obrigatório' });
    }
    
    const newRSVP = await prisma.rSVP.create({
      data: {
        name,
        companions: companions || 0,
        email,
        phone,
        message,
        confirmed: true
      }
    });
    
    res.status(201).json(newRSVP);
  } catch (error) {
    console.error('Erro ao registrar RSVP:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Exportar RSVPs para CSV (protegido)
router.get('/export', protectNonGetRoutes, async (req, res) => {
  try {
    const rsvps = await prisma.rSVP.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Criar cabeçalho do CSV
    let csv = 'Nome,Acompanhantes,Email,Telefone,Mensagem,Confirmado,Data de Registro\n';
    
    // Adicionar linhas
    rsvps.forEach(rsvp => {
      const confirmedText = rsvp.confirmed ? 'Sim' : 'Não';
      const date = new Date(rsvp.createdAt).toLocaleDateString('pt-BR');
      
      csv += `"${rsvp.name}",${rsvp.companions},"${rsvp.email || ''}","${rsvp.phone || ''}","${rsvp.message || ''}","${confirmedText}","${date}"\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=rsvps.csv');
    res.send(csv);
  } catch (error) {
    console.error('Erro ao exportar RSVPs:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;
