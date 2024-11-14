// db.js
require('dotenv').config();
const mysql = require('mysql2');

// Configuração da conexão
const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
});

// A pool de conexões gerencia as conexões automaticamente, não é necessário chamar `connect()`
db.getConnection((err, connection) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL.');
  connection.release(); // Libera a conexão de volta para a pool
});

module.exports = db;
