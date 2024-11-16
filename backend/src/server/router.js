const express = require('express');
const router = express.Router();
const db = require('../database/tarefasdb');

// Middleware para processar dados do formulário
router.use(express.urlencoded({ extended: true }));

// Listagem de tarefas
router.get('/tarefas', (req, res) => {
    db.query('SELECT * FROM Tarefas ORDER BY ordem ASC', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Obter ordem máxima
router.get('/tarefas/max_ordem', (req, res) => {
    db.query('SELECT MAX(ordem) AS max_ordem FROM Tarefas', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao obter ordem máxima' });
        }
        res.json({ max_ordem: results[0].max_ordem || 0 });
    });
});

// Adicionar nova tarefa com cálculo automático de 'ordem'
router.post('/tarefas', (req, res) => {
    const { nome, custo, data_limite } = req.body;

    // Buscar o maior valor atual de 'ordem' e incrementá-lo em 1
    db.query('SELECT MAX(ordem) AS maxOrdem FROM Tarefas', (err, results) => {
        if (err) return res.status(500).send(err);
        const novaOrdem = (results[0].maxOrdem || 0) + 1;

        // Inserir a nova tarefa com a ordem calculada
        db.query(
            'INSERT INTO Tarefas (nome, custo, data_limite, ordem) VALUES (?, ?, ?, ?)',
            [nome, custo, data_limite || null, novaOrdem],
            (err, result) => {
                if (err) return res.status(400).send(err);
                res.status(201).json({ message: 'Tarefa incluída com sucesso!' });
            }
        );
    });
});

// Atualizar tarefa
router.put('/tarefas/:id', (req, res) => {
  const { id } = req.params;
  const { nome, custo, data_limite } = req.body;

  if (!id) {
      return res.status(400).json({ error: "ID é obrigatório." });
  }

  // Validar se o nome da tarefa é único
  db.query('SELECT * FROM Tarefas WHERE nome = ? AND id != ?', [nome, id], (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length > 0) return res.status(400).send('Nome da tarefa já existe.');

      // Construir a consulta com segurança
      const query = `
          UPDATE Tarefas
          SET nome = ?, custo = ?, data_limite = ?
          WHERE id = ?
      `;
      const valores = [nome, custo, data_limite || null, id]; // Substitue valores indefinidos por NULL

      // Executar a consulta
      db.query(query, valores, (err, result) => {
          if (err) return res.status(500).send(err);
          if (result.affectedRows === 0) {
              return res.status(404).json({ error: "Tarefa não encontrada." });
          }
          res.json({ message: "Tarefa atualizada com sucesso!" });
      });
  });
});

// Excluir tarefa
router.delete('/tarefas/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM Tarefas WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Tarefa excluída com sucesso!');
    });
});

module.exports = router;
