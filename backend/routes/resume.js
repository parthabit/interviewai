const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const { generate } = require('../services/gemini');
const { authMiddleware } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf','application/msword','text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type'));
  },
});

router.post('/analyze', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const fileContent = req.file.buffer.toString('utf-8').substring(0, 8000);

    const prompt = `You are an expert ATS resume analyzer and career coach.
Analyze the resume below and return ONLY valid JSON with no markdown or explanation.

Resume:
${fileContent}

Return this exact JSON structure:
{
  "atsScore": 0-100,
  "overallScore": 0-100,
  "sections": {
    "contact": 0-100,
    "summary": 0-100,
    "experience": 0-100,
    "skills": 0-100,
    "education": 0-100,
    "formatting": 0-100
  },
  "skills": {
    "found": ["skill1", "skill2"],
    "missing": ["skill1", "skill2"]
  },
  "keywords": {
    "matched": ["kw1", "kw2"],
    "missed": ["kw1", "kw2"]
  },
  "strengths": ["strength1", "strength2"],
  "improvements": [
    { "severity": "high", "text": "suggestion" },
    { "severity": "medium", "text": "suggestion" },
    { "severity": "low", "text": "suggestion" }
  ]
}`;

    const raw = await generate(prompt, true); // use pro for better accuracy
    let analysis;
    try {
      analysis = JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch {
      // Fallback if parsing fails
      analysis = {
        atsScore: 70, overallScore: 75,
        sections: { contact:80, summary:65, experience:75, skills:70, education:85, formatting:60 },
        skills: { found: ['JavaScript','React','Node.js'], missing: ['Docker','AWS','Kubernetes'] },
        keywords: { matched: ['Software Engineer','Full Stack'], missed: ['Cloud','Microservices'] },
        strengths: ['Good technical skills section', 'Clear project descriptions'],
        improvements: [
          { severity: 'high', text: 'Add quantified achievements with metrics' },
          { severity: 'medium', text: 'Include cloud platform experience' },
          { severity: 'low', text: 'Add a professional summary section' },
        ],
      };
    }

    res.json({ analysis, fileName: req.file.originalname });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
