import Database from "../infra/configDB.js";
class DatabaseMetodos {
    static tableTarefas() {
        const tarefa = `CREATE TABLE IF NOT EXISTS Tarefas
                         (id INTEGER PRIMARY KEY,
                          nome TEXT,
                          custo INTEGER,
                          data TIME)`
        return new Promise((resolve, reject) => {
            Database.run(pedido, (e) => {
                if (e) {
                    reject(e.message)
                } else {
                    resolve("Nova tabela de tarefas")
                }
            })
        })
    };
    static criarTarefa(tarefa) {
        const query = `INSERT INTO Tarefa (nome, custo, data, ordem) VALUES ( ?, ?, ?)`;
        const body = Object.values(tarefa);
        return new Promise((resolve, reject) => {
            Database.run(query, [...body], (e) => {
                if (e) {
                    reject(e)
                } else {
                    resolve({ message: "Nova tarefa inserida com sucesso" })
                }
            })
        })
    };
    static atualizarTarefaId(tarefa, id) {
        const query = `UPDATE tarefa SET (nome, custo, data) = (?,?,?) WHERE id = ?`;
        const body = Object.values(pedido)
        return new Promise((resolve, reject) => {
            Database.run(query, [...body, id], (e, result) => {
                if (e) {
                    reject(e.message)
                } else {
                    resolve({ "message": "Tarefa alterada com sucesso!" })
                }
            })
        })
    };
    static selecionarTarefa(id) {
        const query = `SELECT * FROM Tarefa WHERE id = ?`;
        return new Promise((resolve, reject) => {
            Database.get(query, id, (e, result) => {
                if (e) {
                    reject(e.message)
                } else {
                    resolve(result)
                }
            })
        })
    };
    static selecionarTarefas() {
        const query = `SELECT * FROM Tarefas`;
        return new Promise((resolve, reject) => {
            Database.all(query, (e, rows) => {
                if (e) {
                    reject(e.message)
                } else {
                    resolve({ rows: rows })
                }
            })
        })
    };
    static deletarTarefa(id) {
        const query = `DELETE From Tarefas WHERE id = ?`
        return new Promise((resolve, reject) => {
            Database.run(query, id, (e) => {
                if (e) {
                    reject(e.message)
                } else {
                    resolve({ message: "Tarefa apagada com sucesso" })
                }
            })
        })
    };
}

export default DatabaseMetodos;