const db = require("../models/db");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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
      if (!dni || !nombre || !email || !password || !id_grado) {
        return res.status(400).json({ error: "Faltan datos para alumno" });
      }

      const [result] = await db.query(
        "INSERT INTO usuarios (dni, nombre, email, password, rol, id_grado) VALUES (?, ?, ?, ?, ?, ?)",
        [dni, nombre, email, hashedPassword, rol, id_grado]
      );
      const id_alumno = result.insertId;

      const [asignaturas] = await db.query(
        "SELECT a.id AS id_asignatura FROM profesor_grado_asignatura pga JOIN asignaturas a ON a.id = pga.id_asignatura WHERE pga.id_grado = ? GROUP BY a.id",
        [id_grado]
      );

      for (const a of asignaturas) {
        await db.query(
          "INSERT INTO alumno_grado_asignatura (id_alumno, id_grado, id_asignatura) VALUES (?, ?, ?)",
          [id_alumno, id_grado, a.id_asignatura]
        );
      }
    } else if (rol === "profesor") {
      const { asignaciones } = req.body; 
      if (!Array.isArray(asignaciones) || asignaciones.length === 0) {
        return res
          .status(400)
          .json({ error: "Faltan asignaciones para el profesor" });
      }

      const [result] = await db.query(
        "INSERT INTO usuarios (dni, nombre, email, password, rol) VALUES (?, ?, ?, ?, ?)",
        [dni, nombre, email, hashedPassword, rol]
      );
      const id_profesor = result.insertId;

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

    const profesoresMap = {};
    rows.forEach((row) => {
      if (!profesoresMap[row.id]) {
        profesoresMap[row.id] = {
          id: row.id,
          nombre: row.nombre,
          dni: row.dni,
          email: row.email,
          gradosMaterias: [],
        };
      }
      if (row.id_grado && row.id_asignatura) {
        profesoresMap[row.id].gradosMaterias.push({
          id_grado: row.id_grado,
          grado: row.grado,
          id_asignatura: row.id_asignatura,
          asignatura: row.asignatura,
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

    await db.query(
      "DELETE FROM profesor_grado_asignatura WHERE id_profesor = ?",
      [id]
    );

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
    await db.query(
      "DELETE FROM profesor_grado_asignatura WHERE id_profesor = ?",
      [id]
    );

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
    const [rows] = await db.query(
      "SELECT foto_perfil FROM usuarios WHERE id = ?",
      [userId]
    );
    const anterior = rows[0]?.foto_perfil;

    if (anterior && fs.existsSync("." + anterior)) {
      fs.unlinkSync("." + anterior);
    }

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

exports.obtenerGradosYAlumnosPorProfesor = async (req, res) => {
  const { id_profesor } = req.params;

  try {
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

    const idsGrados = [...new Set(grados.map((g) => g.id_grado))];

    const [alumnos] = await db.query(
      `SELECT 
        aga.id AS id_alumno_grado_asignatura,
        u.id AS id_alumno,
        u.nombre,
        u.dni,
        u.email,
        g.id AS id_grado,
        g.grado,
        a.id AS id_asignatura,
        a.asignatura AS materia,
        c.primer_trimestre,
        c.segundo_trimestre,
        c.tercer_trimestre,
        c.promedio_final,
        c.observaciones
      FROM alumno_grado_asignatura aga
      JOIN usuarios u ON u.id = aga.id_alumno
      JOIN grados g ON g.id = aga.id_grado
      JOIN asignaturas a ON a.id = aga.id_asignatura
      LEFT JOIN calificaciones c ON c.id_alumno_grado_asignatura = aga.id
      WHERE aga.id_grado IN (?)`,
      [idsGrados]
    );

    res.json({ grados, alumnos });
  } catch (error) {
    console.error("Error obtener grados y alumnos por profesor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.guardarNota = async (req, res) => {
  const {
    id_alumno,
    id_grado,
    id_asignatura,
    id_profesor,
    primer_trimestre,
    segundo_trimestre,
    tercer_trimestre,
    observaciones,
  } = req.body;

  if (!id_alumno || !id_grado || !id_asignatura || !id_profesor) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    const [relacion] = await db.query(
      `SELECT id FROM alumno_grado_asignatura 
       WHERE id_alumno = ? AND id_grado = ? AND id_asignatura = ?`,
      [id_alumno, id_grado, id_asignatura]
    );

    let id_relacion;

    if (relacion.length > 0) {
      id_relacion = relacion[0].id;
    } else {
      const [resultado] = await db.query(
        `INSERT INTO alumno_grado_asignatura (id_alumno, id_grado, id_asignatura) 
         VALUES (?, ?, ?)`,
        [id_alumno, id_grado, id_asignatura]
      );
      id_relacion = resultado.insertId;
    }
    const [previas] = await db.query(
      `SELECT primer_trimestre, segundo_trimestre, tercer_trimestre 
       FROM calificaciones
       WHERE id_alumno_grado_asignatura = ?`,
      [id_relacion]
    );

    let primer = previas[0]?.primer_trimestre ?? null;
    let segundo = previas[0]?.segundo_trimestre ?? null;
    let tercero = previas[0]?.tercer_trimestre ?? null;

    if (primer_trimestre !== undefined) primer = primer_trimestre;
    if (segundo_trimestre !== undefined) segundo = segundo_trimestre;
    if (tercer_trimestre !== undefined) tercero = tercer_trimestre;
    const t1 = primer !== null ? Number(primer) : null;
    const t2 = segundo !== null ? Number(segundo) : null;
    const t3 = tercero !== null ? Number(tercero) : null;

    const valores = [t1, t2, t3].filter((v) => v !== null && !isNaN(v));

    let promedio_final = null;

    if (valores.length > 0) {
      const suma = valores.reduce((a, b) => a + b, 0);
      promedio_final = Number((suma / valores.length).toFixed(2));
    }

    const [calificacionExistente] = await db.query(
      `SELECT id 
       FROM calificaciones 
       WHERE id_alumno_grado_asignatura = ?`,
      [id_relacion]
    );

    if (calificacionExistente.length > 0) {
      await db.query(
        `UPDATE calificaciones 
         SET 
           id_profesor = ?,
           primer_trimestre = ?,
           segundo_trimestre = ?,
           tercer_trimestre = ?,
           promedio_final = ?,
           observaciones = ?
         WHERE id_alumno_grado_asignatura = ?`,
        [
          id_profesor,
          primer,
          segundo,
          tercero,
          promedio_final,
          observaciones,
          id_relacion,
        ]
      );
    } else {
      // INSERT
      await db.query(
        `INSERT INTO calificaciones 
         (id_alumno_grado_asignatura, id_profesor, primer_trimestre, segundo_trimestre, tercer_trimestre, promedio_final, observaciones)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          id_relacion,
          id_profesor,
          primer,
          segundo,
          tercero,
          promedio_final,
          observaciones,
        ]
      );
    }

    res.json({
      id_alumno,
      id_grado,
      id_asignatura,
      primer_trimestre: primer,
      segundo_trimestre: segundo,
      tercer_trimestre: tercero,
      promedio_final,
      observaciones,
    });
  } catch (error) {
    console.error("❌ Error al guardar calificación:", error);
    res.status(500).json({ error: "Error al guardar calificación" });
  }
};

exports.eliminarNota = async (req, res) => {
  const { id_alumno, id_grado, id_asignatura, trimestre } = req.body;

  const trimestresValidos = [
    "primer_trimestre",
    "segundo_trimestre",
    "tercer_trimestre",
    "todos",
  ];

  if (!trimestre || !trimestresValidos.includes(trimestre)) {
    return res.status(400).json({ error: "Trimestre inválido" });
  }

  try {
    const [relacion] = await db.query(
      `SELECT id FROM alumno_grado_asignatura 
       WHERE id_alumno = ? AND id_grado = ? AND id_asignatura = ?`,
      [id_alumno, id_grado, id_asignatura]
    );

    if (relacion.length === 0) {
      return res.status(404).json({ error: "Relación no encontrada" });
    }

    const id_relacion = relacion[0].id;

    if (trimestre !== "todos") {
      await db.query(
        `UPDATE calificaciones SET ${trimestre} = NULL 
         WHERE id_alumno_grado_asignatura = ?`,
        [id_relacion]
      );

      await db.query(
        `UPDATE calificaciones SET promedio_final = 
        ROUND((COALESCE(primer_trimestre,0) +
              COALESCE(segundo_trimestre,0) +
              COALESCE(tercer_trimestre,0)) /
              NULLIF( (primer_trimestre IS NOT NULL) +
                      (segundo_trimestre IS NOT NULL) +
                      (tercer_trimestre IS NOT NULL), 0 ), 2)
        WHERE id_alumno_grado_asignatura = ?`,
        [id_relacion]
      );

      return res.json({
        message: `Trimestre ${trimestre} eliminado`,
        id_alumno,
        id_grado,
        id_asignatura,
      });
    }

    await db.query(
      `UPDATE calificaciones SET 
        primer_trimestre = NULL,
        segundo_trimestre = NULL,
        tercer_trimestre = NULL,
        promedio_final = NULL,
        observaciones = NULL
       WHERE id_alumno_grado_asignatura = ?`,
      [id_relacion]
    );

    res.json({
      message: "Todas las calificaciones eliminadas",
      id_alumno,
      id_grado,
      id_asignatura,
    });
  } catch (error) {
    console.error("❌ Error al eliminar calificaciones:", error);
    res.status(500).json({ error: "Error al eliminar calificaciones" });
  }
};

exports.guardarObservacion = async (req, res) => {
  try {
    const { id_alumno, id_grado, id_asignatura, observaciones } = req.body;

    const [relacion] = await db.query(
      `SELECT id FROM alumno_grado_asignatura 
       WHERE id_alumno = ? AND id_grado = ? AND id_asignatura = ?`,
      [id_alumno, id_grado, id_asignatura]
    );

    if (relacion.length === 0) {
      return res
        .status(404)
        .json({ message: "No existe relación para este alumno." });
    }

    const id_relacion = relacion[0].id;

    const [rows] = await db.query(
      `SELECT * FROM calificaciones WHERE id_alumno_grado_asignatura = ?`,
      [id_relacion]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "No existe registro de calificaciones para este alumno.",
      });
    }

    await db.query(
      `UPDATE calificaciones 
       SET observaciones = ?
       WHERE id_alumno_grado_asignatura = ?`,
      [observaciones, id_relacion]
    );

    return res.json({
      id_alumno,
      id_grado,
      id_asignatura,
      observaciones,
    });
  } catch (error) {
    console.error("Error al guardar observación:", error);
    return res.status(500).json({ error: "Error al guardar la observación" });
  }
};

exports.obtenerObservacion = async (req, res) => {
  try {
    const { id_alumno, id_grado, id_asignatura } = req.body;

    const [relacion] = await db.query(
      `SELECT id FROM alumno_grado_asignatura 
       WHERE id_alumno = ? AND id_grado = ? AND id_asignatura = ?`,
      [id_alumno, id_grado, id_asignatura]
    );

    if (relacion.length === 0) {
      return res.status(404).json({ error: "Relación no encontrada." });
    }

    const id_relacion = relacion[0].id;

    const [calificacion] = await db.query(
      `SELECT observaciones 
       FROM calificaciones 
       WHERE id_alumno_grado_asignatura = ?`,
      [id_relacion]
    );

    if (calificacion.length === 0) {
      return res.json({ observaciones: null });
    }

    res.json({ observaciones: calificacion[0].observaciones });
  } catch (error) {
    console.error("❌ Error al obtener observación:", error);
    res.status(500).json({ error: "Error al obtener observación" });
  }
};

exports.obtenerCalificacionesAlumno = async (req, res) => {
  const { id } = req.params;
  console.log("ID del alumno recibido:", id);

  try {
    const [rows] = await db.query(`
      SELECT
        a.asignatura AS materia,
        u.nombre AS docente,
        c.primer_trimestre,
        c.segundo_trimestre,
        c.tercer_trimestre,
        c.promedio_final,
        c.observaciones
      FROM alumno_grado_asignatura ag
      JOIN asignaturas a ON ag.id_asignatura = a.id
      LEFT JOIN calificaciones c ON c.id_alumno_grado_asignatura = ag.id
      LEFT JOIN usuarios u ON c.id_profesor = u.id
      WHERE ag.id_alumno = ?
    `, [id]);

    console.log("Materias + calificaciones:", rows);
    res.json(rows);

  } catch (error) {
    console.error("❌ Error al obtener calificaciones:", error);
    res.status(500).json({ error: 'Error al obtener calificaciones' });
  }
};