const STORAGE_KEY = 'cleantodo-tasks'

let todos = loadTodos()
let currentFilter = 'all'

const form = document.getElementById('todo-form')
const input = document.getElementById('todo-input')
const list = document.getElementById('todo-list')
const emptyState = document.getElementById('empty-state')
const itemsLeft = document.getElementById('items-left')
const clearBtn = document.getElementById('clear-completed')
const filterBtns = document.querySelectorAll('.filter-btn')

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function addTodo(text) {
  todos.unshift({
    id: crypto.randomUUID(),
    text: text.trim(),
    completed: false
  })
  saveTodos()
  render()
}

function toggleTodo(id) {
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  saveTodos()
  render()
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id)
  saveTodos()
  render()
}

function clearCompleted() {
  todos = todos.filter(t => !t.completed)
  saveTodos()
  render()
}

function getFilteredTodos() {
  if (currentFilter === 'active') return todos.filter(t => !t.completed)
  if (currentFilter === 'completed') return todos.filter(t => t.completed)
  return todos
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function createTodoElement(todo) {
  const li = document.createElement('li')
  li.className = `todo-item${todo.completed ? ' completed' : ''}`
  li.innerHTML = `
    <button class="todo-checkbox">${todo.completed ? '✓' : ''}</button>
    <span class="todo-text">${escapeHtml(todo.text)}</span>
    <button class="btn-delete">×</button>
  `
  li.querySelector('.todo-checkbox').onclick = () => toggleTodo(todo.id)
  li.querySelector('.btn-delete').onclick = () => deleteTodo(todo.id)
  return li
}

function render() {
  const filtered = getFilteredTodos()
  list.innerHTML = ''
  filtered.forEach(todo => list.appendChild(createTodoElement(todo)))
  emptyState.classList.toggle('visible', filtered.length === 0)
  const active = todos.filter(t => !t.completed).length
  itemsLeft.textContent = `${active} item${active !== 1 ? 's' : ''} left`
  clearBtn.style.visibility = todos.some(t => t.completed) ? 'visible' : 'hidden'
}

form.onsubmit = (e) => {
  e.preventDefault()
  if (input.value.trim()) {
    addTodo(input.value)
    input.value = ''
  }
}

clearBtn.onclick = clearCompleted

filterBtns.forEach(btn => {
  btn.onclick = () => {
    filterBtns.forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    currentFilter = btn.dataset.filter
    render()
  }
})

render()