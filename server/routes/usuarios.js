const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Rutas
router.post('/', usuariosController.register);
router.get('/alumnos', usuariosController.obtenerAlumnos);
router.get('/profesores', usuariosController.obtenerProfesores)
router.put('/:id', usuariosController.actualizarUsuario);
router.put('/profesores/:id', usuariosController.actualizarProfesor);
router.delete("/:id", usuariosController.eliminarUsuario);
router.delete("/profesores/:id", usuariosController.eliminarProfesor);


module.exports = router;