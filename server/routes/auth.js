const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, checkRole } = require('../middlewares/auth'); // ← Este archivo debe exportar ambas funciones

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/perfil', verifyToken, authController.perfil);

module.exports = router;