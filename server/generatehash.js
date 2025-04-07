// generateHash.js
const bcrypt = require('bcryptjs');

// Configuración (cambia estos valores)
const CONTRASEÑA_PLAIN = 'admin456';  // Cambia esta contraseña
const SALT_ROUNDS = 10;               // Coste del hash (10 es estándar)

// Generar hash
const hash = bcrypt.hashSync(CONTRASEÑA_PLAIN, SALT_ROUNDS);

// Resultado
console.log('====================================');
console.log('Contraseña original:', CONTRASEÑA_PLAIN);
console.log('Hash generado (para MySQL):', hash);
console.log('====================================');

// Validación (opcional)
console.log('¿La contraseña coincide con el hash?', bcrypt.compareSync(CONTRASEÑA_PLAIN, hash));