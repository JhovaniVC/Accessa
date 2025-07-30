const express = require('express');
const router = express.Router();
const { register, login, logout, verifyAuth } = require('../controllers/authController');
const { validateToken } = require('../middlewares/validateToken');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Rutas protegidas
router.get('/verify', validateToken, verifyAuth);

module.exports = router;