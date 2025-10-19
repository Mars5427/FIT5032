import { createRouter, createWebHistory } from 'vue-router'
import { h } from 'vue'

const HomeProbe = { render: () => h('div', { style: 'padding:20px' }, 'ROUTER OK ✅') }

const routes = [
  { path: '/', redirect: '/export' },
  { path: '/export', component: () => import('../components/Export.vue') },
  { path: '/map', component: () => import('../components/MapView.vue') },
  { path: '/tables', component: () => import('../components/Tables.vue') },
  { path: '/analytics', component: () => import('../components/Analytics.vue') },
  { path: '/form', component: () => import('../components/Form.vue') },
  { path: '/rating', component: () => import('../components/Rating.vue') },
  { path: '/login', component: () => import('../components/Login.vue') },
  { path: '/register', component: () => import('../components/Register.vue') },
  { path: '/auth', component: () => import('../components/FirebaseAuth.vue') },
  { path: '/email', component: () => import('../components/Email.vue'), meta: { requiresAdmin: true } },
  { path: '/admin', component: () => import('../components/AdminDashboard.vue'), meta: { requiresAdmin: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

export default createRouter({ history: createWebHistory(), routes })