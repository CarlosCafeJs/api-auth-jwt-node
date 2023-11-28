// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, registerUserToken, checkToken, } = require('../controllers/authController');

// Rota para registro de usuário
router.post('/register', registerUser);

// Rota para login de usuário
router.post('/login', loginUser);

// Rota para login de usuário protegida
router.get('/login/:id', checkToken, registerUserToken);

module.exports = router;
