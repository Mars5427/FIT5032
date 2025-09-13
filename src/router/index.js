import { createRouter, createWebHistory } from 'vue-router'

import Home from '../components/Form.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Unauthorized from '../components/Unauthorized.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/unauthorized', component: Unauthorized }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
