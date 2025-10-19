<template>
  <div class="container py-3">
    <h2 class="h5 mb-3">Analytics</h2>

    <p v-if="msg" class="alert alert-warning py-2">{{ msg }}</p>

    <div class="row g-3">
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">Ratings over time</div>
          <div class="card-body" style="height:320px">
            <canvas id="chart-ratings" aria-label="Ratings line chart" role="img"></canvas>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">Users by role (demo)</div>
          <div class="card-body" style="height:320px">
            <canvas id="chart-roles" aria-label="Users by role bar chart" role="img"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Chart from 'chart.js/auto'
import { db } from '../firebase'
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore'

const msg = ref('')

function toJsDate(v) {
  if (!v) return new Date()
  if (typeof v?.toDate === 'function') return v.toDate()
  if (v instanceof Date) return v
  if (typeof v === 'number') return new Date(v)
  if (typeof v === 'string') return new Date(v)
  return new Date()
}

async function ensureSeedIfEmpty() {
  const q = query(collection(db, 'ratings'), orderBy('createdAt', 'asc'))
  const snap = await getDocs(q)
  if (!snap.empty) return snap.docs.map(d => ({ id: d.id, ...d.data() }))

  try {
    const ls = JSON.parse(localStorage.getItem('ratings') || '[]')
    if (Array.isArray(ls) && ls.length) {
      const seeded = []
      for (const r of ls) {
        const createdAt = r.createdAt ? new Date(r.createdAt) : new Date()
        const ref = await addDoc(collection(db, 'ratings'), {
          score: Number(r.score) || 0,
          createdAt
        })
        seeded.push({ id: ref.id, score: r.score, createdAt })
      }
      return seeded
    }
  } catch {}

  const now = Date.now()
  const demo = [
    { score: 3, createdAt: new Date(now - 86400000 * 2) },
    { score: 4, createdAt: new Date(now - 86400000) },
    { score: 5, createdAt: new Date(now) }
  ]
  for (const r of demo) await addDoc(collection(db, 'ratings'), r)
  msg.value = 'No data found. Seeded demo ratings into Firestore.'
  return demo
}

onMounted(async () => {
  try {
    const rows = await ensureSeedIfEmpty()

    const labels = rows.map(r => toJsDate(r.createdAt).toLocaleDateString())
    const scores = rows.map(r => Number(r.score) || 0)

    const ctx1 = document.getElementById('chart-ratings')
    if (ctx1) new Chart(ctx1, {
      type: 'line',
      data: { labels, datasets: [{ label: 'Rating', data: scores }] },
      options: { responsive: true, maintainAspectRatio: false }
    })

    const ctx2 = document.getElementById('chart-roles')
    if (ctx2) new Chart(ctx2, {
      type: 'bar',
      data: { labels: ['user', 'admin'], datasets: [{ label: 'Count', data: [12, 2] }] },
      options: { responsive: true, maintainAspectRatio: false }
    })
  } catch (e) {
    console.error('Firestore error:', e)
    msg.value = `Firestore error: ${e?.code || e?.message || e}`
    const now = Date.now()
    const demo = [
      { x: now - 86400000 * 2, y: 3 },
      { x: now - 86400000,     y: 4 },
      { x: now,                y: 5 }
    ]
    const ctx1 = document.getElementById('chart-ratings')
    if (ctx1) new Chart(ctx1, {
      type: 'line',
      data: { labels: demo.map(pt => new Date(pt.x).toLocaleDateString()), datasets: [{ label: 'Rating', data: demo.map(pt => pt.y) }] },
      options: { responsive: true, maintainAspectRatio: false }
    })
    const ctx2 = document.getElementById('chart-roles')
    if (ctx2) new Chart(ctx2, {
      type: 'bar',
      data: { labels: ['user', 'admin'], datasets: [{ label: 'Count', data: [12, 2] }] },
      options: { responsive: true, maintainAspectRatio: false }
    })
  }
})
</script>
