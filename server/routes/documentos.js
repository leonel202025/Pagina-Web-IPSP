const express = require("express");
const router = express.Router();
const { descargarDocumento } = require("../controllers/documentosController");

router.get("/:archivo", descargarDocumento);

module.exports = router;
