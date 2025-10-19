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
        <h5>
          Average Rating:
          <span class="text-primary">{{ averageRating.toFixed(1) }}</span> ★
        </h5>
        <p>Total Ratings: {{ ratings.length }}</p>
        <p v-if="msg" class="text-warning">{{ msg }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { db } from '../firebase'
import { collection, doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'

const user = JSON.parse(localStorage.getItem('currentUser') || 'null')

const ratings = ref([]) 
const userRating = ref('')
const msg = ref('')
let stop = null

function loadLocal() {
  try {
    const saved = JSON.parse(localStorage.getItem('ratings') || '[]')
    if (Array.isArray(saved)) ratings.value = saved
  } catch {}
}

onMounted(() => {
  try {
    stop = onSnapshot(collection(db, 'ratings'), snap => {
      ratings.value = snap.docs.map(d => ({
        email: d.data().email || 'anonymous',
        score: Number(d.data().score) || 0
      }))
      if (user) {
        const ex = ratings.value.find(r => r.email === user.email)
        if (ex) userRating.value = ex.score
      }
      localStorage.setItem('ratings', JSON.stringify(ratings.value))
      msg.value = ''
    }, (e) => {
      console.error(e)
      msg.value = `Firestore read failed: ${e.code || e.message}`
      loadLocal()
    })
  } catch (e) {
    console.error(e)
    msg.value = `Firestore unavailable, using local data.`
    loadLocal()
  }

  if (!ratings.value.length) loadLocal()
})

onBeforeUnmount(() => { if (typeof stop === 'function') stop() })

const averageRating = computed(() => {
  if (!ratings.value.length) return 0
  const total = ratings.value.reduce((sum, r) => sum + (Number(r.score) || 0), 0)
  return total / ratings.value.length
})

async function submitRating () {
  if (!user) return
  const score = parseInt(userRating.value)

  const ex = ratings.value.find(r => r.email === user.email)
  if (ex) ex.score = score
  else ratings.value.push({ email: user.email, score })
  localStorage.setItem('ratings', JSON.stringify(ratings.value))

  try {
    const id = user.email.replace(/\//g, '_')
    await setDoc(doc(db, 'ratings', id), {
      email: user.email,
      score,
      createdAt: serverTimestamp()
    })
    msg.value = ''
    alert('Thank you for your rating!')
  } catch (e) {
    console.error(e)
    msg.value = `Saved locally. Firestore write failed: ${e.code || e.message}`
    alert('Saved locally. Firestore write failed.')
  }
}
</script>

<style scoped>
h2 { margin-bottom: 15px; }
</style>
