// controllers/usuariosController.js
const db = require("../models/db");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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
    const [users] = await db.query("SELECT id FROM usuarios WHERE email = ?", [
      email,
    ]);
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
        return res
          .status(400)
          .json({ error: "Faltan grados o asignaturas para el profesor" });
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
    res
      .status(500)
      .json({ error: "Error al crear usuario", details: err.message });
  }
};

// Obtener alumnos (función nueva)
exports.obtenerAlumnos = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE rol = 'alumno'"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener alumnos:", err);
    res.status(500).json({ error: "Error al obtener alumnos" });
  }
};

// Obtener profesores (función nueva)
exports.obtenerProfesores = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.id,
        u.nombre,
        u.dni,
        u.email,
        GROUP_CONCAT(DISTINCT a.asignatura SEPARATOR ', ') AS materias,
        GROUP_CONCAT(DISTINCT g.grado SEPARATOR ', ') AS grados,
        GROUP_CONCAT(DISTINCT a.id SEPARATOR ',') AS asignaturas_ids,
        GROUP_CONCAT(DISTINCT g.id SEPARATOR ',') AS grados_ids
      FROM usuarios u
      LEFT JOIN profesor_asignatura pa ON pa.id_profesor = u.id
      LEFT JOIN asignaturas a ON a.id = pa.id_asignatura
      LEFT JOIN profesor_grado pg ON pg.id_profesor = u.id
      LEFT JOIN grados g ON g.id = pg.id_grado
      WHERE u.rol = 'profesor'
      GROUP BY u.id, u.nombre, u.dni, u.email
    `);

    // Convertir strings de IDs a arrays numéricos
    const profesores = rows.map((profesor) => ({
      ...profesor,
      asignaturas_ids: profesor.asignaturas_ids
        ? profesor.asignaturas_ids.split(",").map(Number)
        : [],
      grados_ids: profesor.grados_ids
        ? profesor.grados_ids.split(",").map(Number)
        : [],
    }));

    res.json(profesores);
  } catch (err) {
    console.error("Error al obtener profesores:", err);
    res.status(500).json({ error: "Error al obtener profesores" });
  }
};

exports.actualizarUsuario = async (req, res) => {
  const id = req.params.id;
  const { dni, nombre, email, id_grado } = req.body;

  try {
    const sql = `UPDATE usuarios SET dni=?, nombre=?, email=?, id_grado=? WHERE id=?`;
    const params = [dni, nombre, email, id_grado, id];

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

exports.actualizarProfesor = async (req, res) => {
  const { id } = req.params;
  const { dni, nombre, email, password, grados, asignaturas } = req.body;

  try {
    // Construir consulta de actualización dinámicamente (password opcional)
    let updateQuery = "UPDATE usuarios SET dni = ?, nombre = ?, email = ?";
    const params = [dni, nombre, email];

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += ", password = ?";
      params.push(hashedPassword);
    }

    updateQuery += " WHERE id = ?";
    params.push(id);

    await db.query(updateQuery, params);

    // Eliminar relaciones anteriores en tablas correctas
    await db.query("DELETE FROM profesor_grado WHERE id_profesor = ?", [id]);
    await db.query("DELETE FROM profesor_asignatura WHERE id_profesor = ?", [
      id,
    ]);

    // Insertar nuevas relaciones
    if (Array.isArray(grados)) {
      for (const idGrado of grados) {
        await db.query(
          "INSERT INTO profesor_grado (id_profesor, id_grado) VALUES (?, ?)",
          [id, idGrado]
        );
      }
    }

    if (Array.isArray(asignaturas)) {
      for (const idAsignatura of asignaturas) {
        await db.query(
          "INSERT INTO profesor_asignatura (id_profesor, id_asignatura) VALUES (?, ?)",
          [id, idAsignatura]
        );
      }
    }

    res.json({ message: "Profesor actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar profesor:", error);
    res.status(500).json({ error: "Error al actualizar profesor" });
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

exports.eliminarProfesor = async (req, res) => {
  const { id } = req.params;

  try {
    // Eliminar relaciones primero
    await db.query("DELETE FROM profesor_asignatura WHERE id_profesor = ?", [
      id,
    ]);
    await db.query("DELETE FROM profesor_grado WHERE id_profesor = ?", [id]);

    // Luego eliminar al profesor de la tabla usuarios
    const [result] = await db.query("DELETE FROM usuarios WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Profesor no encontrado" });
    }

    res.json({ message: "Profesor eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar profesor:", error);
    res.status(500).json({ error: "Error al eliminar profesor" });
  }
};

/* Manejar Foto de Perfil */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

exports.uploadFotoPerfil = upload.single("foto");

exports.actualizarFotoPerfil = async (req, res) => {
  const userId = req.body.userId;

  if (!req.file) {
    return res.status(400).json({ error: "No se subió ninguna imagen" });
  }

  const rutaImagen = `/uploads/${req.file.filename}`;

  try {
    // (Opcional) Obtener ruta anterior y eliminarla
    const [rows] = await db.query(
      "SELECT foto_perfil FROM usuarios WHERE id = ?",
      [userId]
    );
    const anterior = rows[0]?.foto_perfil;

    if (anterior && fs.existsSync("." + anterior)) {
      fs.unlinkSync("." + anterior); // Elimina la imagen vieja
    }

    // Actualizar la base de datos
    await db.query("UPDATE usuarios SET foto_perfil = ? WHERE id = ?", [
      rutaImagen,
      userId,
    ]);

    res.json({ mensaje: "Imagen actualizada", ruta: rutaImagen });
  } catch (err) {
    console.error("❌ Error al guardar imagen:", err);
    res.status(500).json({ error: "Error al guardar imagen" });
  }
};

exports.buscarPorDni = async (req, res) => {
  const { dni } = req.params;
  try {
    const [result] = await db.query("SELECT * FROM usuarios WHERE dni = ?", [
      dni,
    ]);
    if (result.length === 0) {
      return res.status(404).json({ mensaje: "Alumno no encontrado" });
    }
    res.json(result[0]);
  } catch (err) {
    console.error("Error al buscar por DNI:", err);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};
