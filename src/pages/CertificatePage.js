import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { generateCertificate } from '../services/certificateGenerator';

const TRACKS = [
  { id: 'dsa', title: 'DSA & Algorithms Mastery', score: 84, date: 'May 10, 2025', company: 'Google', icon: '🌳', earned: true },
  { id: 'react', title: 'React & Frontend Expert', score: 91, date: 'May 2, 2025', company: 'Flipkart', icon: '⚛️', earned: true },
  { id: 'hr', title: 'HR & Communication Pro', score: 79, date: 'Apr 29, 2025', company: 'Microsoft', icon: '🗣️', earned: true },
  { id: 'system', title: 'System Design Fundamentals', score: 68, date: null, company: 'Amazon', icon: '🏗️', earned: false, progress: 68 },
  { id: 'backend', title: 'Node.js Backend Developer', score: null, date: null, company: 'Razorpay', icon: '🟢', earned: false, progress: 40 },
];

export default function CertificatePage() {
  const { user } = useApp();
  const [generating, setGenerating] = useState(null);
  const [done, setDone] = useState(null);

  const handleGenerate = async (track) => {
    if (!track.earned) return;
    setGenerating(track.id);
    const certId = `IAI-${Date.now().toString(36).toUpperCase()}`;
    await generateCertificate({
      name: user.name,
      course: track.title,
      company: track.company,
      score: track.score,
      date: track.date,
      certId,
    });
    setGenerating(null);
    setDone(track.id);
    setTimeout(() => setDone(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Certificates</h1>
        <p className="text-slate-500 mt-1">Download your achievement certificates as PDF</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Earned', value: TRACKS.filter(t => t.earned).length, icon: '🏆', color: 'text-yellow-400' },
          { label: 'In Progress', value: TRACKS.filter(t => !t.earned).length, icon: '⏳', color: 'text-brand-400' },
          { label: 'Avg Score', value: '85%', icon: '📊', color: 'text-green-400' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card rounded-2xl p-4 flex items-center gap-4">
            <span className="text-3xl">{s.icon}</span>
            <div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Certificate Cards */}
      <div className="space-y-4">
        {TRACKS.map((track, i) => (
          <motion.div key={track.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`glass-card rounded-2xl p-5 flex items-center gap-5 ${track.earned ? 'border-yellow-500/20 hover:border-yellow-500/30' : 'opacity-70'} transition-all`}>
            {/* Icon */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${track.earned ? 'bg-yellow-500/10 border border-yellow-500/20' : 'glass'}`}>
              {track.icon}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white">{track.title}</h3>
                {track.earned && <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">Earned</span>}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                <span>🏢 {track.company}</span>
                {track.date && <span>📅 {track.date}</span>}
                {track.score && <span className="text-green-400 font-medium">Score: {track.score}%</span>}
              </div>
              {!track.earned && (
                <div>
                  <div className="h-1.5 glass rounded-full overflow-hidden w-48">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: `${track.progress}%` }} />
                  </div>
                  <div className="text-xs text-slate-600 mt-1">{track.progress}% complete</div>
                </div>
              )}
            </div>

            {/* Preview (certificate mini-preview) */}
            {track.earned && (
              <div className="w-28 h-18 flex-shrink-0 hidden md:block">
                <div className="relative rounded-xl overflow-hidden border border-yellow-500/20" style={{ height: 72, background: 'linear-gradient(135deg,#080d1a,#1a1b52)' }}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                    <div className="text-xs text-yellow-400 font-bold mb-0.5">🏆</div>
                    <div className="text-xs text-white font-semibold text-center leading-tight truncate w-full text-center">{user.name.split(' ')[0]}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{track.score}%</div>
                  </div>
                </div>
              </div>
            )}

            {/* Action */}
            <div className="flex-shrink-0">
              {track.earned ? (
                <button onClick={() => handleGenerate(track)} disabled={generating === track.id}
                  className={`flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-medium transition-all ${done === track.id ? 'bg-green-500 text-white' : 'btn-primary'} disabled:opacity-70`}>
                  {generating === track.id ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Generating…</span></>
                  ) : done === track.id ? (
                    <><span>✓</span><span>Downloaded!</span></>
                  ) : (
                    <><span>📥</span><span>Download PDF</span></>
                  )}
                </button>
              ) : (
                <div className="text-xs text-slate-600 text-center px-3">
                  <div>🔒 Locked</div>
                  <div>Complete track</div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* How to share */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-5">
        <h3 className="font-semibold text-white mb-3">📤 How to Share Your Certificate</h3>
        <div className="grid grid-cols-3 gap-4 text-sm text-slate-400">
          {[
            { icon: '💼', title: 'LinkedIn', desc: 'Upload PDF to your LinkedIn profile under "Licenses & Certifications"' },
            { icon: '📧', title: 'Email', desc: 'Attach the PDF to job applications alongside your resume' },
            { icon: '🔗', title: 'Portfolio', desc: 'Add to your personal portfolio or GitHub README' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div>
                <div className="font-medium text-white mb-0.5">{item.title}</div>
                <div className="text-xs leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
