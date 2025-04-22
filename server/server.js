require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // Añade esto

const app = express();

// Middlewares actualizados
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Para formularios normales

// Rutas
const contactoRoute = require('./routes/contacto');
app.use('/api/contacto', contactoRoute);

// Middleware de errores mejorado
app.use((err, req, res, next) => {
  console.error('💥 ERROR:', {
    message: err.message,
    stack: err.stack,
    received: {
      body: req.body,
      files: req.files
    }
  });
  
  res.status(500).json({
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});