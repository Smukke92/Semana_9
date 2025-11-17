import { v4 as uuidv4 } from "uuid";

let tasks = [];

// Obtener todas las tareas
export const getAllTasks = (req, res) => {
  res.json(tasks);
};

// Obtener tarea por ID
export const getTaskById = (req, res) => {
  const { id } = req.params;
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};

// Crear nueva tarea
export const createTask = (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const newTask = {
    id: uuidv4(),
    title,
    status: "todo" // por defecto
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
};

// Actualizar tarea (titulo o status)
export const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;

  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (title !== undefined) task.title = title;
  if (status !== undefined && ["todo", "doing", "done"].includes(status)) {
    task.status = status;
  }

  res.json(task);
};

// Cambiar solo estado de la tarea
export const updateTaskStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["todo", "doing", "done"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  task.status = status;
  res.json(task);
};

// Eliminar tarea
export const deleteTask = (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ message: "Task not found" });

  tasks.splice(index, 1);
  res.status(204).send();
};

// Obtener resumen
export const getSummary = (req, res) => {
  const summary = { todo: 0, doing: 0, done: 0 };
  tasks.forEach(t => {
    if (summary[t.status] !== undefined) summary[t.status]++;
  });
  res.json(summary);
};
