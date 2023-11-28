require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./src/config/Databases');
const authRoutes = require('./src/routes/authRoutes');
const cors = require('cors');  

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Habilitando CORS para todas as origens
app.use(cors());

// Rotas de autenticação
app.use('/auth', authRoutes);

// Conectar ao banco de dados e iniciar o servidor
connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
    });
  })
  .catch((err) => {
    console.error('Erro ao iniciar o servidor:', err);
  });
