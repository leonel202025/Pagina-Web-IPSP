const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/asignaturas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, asignatura FROM asignaturas');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error en /api/asignaturas:', err);
    res.status(500).json({ error: 'Error al obtener las asignaturas' });
  }
});

module.exports = router;
