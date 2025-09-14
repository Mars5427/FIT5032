import { createRouter, createWebHistory } from 'vue-router'

// 引入你的页面组件
import Form from '../components/Form.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Rating from '../components/Rating.vue'
import Unauthorized from '../components/Unauthorized.vue'

const routes = [
  { path: '/', redirect: '/form' },   // 默认跳到表单页
  { path: '/form', component: Form },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/rating', component: Rating },
  { path: '/unauthorized', component: Unauthorized }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
