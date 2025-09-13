<template>
  <div class="auth-system">
    <div v-if="!currentUser">
      <h3>Login</h3>
      <form @submit.prevent="login">
        <input v-model="loginForm.email" placeholder="Email" required />
        <input v-model="loginForm.password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>

      <h3>Register</h3>
      <form @submit.prevent="register">
        <input v-model="registerForm.email" placeholder="Email" required />
        <input v-model="registerForm.password" type="password" placeholder="Password" required />
        <select v-model="registerForm.role" required>
          <option disabled value="">Select role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>

    <div v-else>
      <p>Welcome, {{ currentUser.email }} (Role: {{ currentUser.role }})</p>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const loginForm = ref({ email: "", password: "" })
const registerForm = ref({ email: "", password: "", role: "" })
const currentUser = ref(null)
const users = ref([])

// 加载已有用户
onMounted(() => {
  const saved = localStorage.getItem("users")
  if (saved) users.value = JSON.parse(saved)

  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) currentUser.value = JSON.parse(savedUser)
})

const saveUsers = () => {
  localStorage.setItem("users", JSON.stringify(users.value))
}

const login = () => {
  const user = users.value.find(
    u => u.email === loginForm.value.email && u.password === loginForm.value.password
  )
  if (user) {
    currentUser.value = user
    localStorage.setItem("currentUser", JSON.stringify(user))
    alert("Login successful")
  } else {
    alert("Invalid email or password")
  }
}

const register = () => {
  if (users.value.some(u => u.email === registerForm.value.email)) {
    alert("User already exists")
    return
  }
  const newUser = { ...registerForm.value }
  users.value.push(newUser)
  saveUsers()
  alert("Registration successful")
  registerForm.value = { email: "", password: "", role: "" }
}

const logout = () => {
  currentUser.value = null
  localStorage.removeItem("currentUser")
}
</script>