/**
 * InterviewAI Backend — Production Server
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const isProd = process.env.NODE_ENV === 'production';

/* ── Security ── */
app.use(helmet());
app.set('trust proxy', 1); // Required for Railway/Render

/* ── CORS ── */
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* ── Rate limiting ── */
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
}));

// Stricter limit for AI routes (cost control)
app.use('/api/interviews', rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many interview requests. Please wait a minute.' },
}));

/* ── Routes ── */
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/interviews',    require('./routes/interviews'));
app.use('/api/resume',        require('./routes/resume'));
app.use('/api/analytics',     require('./routes/analytics'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/certificates',  require('./routes/certificates'));

/* ── Health check (Railway uses this) ── */
app.get('/api/health', (_, res) => res.json({
  status: 'ok',
  version: '2.5.0',
  env: process.env.NODE_ENV,
  timestamp: new Date().toISOString(),
}));

/* ── 404 ── */
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

/* ── Error handler ── */
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack);
  res.status(err.status || 500).json({
    error: isProd ? 'Internal server error' : err.message,
  });
});

/* ── Cron jobs (production only) ── */
if (isProd) {
  // Streak reminders — 7 PM IST (13:30 UTC)
  cron.schedule('30 13 * * *', async () => {
    try {
      const emailService = require('./services/emailService');
      const User = require('./models/User');
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const users = await User.find({ streak: { $gt: 3 }, lastActive: { $lt: yesterday } }).limit(200);
      for (const u of users) {
        try { await emailService.sendStreakReminder(u, { streak: u.streak, challengeTopic: 'Dynamic Programming' }); } catch {}
      }
      console.log(`[Cron] Streak reminders: ${users.length} users`);
    } catch (e) { console.error('[Cron] streak error:', e.message); }
  });

  // Daily challenge — 8 AM IST (02:30 UTC)
  cron.schedule('30 2 * * *', async () => {
    try {
      const emailService = require('./services/emailService');
      const User = require('./models/User');
      const topics = ['System Design', 'Dynamic Programming', 'Graph Algorithms', 'React Hooks', 'Node.js'];
      const topic = topics[new Date().getDay() % topics.length];
      const users = await User.find({ plan: { $in: ['Pro', 'Premium'] } }).limit(500);
      for (const u of users) {
        try { await emailService.sendDailyChallenge(u, { topic, difficulty: 'Medium', points: 100, expiresIn: '16 hours' }); } catch {}
      }
      console.log(`[Cron] Daily challenges: ${users.length} users`);
    } catch (e) { console.error('[Cron] daily error:', e.message); }
  });
}

/* ── Connect DB + Start ── */
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/interviewai', {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('[DB] MongoDB connected');
  app.listen(PORT, () => console.log(`[Server] Running on port ${PORT} (${process.env.NODE_ENV || 'development'})`));
})
.catch(err => {
  console.error('[DB] Connection failed:', err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received, shutting down...');
  mongoose.connection.close(() => process.exit(0));
});
