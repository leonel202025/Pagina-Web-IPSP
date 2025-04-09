const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = rows[0];

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // ✅ Generar el token
    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Enviar token y datos del usuario (los que necesites)
    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Registro (solo accesible por admins)
exports.register = async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  try {
    // Verificar si el usuario ya existe
    const [users] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (users.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    // Crear usuario (solo si quien hace la request es admin)
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hashedPassword, rol || 'alumno']
    );
    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

exports.perfil = async (req, res) => {
  const userId = req.userId; // ← Esto lo pone el middleware verifyToken

  try {
    const [rows] = await db.query(
      'SELECT id, nombre, email, rol FROM usuarios WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ user: rows[0] });
  } catch (error) {
    console.error('❌ Error al obtener el perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

