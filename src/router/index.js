import { createRouter, createWebHistory } from 'vue-router'
import { auth, db } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const routes = [
  { path: '/login', component: () => import('../components/Login.vue') },
  { path: '/register', component: () => import('../components/Register.vue') },

  { path: '/', name: 'home', component: () => import('../components/Form.vue'), meta: { requiresAuth: true } },
  { path: '/form', component: () => import('../components/Form.vue'), meta: { requiresAuth: true } },
  { path: '/tables', component: () => import('../components/Tables.vue'), meta: { requiresAuth: true } },
  { path: '/map', component: () => import('../components/MapView.vue'), meta: { requiresAuth: true } },
  { path: '/analytics', component: () => import('../components/Analytics.vue'), meta: { requiresAuth: true } },
  { path: '/export', component: () => import('../components/Export.vue'), meta: { requiresAuth: true } },

  { path: '/admin', name: 'admin', component: () => import('../components/AdminDashboard.vue'), meta: { requiresAuth: true, requiresAdmin: true } },

  { path: '/unauthorized', component: { template: '<div class="container mt-5"><h3>Unauthorized</h3><p>You do not have permission to view this page.</p></div>' } },

  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

let authReady = false
onAuthStateChanged(auth, () => { authReady = true })

async function getUserRole(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    return snap.exists() ? (snap.data().role || 'user') : 'user'
  } catch {
    return 'user'
  }
}

router.beforeEach(async (to, from, next) => {
  if (!authReady) {
    await new Promise(resolve => {
      const stop = onAuthStateChanged(auth, () => { stop(); resolve() })
    })
  }

  const requiresAuth = to.meta?.requiresAuth
  const requiresAdmin = to.meta?.requiresAdmin

  if (requiresAuth && !auth.currentUser) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (requiresAdmin) {
    const role = await getUserRole(auth.currentUser.uid)
    if (role !== 'admin') return next('/unauthorized')
  }

  next()
})

export default router
