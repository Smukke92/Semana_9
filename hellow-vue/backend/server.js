const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const shortid = require('shortid');

const DB_FILE = path.join(__dirname, 'tasks.json');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Util: cargar/guardar
function loadTasks() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify([]), 'utf8');
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Error loading DB:', err);
    return [];
  }
}
function saveTasks(tasks) {
  fs.writeFileSync(DB_FILE, JSON.stringify(tasks, null, 2), 'utf8');
}

// Valid status
const VALID_STATUS = ['todo', 'doing', 'done'];

/**
 * obtener todas la tareas---
 */
app.get('/tasks', (req, res) => {
  const statusFilter = req.query.status;
  let tasks = loadTasks();
  if (statusFilter) {
    tasks = tasks.filter(t => t.status === statusFilter);
  }
  res.json(tasks);
});

/**
 Obtener una tarea por ID---
 */
app.get('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const tasks = loadTasks();
  const task = tasks.find(t => String(t.id) === String(id));
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

/**
 Crear nueva tarea---
 */
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: 'title required' });

  const tasks = loadTasks();
  const newTask = {
    id: shortid.generate(),
    title,
    description: description || '',
    status: 'todo',
    createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

/**
 * PUT /tasks/:id
 * Actualizar tarea completa
 */
app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const { title, description, status } = req.body;
  if (!title || !status) return res.status(400).json({ message: 'title and status required' });
  if (!VALID_STATUS.includes(status)) return res.status(400).json({ message: `status must be one of ${VALID_STATUS.join(',')}` });

  const tasks = loadTasks();
  const idx = tasks.findIndex(t => String(t.id) === String(id));
  if (idx === -1) return res.status(404).json({ message: 'Task not found' });

  const updated = {
    ...tasks[idx],
    title,
    description: description || '',
    status
  };
  tasks[idx] = updated;
  saveTasks(tasks);
  res.json(updated);
});

/**
Cambiar estado de tarea
 */
app.patch('/tasks/:id/status', (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  if (!status) return res.status(400).json({ message: 'status required' });
  if (!VALID_STATUS.includes(status)) return res.status(400).json({ message: `status must be one of ${VALID_STATUS.join(',')}` });

  const tasks = loadTasks();
  const idx = tasks.findIndex(t => String(t.id) === String(id));
  if (idx === -1) return res.status(404).json({ message: 'Task not found' });

  tasks[idx].status = status;
  saveTasks(tasks);
  res.json(tasks[idx]);
});

/**
 * Eliminar tarea
 */
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  let tasks = loadTasks();
  const idx = tasks.findIndex(t => String(t.id) === String(id));
  if (idx === -1) return res.status(404).json({ message: 'Task not found' });

  tasks.splice(idx, 1);
  saveTasks(tasks);
  res.json({ message: 'Task deleted successfully' });
});

/**
 * GET /tasks/summary
 * returns counts by status { todo: n, doing: m, done: k }
 */
app.get('/tasks/summary', (req, res) => {
  const tasks = loadTasks();
  const summary = { todo: 0, doing: 0, done: 0 };
  tasks.forEach(t => {
    if (summary[t.status] !== undefined) summary[t.status]++;
  });
  res.json(summary);
});

// Start
app.listen(PORT, () => {
  console.log(`Todo API running on http://localhost:${PORT}`);
});
