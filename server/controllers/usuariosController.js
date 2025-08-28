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
      const { asignaciones } = req.body; // Array [{id_grado, id_asignatura}, ...]
      if (!Array.isArray(asignaciones) || asignaciones.length === 0) {
        return res
          .status(400)
          .json({ error: "Faltan asignaciones para el profesor" });
      }

      // Insertar usuario
      const [result] = await db.query(
        "INSERT INTO usuarios (dni, nombre, email, password, rol) VALUES (?, ?, ?, ?, ?)",
        [dni, nombre, email, hashedPassword, rol]
      );
      const id_profesor = result.insertId;

      // Insertar combinaciones en profesor_grado_asignatura
      for (const asig of asignaciones) {
        if (!asig.id_grado || !asig.id_asignatura) continue;
        await db.query(
          "INSERT INTO profesor_grado_asignatura (id_profesor, id_grado, id_asignatura) VALUES (?, ?, ?)",
          [id_profesor, asig.id_grado, asig.id_asignatura]
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

exports.obtenerProfesores = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.id, u.nombre, u.dni, u.email,
        g.id AS id_grado, g.grado,
        a.id AS id_asignatura, a.asignatura
      FROM usuarios u
      LEFT JOIN profesor_grado_asignatura pga ON pga.id_profesor = u.id
      LEFT JOIN grados g ON g.id = pga.id_grado
      LEFT JOIN asignaturas a ON a.id = pga.id_asignatura
      WHERE u.rol = 'profesor'
      ORDER BY u.id, g.id, a.id
    `);

    // Agrupar por profesor y formar array de combinaciones
    const profesoresMap = {};
    rows.forEach(row => {
      if (!profesoresMap[row.id]) {
        profesoresMap[row.id] = {
          id: row.id,
          nombre: row.nombre,
          dni: row.dni,
          email: row.email,
          gradosMaterias: []
        };
      }
      if (row.id_grado && row.id_asignatura) {
        profesoresMap[row.id].gradosMaterias.push({
          id_grado: row.id_grado,
          grado: row.grado,
          id_asignatura: row.id_asignatura,
          asignatura: row.asignatura
        });
      }
    });

    res.json(Object.values(profesoresMap));
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
  const { dni, nombre, email, password, gradosMaterias } = req.body;

  try {
    // Actualizar datos personales
    const params = [dni, nombre, email];
    let sql = "UPDATE usuarios SET dni = ?, nombre = ?, email = ?";
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      sql += ", password = ?";
      params.push(hashed);
    }
    sql += " WHERE id = ?";
    params.push(id);
    await db.query(sql, params);

    // Eliminar asignaciones antiguas
    await db.query("DELETE FROM profesor_grado_asignatura WHERE id_profesor = ?", [id]);

    // Insertar nuevas combinaciones
    if (Array.isArray(gradosMaterias)) {
      for (const gm of gradosMaterias) {
        if (!gm.id_grado || !gm.id_asignatura) continue;
        await db.query(
          "INSERT INTO profesor_grado_asignatura (id_profesor, id_grado, id_asignatura) VALUES (?, ?, ?)",
          [id, gm.id_grado, gm.id_asignatura]
        );
      }
    }

    res.json({ message: "Profesor actualizado correctamente" });
  } catch (error) {
    console.error("Error actualizar profesor:", error);
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
    const [result] = await db.query(
      "SELECT * FROM usuarios WHERE dni = ? AND rol = 'alumno'",
      [dni]
    );

    if (result.length === 0) {
      return res.status(404).json({ mensaje: "Alumno no encontrado" });
    }

    res.json(result[0]);
  } catch (err) {
    console.error("Error al buscar por DNI:", err);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

// Obtener grados, materias y alumnos asignados a un profesor
exports.obtenerGradosYAlumnosPorProfesor = async (req, res) => {
  const { id_profesor } = req.params;

  try {
    // 1) Obtener todas las combinaciones de grado + materia que dicta el profesor
    const [grados] = await db.query(
      `SELECT 
          g.id AS id_grado,
          g.grado,
          a.id AS id_asignatura,
          a.asignatura AS materia
       FROM profesor_grado_asignatura pga
       JOIN grados g ON g.id = pga.id_grado
       JOIN asignaturas a ON a.id = pga.id_asignatura
       WHERE pga.id_profesor = ?
       ORDER BY g.id, a.id`,
      [id_profesor]
    );

    if (grados.length === 0) {
      return res.json({ grados: [], alumnos: [] });
    }

    // Extraer IDs de grados para buscar alumnos
    const idsGrados = [...new Set(grados.map((g) => g.id_grado))];

    // 2) Obtener alumnos de esos grados
    const [alumnos] = await db.query(
      `SELECT 
          u.id,
          u.dni,
          u.nombre,
          u.email,
          u.id_grado,
          c.id_asignatura,
          c.nota
       FROM usuarios u
       LEFT JOIN calificaciones c 
            ON c.id_alumno = u.id 
           AND c.id_grado = u.id_grado
       WHERE u.rol = 'alumno' 
         AND u.id_grado IN (?)`,
      [idsGrados]
    );

    res.json({ grados, alumnos });
  } catch (error) {
    console.error("Error obtener grados y alumnos por profesor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

