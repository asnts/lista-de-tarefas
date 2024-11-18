// db.js
const mysql = require('mysql2');
require('dotenv').config();

// Configuração da conexão
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'mEGUwDTp32024',
  database: 'lista_de_tarefas',
  port:'3306',
  // insecureAuth : true
  });


db.getConnection((err, connection) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL.');
  connection.release(); 
});

module.exports = db;
