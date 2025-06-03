const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/grados', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, grado FROM grados');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error en /api/grados:', err);
    res.status(500).json({ error: 'Error al obtener los grados' });
  }
});

module.exports = router;