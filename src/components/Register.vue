<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

const router = useRouter()
const route = useRoute()

const displayName = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')

const loading = ref(false)
const err = ref('')

function afterLoginTarget() {
  return (route.query.redirect && String(route.query.redirect)) || '/'
}

async function createProfileDoc(u, role = 'user') {
  await setDoc(doc(db, 'users', u.uid), {
    uid: u.uid,
    email: u.email || '',
    displayName: u.displayName || displayName.value || '',
    role,                        
    createdAt: serverTimestamp()
  }, { merge: true })
}

async function submitEmail() {
  err.value = ''
  if (!displayName.value.trim()) { err.value = 'Display name is required.'; return }
  if (!email.value.trim()) { err.value = 'Email is required.'; return }
  if (password.value.length < 6) { err.value = 'Password must be at least 6 characters.'; return }
  if (password.value !== confirm.value) { err.value = 'Passwords do not match.'; return }

  try {
    loading.value = true
    const cred = await createUserWithEmailAndPassword(auth, email.value.trim(), password.value)
    if (displayName.value.trim()) {
      await updateProfile(cred.user, { displayName: displayName.value.trim() })
    }
    await createProfileDoc(cred.user, 'user')

    localStorage.setItem('currentUser', JSON.stringify({
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: displayName.value.trim(),
      role: 'user'
    }))
    router.replace(afterLoginTarget()) 
  } catch (e) {
    err.value = e?.message || 'Registration failed.'
  } finally {
    loading.value = false
  }
}

async function signupGoogle() {
  err.value = ''
  try {
    loading.value = true
    const provider = new GoogleAuthProvider()
    const cred = await signInWithPopup(auth, provider)
    await createProfileDoc(cred.user, 'user')
    localStorage.setItem('currentUser', JSON.stringify({
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: cred.user.displayName || '',
      role: 'user'
    }))
    router.replace(afterLoginTarget())
  } catch (e) {
    err.value = e?.message || 'Google signup failed.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <h1 class="mb-3">Create Account</h1>

      <div class="card shadow-sm">
        <div class="card-body">
          <div class="mb-3">
            <label for="name" class="form-label">Display name</label>
            <input id="name" v-model="displayName" type="text" class="form-control" required aria-required="true" />
          </div>

          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input id="email" v-model="email" type="email" class="form-control" required aria-required="true" />
          </div>

          <div class="mb-3">
            <label for="pw" class="form-label">Password</label>
            <input id="pw" v-model="password" type="password" minlength="6" class="form-control" required aria-required="true" />
          </div>

          <div class="mb-3">
            <label for="cpw" class="form-label">Confirm password</label>
            <input id="cpw" v-model="confirm" type="password" minlength="6" class="form-control" required aria-required="true" />
          </div>

          <div class="d-grid gap-2">
            <button class="btn btn-primary" :disabled="loading" @click="submitEmail">
              {{ loading ? 'Creating...' : 'Create with Email' }}
            </button>
            <button class="btn btn-outline-secondary" :disabled="loading" @click="signupGoogle">
              Continue with Google
            </button>
          </div>

          <p v-if="err" class="text-danger mt-3" role="alert" aria-live="assertive">{{ err }}</p>
          <p class="mt-3 mb-0">Already have an account? <router-link to="/login">Login</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>
