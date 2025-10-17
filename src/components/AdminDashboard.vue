<template>
  <div class="container mt-4">
    <h2>🛠️ Admin Dashboard</h2>
    <div class="row g-3 mt-1">
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5>Total Users</h5>
            <p class="display-6">{{ stats.users }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5>Admins</h5>
            <p class="display-6">{{ stats.admins }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5>Avg Rating</h5>
            <p class="display-6">{{ stats.avgRating.toFixed(1) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <router-link to="/email" class="btn btn-primary me-2">Bulk Email</router-link>
      <router-link to="/export" class="btn btn-outline-secondary">Export Data</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const stats = ref({ users:0, admins:0, avgRating:0 })

onMounted(() => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  stats.value.users = users.length
  stats.value.admins = users.filter(u => u.role === 'admin').length
  const ratings = JSON.parse(localStorage.getItem('ratings') || '[]')
  if (ratings.length){
    stats.value.avgRating = ratings.reduce((a,b)=>a+b.score,0)/ratings.length
  } else {
    stats.value.avgRating = 0
  }
})
</script>
