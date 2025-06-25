// controllers/usuariosController.js
const db = require("../models/db");
const bcrypt = require("bcryptjs");

// Función para registrar usuario (antes en authController)
exports.register = async (req, res) => {
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

      const [result] = await db.query(
        "INSERT INTO usuarios (dni, nombre, email, password, rol) VALUES (?, ?, ?, ?, ?)",
        [dni, nombre, email, hashedPassword, rol]
      );

      const id_profesor = result.insertId;

      for (const id_grado of grados) {
        await db.query(
          "INSERT INTO profesor_grado (id_profesor, id_grado) VALUES (?, ?)",
          [id_profesor, id_grado]
        );
      }

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

// Obtener alumnos (función nueva)
exports.obtenerAlumnos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE rol = 'alumno'");
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener alumnos:", err);
    res.status(500).json({ error: "Error al obtener alumnos" });
  }
};


exports.actualizarUsuario = async (req, res) => {
  const id = req.params.id;
  const { dni, nombre, email, password, id_grado } = req.body;

  try {
    // Aquí puedes hacer validaciones, hash de password, etc.

    const sql = `
      UPDATE usuarios SET dni=?, nombre=?, email=?, 
      password=?, id_grado=? WHERE id=?
    `;

    const params = [dni, nombre, email, password, id_grado, id];

    const [result] = await db.query(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error actualizar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM usuarios WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error al eliminar usuario:", err);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};
