const db = require("../models/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

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

// REGISTER
exports.register = async (req, res) => {
  console.log("Body recibido:", req.body); // <-- acá
  const {
    dni,
    nombre,
    email,
    password,
    rol,
    grados = [],
    asignaturas = [],
    id_grado,
  } = req.body;

  try {
    const [users] = await db.query("SELECT id FROM usuarios WHERE email = ?", [email]);
    if (users.length > 0) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (rol === "alumno") {
      if (!dni || !nombre || !email || !password) {
        return res.status(400).json({ error: "Faltan datos para alumno" });
      }

      await db.query(
        "INSERT INTO usuarios (dni, nombre, email, password, rol, id_grado) VALUES (?, ?, ?, ?, ?, ?)",
        [dni, nombre, email, hashedPassword, rol, id_grado]
      );

    } else if (rol === "profesor") {
      if (!grados.length || !asignaturas.length) {
        return res.status(400).json({ error: "Faltan grados o asignaturas para el profesor" });
      }

      // Insertar profesor
      const [result] = await db.query(
        "INSERT INTO usuarios (dni, nombre, email, password, rol) VALUES (?, ?, ?, ?, ?)",
        [dni, nombre, email, hashedPassword, rol]
      );

      const profesorId = result.insertId;

      // Insertar grados del profesor
      for (const id_grado of grados) {
        await db.query(
          "INSERT INTO profesor_grado (id_profesor, id_grado) VALUES (?, ?)",
          [id_profesor, id_grado]
        );
      }

      // Insertar asignaturas del profesor
      for (const id_asignatura of asignaturas) {
        await db.query(
          "INSERT INTO profesor_asignatura (id_profesor, id_asignatura) VALUES (?, ?)",
          [id_profesor, id_asignatura]
        );
      }

    } else {
      return res.status(400).json({ error: "Rol no válido" });
    }

    res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (err) {
    console.error("❌ Error en register:", err);
    res.status(500).json({ error: "Error al crear usuario", details: err.message });
  }
};

// PERFIL
exports.perfil = async (req, res) => {
  const userId = req.userId;

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
