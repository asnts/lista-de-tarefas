// db.js
require('dotenv').config();
const mysql = require('mysql2/promise');
console.log(process.env.MYSQLUSER);  // Deve retornar 'root'
console.log(process.env.MYSQLPASSWORD);  // Deve retornar a senha
console.log(process.env.MYSQLDATABASE)


// Configuração da conexão
const db = mysql.createPool({
  port:process.env.MYSQL_PORT,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
   });



console.log('Tentando conectar com as seguintes variáveis:');
console.log({
  port:process.env.MYSQL_PORT,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
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
