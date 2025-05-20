const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

// Rotas
const authRoutes = require('./routes/auth');
const configRoutes = require('./routes/config');
const presentesRoutes = require('./routes/presentes');
const rsvpRoutes = require('./routes/rsvp');
const mercadoPagoRoutes = require('./routes/mercadopago');
const albumRoutes = require('./routes/album');
const contentRoutes = require('./routes/content');

// Middlewares
const { authenticateJWT } = require('./middleware/auth');

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas públicas
app.use('/api/auth', authRoutes);
app.use('/api/rsvp', rsvpRoutes);
app.use('/api/mercadopago/webhook', mercadoPagoRoutes);

// Rotas protegidas
app.use('/api/config', authenticateJWT, configRoutes);
app.use('/api/presentes', presentesRoutes); // Parcialmente protegida (GET público)
app.use('/api/album', albumRoutes); // Parcialmente protegida (GET público)
app.use('/api/content', contentRoutes); // Parcialmente protegida (GET público)

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API do Site de Casamento Marília & Iago' });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Exportando para testes
module.exports = app;
