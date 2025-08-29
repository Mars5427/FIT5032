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
  <div class="container-fluid mt-4">
    <h2 class="text-center mb-4">📚 Authors List</h2>
    <div class="row">
      <div v-for="author in authors" :key="author.id" class="col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ author.name }}</h5>
            <p class="card-text">Born: {{ author.birthYear }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
</style>
