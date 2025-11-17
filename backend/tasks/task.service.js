import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, "tasks.json");

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

function load() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function save(tasks) {
  fs.writeFileSync(DB_FILE, JSON.stringify(tasks, null, 2));
}

export function getAll() {
  return load();
}

export function getById(id) {
  return load().find(t => t.id === id);
}

export function create({ title, description = "" }) {
  const tasks = load();
  const newTask = {
    id: randomUUID(),
    title,
    description,
    status: "todo",
    createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  save(tasks);
  return newTask;
}

export function update(id, data) {
  const tasks = load();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;

  tasks[index] = { ...tasks[index], ...data };
  save(tasks);
  return tasks[index];
}

export function remove(id) {
  const tasks = load();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return false;

  tasks.splice(index, 1);
  save(tasks);
  return true;
}

// 🔥 NUEVO: summary()
export function summary() {
  const tasks = load();
  return {
    todo: tasks.filter(t => t.status === "todo").length,
    doing: tasks.filter(t => t.status === "doing").length,
    done: tasks.filter(t => t.status === "done").length
  };

}

export function updateStatus(id, status) {
  const tasks = load();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;

  tasks[index].status = status;
  save(tasks);

  return tasks[index];
}

