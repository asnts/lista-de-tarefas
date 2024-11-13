const express = require('express');

const router = express.Router();

const db = require('../database/tarefasdb'); 


router.get('/tarefas', (req, res) => {
    db.query('SELECT * FROM Tarefas ORDER BY id ASC', (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  });

  router.post('/tarefas', (req, res) => {
    const { nome, custo, data_limite, ordem } = req.body;
    
    db.query('SELECT MAX(id) AS maxId FROM Tarefas', (err, results) => {
      if (err) return res.status(500).send(err);
      const novaOrdem = (results[0].maxOrdem || 0) + 1;
  
      db.query('INSERT INTO Tarefas (nome, custo, data_limite, ordem) VALUES (?, ?, ?, ?)', 
      [nome, custo, data_limite, ordem], (err, result) => {
        if (err) return res.status(400).send(err);
        res.status(201).send('Tarefa incluída com sucesso!');
      });
    });
  });

  router.put('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    const { nome, custo, data_limite, ordem } = req.body;
  
    db.query('SELECT * FROM Tarefas WHERE nome = ? AND id != ?', [nome, id, ordem], (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length > 0) return res.status(400).send('Nome da tarefa já existe.');
  
      db.query('UPDATE Tarefas SET nome = ?, custo = ?, data_limite = ? WHERE id = ?', 
      [nome, custo, data_limite, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Tarefa atualizada com sucesso!');
      });
    });
  });
  
  router.delete('/tarefas/:id', (req, res) => {
    const { id } = req.params;
  
    db.query('DELETE FROM Tarefas WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).send(err);
      res.send('Tarefa excluída com sucesso!');
    });
  });


  router.put('/tarefas/ordenar', (req, res) => {
    const { novaOrdem } = req.body; // novaOrdem será um array de objetos { id, ordem }
  
    const promises = novaOrdem.map(tarefa => {
      return new Promise((resolve, reject) => {
        db.query('UPDATE Tarefas SET ordem = ? WHERE id = ?', [tarefa.ordem, tarefa.id], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    });
  
    Promise.all(promises)
      .then(() => res.send('Ordem das tarefas atualizada com sucesso!'))
      .catch((err) => res.status(500).send(err));
  });
  

  module.exports = router;
  

  