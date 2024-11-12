const tbody = document.querySelector('tbody');
const addForm = document.querySelector('.form');
const incluirTarefa = document.querySelector('.incluir-tarefa');

const fetchTasks = async () => {
  const response = await fetch('http://localhost:3333/tarefas')
  const tarefas = await response.json()
  return tarefas;
}

const criarTarefa = async (event) => {
  event.preventDefault();

  const tarefa = { title: incluirTarefa.value };

  await fetch('http://localhost:3333/tarefas', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tarefa),
  });


 atualizarTarefas();
  incluirTarefa.value = '';
}

const deletarTarefa = async (id) => {
  await fetch(`http://localhost:3333/tarefas/${id}`, {
    method: 'delete',
  });

  atualizarTarefas();
}

const atualizarTarefaId = async ({ id, nome, custo }) => {

  await fetch(`http://localhost:3333/tarefas/${id}`, {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, custo }),
  });

  atualizarTarefas();
}



const formatDate = (dateUTC) => {
  const options = { dateStyle: 'long', timeStyle: 'short' };
  const date = new Date(dateUTC).toLocaleString('pt-br', options);
  return date;
}

const createElement = (tag, innerText = '', innerHTML = '') => {
  const element = document.createElement(tag);

  if (innerText) {
    element.innerText = innerText;
  }

  if (innerHTML) {
    element.innerHTML = innerHTML;
  }

  return element;
}


const createRow = (tarefa) => {

  const { id, nome, custo, data } = tarefa;

  const tr = createElement('tr');
  const tdNome = createElement('td', nome);
  const tdCusto = createElement('td', custo);
  const tdData = createElement('td', formatDate());
  const tdActions = createElement('td');

   select.addEventListener('change', ({ target }) => updateTask({ ...tarefa, status: target.value }));

  const editButton = createElement('button', '', '<span class="material-symbols-outlined">edit</span>');
  const deleteButton = createElement('button', '', '<span class="material-symbols-outlined">delete</span>');
  
  const editForm = createElement('form');
  const editInput = createElement('input');

  editInput.value = title;
  editForm.appendChild(editInput);
  
  editForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    updateTask({ id, title: editInput.value});
  });

  editButton.addEventListener('click', () => {
    tdTitle.innerText = '';
    tdTitle.appendChild(editForm);
  });

  editButton.classList.add('btn-action');
  deleteButton.classList.add('btn-action');

  deleteButton.addEventListener('click', () => deleteTask(id));
  
  tdStatus.appendChild(select);

  tdActions.appendChild(editButton);
  tdActions.appendChild(deleteButton);

  tr.appendChild(tdTitle);
  tr.appendChild(tdCreatedAt);
  tr.appendChild(tdStatus);
  tr.appendChild(tdActions);

  return tr;
}

const atualizarTarefas = async () => {
  const tasks = await fetchTasks();

  tbody.innerHTML = '';

  tasks.forEach((task) => {
    const tr = createRow(task);
    tbody.appendChild(tr);
  });
}


addForm.addEventListener('submit', addTask);

carregarTarefas();