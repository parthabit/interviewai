const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const User = require('../models/User');

/* ── Send test email (dev only) ─────────────────────────────────────────── */
router.post('/test', authMiddleware, async (req, res) => {
  try {
    const { type } = req.body;
    switch (type) {
      case 'welcome':
        await emailService.sendWelcome(req.user); break;
      case 'daily':
        await emailService.sendDailyChallenge(req.user, { topic: 'System Design', difficulty: 'Hard', points: 150, expiresIn: '14 hours' }); break;
      case 'streak':
        await emailService.sendStreakReminder(req.user, { streak: req.user.streak, challengeTopic: 'Binary Trees' }); break;
      default:
        return res.status(400).json({ error: 'Unknown type' });
    }
    res.json({ success: true, message: `Test email (${type}) sent to ${req.user.email}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Admin bulk notifications ───────────────────────────────────────────── */
router.post('/broadcast', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { type, filter } = req.body; // filter: 'all' | 'pro' | 'streak-at-risk'
    let query = {};
    if (filter === 'pro') query.plan = { $in: ['Pro', 'Premium'] };
    if (filter === 'streak-at-risk') query.streak = { $gt: 5 };

    const users = await User.find(query).limit(500);
    let sent = 0;
    for (const u of users) {
      try {
        if (type === 'daily') await emailService.sendDailyChallenge(u, { topic: 'System Design', difficulty: 'Hard', points: 150, expiresIn: '12 hours' });
        if (type === 'streak' && u.streak > 5) await emailService.sendStreakReminder(u, { streak: u.streak, challengeTopic: 'Dynamic Programming' });
        sent++;
      } catch {}
    }
    res.json({ success: true, sent, total: users.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
