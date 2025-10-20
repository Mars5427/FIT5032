<template>
  <div class="container mt-4">
    <h2>🛠️ Admin Dashboard</h2>
    <div class="row g-3 mt-1">
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5>Total Users</h5>
            <p class="display-6">{{ stats.users }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5>Admins</h5>
            <p class="display-6">{{ stats.admins }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5>Avg Rating</h5>
            <p class="display-6">{{ stats.avgRating.toFixed(1) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <router-link to="/email" class="btn btn-primary me-2">Bulk Email</router-link>
      <router-link to="/export" class="btn btn-outline-secondary">Export Data</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

const router = useRouter()

const stats = ref({ users: 6, admins: 1, avgRating: 4.2 })

onMounted(async () => {
  const u = auth.currentUser
  if (!u) {
    router.replace({ path: '/login', query: { redirect: '/admin' } })
    return
  }
  const snap = await getDoc(doc(db, 'users', u.uid))
  const role = snap.exists() ? (snap.data().role || 'user') : 'user'
  if (role !== 'admin') {
    router.replace('/unauthorized')
    return
  }

  /*
  try {
    const usersSnap = await getDocs(collection(db, 'users'))
    stats.value.users = usersSnap.size
  } catch (e) {
    console.warn('users count error', e)
  }

  try {
    const adminsQ = query(collection(db, 'users'), where('role', '==', 'admin'))
    const adminsSnap = await getDocs(adminsQ)
    stats.value.admins = adminsSnap.size
  } catch (e) {
    console.warn('admins count error', e)
  }

  try {
    const ratingsSnap = await getDocs(collection(db, 'ratings'))
    const vals = ratingsSnap.docs.map(d => Number(d.data()?.value) || 0).filter(v => v > 0)
    const sum = vals.reduce((a, b) => a + b, 0)
    stats.value.avgRating = vals.length ? sum / vals.length : 0
  } catch (e) {
    console.warn('avg rating error', e)
  }
  */
})
</script>

