const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { register } = require('../controllers/authController');

// Ruta para crear usuario (alumno o profesor)
router.post('/', register);

module.exports = router;