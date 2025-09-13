<template>
  <div class="container mt-5" style="max-width: 500px;">
    <h2 class="mb-4">Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input v-model="email" type="email" id="email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input v-model="password" type="password" id="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary w-100">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const user = users.find(u => u.email === email.value && u.password === password.value)

  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user))
    alert('Login successful!')
    router.push('/')
  } else {
    alert('Invalid email or password')
  }
}
</script>
