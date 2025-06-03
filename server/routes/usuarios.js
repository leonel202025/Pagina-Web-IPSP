const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para crear usuario (alumno o profesor)
router.post('/', authController.register);

module.exports = router;