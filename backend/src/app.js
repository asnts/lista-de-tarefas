const express = require('express');
const cors = require('cors');
const router = require('./server/router');

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

app.get('/test-db', (req, res) => {
    db.query('SELECT 1 + 1 AS resultado', (err, results) => {
      if (err) {
        console.error('Erro ao testar conexão com o banco:', err);
        return res.status(500).json({ error: 'Erro ao conectar com o banco' });
      }
      res.status(200).json({ resultado: results[0].resultado });
    });
  });

module.exports = app;