const db = require("../models/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // ✅ Generar el token
    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Enviar token y datos del usuario (los que necesites)
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

exports.register = async (req, res) => {
  const { dni, nombre, email, password, rol, id_grado } = req.body;
  try {
    // Verificar si el usuario ya existe
    const [users] = await db.query("SELECT id FROM usuarios WHERE email = ?", [
      email,
    ]);
    if (users.length > 0) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Ajustar la query según si es alumno o profesor
    if (rol === "alumno") {
      if (!dni || !id_grado) {
        return res.status(400).json({ error: "Faltan datos para alumno" });
      }
      await db.query(
        "INSERT INTO usuarios (dni, nombre, email, password, rol, id_grado) VALUES (?, ?, ?, ?, ?, ?)",
        [dni, nombre, email, hashedPassword, rol, id_grado]
      );
    } else if (rol === "profesor") {
      // Si no tiene campos extra para profesor, solo guarda lo básico
      await db.query(
        "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
        [nombre, email, hashedPassword, rol]
      );
    } else {
      // Otros roles si los tienes o error
      return res.status(400).json({ error: "Rol no válido" });
    }

    res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (err) {
    console.error("Error en register:", err);
    res
      .status(500)
      .json({ error: "Error al crear usuario", details: err.message });
  }
};

exports.perfil = async (req, res) => {
  const userId = req.userId; // ← Esto lo pone el middleware verifyToken

  try {
    const [rows] = await db.query(
      "SELECT id, nombre, email, rol FROM usuarios WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ user: rows[0] });
  } catch (error) {
    console.error("❌ Error al obtener el perfil:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
