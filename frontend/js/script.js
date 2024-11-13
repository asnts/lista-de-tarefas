const incluirTarefa = document.querySelector('.incluir-tarefa');
const incluirCusto = document.querySelector('.incluir-custo');
const incluirData = document.querySelector('.incluir-data');
const tbody = document.querySelector('tbody');
const addTarefa = document.querySelector('.tarefa-form'); 

const fetchTasks = async () => {
  const response = await fetch('http://localhost:3333/tarefas');
  const tarefas = await response.json();
  return tarefas;
}

// Função para formatar a data para o formato "YYYY-MM-DD" que o banco de dados espera
function formatarDataParaBanco(data) {
  const [dia, mes, ano] = data.split('/');
  return `${ano}-${mes}-${dia}`; // Formato esperado pelo banco de dados
}

// Função para formatar a data para exibição "DD/MM/YYYY"
function formatarDataParaExibir(data) {
  if (!data) return 'Data Inválida'; // Verificação para evitar valores nulos
  const dateObj = new Date(data);
  if (isNaN(dateObj.getTime())) return 'Data Inválida'; // Verificação para evitar `NaN`
  const dia = String(dateObj.getDate()).padStart(2, '0');
  const mes = String(dateObj.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
  const ano = dateObj.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

const criarTarefa = async (event) => {
  event.preventDefault();
  console.log("Botão de adicionar tarefa foi acionado");

  const tarefaNome = incluirTarefa.value.trim();
  const tarefaCusto = incluirCusto.value.trim();
  const tarefaData = incluirData.value;

  if (!tarefaNome || !tarefaCusto || !tarefaData) {
    alert("Por favor, preencha todos os campos da tarefa.");
    return;
  }
  if (isNaN(tarefaCusto)) {
    console.log("O custo precisa ser um número válido.");
    return;
  }
  
  const formattedDate = formatarDataParaBanco(tarefaData);
  if (!formattedDate) {
    console.log("Data inválida.");
    return;
  }
  
  try{
    const responseMaxOrdem = await fetch('http://localhost:3333/tarefas/max_ordem');
    const maxOrdem = await responseMaxOrdem.json();
    const novaOrdem = maxOrdem.max_ordem + 1;

  
    const response = await fetch('http://localhost:3333/tarefas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: tarefaNome,
    custo: tarefaCusto,
    data: formatarDataParaBanco(tarefaData)
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro ao criar tarefa:", errorText);
      throw new Error ("Erro ao criar tarefa");
    }

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
  return formatarDataParaExibir(dateUTC); // Utiliza a função para exibir a data formatada
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
  const tdData = createElement('td', formatDate(data));  
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
