const incluirTarefa = document.querySelector('.incluir-tarefa');
const incluirCusto = document.querySelector('.incluir-custo');
const incluirData = document.querySelector('.incluir-data');
const tbody = document.querySelector('tbody');
const addTarefa = document.querySelector('.tarefa-form');  // Corrigi a seleção do formulário

const fetchTasks = async () => {
  const response = await fetch('http://localhost:3333/tarefas');
  const tarefas = await response.json();
  return tarefas;
}

const criarTarefa = async (event) => {
  event.preventDefault();

  const tarefaNome = incluirTarefa.value.trim();
  const tarefaCusto = incluirCusto.value.trim();
  const tarefaData = incluirData.value;

  if (!tarefaNome || !tarefaCusto || !tarefaData) {
    alert("Por favor, preencha todos os campos da tarefa.");
    return;
  }

  const tarefa = {
    nome: tarefaNome,
    custo: parseFloat(tarefaCusto).toFixed(2),
    data: new Date(tarefaData).toISOString()
  };

  try {
    const response = await fetch('http://localhost:3333/tarefas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tarefa),
    });

    if (!response.ok) throw new Error("Erro ao criar tarefa");

    atualizarTarefas();
    incluirTarefa.value = '';
    incluirCusto.value = '';
    incluirData.value = '';
  } catch (error) {
    console.error("Erro ao enviar tarefa:", error);
  }
};

const deletarTarefa = async (id) => {
  await fetch(`http://localhost:3333/tarefas/${id}`, {
    method: 'DELETE',
  });

  atualizarTarefas();
}

const atualizarTarefaId = async ({ id, nome, custo }) => {
  await fetch(`http://localhost:3333/tarefas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, custo }),
  });

  atualizarTarefas();
}

const formatDate = (dateUTC) => {
  const options = { dateStyle: 'long', timeStyle: 'short' };
  return new Date(dateUTC).toLocaleString('pt-BR', options);
}

const createElement = (tag, innerText = '', innerHTML = '') => {
  const element = document.createElement(tag);
  if (innerText) element.innerText = innerText;
  if (innerHTML) element.innerHTML = innerHTML;
  return element;
}

const createRow = (tarefa) => {
  const { id, nome, custo, data } = tarefa;

  const tr = createElement('tr');
  const tdNome = createElement('td', nome);
  const tdCusto = createElement('td', custo);
  const tdData = createElement('td', formatDate(data));  // Corrigido para passar 'td' como primeiro argumento
  const tdActions = createElement('td');

  const editButton = createElement('button', '', '<span class="material-symbols-outlined">edit</span>');
  const deleteButton = createElement('button', '', '<span class="material-symbols-outlined">delete</span>');

  const editForm = createElement('form');
  const editInput = createElement('input');
  editInput.value = nome;
  editForm.appendChild(editInput);

  editForm.addEventListener('submit', (event) => {
    event.preventDefault();
    atualizarTarefaId({ id, nome: editInput.value, custo });
  });

  editButton.addEventListener('click', () => {
    tdNome.innerText = '';
    tdNome.appendChild(editForm);
  });

  editButton.classList.add('btn-action');
  deleteButton.classList.add('btn-action');

  deleteButton.addEventListener('click', () => deletarTarefa(id));

  tdActions.appendChild(editButton);
  tdActions.appendChild(deleteButton);

  tr.appendChild(tdNome);
  tr.appendChild(tdCusto);
  tr.appendChild(tdData);
  tr.appendChild(tdActions);

  return tr;
}

const atualizarTarefas = async () => {
  const tasks = await fetchTasks();
  tbody.innerHTML = ''; // Limpa o conteúdo do tbody antes de adicionar as tarefas

  tasks.forEach((task) => {
    const tr = createRow(task);
    tbody.appendChild(tr);
  });
}

addTarefa.addEventListener('submit', criarTarefa);

atualizarTarefas(); // Carrega as tarefas inicialmente
