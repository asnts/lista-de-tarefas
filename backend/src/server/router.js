const express = require('express');

const router = express.Router();



// const tarefasController = require('../controller/tarefasController');
// //const tarefasMiddleware = require('./middlewares/tarefasMiddleware');

// router.get('/tarefas', tarefasController.getAll);
// router.post('/tarefas', tarefasController.criarTarefa); //tarefasMiddleware.validateFieldTitle
// router.delete('/tarefas/:id', tarefasController.deleteTask);
// router.put('/tarefas/:id',
//   // tarefasMiddleware.validateFieldTitle,
//   // tarefasMiddleware.validateFieldStatus,
//   // tarefasController.updateTask,
// );


router.get('/tarefas', (req, res) => {
    db.query('SELECT * FROM Tarefas ORDER BY ordem', (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  });

  router.post('/tarefas', (req, res) => {
    const { nome, custo, data_limite } = req.body;
    
    db.query('SELECT MAX(ordem) AS maxOrdem FROM Tarefas', (err, results) => {
      if (err) return res.status(500).send(err);
      const novaOrdem = (results[0].maxOrdem || 0) + 1;
  
      db.query('INSERT INTO Tarefas (nome, custo, data, ordem) VALUES (?, ?, ?, ?)', 
      [nome, custo, data_limite, novaOrdem], (err, result) => {
        if (err) return res.status(400).send(err);
        res.status(201).send('Tarefa incluída com sucesso!');
      });
    });
  });

  router.put('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    const { nome, custo, data_limite } = req.body;
  
    db.query('SELECT * FROM Tarefas WHERE nome = ? AND id != ?', [nome, id], (err, results) => {
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
  

  