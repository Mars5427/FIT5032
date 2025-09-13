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
                {{ user.username }} ({{ user.role }})
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" @click="logout">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main>
      <router-view />
    </main>

    <footer class="bg-dark text-light py-3 text-center mt-5">
      <p class="mb-0">© 2025 MindWell Youth | Supporting Youth Mental Health</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)

const checkAuth = () => {
  const currentUser = localStorage.getItem('currentUser')
  if (currentUser) {
    user.value = JSON.parse(currentUser)
  }
}

const logout = () => {
  localStorage.removeItem('currentUser')
  user.value = null
  router.push('/')
}

onMounted(() => {
  checkAuth()
  // Listen for storage changes (login/logout from other tabs)
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