import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_ANALYSIS = {
  atsScore: 73,
  overallScore: 81,
  sections: {
    contact: 95,
    summary: 70,
    experience: 85,
    skills: 78,
    education: 92,
    formatting: 65,
  },
  skills: {
    found: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB', 'Git', 'REST APIs', 'TypeScript'],
    missing: ['Docker', 'Kubernetes', 'AWS', 'GraphQL', 'Redis'],
    recommended: ['System Design', 'LLD', 'Problem Solving', 'Agile/Scrum'],
  },
  keywords: {
    matched: ['Software Engineer', 'Full Stack', 'API Development', 'Agile'],
    missed: ['Cloud', 'Microservices', 'CI/CD', 'DevOps', 'Kubernetes'],
  },
  strengths: [
    'Strong technical skills section with relevant technologies',
    'Clear project descriptions with quantified impact',
    'Good educational background from reputed institution',
    'Active GitHub profile linked with 40+ repositories',
  ],
  improvements: [
    { severity: 'high', text: 'Add quantified achievements (e.g., "Improved API response time by 40%")' },
    { severity: 'high', text: 'Include cloud platform experience (AWS/GCP/Azure) — critical for 2025 hiring' },
    { severity: 'medium', text: 'Add a professional summary section (currently missing)' },
    { severity: 'medium', text: 'Use action verbs consistently: "Built", "Designed", "Deployed"' },
    { severity: 'low', text: 'Optimize formatting — use single-column layout for better ATS parsing' },
    { severity: 'low', text: 'Add keywords: Microservices, CI/CD, System Design to match job descriptions' },
  ],
  wordCount: 487,
  pages: 1,
  readability: 'Good',
  format: 'PDF',
};

