<template>
  <div class="container mt-4" style="max-width:720px">
    <h2>📧 Send Email (with attachment)</h2>

    <form @submit.prevent="onSend" class="mt-3">
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
        <small v-if="file" class="text-muted">Selected: {{ file?.name }}</small>
      </div>

      <button class="btn btn-primary" :disabled="sending">
        {{ sending ? 'Sending...' : 'Send' }}
      </button>
    </form>

    <div aria-live="polite" class="mt-3">
      <div v-if="alert" class="alert" :class="alert.type === 'success' ? 'alert-success' : 'alert-danger'">
        {{ alert.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 函数完整 URL：优先 VITE_EMAIL_FN；兼容老配置 VITE_FUNCTIONS_BASE_URL + /sendEmail
const FN_URL =
  import.meta.env.VITE_EMAIL_FN ||
  (import.meta.env.VITE_FUNCTIONS_BASE_URL
    ? `${import.meta.env.VITE_FUNCTIONS_BASE_URL.replace(/\/+$/, '')}/sendEmail`
    : '')

const to = ref('')
const subject = ref('')
const message = ref('')
const file = ref(null)     // File 对象
const alert = ref(null)
const sending = ref(false)

// 把 File 转为纯 base64（去掉 data:...;base64, 前缀）
function fileToBase64(f) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || '')
      const base64 = result.includes(',') ? result.split(',')[1] : result
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(f)
  })
}

function onFile(e) {
  file.value = e.target.files && e.target.files[0] ? e.target.files[0] : null
}

async function onSend() {
  alert.value = null

  if (!FN_URL) {
    alert.value = { type: 'danger', text: 'Email function URL is not configured (VITE_EMAIL_FN).' }
    return
  }

  try {
    sending.value = true

    // 组装附件（可选）
    let attachment = null
    if (file.value) {
      const base64 = await fileToBase64(file.value)
      attachment = {
        content: base64,
        filename: file.value.name,
        type: file.value.type || 'application/octet-stream'
      }
    }

    const payload = {
      to: to.value.split(',').map(s => s.trim()).filter(Boolean),
      subject: subject.value,
      message: message.value,
      attachment
    }

    const res = await fetch(FN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    // 兼容任何响应：先拿文本，再尝试 JSON 解析
    const text = await res.text()
    let data
    try { data = JSON.parse(text) } catch { data = { ok: res.ok, message: text } }

    if (!res.ok || data?.ok === false) {
      throw new Error(data?.message || `HTTP ${res.status}`)
    }

    alert.value = { type: 'success', text: 'Email sent ✅' }
  } catch (e) {
    console.error(e)
    alert.value = { type: 'danger', text: `Send failed: ${e?.message || e}` }
  } finally {
    sending.value = false
  }
}
</script>
