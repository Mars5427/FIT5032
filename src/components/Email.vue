<template>
  <div class="container mt-4" style="max-width:720px">
    <h2>📧 Send Email (with attachment)</h2>
    <form @submit.prevent="sendEmail" class="mt-3">
      <div class="mb-3">
        <label class="form-label">To (comma separated)</label>
        <input v-model="to" class="form-control" placeholder="user1@example.com, user2@example.com" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Subject</label>
        <input v-model="subject" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Message</label>
        <textarea v-model="message" class="form-control" rows="4" required></textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">Attachment (optional)</label>
        <input type="file" @change="onFile" class="form-control" />
      </div>
      <button class="btn btn-primary">Send</button>
    </form>

    <div aria-live="polite" class="mt-3">
      <div v-if="status" class="alert" :class="status.ok ? 'alert-success' : 'alert-danger'">{{ status.msg }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const to = ref('')
const subject = ref('')
const message = ref('')
const fileB64 = ref(null)
const fileName = ref('')
const status = ref(null)

function onFile(e){
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const base64 = reader.result.split(',')[1]
    fileB64.value = base64
    fileName.value = file.name
  }
  reader.readAsDataURL(file)
}

async function sendEmail(){
  try{
    const res = await fetch(`${import.meta.env.VITE_FUNCTIONS_BASE_URL}/sendEmail`, {
      method:'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        to: to.value.split(',').map(s => s.trim()).filter(Boolean),
        subject: subject.value,
        message: message.value,
        attachment: fileB64.value ? { content: fileB64.value, filename: fileName.value } : null
      })
    })
    const data = await res.json()
    status.value = { ok: res.ok, msg: data.message || 'Sent' }
  } catch (e) {
    status.value = { ok:false, msg: String(e) }
  }
}
</script>
