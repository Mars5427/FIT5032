const { onRequest } = require('firebase-functions/v2/https')
const { setGlobalOptions } = require('firebase-functions/v2')
const { defineSecret } = require('firebase-functions/params')
const logger = require('firebase-functions/logger')
const sgMail = require('@sendgrid/mail')
const cors = require('cors')({ origin: true })

setGlobalOptions({ region: 'australia-southeast1', maxInstances: 10 })

const SENDGRID_API_KEY = defineSecret('SENDGRID_API_KEY')

const VERIFIED_FROM = 'q821374295@gmail.com'

exports.sendEmail = onRequest({ secrets: [SENDGRID_API_KEY] }, (req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Origin', '*')
        res.set('Access-Control-Allow-Headers', 'Content-Type')
        res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return res.status(204).send('')
      }
      if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, message: 'Method not allowed' })
      }

      sgMail.setApiKey(SENDGRID_API_KEY.value())
      logger.info('SENDING_FROM', { from: VERIFIED_FROM })

      const { to, subject, message, attachment } = req.body || {}
      if (!to || !subject || !message) {
        return res.status(400).json({ ok: false, message: 'Missing fields' })
      }

      const recipients = Array.isArray(to) ? to : String(to).split(',').map(s => s.trim()).filter(Boolean)
      const msg = {
        to: recipients,
        from: VERIFIED_FROM,
        subject,
        text: String(message),
        html: `<p>${escapeHtml(String(message)).replace(/\n/g,'<br/>')}</p>`
      }

      if (attachment?.content && attachment?.filename) {
        msg.attachments = [{
          content: attachment.content,
          filename: attachment.filename,
          type: attachment.type || 'application/octet-stream',
          disposition: 'attachment'
        }]
      }
      logger.info('SENDING_FROM', { from: msg.from })
      await sgMail.send(msg)
      return res.status(200).json({ ok: true, message: 'Email sent' })
    } catch (e) {
      logger.error('sendEmail error:', e)
      return res.status(500).json({
        ok: false,
        message: e?.response?.body?.errors?.[0]?.message || String(e)
      })
    }
  })
})

exports.apiResources = onRequest((req, res) => {
  cors(req, res, () => {
    res.json([
      { id: 1, title: 'Mindfulness Basics', category: 'Education' },
      { id: 2, title: 'Youth Helpline', category: 'Support' }
    ])
  })
})

exports.apiWorkshops = onRequest((req, res) => {
  cors(req, res, () => {
    res.json([
      { id: 1, name: 'Stress Busters 101', date: '2025-10-20', location: 'Melbourne CBD' },
      { id: 2, name: 'Mindful Mondays',   date: '2025-10-27', location: 'Clayton' }
    ])
  })
})

function escapeHtml (str) {
  return String(str).replace(/[&<>"']/g, s => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[s])
}
