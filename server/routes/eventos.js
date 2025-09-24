const express = require("express");
const router = express.Router();
const eventosController = require("../controllers/eventosController");

router.post("/", eventosController.crearEvento);
router.get("/listar", eventosController.listarEventos); // 👈 nueva ruta

module.exports = router;
