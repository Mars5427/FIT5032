<template>
  <div class="container mt-4">
    <h2>📊 Mood Check-ins (Firestore)</h2>
    <p class="text-muted">Interactive chart of average daily mood from Firestore.</p>
    <canvas id="moodChart" aria-label="Mood chart" role="img"></canvas>
    <div class="mt-3 d-flex gap-2">
      <button class="btn btn-outline-primary" @click="addRandomCheckin">Add Random Check-in (demo)</button>
      <button class="btn btn-outline-secondary" @click="reload">Reload</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore'
import Chart from 'chart.js/auto'

let chart

async function loadData(){
  const q = query(collection(db, 'checkins'), orderBy('ts','asc'))
  const snap = await getDocs(q)
  const byDay = {}
  snap.forEach(doc => {
    const d = new Date(doc.data().ts).toISOString().slice(0,10)
    byDay[d] = byDay[d] || []
    byDay[d].push(doc.data().mood)
  })
  const labels = Object.keys(byDay).sort()
  const values = labels.map(d => {
    const arr = byDay[d]
    return arr.reduce((a,b)=>a+b,0) / arr.length
  })
  const ctx = document.getElementById('moodChart')
  if (chart) chart.destroy()
  chart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{ label: 'Avg mood (1-5)', data: values }] },
    options: { responsive: true, maintainAspectRatio: false }
  })
}

async function addRandomCheckin(){
  await addDoc(collection(db,'checkins'), { mood: 1 + Math.floor(Math.random()*5), ts: Date.now() })
  await loadData()
}

function reload(){ loadData() }

onMounted(loadData)
</script>

<style scoped>
#moodChart { min-height: 360px; }
</style>
