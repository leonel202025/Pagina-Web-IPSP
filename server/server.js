require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const usuariosRoute = require('./routes/usuarios');
const contactoRoute = require('./routes/contacto');
const asignaturaRoute = require('./routes/asignaturas');

const app = express();

app.use((req, res, next) => {
  console.log(`🔔 Petición entrante: ${req.method} ${req.url}`);
  next();
});

// Middlewares actualizados
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/api', asignaturaRoute);
app.use('/api/usuarios', usuariosRoute);
app.use('/api/contacto', contactoRoute);
app.use('/api/auth', authRoutes); 
app.use('/api', require('./routes/grados'));

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