/**
 * Email Service — Nodemailer + HTML templates
 * Supports: welcome, interview-complete, resume-analyzed, daily-challenge, certificate
 */
const nodemailer = require('nodemailer');

/* ── Transporter ─────────────────────────────────────────────────────────── */
const createTransporter = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* ── Base HTML wrapper ───────────────────────────────────────────────────── */
const base = (content) => `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>InterviewAI</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{background:#080d1a;font-family:'Segoe UI',sans-serif;color:#e2e8f0}.wrap{max-width:600px;margin:0 auto;padding:40px 20px}
.card{background:linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03));border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:40px}
.logo{background:linear-gradient(135deg,#5b68f3,#8b5cf6);border-radius:12px;width:48px;height:48px;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:16px;margin-bottom:24px}
h1{font-size:24px;font-weight:700;color:#fff;margin-bottom:8px}p{color:#94a3b8;line-height:1.6;margin-bottom:16px}
.btn{display:inline-block;background:linear-gradient(135deg,#5b68f3,#4347e8);color:#fff!important;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:600;margin:8px 0}
.metric{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px;margin:8px 0;display:flex;justify-content:space-between;align-items:center}
.metric-val{font-size:20px;font-weight:700;color:#5b68f3}.score-good{color:#22c55e}.score-ok{color:#f59e0b}
.tag{display:inline-block;background:rgba(91,104,243,0.15);color:#818cf8;border:1px solid rgba(91,104,243,0.3);border-radius:20px;padding:4px 12px;font-size:12px;margin:2px}
footer{text-align:center;color:#334155;font-size:12px;margin-top:32px;line-height:1.8}hr{border:none;border-top:1px solid rgba(255,255,255,0.06);margin:24px 0}</style>
</head><body><div class="wrap"><div class="card"><div class="logo">AI</div>${content}</div>
<footer>InterviewAI · Smart Interview Platform<br>Made with ❤️ for Indian students<br><a href="#" style="color:#5b68f3">Unsubscribe</a></footer></div></body></html>`;

