// analytics.js
const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const { authMiddleware } = require('../middleware/auth');

router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user._id, status: 'completed' });
    if (!interviews.length) return res.json({ totalInterviews: 0, avgScore: 0, trend: [] });

    const avgScore = Math.round(interviews.reduce((acc, i) => acc + (i.scores?.overall || 0), 0) / interviews.length);

    // Weekly trend
    const trend = [];
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - i * 7);
      const weekEnd = new Date(weekStart); weekEnd.setDate(weekEnd.getDate() + 7);
      const weekInterviews = interviews.filter(iv => iv.createdAt >= weekStart && iv.createdAt < weekEnd);
      const weekAvg = weekInterviews.length ? Math.round(weekInterviews.reduce((a, iv) => a + (iv.scores?.overall || 0), 0) / weekInterviews.length) : null;
      trend.push({ week: `W${12 - i}`, score: weekAvg });
    }

    res.json({ totalInterviews: interviews.length, avgScore, trend });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
