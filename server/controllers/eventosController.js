const db = require("../models/db"); // tu conexión mysql

exports.crearEvento = async (req, res) => {
  try {
    const { titulo, descripcion, fecha, todosProfesores, profesoresAsignados } = req.body;

    // Insertar evento
    const [result] = await db.query(
      "INSERT INTO eventos (titulo, descripcion, fecha, todos_profesores) VALUES (?, ?, ?, ?)",
      [titulo, descripcion, fecha, todosProfesores]
    );

    const eventoId = result.insertId;

    // Si NO es para todos, guardar los profesores seleccionados
    if (!todosProfesores && profesoresAsignados && profesoresAsignados.length > 0) {
      for (const profesorId of profesoresAsignados) {
        await db.query(
          "INSERT INTO evento_profesor (id_evento, id_profesor) VALUES (?, ?)",
          [eventoId, profesorId]
        );
      }
    }

    res.status(201).json({ mensaje: "Evento creado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear evento" });
  }
};
