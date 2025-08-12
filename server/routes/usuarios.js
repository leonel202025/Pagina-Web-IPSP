const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");

// Rutas
router.post("/", usuariosController.register);
router.post(
  "/perfil/foto", usuariosController.uploadFotoPerfil, usuariosController.actualizarFotoPerfil
);
router.get("/alumnos", usuariosController.obtenerAlumnos);
router.get("/profesores", usuariosController.obtenerProfesores);
router.get("/buscar/:dni", usuariosController.buscarPorDni);
router.put("/:id", usuariosController.actualizarUsuario);
router.put("/profesores/:id", usuariosController.actualizarProfesor);
router.delete("/:id", usuariosController.eliminarUsuario);
router.delete("/profesores/:id", usuariosController.eliminarProfesor);
router.get("/profesor/:id_profesor/grados", usuariosController.obtenerGradosYAlumnosPorProfesor);


module.exports = router;
