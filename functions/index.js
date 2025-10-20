const { onRequest } = require('firebase-functions/v2/https')
const { setGlobalOptions } = require('firebase-functions/v2')
const { defineSecret } = require('firebase-functions/params')
const logger = require('firebase-functions/logger')
const sgMail = require('@sendgrid/mail')
const cors = require('cors')({ origin: true })

setGlobalOptions({ region: 'australia-southeast1', maxInstances: 10 })

const SENDGRID_API_KEY = defineSecret('SENDGRID_API_KEY')

const VERIFIED_FROM = 'axuu0042@student.monash.edu'

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
      { "id": 1, "title": "Mindfulness Basics", "category": "Education", "source": "Headspace", "url": "https://www.headspace.com" },
      { "id": 2, "title": "Youth Helpline", "category": "Support", "source": "Lifeline", "url": "https://www.lifeline.org.au" },
      { "id": 3, "title": "Coping with Exam Stress", "category": "Article", "source": "ReachOut", "url": "https://au.reachout.com" },
      { "id": 4, "title": "Anxiety Management", "category": "Education", "source": "Beyond Blue", "url": "https://www.beyondblue.org.au" },
      { "id": 5, "title": "Mindful Breathing Guide", "category": "Article", "source": "Smiling Mind", "url": "https://www.smilingmind.com.au" },
      { "id": 6, "title": "Positive Thinking 101", "category": "Workshop", "source": "Mind Australia", "url": "https://www.mindaustralia.org.au" },
      { "id": 7, "title": "Stress Management Toolkit", "category": "Resource", "source": "Head to Health", "url": "https://www.headtohealth.gov.au" },
      { "id": 8, "title": "Youth Peer Support", "category": "Program", "source": "Orygen", "url": "https://www.orygen.org.au" },
      { "id": 9, "title": "Sleep Hygiene Tips", "category": "Article", "source": "Better Health Vic", "url": "https://www.betterhealth.vic.gov.au" },
      { "id": 10, "title": "Healthy Screen Time", "category": "Education", "source": "eSafety Commissioner", "url": "https://www.esafety.gov.au" },
      { "id": 11, "title": "Emotional Regulation Skills", "category": "Support", "source": "ReachOut", "url": "https://au.reachout.com" },
      { "id": 12, "title": "Self-Care for Students", "category": "Article", "source": "Headspace", "url": "https://www.headspace.com" },
      { "id": 13, "title": "Building Resilience", "category": "Education", "source": "Beyond Blue", "url": "https://www.beyondblue.org.au" }
    ])
  })
})

exports.apiWorkshops = onRequest((req, res) => {
  cors(req, res, () => {
    res.json([
      { "id": 1, "name": "Stress Busters 101", "date": "2025-10-20", "location": "Melbourne CBD" },
      { "id": 2, "name": "Mindful Mondays", "date": "2025-10-27", "location": "Clayton" },
      { "id": 3, "name": "Peer Support Circle", "date": "2025-11-03", "location": "Caulfield" },
      { "id": 4, "name": "Art Therapy Session", "date": "2025-11-10", "location": "Dandenong" },
      { "id": 5, "name": "Music for the Mind", "date": "2025-11-17", "location": "Monash" },
      { "id": 6, "name": "Yoga for Relaxation", "date": "2025-11-24", "location": "Clayton" },
      { "id": 7, "name": "Nutrition & Mental Health", "date": "2025-12-01", "location": "Melbourne CBD" },
      { "id": 8, "name": "Confidence Building", "date": "2025-12-08", "location": "Frankston" },
      { "id": 9, "name": "Dealing with Anxiety", "date": "2025-12-15", "location": "Caulfield" },
      { "id": 10, "name": "Group Meditation", "date": "2025-12-22", "location": "Melbourne CBD" },
      { "id": 11, "name": "Social Skills Workshop", "date": "2025-12-29", "location": "Clayton" },
      { "id": 12, "name": "Holiday Self-Care", "date": "2026-01-05", "location": "Frankston" },
      { "id": 13, "name": "Study Stress Support", "date": "2026-01-12", "location": "Monash" },
      { "id": 14, "name": "New Year Resolutions", "date": "2026-01-19", "location": "Caulfield" },
      { "id": 15, "name": "Mindfulness for Teens", "date": "2026-01-26", "location": "Melbourne CBD" },
      { "id": 16, "name": "Mental Health 101", "date": "2026-02-02", "location": "Clayton" },
      { "id": 17, "name": "Journaling for Growth", "date": "2026-02-09", "location": "Caulfield" },
      { "id": 18, "name": "Managing Screen Time", "date": "2026-02-16", "location": "Monash" }
    ])
  })
})

function escapeHtml (str) {
  return String(str).replace(/[&<>"']/g, s => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[s])
}
