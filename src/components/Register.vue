<template>
  <div class="container mt-5" style="max-width: 500px;">
    <h2 class="mb-4">Register</h2>
    <form @submit.prevent="handleRegister">
      <div class="mb-3">
        <label class="form-label">Username</label>
        <input v-model="username" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="email" type="email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input v-model="password" type="password" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Role</label>
        <select v-model="role" class="form-select" required>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" class="btn btn-success w-100">Register</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const role = ref('user')
const router = useRouter()

const handleRegister = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')

  if (users.find(u => u.email === email.value)) {
    alert('Email already registered!')
    return
  }

  const newUser = { username: username.value, email: email.value, password: password.value, role: role.value }
  users.push(newUser)
  localStorage.setItem('users', JSON.stringify(users))
  alert('Registration successful! You can now login.')
  router.push('/login')
}
</script>
