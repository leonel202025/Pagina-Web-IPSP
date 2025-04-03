require('dotenv').config(); // ◀️¡IMPORTANTE!

const db = require('./models/db');

async function testConnection() {
  try {
    // Usa pool.getConnection() en lugar de db.getConnection()
    const connection = await db.getConnection();
    console.log("✅ ¡Conexión exitosa!");
    
    // Haz una prueba simple
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    console.log("Prueba de consulta:", rows[0].result);
    
    connection.release();
  } catch (err) {
    console.error("❌ Error de conexión:", err.message);
  }
}

testConnection();