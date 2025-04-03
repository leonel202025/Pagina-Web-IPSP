const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login (para todos los usuarios)
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.query(
      'SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ?', 
      [email]
    );
    if (!users.length || !(await bcrypt.compare(password, users[0].password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const { password: _, ...userData } = users[0];
    const token = jwt.sign(
      { id: userData.id, rol: userData.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
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