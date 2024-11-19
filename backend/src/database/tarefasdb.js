// db.js
require('dotenv').config();
const mysql = require('mysql2/promise');
console.log(process.env.MYSQL_USER);  // Deve retornar 'root'
console.log(process.env.MYSQL_PASSWORD);  // Deve retornar a senha
console.log(process.env.MYSQL_DATABASE)


// Configuração da conexão
const db = mysql.createPool({
  host: process.env.MYSQL_HOST,  // Verifique se é o nome correto da variável
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});


console.log('Tentando conectar com as seguintes variáveis:');
console.log({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  database: process.env.MYSQLDATABASE,
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
