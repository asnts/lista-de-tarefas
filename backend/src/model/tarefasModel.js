const connection = require('./connection')

const getAll = async () => {
    const [tarefas] = await connection.execute('SELECT * FROM Tarefas');
    return tarefas;
};

const criarTarefa = async (tarefa) => {
    const {nome, custo}  = tarefa;
    const data = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO Tarefas(nome, custo, data) VALUE (?, ?, ?)';

    

};

const deletarTarefa = async (id) => {
    const [tarefaRemovida] = await connection.execute('DELETE FROM Tarefas where id = ?', [id]);
     return tarefaRemovida;
};


const atualizarTarefa = async (id, tarefa) => {
    const {nome, custo, data} = tarefa;

   const query = 'UPDATE Tarefas SET nome = ?, custo = ?, data = ?, WHERE id = ?';
   
   const [tarefaAtualizada] = await connection.execute(query, [nome, custo, data, id]);
   return tarefaAtualizada;

};

module.exports = {
    getAll,
    criarTarefa,
    deletarTarefa,
    atualizarTarefa,
};

