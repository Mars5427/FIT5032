<template>
  <div class="container mt-5" style="max-width: 600px;">
    <h2>User Rating</h2>
    <p class="text-muted">Rate Our Service</p>

    <div v-if="!user">
      <p class="text-danger">Please login to rate.</p>
    </div>

    <div v-else>
      <div class="mb-3">
        <label class="form-label">Your Rating:</label>
        <select v-model="userRating" class="form-select" @change="submitRating">
          <option disabled value="">Select rating</option>
          <option v-for="n in 5" :key="n" :value="n">{{ n }} ★</option>
        </select>
      </div>

      <div class="mt-4">
        <h5>Average Rating: 
          <span class="text-primary">{{ averageRating.toFixed(1) }}</span> ★
        </h5>
        <p>Total Ratings: {{ ratings.length }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
const ratings = ref([])
const userRating = ref('')

onMounted(() => {
  const saved = localStorage.getItem('ratings')
  if (saved) ratings.value = JSON.parse(saved)

  if (user) {
    const existing = ratings.value.find(r => r.email === user.email)
    if (existing) {
      userRating.value = existing.score
    }
  }
})

const averageRating = computed(() => {
  if (!ratings.value.length) return 0
  const total = ratings.value.reduce((sum, r) => sum + r.score, 0)
  return total / ratings.value.length
})

const submitRating = () => {
  if (!user) return

  const existing = ratings.value.find(r => r.email === user.email)
  if (existing) {
    existing.score = parseInt(userRating.value)
  } else {
    ratings.value.push({
      email: user.email,
      score: parseInt(userRating.value)
    })
  }
  localStorage.setItem('ratings', JSON.stringify(ratings.value))
  alert('Thank you for your rating!')
}
</script>

<style scoped>
h2 {
  margin-bottom: 15px;
}
</style>
