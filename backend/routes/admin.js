const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Interview = require('../models/Interview');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.use(authMiddleware, adminMiddleware);

router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalInterviews, proUsers] = await Promise.all([
      User.countDocuments(),
      Interview.countDocuments({ status: 'completed' }),
      User.countDocuments({ plan: { $in: ['Pro', 'Premium'] } }),
    ]);
    res.json({ totalUsers, totalInterviews, proUsers, revenue: proUsers * 499 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = search ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] } : {};
    const users = await User.find(query).select('-password').limit(+limit).skip((+page - 1) * +limit).sort({ createdAt: -1 });
    const total = await User.countDocuments(query);
    res.json({ users, total, pages: Math.ceil(total / +limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/users/:id', async (req, res) => {
  try {
    const allowed = ['plan', 'role', 'status'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k]) updates[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
