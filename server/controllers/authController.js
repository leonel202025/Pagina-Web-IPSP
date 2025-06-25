// controllers/authController.js
const db = require("../models/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.perfil = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Token inválido o faltante" });
    }

    const [rows] = await db.query("SELECT * FROM usuarios WHERE id = ?", [
      req.userId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario = rows[0];
    delete usuario.password; // eliminar el password si lo trae
    res.json(usuario);
  } catch (err) {
    console.error("Error en /perfil:", err); // 👈 Esto es lo que necesitamos ver
    res.status(500).json({ error: "Error del servidor" });
  }
};
