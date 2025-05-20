const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { protectNonGetRoutes } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Obter todas as fotos de uma galeria específica (público)
router.get('/:gallery', async (req, res) => {
  try {
    const { gallery } = req.params;
    
    const photos = await prisma.album.findMany({
      where: { gallery },
      orderBy: { order: 'asc' }
    });
    
    res.json(photos);
  } catch (error) {
    console.error('Erro ao buscar fotos do álbum:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Obter todas as galerias (público)
router.get('/', async (req, res) => {
  try {
    // Agrupar fotos por galeria
    const photos = await prisma.album.findMany({
      orderBy: [
        { gallery: 'asc' },
        { order: 'asc' }
      ]
    });
    
    // Criar objeto com galerias
    const galleries = {};
    photos.forEach(photo => {
      if (!galleries[photo.gallery]) {
        galleries[photo.gallery] = [];
      }
      galleries[photo.gallery].push(photo);
    });
    
    res.json(galleries);
  } catch (error) {
    console.error('Erro ao buscar galerias:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Adicionar nova foto (protegido)
router.post('/', protectNonGetRoutes, async (req, res) => {
  try {
    const { gallery, image, title, order } = req.body;
    
    const newPhoto = await prisma.album.create({
      data: {
        gallery,
        image,
        title: title || '',
        order: order || 0
      }
    });
    
    res.status(201).json(newPhoto);
  } catch (error) {
    console.error('Erro ao adicionar foto:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Atualizar ordem das fotos (protegido)
router.put('/reorder', protectNonGetRoutes, async (req, res) => {
  try {
    const { photos } = req.body;
    
    // Atualizar ordem de cada foto
    const updates = photos.map(photo => 
      prisma.album.update({
        where: { id: photo.id },
        data: { order: photo.order }
      })
    );
    
    await Promise.all(updates);
    
    res.json({ message: 'Ordem atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao reordenar fotos:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Excluir foto (protegido)
router.delete('/:id', protectNonGetRoutes, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.album.delete({
      where: { id: Number(id) }
    });
    
    res.json({ message: 'Foto excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir foto:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;
