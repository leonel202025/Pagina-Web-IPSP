require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const contactoRoute = require('./routes/contacto');
const asignaturaRoute = require('./routes/asignaturas');
const path = require("path");
const documentosRoutes = require("./routes/documentos");

const app = express();
app.use((req, res, next) => {
  next();
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/api/asignaturas', asignaturaRoute);
app.use('/api/grados', require('./routes/grados'));
app.use('/api/contacto', contactoRoute);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', require('./routes/usuarios'));
app.use("/api/eventos", require("./routes/eventos"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/documentos", documentosRoutes);

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