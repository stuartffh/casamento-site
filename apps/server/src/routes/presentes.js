const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { protectNonGetRoutes } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Obter todos os presentes (público)
router.get('/', async (req, res) => {
  try {
    const presentes = await prisma.present.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(presentes);
  } catch (error) {
    console.error('Erro ao buscar presentes:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Obter um presente específico (público)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const presente = await prisma.present.findUnique({
      where: { id: Number(id) }
    });
    
    if (!presente) {
      return res.status(404).json({ message: 'Presente não encontrado' });
    }
    
    res.json(presente);
  } catch (error) {
    console.error('Erro ao buscar presente:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Criar um novo presente (protegido)
router.post('/', protectNonGetRoutes, async (req, res) => {
  try {
    const { name, description, price, image, stock } = req.body;
    
    const newPresente = await prisma.present.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        stock: stock || 1
      }
    });
    
    res.status(201).json(newPresente);
  } catch (error) {
    console.error('Erro ao criar presente:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Atualizar um presente (protegido)
router.put('/:id', protectNonGetRoutes, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, stock } = req.body;
    
    const updatedPresente = await prisma.present.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        stock
      }
    });
    
    res.json(updatedPresente);
  } catch (error) {
    console.error('Erro ao atualizar presente:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Excluir um presente (protegido)
router.delete('/:id', protectNonGetRoutes, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.present.delete({
      where: { id: Number(id) }
    });
    
    res.json({ message: 'Presente excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir presente:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;
