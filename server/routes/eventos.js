const express = require("express");
const router = express.Router();
const eventosController = require("../controllers/eventosController");

router.post("/", eventosController.crearEvento);

module.exports = router;
