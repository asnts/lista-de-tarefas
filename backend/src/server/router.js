const express = require('express');
const router = express.Router();
const pool = require('../database/tarefasdb');

// Middleware para processar dados do formulário
router.use(express.urlencoded({ extended: true }));

// Listagem de tarefas
router.get('/tarefas', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM Tarefas ORDER BY ordem ASC');
    res.json(results);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Obter ordem máxima
router.get('/tarefas/max_ordem', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT MAX(ordem) AS max_ordem FROM Tarefas');
    res.json({ max_ordem: results[0].max_ordem || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter ordem máxima' });
  }
});

// Adicionar nova tarefa com cálculo automático de 'ordem'
router.post('/tarefas', async (req, res) => {
  const { nome, custo, data_limite } = req.body;
  try {
    const [[{ maxOrdem }]] = await pool.query('SELECT MAX(ordem) AS maxOrdem FROM Tarefas');
    const novaOrdem = (maxOrdem || 0) + 1;

    await pool.query(
      'INSERT INTO Tarefas (nome, custo, data_limite, ordem) VALUES (?, ?, ?, ?)',
      [nome, custo, data_limite || null, novaOrdem]
    );
    res.status(201).json({ message: 'Tarefa incluída com sucesso!' });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Atualizar tarefa
router.put('/tarefas/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, custo, data_limite } = req.body;

  try {
    const [results] = await pool.query('SELECT * FROM Tarefas WHERE nome = ? AND id != ?', [nome, id]);
    if (results.length > 0) return res.status(400).send('Nome da tarefa já existe.');

    const [result] = await pool.query(
      'UPDATE Tarefas SET nome = ?, custo = ?, data_limite = ? WHERE id = ?',
      [nome, custo, data_limite || null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    res.json({ message: 'Tarefa atualizada com sucesso!' });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Excluir tarefa
router.delete('/tarefas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM Tarefas WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    res.send('Tarefa excluída com sucesso!');
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
