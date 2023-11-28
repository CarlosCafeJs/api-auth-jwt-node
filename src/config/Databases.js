// src/config/database.js
const mongoose = require('mongoose');
require('dotenv').config()

const DB_USER = process.env.DB_USERS;
const DB_PASSWORD = process.env.DB_PASSWORDS;

const connectDB = async () => {
  try {
   
    await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.szdt5ht.mongodb.net/?retryWrites=true&w=majority`);
    console.log('Conectado ao banco de dados!');

  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
    console.log(error.message)
    // Trate o erro aqui, por exemplo, lançando uma exceção ou tomando alguma ação apropriada.
  }
};

module.exports = connectDB;
