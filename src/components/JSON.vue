<script setup>
import { ref, onMounted } from "vue"
import authorsData from "../assets/json/authors.json"

const authors = ref([])

onMounted(() => {
  const saved = localStorage.getItem("authors")
  if (saved) {
    authors.value = JSON.parse(saved)
  } else {
    authors.value = authorsData
    localStorage.setItem("authors", JSON.stringify(authorsData))
  }
})
</script>

<template>
  <div class="container mt-4">
    <h2>Authors</h2>
    <ul class="list-group">
      <li v-for="author in authors" :key="author.id" class="list-group-item">
        {{ author.name }} ({{ author.birthYear }})
      </li>
    </ul>
  </div>
</template> 
