<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">MindWell Youth</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item" v-if="user">
              <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
            </li>
            <li class="nav-item" v-if="user">
              <router-link class="nav-link" to="/resources">Resources</router-link>
            </li>
            <li class="nav-item" v-if="user && user.role === 'admin'">
              <router-link class="nav-link" to="/admin">Admin Panel</router-link>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto">
            <li class="nav-item" v-if="!user">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item" v-if="!user">
              <router-link class="nav-link" to="/register">Register</router-link>
            </li>
            <li class="nav-item dropdown" v-if="user">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
              >
                {{ user.email }} ({{ user.role }})
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" @click="logout">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container mt-4">
      <router-view />

      <section class="mt-5">
        <h2>User Rating</h2>
        <Rating />
      </section>

      <section class="mt-5">
        <h2>Admin Restricted Section</h2>
        <div v-if="user && user.role === 'admin'">
          <p>Welcome to the admin-only section. Here you can manage resources.</p>
        </div>
        <div v-else>
          <Unauthorized />
        </div>
      </section>
    </main>

    <footer class="bg-dark text-light py-3 text-center mt-5">
      <p class="mb-0">© 2025 MindWell Youth | Supporting Youth Mental Health</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Rating from './components/Rating.vue'
import Unauthorized from './components/Unauthorized.vue'

const router = useRouter()
const user = ref(null)

const checkAuth = () => {
  const currentUser = localStorage.getItem('currentUser')
  if (currentUser) {
    user.value = JSON.parse(currentUser)
  } else {
    user.value = null
  }
}

const logout = () => {
  localStorage.removeItem('currentUser')
  user.value = null
  router.push('/')
}

onMounted(() => {
  checkAuth()
  window.addEventListener('storage', checkAuth)
})
</script>

<style>
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.navbar-brand {
  font-weight: bold;
}

.router-link-active {
  font-weight: bold;
}
</style>
