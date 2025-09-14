import { createRouter, createWebHistory } from 'vue-router'
import Admin from '../components/Admin.vue'
import Unauthorized from '../components/Unauthorized.vue'
import Form from '../components/Form.vue'
import Rating from '../components/Rating.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'

const routes = [
  { path: '/', redirect: '/form' },
  { path: '/form', component: Form },
  { path: '/rating', component: Rating },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/unauthorized', component: Unauthorized },
  {
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
      if (user && user.role === 'admin') {
        next()
      } else {
        next('/unauthorized') 
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
