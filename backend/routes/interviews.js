const express = require('express');
const router  = express.Router();
const { chat, generate } = require('../services/gemini');
const Interview  = require('../models/Interview');
const User       = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const emailService = require('../services/emailService');

// System prompts per interview type
const systemPrompts = {
  technical: (company) => `You are a senior software engineer interviewer at ${company || 'a top tech company'}.
Conduct a technical interview covering DSA, system design, and coding concepts.
Ask ONE question at a time. Follow up naturally on the candidate's answers.
Be professional but encouraging. After 6-8 exchanges, wrap up with brief positive feedback.`,

  hr: (company) => `You are an HR manager at ${company || 'a top company'}.
Conduct a behavioral interview using the STAR method.
Ask about past experiences, leadership, teamwork, conflict resolution, and cultural fit.
Be warm, professional, and encouraging. Ask ONE question at a time.`,

  system: (company) => `You are a principal engineer at ${company || 'a top tech company'}.
Conduct a system design interview. Start with a broad design problem, then dig into specifics.
Guide the candidate through scalability, databases, APIs, and trade-offs.
Ask ONE question at a time and build on their answers.`,
};

/* ── Start interview ─────────────────────────────────────────────────── */
router.post('/start', authMiddleware, async (req, res) => {
  try {
    const { type, company, topic } = req.body;
    const interview = await Interview.create({
      user: req.user._id, type, company, topic, status: 'active',
    });
    res.json({ interviewId: interview._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Send message → Gemini responds ─────────────────────────────────── */
router.post('/:id/message', authMiddleware, async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
    if (!interview) return res.status(404).json({ error: 'Interview not found' });

    const { content } = req.body;
    interview.messages.push({ role: 'user', content });

    // Convert stored messages to Gemini history format
    // Gemini uses 'user' and 'model' (not 'assistant')
    const history = interview.messages.slice(0, -1).map(m => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const systemPrompt = systemPrompts[interview.type]?.(interview.company)
      || systemPrompts.technical(interview.company);

    const aiContent = await chat(systemPrompt, history, content);

    interview.messages.push({ role: 'ai', content: aiContent });
    await interview.save();

    res.json({ content: aiContent, messageCount: interview.messages.length });
  } catch (err) {
    console.error('Gemini chat error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ── End interview → Gemini scores the session ───────────────────────── */
router.post('/:id/end', authMiddleware, async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
    if (!interview) return res.status(404).json({ error: 'Interview not found' });

    const transcript = interview.messages
      .map(m => `${m.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.content}`)
      .join('\n');

    const evalPrompt = `You are an expert interview evaluator. Analyze this interview transcript and score the candidate.

Transcript:
${transcript}

Respond with ONLY valid JSON, no markdown, no explanation:
{"communication":0-100,"technical":0-100,"confidence":0-100,"clarity":0-100,"strengths":["..."],"improvements":["..."]}`;

    let scores = { communication: 75, technical: 70, confidence: 68, clarity: 72 };
    try {
      const raw = await generate(evalPrompt, true); // use pro for better evaluation
      const cleaned = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      scores = {
        communication: parsed.communication || 75,
        technical:     parsed.technical     || 70,
        confidence:    parsed.confidence    || 68,
        clarity:       parsed.clarity       || 72,
      };
    } catch (e) {
      console.warn('Score parsing failed, using defaults:', e.message);
    }

    scores.overall = Math.round(
      (scores.communication + scores.technical + scores.confidence + scores.clarity) / 4
    );

    interview.scores   = scores;
    interview.status   = 'completed';
    interview.duration = req.body.duration || 0;
    await interview.save();

    await User.findByIdAndUpdate(req.user._id, { $inc: { totalInterviews: 1 } });

    // Email results (non-blocking)
    const mins = Math.floor((req.body.duration || 0) / 60);
    emailService.sendInterviewComplete(req.user, {
      type: interview.type,
      company: interview.company || 'Top Company',
      scores,
      duration: `${mins} min`,
    }).catch(e => console.warn('Email failed:', e.message));

    res.json({ scores, interviewId: interview._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Interview history ───────────────────────────────────────────────── */
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user._id, status: 'completed' })
      .sort({ createdAt: -1 }).limit(20).select('-messages');
    res.json({ interviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
