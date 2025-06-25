const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/auth"); // importa tu middleware

router.post("/login", authController.login);
// Proteges la ruta perfil con verifyToken
router.get("/perfil", authMiddleware.verifyToken, authController.perfil);

module.exports = router;
