require('dotenv').config();
const mysql = require('mysql2/promise');


// Configuração do pool de conexões
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  port: process.env.MYSQL_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conectado ao banco de dados MySQL.');
    connection.release();  
  } catch (err) {
    console.error('Erro ao conectar ao MySQL:', err);
  }
}



module.exports = pool;
