const express = require("express");
const router = express.Router();
const eventosController = require("../controllers/eventosController");

router.post("/", eventosController.crearEvento);
router.get("/listar", eventosController.listarEventos); // 👈 nueva ruta
router.get("/profesor/:idProfesor", eventosController.listarEventosProfesor);
router.get("/tareas", eventosController.listarTareas); // ✅ nueva ruta

module.exports = router;
