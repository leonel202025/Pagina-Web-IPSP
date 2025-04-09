const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  console.log('👉 Authorization Header:', req.headers['authorization']); // 🔍

  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Token no proporcionado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.userId = decoded.id;
    req.userRol = decoded.rol;
    next();
  });
};

exports.checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.userRol)) {
    return res.status(403).json({ error: 'Acceso no autorizado' });
  }
  next();
};
