const db = require("../models/db"); // tu conexión mysql

exports.crearEvento = async (req, res) => {
  try {
    const { titulo, descripcion, fecha, todosProfesores, profesoresAsignados } =
      req.body;

    // 1️⃣ Insertar evento
    const [result] = await db.query(
      "INSERT INTO eventos (titulo, descripcion, fecha, todos_profesores) VALUES (?, ?, ?, ?)",
      [titulo, descripcion, fecha, todosProfesores]
    );
    const eventoId = result.insertId;

    // 2️⃣ Si NO es para todos, guardar profesores y tareas
    if (
      !todosProfesores &&
      profesoresAsignados &&
      profesoresAsignados.length > 0
    ) {
      for (const prof of profesoresAsignados) {
        // Insertar relación profesor-evento
        await db.query(
          "INSERT INTO evento_profesor (id_evento, id_profesor) VALUES (?, ?)",
          [eventoId, prof.idProfesor]
        );

        // Insertar relación tarea-evento-profesor si tiene tarea asignada
        if (prof.idTarea) {
          await db.query(
            "INSERT INTO evento_tarea (id_evento, id_tarea, id_profesor) VALUES (?, ?, ?)",
            [eventoId, prof.idTarea, prof.idProfesor]
          );
        }
      }
    }

    res.status(201).json({ mensaje: "Evento creado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear evento" });
  }
};

exports.listarEventos = async (req, res) => {
  try {
    const [eventos] = await db.query(
      `SELECT id, titulo, descripcion, fecha, todos_profesores
       FROM eventos
       ORDER BY fecha DESC`
    );

    const eventosConAsignaciones = [];

    for (const evento of eventos) {
      let asignaciones = [];

      if (!evento.todos_profesores) {
        const [rows] = await db.query(
          `SELECT u.id AS idProfesor, t.id AS idTarea, u.nombre AS profesor, t.nombre AS tarea
     FROM evento_profesor ep
     JOIN usuarios u ON ep.id_profesor = u.id
     LEFT JOIN evento_tarea et ON ep.id_evento = et.id_evento AND ep.id_profesor = et.id_profesor
     LEFT JOIN tareas t ON et.id_tarea = t.id
     WHERE ep.id_evento = ?`,
          [evento.id]
        );
        asignaciones = rows.length ? rows : [];
      } else {
        asignaciones = [{ profesor: "Todos los profesores", tarea: "" }];
      }

      eventosConAsignaciones.push({
        ...evento,
        asignaciones,
      });
    }

    res.json(eventosConAsignaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al listar eventos" });
  }
};

exports.listarEventosProfesor = async (req, res) => {
  try {
    const { idProfesor } = req.params;

    // Eventos para todos los profesores
    const [eventosParaTodos] = await db.query(
      `SELECT id, titulo, descripcion, fecha, todos_profesores
       FROM eventos
       WHERE todos_profesores = 1
       ORDER BY fecha DESC`
    );

    // Eventos asignados al profesor con sus tareas
    const [eventosAsignados] = await db.query(
      `SELECT e.id, e.titulo, e.descripcion, e.fecha, t.nombre as tarea
       FROM eventos e
       JOIN evento_profesor ep ON e.id = ep.id_evento
       JOIN evento_tarea et ON e.id = et.id_evento AND ep.id_profesor = et.id_profesor
       JOIN tareas t ON et.id_tarea = t.id
       WHERE ep.id_profesor = ?
       ORDER BY e.fecha DESC`,
      [idProfesor]
    );

    // Unir eventos sin duplicados
    const eventosMap = new Map();
    [...eventosParaTodos, ...eventosAsignados].forEach((ev) => {
      if (!eventosMap.has(ev.id)) {
        eventosMap.set(ev.id, { ...ev, tareas: [] });
      }
      if (ev.tarea) {
        eventosMap.get(ev.id).tareas.push(ev.tarea);
      }
    });

    const eventos = Array.from(eventosMap.values());
    res.json(eventos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al listar eventos del profesor" });
  }
};

exports.listarTareas = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, nombre, descripcion FROM tareas");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al listar tareas" });
  }
};

exports.editarEvento = async (req, res) => {
  try {
    const fecha = new Date(req.body.fecha);
    const fechaFormateada = fecha.toISOString().slice(0, 19).replace("T", " ");
    const { id } = req.params;
    const { titulo, descripcion, todosProfesores, profesoresAsignados } =
      req.body;

    await db.query(
      "UPDATE eventos SET titulo = ?, descripcion = ?, fecha = ?, todos_profesores = ? WHERE id = ?",
      [titulo, descripcion, fechaFormateada, todosProfesores, id]
    );

    await db.query("DELETE FROM evento_profesor WHERE id_evento = ?", [id]);
    await db.query("DELETE FROM evento_tarea WHERE id_evento = ?", [id]);

    if (!todosProfesores && profesoresAsignados?.length > 0) {
      for (const prof of profesoresAsignados) {
        await db.query(
          "INSERT INTO evento_profesor (id_evento, id_profesor) VALUES (?, ?)",
          [id, prof.idProfesor]
        );
        if (prof.idTarea) {
          await db.query(
            "INSERT INTO evento_tarea (id_evento, id_tarea, id_profesor) VALUES (?, ?, ?)",
            [id, prof.idTarea, prof.idProfesor]
          );
        }
      }
    }

    // Traer evento actualizado con asignaciones
    const [eventoRows] = await db.query("SELECT * FROM eventos WHERE id = ?", [
      id,
    ]);
    const evento = eventoRows[0];

    let asignaciones = [];
    if (!evento.todos_profesores) {
      const [rows] = await db.query(
        `SELECT u.id AS idProfesor, t.id AS idTarea, u.nombre AS profesor, t.nombre AS tarea
         FROM evento_profesor ep
         JOIN usuarios u ON ep.id_profesor = u.id
         LEFT JOIN evento_tarea et ON ep.id_evento = et.id_evento AND ep.id_profesor = et.id_profesor
         LEFT JOIN tareas t ON et.id_tarea = t.id
         WHERE ep.id_evento = ?`,
        [evento.id]
      );
      asignaciones = rows.length ? rows : [];
    } else {
      asignaciones = [{ profesor: "Todos los profesores", tarea: "" }];
    }

    res.json({ ...evento, asignaciones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al editar evento" });
  }
};

exports.eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Eliminar relaciones en evento_tarea y evento_profesor
    await db.query("DELETE FROM evento_tarea WHERE id_evento = ?", [id]);
    await db.query("DELETE FROM evento_profesor WHERE id_evento = ?", [id]);

    // 2️⃣ Eliminar el evento
    const [result] = await db.query("DELETE FROM eventos WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }

    res.json({ mensaje: "Evento eliminado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar evento" });
  }
};