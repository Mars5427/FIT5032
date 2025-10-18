const { onRequest } = require('firebase-functions/v2/https')
const logger = require('firebase-functions/logger')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })
const sgMail = require('@sendgrid/mail')

admin.initializeApp()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const REGION = 'australia-southeast1'

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[s])
}

exports.sendEmail = onRequest({ region: REGION }, async (req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })
      const { to, subject, message, attachment } = req.body || {}
      if (!to || !subject || !message) return res.status(400).json({ message: 'Missing fields' })

      const msg = {
        to,
        from: 'axuu0042@student.monash.edu',
        subject,
        text: message,
        html: `<p>${escapeHtml(message).replace(/\n/g,'<br/>')}</p>`
      }
      if (attachment && attachment.content && attachment.filename) {
        msg.attachments = [{
          content: attachment.content,
          filename: attachment.filename,
          type: 'application/octet-stream',
          disposition: 'attachment'
        }]
      }

      const resp = await sgMail.send(msg)
      logger.info('Email sent', { to, status: resp?.[0]?.statusCode })
      res.json({ message: 'Email sent' })
    } catch (e) {
      logger.error('sendEmail error', e)
      res.status(500).json({ message: String(e) })
    }
  })
})

exports.apiResources = onRequest({ region: REGION }, async (req, res) => {
  cors(req, res, async () => {
    try {
      const data = [
        { id: 1, title: 'Mindfulness Basics', category: 'Education' },
        { id: 2, title: 'Youth Helpline', category: 'Support' },
      ]
      res.json(data)
    } catch (e) {
      res.status(500).json({ error: String(e) })
    }
  })
})

exports.apiWorkshops = onRequest({ region: REGION }, async (req, res) => {
  cors(req, res, async () => {
    try {
      const data = [
        { id: 1, name: 'Stress Busters 101', date: '2025-10-20', location: 'Melbourne CBD' },
        { id: 2, name: 'Mindful Mondays',  date: '2025-10-27', location: 'Clayton' },
      ]
      res.json(data)
    } catch (e) {
      res.status(500).json({ error: String(e) })
    }
  })
})
