<template>
  <ul>
    <li v-for="task in tasks" :key="task.id">
      {{ task.title }}
      <button v-if="task.status === 'todo'" @click="$emit('changeStatus', task, 'doing')">En Progreso</button>
      <button v-if="task.status === 'doing'" @click="$emit('changeStatus', task, 'done')">Finalizado</button>
    </li>
  </ul>
</template>

<script>
export default {
  props: ["tasks"]
};
</script>
