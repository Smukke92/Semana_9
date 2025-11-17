<template>
  <div id="app">
    <h1>Gestor de Tareas</h1>

    <!-- Agregar tarea -->
    <div class="add-task">
      <input v-model="newTask" placeholder="Escribe una nueva tarea..." />
      <button @click="addTask">Agregar</button>
    </div>

    <!-- Resumen -->
    <div class="summary">
      <p>Por hacer: {{ summary.todo }}</p>
      <p>En progreso: {{ summary.doing }}</p>
      <p>Finalizadas: {{ summary.done }}</p>
    </div>

    <!-- Columnas -->
    <div class="columns">
      <div class="column">
        <h2>Por hacer</h2>
        <ul>
          <li v-for="task in tasks.todo" :key="task.id">
            {{ task.title }}
            <button @click="moveToNext(task.id, task.status)">➡️</button>
            <button @click="deleteTask(task.id)">🗑️</button>
          </li>
        </ul>
      </div>

      <div class="column">
        <h2>En progreso</h2>
        <ul>
          <li v-for="task in tasks.doing" :key="task.id">
            {{ task.title }}
            <button @click="moveToNext(task.id, task.status)">➡️</button>
            <button @click="deleteTask(task.id)">🗑️</button>
          </li>
        </ul>
      </div>

      <div class="column">
        <h2>Finalizadas</h2>
        <ul>
          <li v-for="task in tasks.done" :key="task.id">
            {{ task.title }}
            <button @click="deleteTask(task.id)">🗑️</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
const API_BASE = "http://localhost:3000";

export default {
  data() {
    return {
      newTask: "",
      tasks: { todo: [], doing: [], done: [] },
      summary: { todo: 0, doing: 0, done: 0 },
    };
  },
  methods: {
    async loadAllTasks() {
      try {
        const res = await fetch(`${API_BASE}/tasks`);
        const all = await res.json();
        const grouped = { todo: [], doing: [], done: [] };
        all.forEach((t) => grouped[t.status]?.push(t) || (grouped[t.status] = [t]));
        this.tasks = grouped;
        this.loadSummary();
      } catch (err) {
        console.error("Error al cargar tareas:", err);
      }
    },
    async addTask() {
      if (!this.newTask.trim()) return;
      try {
        const res = await fetch(`${API_BASE}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: this.newTask }),
        });
        if (res.ok) {
          this.newTask = "";
          this.loadAllTasks();
        }
      } catch (err) {
        console.error("Error al agregar tarea:", err);
      }
    },
    async moveToNext(id, currentStatus) {
      const nextMap = { todo: "doing", doing: "done", done: "done" };
      const next = nextMap[currentStatus];
      try {
        await fetch(`${API_BASE}/tasks/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: next }),
        });
        this.loadAllTasks();
      } catch (err) {
        console.error("Error al cambiar estado:", err);
      }
    },
    async deleteTask(id) {
      try {
        await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
        this.loadAllTasks();
      } catch (err) {
        console.error("Error al eliminar tarea:", err);
      }
    },
    async loadSummary() {
      try {
        const res = await fetch(`${API_BASE}/tasks/summary`);
        if (res.ok) this.summary = await res.json();
      } catch (err) {
        console.error("Error al cargar resumen:", err);
      }
    },
  },
  mounted() {
    this.loadAllTasks();
  },
};
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  max-width: 900px;
  margin: 30px auto;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.add-task {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.add-task input {
  flex: 1;
  padding: 8px;
  font-size: 16px;
}
.add-task button {
  padding: 8px 16px;
  cursor: pointer;
}
.columns {
  display: flex;
  gap: 20px;
}
.column {
  flex: 1;
  background: #fafafa;
  padding: 10px;
  border-radius: 10px;
}
.column h2 {
  text-align: center;
}
.column ul {
  list-style: none;
  padding: 0;
}
.column li {
  background: #fff;
  margin: 5px 0;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ddd;
}
.column button {
  margin-left: 5px;
  cursor: pointer;
}
.summary {
  margin: 20px 0;
  background: #f0f0f0;
  padding: 10px;
  border-radius: 8px;
}
</style>
