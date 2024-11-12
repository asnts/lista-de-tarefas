const tarefasModel = require('../model/tarefasModel');
const { response, request } = require('express');

const getAll = async (_request, response) => {
    const tarefas = await tarefasModel.getAll();
    return response.status(200).json(tarefas);
};

const criarTarefa = async(request, response) => {
    const tarefaCriada = await tarefasModel.criarTarefa(request.body);
    return response.status(201).json(tarefaCriada);
};

const deletarTarefa = async (request, response) => {
    const{id} = request.params;


    await tarefasModel.deletarTarefa(id);
    return response.status(204).json();

};


const atualizarTarefa = async (request, response) => {
    const {id} = request.params;

    await tarefasModel.atualizarTarefa(id, request.body);
    return response.status(204).json();

};

module.exports = {
    getAll,
    criarTarefa,
    deletarTarefa,
    atualizarTarefa,
}
