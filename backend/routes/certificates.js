const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const emailService = require('../services/emailService');

/* ── Generate certificate + send email ─────────────────────────────────── */
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { course, score, company } = req.body;
    const certId = `IAI-${Date.now().toString(36).toUpperCase()}`;
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    // Send certificate email notification
    await emailService.sendCertificate(req.user, { course, score, certId });

    res.json({ certId, date, message: 'Certificate generated and emailed!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── List user certificates ─────────────────────────────────────────────── */
router.get('/', authMiddleware, async (req, res) => {
  res.json({ certificates: req.user.certificates || [] });
});

module.exports = router;
