const express = require('express');
const router = express.Router();
const path = require('path'); // ¡Agrega esto al inicio!
const authController = require(path.join(__dirname, '../controllers/authController'));
const { verifyToken, checkRole } = require('../middlewares/auth');

// Publica
router.post('/login', authController.login);

// Protegida (solo admin)
router.post('/register', verifyToken, checkRole(['admin']), authController.register);

module.exports = router;