/* ── Templates ───────────────────────────────────────────────────────────── */
const templates = {
  welcome: ({ name }) => ({
    subject: '🎉 Welcome to InterviewAI — Start your journey today!',
    html: base(`
      <h1>Welcome aboard, ${name}! 🚀</h1>
      <p>You've just joined 50,000+ students who are landing their dream jobs with AI-powered interview practice.</p>
      <hr>
      <p><strong style="color:#fff">Here's what you can do right now:</strong></p>
      <div class="metric"><span>🤖 AI Mock Interview</span><span class="metric-val">Free</span></div>
      <div class="metric"><span>📄 Resume Analyzer</span><span class="metric-val">Free</span></div>
      <div class="metric"><span>📊 Performance Analytics</span><span class="metric-val">Free</span></div>
      <br>
      <a class="btn" href="${process.env.CLIENT_URL}/dashboard">Start Practicing Now →</a>
      <hr>
      <p style="font-size:13px">Pro tip: Practice daily for 30 minutes — students who do see a <strong style="color:#22c55e">47% improvement</strong> in interview scores within 3 weeks.</p>
    `),
  }),

  interviewComplete: ({ name, type, company, scores, duration }) => {
    const overall = scores.overall || Math.round((scores.communication + scores.confidence + scores.clarity + scores.technical) / 4);
    const scoreClass = overall >= 80 ? 'score-good' : overall >= 65 ? 'score-ok' : '';
    return {
      subject: `📊 Your ${type} Interview Results — Score: ${overall}%`,
      html: base(`
        <h1>Interview Complete! 🎉</h1>
        <p>Great job completing your <strong style="color:#fff">${type} Interview</strong> for <strong style="color:#fff">${company}</strong>. Here's your detailed breakdown:</p>
        <div class="metric"><span>⏱ Duration</span><span class="metric-val" style="color:#94a3b8">${duration}</span></div>
        <div class="metric"><span>🏆 Overall Score</span><span class="metric-val ${scoreClass}">${overall}%</span></div>
        <hr>
        <p><strong style="color:#fff">Detailed Scores:</strong></p>
        <div class="metric"><span>💬 Communication</span><span class="metric-val">${scores.communication}%</span></div>
        <div class="metric"><span>💪 Confidence</span><span class="metric-val">${scores.confidence}%</span></div>
        <div class="metric"><span>🎯 Clarity</span><span class="metric-val">${scores.clarity}%</span></div>
        <div class="metric"><span>🧠 Technical</span><span class="metric-val">${scores.technical}%</span></div>
        <br>
        <a class="btn" href="${process.env.CLIENT_URL}/analytics">View Full Analytics →</a>
        <hr>
        <p style="font-size:13px">Keep practicing! Consistency is the key to cracking top company interviews.</p>
      `),
    };
  },

  resumeAnalyzed: ({ name, atsScore, missingSkills, topImprovement }) => ({
    subject: `📄 Resume Analysis Complete — ATS Score: ${atsScore}%`,
    html: base(`
      <h1>Your Resume Analysis is Ready!</h1>
      <p>Hi ${name}, our AI has finished analyzing your resume. Here's a quick summary:</p>
      <div class="metric"><span>🎯 ATS Compatibility</span><span class="metric-val ${atsScore >= 75 ? 'score-good' : 'score-ok'}">${atsScore}%</span></div>
      <hr>
      <p><strong style="color:#fff">Missing High-Value Skills:</strong></p>
      <div style="margin:8px 0">${missingSkills.map(s => `<span class="tag">${s}</span>`).join('')}</div>
      <hr>
      <p><strong style="color:#fff">Top Improvement:</strong></p>
      <div class="metric"><span style="color:#fbbf24">💡 ${topImprovement}</span></div>
      <br>
      <a class="btn" href="${process.env.CLIENT_URL}/resume">View Full Report →</a>
    `),
  }),

  dailyChallenge: ({ name, topic, difficulty, points, expiresIn }) => ({
    subject: `⚡ Daily Challenge: ${topic} — ${points} points at stake!`,
    html: base(`
      <h1>Your Daily Challenge is Live! ⚡</h1>
      <p>Hi ${name}, a new challenge is waiting for you. Don't break your streak!</p>
      <div class="metric"><span>📚 Topic</span><span class="metric-val" style="color:#a78bfa">${topic}</span></div>
      <div class="metric"><span>🔥 Difficulty</span><span class="metric-val ${difficulty === 'Hard' ? '' : 'score-ok'}">${difficulty}</span></div>
      <div class="metric"><span>🏅 Points</span><span class="metric-val score-good">+${points} pts</span></div>
      <div class="metric"><span>⏰ Expires in</span><span class="metric-val" style="color:#94a3b8">${expiresIn}</span></div>
      <br>
      <a class="btn" href="${process.env.CLIENT_URL}/interview">Accept Challenge →</a>
      <hr>
      <p style="font-size:13px">🔥 Students who complete daily challenges improve their rank by an average of <strong style="color:#fff">12 positions per week</strong>.</p>
    `),
  }),

  certificate: ({ name, course, score, certId }) => ({
    subject: `🏆 Certificate Earned: ${course}!`,
    html: base(`
      <h1>Congratulations, ${name}! 🏆</h1>
      <p>You've officially earned your <strong style="color:#fff">${course}</strong> certificate from InterviewAI!</p>
      <div class="metric"><span>📜 Certificate</span><span class="metric-val" style="color:#fbbf24">${course}</span></div>
      <div class="metric"><span>📊 Final Score</span><span class="metric-val score-good">${score}%</span></div>
      <div class="metric"><span>🔖 Cert ID</span><span style="color:#94a3b8;font-family:monospace;font-size:13px">${certId}</span></div>
      <br>
      <a class="btn" href="${process.env.CLIENT_URL}/certificate">Download Certificate PDF →</a>
      <hr>
      <p style="font-size:13px">Add this to your <strong style="color:#fff">LinkedIn profile</strong> under "Licenses & Certifications" to stand out to recruiters!</p>
    `),
  }),

  streakReminder: ({ name, streak, challengeTopic }) => ({
    subject: `🔥 Don't lose your ${streak}-day streak, ${name}!`,
    html: base(`
      <h1>Your streak is at risk! 🔥</h1>
      <p>Hi ${name}, you're on a <strong style="color:#f97316">${streak}-day streak</strong> — don't let it end today!</p>
      <div class="metric"><span>🔥 Current Streak</span><span class="metric-val" style="color:#f97316">${streak} days</span></div>
      <div class="metric"><span>⚡ Today's Challenge</span><span class="metric-val" style="color:#a78bfa">${challengeTopic}</span></div>
      <br>
      <a class="btn" href="${process.env.CLIENT_URL}/interview">Practice Now — Save Your Streak →</a>
      <p style="font-size:13px;margin-top:16px">Students with 14+ day streaks are <strong style="color:#fff">3x more likely</strong> to crack their target company interview.</p>
    `),
  }),
};

/* ── Send helper ─────────────────────────────────────────────────────────── */
async function sendEmail(to, templateName, data) {
  const transporter = createTransporter();
  const template = templates[templateName];
  if (!template) throw new Error(`Unknown email template: ${templateName}`);
  const { subject, html } = template(data);
  const info = await transporter.sendMail({
    from: `"InterviewAI" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
  console.log(`✉ Email sent [${templateName}] to ${to} — ${info.messageId}`);
  return info;
}

/* ── Convenience exports ─────────────────────────────────────────────────── */
const emailService = {
  sendWelcome: (user) => sendEmail(user.email, 'welcome', { name: user.name }),
  sendInterviewComplete: (user, data) => sendEmail(user.email, 'interviewComplete', { name: user.name, ...data }),
  sendResumeAnalyzed: (user, data) => sendEmail(user.email, 'resumeAnalyzed', { name: user.name, ...data }),
  sendDailyChallenge: (user, data) => sendEmail(user.email, 'dailyChallenge', { name: user.name, ...data }),
  sendCertificate: (user, data) => sendEmail(user.email, 'certificate', { name: user.name, ...data }),
  sendStreakReminder: (user, data) => sendEmail(user.email, 'streakReminder', { name: user.name, ...data }),
};

module.exports = emailService;
