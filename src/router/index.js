import { createRouter, createWebHistory } from 'vue-router'
import Form from '../components/Form.vue'
import Rating from '../components/Rating.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Unauthorized from '../components/Unauthorized.vue'
import Admin from '../components/AdminDashboard.vue'
import Tables from '../components/Tables.vue'
import MapView from '../components/MapView.vue'
import Email from '../components/Email.vue'
import Export from '../components/Export.vue'
import Analytics from '../components/Analytics.vue'
import FirebaseAuth from '../components/FirebaseAuth.vue'

function getCurrentUser(){
  try { return JSON.parse(localStorage.getItem('currentUser') || 'null') }
  catch { return null }
}

const routes = [
  { path: '/', redirect: '/form' },
  { path: '/form', component: Form },
  { path: '/rating', component: Rating },
  { path: '/tables', component: Tables },
  { path: '/map', component: MapView },
  { path: '/email', component: Email, meta: { requiresAdmin: true } },
  { path: '/export', component: Export },
  { path: '/analytics', component: Analytics },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/auth', component: FirebaseAuth },
  { path: '/unauthorized', component: Unauthorized },
  { path: '/admin', component: Admin, meta: { requiresAdmin: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin) {
    const user = getCurrentUser()
    if (!user || user.role !== 'admin') return next('/unauthorized')
  }
  next()
})

export default router
