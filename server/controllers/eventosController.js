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

exports.listarEventos = async (req, res) => {
  try {
    // Traemos todos los eventos
    const [eventos] = await db.query(
      `SELECT id, titulo, descripcion, fecha, todos_profesores
       FROM eventos
       ORDER BY fecha DESC`
    );

    const eventosConProfesores = [];
    for (const evento of eventos) {
      let profesores = [];

      if (!evento.todos_profesores) {
        // Traemos los nombres de los profesores asignados desde usuarios
        const [rows] = await db.query(
          `SELECT u.nombre
           FROM evento_profesor ep
           JOIN usuarios u ON ep.id_profesor = u.id
           WHERE ep.id_evento = ? AND u.rol = 'profesor'`,
          [evento.id]
        );

        profesores = rows.map(r => r.nombre);
      }

      eventosConProfesores.push({
        ...evento,
        profesores: evento.todos_profesores ? ['Todos los profesores'] : profesores.length ? profesores : ['Sin profesores asignados']
      });
    }

    res.json(eventosConProfesores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al listar eventos" });
  }
};

exports.listarEventosProfesor = async (req, res) => {
  try {
    const { idProfesor } = req.params;

    // Traemos los eventos que son para todos los profesores
    const [eventosParaTodos] = await db.query(
      `SELECT id, titulo, descripcion, fecha, todos_profesores
       FROM eventos
       WHERE todos_profesores = 1
       ORDER BY fecha DESC`
    );

    // Traemos los eventos asignados específicamente al profesor
    const [eventosAsignados] = await db.query(
      `SELECT e.id, e.titulo, e.descripcion, e.fecha, e.todos_profesores
       FROM eventos e
       JOIN evento_profesor ep ON e.id = ep.id_evento
       WHERE ep.id_profesor = ?
       ORDER BY e.fecha DESC`,
      [idProfesor]
    );

    // Unimos ambos resultados (sin duplicar)
    const eventosMap = new Map();

    [...eventosParaTodos, ...eventosAsignados].forEach(ev => {
      eventosMap.set(ev.id, ev); // evita duplicados por id
    });

    const eventos = Array.from(eventosMap.values());

    res.json(eventos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al listar eventos del profesor" });
  }
};
