const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Ruta para crear usuario (alumno o profesor)
router.post('/register', usuariosController.register);
router.get('/alumnos', usuariosController.obtenerAlumnos);
router.put('/:id', usuariosController.actualizarUsuario);
router.delete("/:id", usuariosController.eliminarUsuario);


module.exports = router;