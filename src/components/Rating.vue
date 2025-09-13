<template>
  <div class="rating">
    <h3>Rate Our Service</h3>
    <div v-if="currentUser">
      <select v-model.number="userRating">
        <option disabled value="0">Select rating</option>
        <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
      </select>
      <button @click="submitRating">Submit</button>
    </div>
    <div v-else>
      <p>Please login to rate.</p>
    </div>

    <div v-if="ratings.length">
      <p>Average Rating: {{ averageRating.toFixed(2) }} ⭐</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"

const ratings = ref([])
const userRating = ref(0)
const currentUser = ref(null)

onMounted(() => {
  const savedRatings = localStorage.getItem("ratings")
  if (savedRatings) ratings.value = JSON.parse(savedRatings)

  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) currentUser.value = JSON.parse(savedUser)
})

const submitRating = () => {
  if (!currentUser.value) return
  ratings.value.push({ user: currentUser.value.email, value: userRating.value })
  localStorage.setItem("ratings", JSON.stringify(ratings.value))
  alert("Thanks for rating!")
}

const averageRating = computed(() => {
  if (!ratings.value.length) return 0
  return ratings.value.reduce((sum, r) => sum + r.value, 0) / ratings.value.length
})
</script>
