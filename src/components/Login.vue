<script setup>
import { ref } from 'vue'
import { auth } from '../firebase'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const router = useRouter()

async function loginEmail() {
  try {
    loading.value = true
    const cred = await signInWithEmailAndPassword(auth, email.value.trim(), password.value)
    localStorage.setItem('currentUser', JSON.stringify({ uid: cred.user.uid, email: cred.user.email }))
    router.push('/form')
  } catch (e) {
    errorMsg.value = e.message || 'Login failed'
  } finally {
    loading.value = false
  }
}

async function loginGoogle() {
  try {
    const provider = new GoogleAuthProvider()
    const cred = await signInWithPopup(auth, provider)
    localStorage.setItem('currentUser', JSON.stringify({ uid: cred.user.uid, email: cred.user.email }))
    router.push('/analytics')
  } catch (e) {
    errorMsg.value = e.message || 'Google login failed'
  }
}
</script>

<template>
  <div class="login">
    <h1>Login</h1>
    <input v-model="email" placeholder="Email" type="email" />
    <input v-model="password" placeholder="Password" type="password" />
    <button :disabled="loading" @click="loginEmail">Login</button>
    <button :disabled="loading" @click="loginGoogle">Sign in with Google</button>
    <p v-if="errorMsg" role="alert">{{ errorMsg }}</p>
  </div>
</template>
