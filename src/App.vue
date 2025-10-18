<template>
  <a class="visually-hidden-focusable" href="#main" id="skip">Skip to main content</a>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">MindWell Youth</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item"><router-link class="nav-link" to="/form">Form</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/rating">Rating</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/tables">Tables</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/map">Map</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/analytics">Analytics</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/export">Export</router-link></li>
            <li class="nav-item" v-if="user && user.role==='admin'"><router-link class="nav-link" to="/admin">Admin</router-link></li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item" v-if="!user"><router-link class="nav-link" to="/login">Login</router-link></li>
            <li class="nav-item" v-if="!user"><router-link class="nav-link" to="/register">Register</router-link></li>
            <li class="nav-item dropdown" v-if="user">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">{{ user.username || user.email }}</a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li v-if="user.role==='admin'"><router-link class="dropdown-item" to="/email">Bulk Email</router-link></li>
                <li><a class="dropdown-item" href="#" @click="logout">Logout</a></li>
              </ul>
            </li>
          <li class="nav-item"><router-link class="nav-link" to="/auth">Firebase Auth</router-link></li>
          </ul>
        </div>
      </div>
    </nav>

    <main id="main" class="container mt-4" tabindex="-1">
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

function checkAuth(){
  try { user.value = JSON.parse(localStorage.getItem('currentUser') || 'null') } catch { user.value = null }
}
function logout(){
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
.visually-hidden-focusable:active, .visually-hidden-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
</style>
