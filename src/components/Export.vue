<template>
  <div class="container mt-4">
    <h2>⬇️ Export Data</h2>
    <div class="d-flex gap-2 mt-3">
      <button class="btn btn-outline-primary" @click="exportCSV">Export Ratings (CSV)</button>
      <button class="btn btn-outline-secondary" @click="exportPDF">Export Summary (PDF)</button>
    </div>
    <p class="text-muted mt-2">CSV includes all ratings. PDF contains a summary for reporting.</p>
  </div>
</template>

<script setup>
function exportCSV(){
  const ratings = JSON.parse(localStorage.getItem('ratings') || '[]')
  const header = 'email,score\n'
  const rows = ratings.map(r => `${r.email},${r.score}`).join('\n')
  const csv = header + rows
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'ratings.csv'
  a.click()
  URL.revokeObjectURL(url)
}

async function exportPDF(){
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()
  const ratings = JSON.parse(localStorage.getItem('ratings') || '[]')
  const avg = ratings.length ? ratings.reduce((a,b)=>a+b.score,0)/ratings.length : 0
  doc.text('MindWell Youth - Summary', 14, 20)
  doc.text(`Total users (local): ${JSON.parse(localStorage.getItem('users')||'[]').length}`, 14, 30)
  doc.text(`Total ratings: ${ratings.length}`, 14, 40)
  doc.text(`Average rating: ${avg.toFixed(1)}`, 14, 50)
  doc.save('summary.pdf')
}
</script>
