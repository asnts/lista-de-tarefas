// db.js
require('dotenv').config();
const mysql = require('mysql2/promise');
console.log(process.env.MYSQLUSER);  // Deve retornar 'root'
console.log(process.env.MYSQLPASSWORD);  // Deve retornar a senha
console.log(process.env.MYSQLDATABASE)


// Configuração da conexão
const db = mysql.createPool({
  host: process.env.MYSQLHOST,  // Verifique se é o nome correto da variável
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE
});


console.log('Tentando conectar com as seguintes variáveis:');
console.log({
  host: process.env.MYSQLHOST,  // Verifique se é o nome correto da variável
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
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
