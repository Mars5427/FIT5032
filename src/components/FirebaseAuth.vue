<template>
  <div class="container mt-5" style="max-width:520px">
    <h2>🔐 Firebase Authentication</h2>
    <form @submit.prevent="register" class="mt-3" aria-label="Register form">
      <h5>Register (email/password)</h5>
      <div class="mb-2"><input v-model="rEmail" type="email" class="form-control" placeholder="Email" required /></div>
      <div class="mb-2"><input v-model="rPass" type="password" class="form-control" placeholder="Password" required minlength="6" /></div>
      <button class="btn btn-outline-primary">Register</button>
    </form>
    <hr/>
    <form @submit.prevent="login" aria-label="Login form">
      <h5>Login (email/password)</h5>
      <div class="mb-2"><input v-model="lEmail" type="email" class="form-control" placeholder="Email" required /></div>
      <div class="mb-2"><input v-model="lPass" type="password" class="form-control" placeholder="Password" required /></div>
      <button class="btn btn-primary">Login</button>
    </form>
    <div class="mt-3"><button class="btn btn-secondary" @click="loginGoogle">Sign in with Google</button></div>
    <div aria-live="polite" class="mt-3">
      <div v-if="status" class="alert" :class="status.ok ? 'alert-success' : 'alert-danger'">{{ status.msg }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth, GoogleAuthProvider, signInWithPopup } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const rEmail = ref('')
const rPass = ref('')
const lEmail = ref('')
const lPass = ref('')
const status = ref(null)

async function register(){
  try{
    await createUserWithEmailAndPassword(auth, rEmail.value, rPass.value)
    status.value = { ok:true, msg:'Registered! You can login now.' }
  }catch(e){ status.value = { ok:false, msg: String(e.message || e) } }
}
async function login(){
  try{
    await signInWithEmailAndPassword(auth, lEmail.value, lPass.value)
    localStorage.setItem('currentUser', JSON.stringify({ email: auth.currentUser.email, role:'member', username: auth.currentUser.displayName }))
    status.value = { ok:true, msg:'Logged in via Firebase Auth' }
  }catch(e){ status.value = { ok:false, msg: String(e.message || e) } }
}
async function loginGoogle(){
  try{
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    localStorage.setItem('currentUser', JSON.stringify({ email: auth.currentUser.email, role:'member', username: auth.currentUser.displayName }))
    status.value = { ok:true, msg:'Logged in with Google' }
  }catch(e){ status.value = { ok:false, msg: String(e.message || e) } }
}
</script>