const ScoreRing = ({ score, color, size = 80 }) => {
  const r = (size - 10) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (score / 100) * circumference;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={6} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        initial={{ strokeDasharray: `0 ${circumference}` }}
        animate={{ strokeDasharray: `${dash} ${circumference}` }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
      <text x={size / 2} y={size / 2 + 6} textAnchor="middle" fill="white" fontSize={16} fontWeight="bold">{score}</text>
    </svg>
  );
};

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');

  const handleFile = useCallback((f) => {
    if (!f) return;
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['pdf', 'doc', 'docx', 'txt'].includes(ext)) {
      alert('Please upload a PDF, DOC, DOCX, or TXT file');
      return;
    }
    setFile(f);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const analyzeResume = useCallback(async () => {
    setAnalyzing(true);
    setProgress(0);

    const steps = [
      { p: 15, l: 'Parsing document structure...' },
      { p: 30, l: 'Extracting text content...' },
      { p: 50, l: 'Running ATS compatibility check...' },
      { p: 68, l: 'Analyzing skill keywords...' },
      { p: 82, l: 'Generating improvement suggestions...' },
      { p: 95, l: 'Calculating final scores...' },
      { p: 100, l: 'Analysis complete!' },
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 500 + Math.random() * 400));
      setProgress(step.p);
      setProgressLabel(step.l);
    }

    await new Promise(r => setTimeout(r, 300));
    setAnalyzing(false);
    setAnalysis(MOCK_ANALYSIS);
  }, []);

  const severityColor = (s) => ({ high: 'text-red-400 bg-red-500/10 border-red-500/20', medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', low: 'text-blue-400 bg-blue-500/10 border-blue-500/20' }[s]);
  const sectionColor = (score) => score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Resume Analyzer</h1>
        <p className="text-slate-500 mt-1">Upload your resume and get instant AI-powered ATS analysis</p>
      </motion.div>

      {!analysis ? (
        <div className="grid grid-cols-3 gap-6">
          {/* Upload Area */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="col-span-2 space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => !file && document.getElementById('resume-input').click()}
              className={`glass-card rounded-2xl p-12 text-center cursor-pointer transition-all border-2 border-dashed ${
                dragOver ? 'border-brand-400 bg-brand-500/5' : file ? 'border-green-500/30 bg-green-500/5' : 'border-white/10 hover:border-brand-500/30 hover:bg-brand-500/3'
              }`}
            >
              <input id="resume-input" type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={e => handleFile(e.target.files[0])} />
              {file ? (
                <div>
                  <div className="text-5xl mb-4">📄</div>
                  <div className="text-white font-semibold text-lg">{file.name}</div>
                  <div className="text-slate-500 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB · {file.name.split('.').pop().toUpperCase()}</div>
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-4 text-sm text-red-400 hover:text-red-300 transition-colors">
                    Remove file
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-5xl mb-4">📤</div>
                  <div className="text-white font-semibold text-lg mb-2">Drop your resume here</div>
                  <div className="text-slate-500 text-sm mb-4">or click to browse files</div>
                  <div className="flex items-center justify-center gap-3">
                    {['PDF', 'DOC', 'DOCX', 'TXT'].map(f => (
                      <span key={f} className="glass px-2 py-1 rounded-lg text-xs text-slate-400">{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {analyzing && (
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-white font-medium">Analyzing your resume...</span>
                  <span className="text-sm text-brand-400 font-mono">{progress}%</span>
                </div>
                <div className="h-2 glass rounded-full overflow-hidden mb-3">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <p className="text-sm text-slate-500">{progressLabel}</p>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {['Parsing Structure', 'ATS Check', 'Skill Analysis', 'Score Calculation'].map((step, i) => (
                    <div key={i} className={`flex items-center gap-2 text-xs ${progress > i * 25 ? 'text-green-400' : 'text-slate-600'}`}>
                      <span>{progress > i * 25 ? '✅' : '⏳'}</span> {step}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {file && !analyzing && (
              <button onClick={analyzeResume} className="btn-primary w-full py-4 rounded-xl text-base flex items-center justify-center gap-2">
                <span>🤖</span> Analyze with AI
              </button>
            )}
          </motion.div>

          {/* Tips */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-4">What we analyze</h3>
              <div className="space-y-3">
                {[
                  { icon: '🎯', label: 'ATS Score', desc: 'Compatibility with tracking systems' },
                  { icon: '🔑', label: 'Keywords', desc: 'Industry-specific terms' },
                  { icon: '⚡', label: 'Skills Gap', desc: 'Missing high-demand skills' },
                  { icon: '📝', label: 'Format Check', desc: 'Structure and readability' },
                  { icon: '💡', label: 'AI Suggestions', desc: 'Personalized improvements' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-white">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-3 text-sm">Quick Tips</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex gap-2"><span className="text-green-400">✓</span> Use PDF format for best ATS results</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Include quantified achievements</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Tailor resume to job description</li>
                <li className="flex gap-2"><span className="text-yellow-400">!</span> Avoid tables and graphics in resumes</li>
                <li className="flex gap-2"><span className="text-yellow-400">!</span> Keep it 1-2 pages maximum</li>
              </ul>
            </div>
          </motion.div>
        </div>
      ) : (
        /* ANALYSIS RESULTS */
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Score Overview */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'ATS Score', score: analysis.atsScore, color: '#5b68f3', desc: 'ATS Compatible' },
              { label: 'Overall Score', score: analysis.overallScore, color: '#22c55e', desc: 'Very Good' },
              { label: 'Skills Match', score: 72, color: '#f59e0b', desc: 'Needs Work' },
              { label: 'Readability', score: 88, color: '#06b6d4', desc: 'Excellent' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-2xl p-5 text-center">
                <ScoreRing score={s.score} color={s.color} size={80} />
                <div className="text-sm font-semibold text-white mt-3 mb-1">{s.label}</div>
                <div className="text-xs text-slate-500">{s.desc}</div>
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-3 gap-6">
            {/* Section Scores */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-4">Section Scores</h3>
              <div className="space-y-3">
                {Object.entries(analysis.sections).map(([key, score]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-slate-400 capitalize">{key}</span>
                      <span className="font-semibold" style={{ color: sectionColor(score) }}>{score}%</span>
                    </div>
                    <div className="h-1.5 glass rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full"
                        style={{ background: sectionColor(score) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Skills Analysis */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-4">Skills Analysis</h3>
              <div className="mb-4">
                <div className="text-xs text-green-400 font-semibold mb-2">✅ Found ({analysis.skills.found.length})</div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.skills.found.map(s => (
                    <span key={s} className="text-xs px-2 py-1 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">{s}</span>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <div className="text-xs text-red-400 font-semibold mb-2">❌ Missing ({analysis.skills.missing.length})</div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.skills.missing.map(s => (
                    <span key={s} className="text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-blue-400 font-semibold mb-2">💡 Add These</div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.skills.recommended.map(s => (
                    <span key={s} className="text-xs px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">{s}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Keywords */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-4">Keyword Optimization</h3>
              <div className="mb-4">
                <div className="text-xs text-green-400 font-semibold mb-2">✅ Matched Keywords</div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.keywords.matched.map(k => (
                    <span key={k} className="text-xs px-2 py-1 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">{k}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-orange-400 font-semibold mb-2">⚠️ Add These Keywords</div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.keywords.missed.map(k => (
                    <span key={k} className="text-xs px-2 py-1 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">{k}</span>
                  ))}
                </div>
              </div>
              <div className="mt-4 p-3 glass rounded-xl text-xs text-slate-400">
                <strong className="text-white">Pro Tip:</strong> Add 3-5 of the missing keywords naturally in your experience section to boost ATS score by ~15 points.
              </div>
            </motion.div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">✅ Strengths</h3>
              <div className="space-y-3">
                {analysis.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-green-300">
                    <span className="text-green-400 mt-0.5 flex-shrink-0">→</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">💡 Improvements</h3>
              <div className="space-y-2">
                {analysis.improvements.map((item, i) => (
                  <div key={i} className={`flex items-start gap-2 text-xs p-2.5 rounded-lg border ${severityColor(item.severity)}`}>
                    <span className="flex-shrink-0 uppercase font-bold text-xs">{item.severity}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button onClick={() => { setAnalysis(null); setFile(null); }} className="btn-secondary py-3 px-6 rounded-xl text-sm">
              Analyze Another
            </button>
            <button className="btn-primary py-3 px-6 rounded-xl text-sm flex items-center gap-2">
              <span>📥</span> Download Report
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
