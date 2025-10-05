<template>  
  <div class="container">
    <h1>Gestor de tareas</h1>

    <!-- Input con v-model -->
    <input 
      v-model="newTask" 
      placeholder="Introduce una tarea" 
      @keyup.enter="addTask" 
    />
    <button @click="addTask">agregar</button>

    <hr />

    <h2>Listado de tareas</h2>

    <!-- v-if / v-else -->
    <div v-if="tasks.todo.length > 0 || tasks.doing.length > 0 || tasks.done.length > 0">

      <div class="columns">
        
        <!-- Columna TO DO -->
        <div class="column">
          <h3>To do</h3>
          <!-- v-for -->
          <div v-for="task in tasks.todo" :key="task.id" class="task-item">  
            <button class="task-btn" @click="moveToNext(task.id, 'todo')">
              {{ task.text }}
            </button>
            <button class="arrow-btn" @click="moveToNext(task.id, 'todo')">
              →
            </button>
          </div>
        </div>

        <!-- Columna DOING -->
        <div class="column">
          <h3>Doing</h3>
          <div v-for="task in tasks.doing" :key="task.id" class="task-item">
            <button class="doin-task-btn" @click="moveToNext(task.id, 'doing')">
              {{ task.text }}
            </button>
            <button class="doin-arrow-btn" @click="moveToNext(task.id, 'doing')">
              →
            </button>
          </div>
        </div>

        <!-- Columna DONE -->
        <div class="column">
          <h3>Done</h3>
          <div v-for="task in tasks.done" :key="task.id" class="task-done">
            {{ task.text }}
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <p>No hay tareas registradas</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Modelo: variables reactivas
const newTask = ref('')
const tasks = ref({
  todo: [],
  doing: [],
  done: []
})

let taskIdCounter = 0

// ViewModel: lógica del componente
const addTask = () => {
  const taskText = newTask.value.trim()
  if (taskText !== '') {
    tasks.value.todo.push({
      id: taskIdCounter++,
      text: taskText
    })
    newTask.value = ''
  }
}

const moveToNext = (taskId, currentColumn) => {
  const taskIndex = tasks.value[currentColumn].findIndex(t => t.id === taskId)
  const task = tasks.value[currentColumn][taskIndex]
  
  // Remover de la columna actual
  tasks.value[currentColumn].splice(taskIndex, 1)
  
  // Agregar a la siguiente columna
  if (currentColumn === 'todo') {
    tasks.value.doing.push(task)
  } else if (currentColumn === 'doing') {
    tasks.value.done.push(task)
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 40px auto;
  font-family: Arial, sans-serif;
  padding: 0 20px;
}

h1 {
  text-align: center;
  font-size: 28px;
  margin-bottom: 20px;
}

input {
  padding: 8px;
  width: 60%;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #e5e7eb;
}

button {
  margin-left: 8px;
  padding: 8px 12px;
  border: none;
  background: #d1d5db;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #9ca3af;
}

hr {
  border: none;
  border-top: 1px solid #ccc;
  margin: 20px 0;
}

h2 {
  text-align: center;
  font-size: 22px;
  margin-bottom: 20px;
}

p {
  text-align: center;
  color: #666;
}

.columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 20px;
}

.column {
  border: 2px solid #999;
  background: #f3f4f6;
  padding: 12px;
  border-radius: 4px;
  min-height: 250px;
}

.column h3 {
  text-align: center;
  font-size: 18px;
  margin-bottom: 12px;
}

.task-item {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
}

.task-btn {
  flex: 1;
  background: #fca5a5;
  text-align: left;
  padding: 8px 10px;
  margin: 0;
}
.doin-task-btn {
  flex: 1;
  background: #6a72e6ff;
  text-align: left;
  padding: 8px 10px;
  margin: 0;
}
.doin-arrow-btn{
  background: #6a72e6ff;
  padding: 8px 12px;
  margin: 0;
  font-size: 16px;
}

.task-btn:hover {
  background: #f87171;
}

.arrow-btn {
  background: #fca5a5;
  padding: 8px 12px;
  margin: 0;
  font-size: 16px;
}

.arrow-btn:hover {
  background: #f87171;
}

.task-done {
  background: #afe9adff;
  padding: 8px 10px;
  border-radius: 4px;
  margin-bottom: 6px;
}
</style>