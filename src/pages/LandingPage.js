import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const features = [
  { icon: '🤖', title: 'AI Interview Simulation', desc: 'Practice with our advanced AI that adapts to your answers, asks follow-ups, and mimics real interviewers from top companies.' },
  { icon: '📄', title: 'Smart Resume Analysis', desc: 'Upload your resume and get instant ATS score, keyword optimization tips, and detailed improvement suggestions powered by AI.' },
  { icon: '📊', title: 'Performance Analytics', desc: 'Track communication score, confidence levels, grammar analysis, and speaking patterns with detailed progress charts.' },
  { icon: '🎯', title: 'Personalized Roadmap', desc: 'Get a customized placement preparation roadmap based on your target companies, role, and current skill level.' },
  { icon: '🏆', title: 'Leaderboard & Certificates', desc: 'Compete with peers, earn achievement badges, and generate shareable certificates for completed interview tracks.' },
  { icon: '🎙️', title: 'Voice-Powered Practice', desc: 'Real-time speech-to-text, AI voice responses, and speaking speed analysis for authentic interview experience.' },
];

const testimonials = [
  { name: 'Priya Menon', role: 'SDE at Google', college: 'IIT Delhi', avatar: 'P', score: 94, quote: 'InterviewAI helped me crack my Google interview. The AI questions were surprisingly close to the real ones!' },
  { name: 'Rohan Gupta', role: 'Product Manager at Microsoft', college: 'BITS Pilani', avatar: 'R', score: 88, quote: 'The behavioral interview module is incredible. My confidence score went from 58 to 89 in 3 weeks.' },
  { name: 'Sneha Patel', role: 'Data Scientist at Flipkart', college: 'NIT Trichy', avatar: 'S', score: 91, quote: 'Resume analyzer gave me insights I never thought of. My ATS score jumped from 61 to 87 overnight!' },
  { name: 'Vikram Singh', role: 'Frontend Dev at Razorpay', college: 'VIT Vellore', avatar: 'V', score: 85, quote: 'The leaderboard kept me motivated. Daily challenges are addictive and genuinely helpful.' },
];

const pricing = [
  { name: 'Free', price: 0, period: 'forever', color: 'from-slate-700 to-slate-600', features: ['5 AI interviews/month', 'Basic resume check', 'Limited analytics', 'Community access'] },
  { name: 'Pro', price: 499, period: 'month', color: 'from-brand-600 to-purple-600', popular: true, features: ['Unlimited AI interviews', 'Advanced resume AI', 'Full analytics dashboard', 'Voice analysis', 'Priority support', 'Certificates'] },
  { name: 'Premium', price: 1499, period: 'month', color: 'from-amber-600 to-orange-600', features: ['Everything in Pro', 'Mock interviews with mentors', '1:1 career guidance', 'LinkedIn profile review', 'Placement guarantee support', 'Custom roadmap'] },
];

const stats = [
  { value: '50K+', label: 'Students Placed' },
  { value: '200+', label: 'Partner Companies' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '4.9★', label: 'App Rating' },
];

const faqs = [
  { q: 'How realistic are the AI interviews?', a: 'Our AI is trained on thousands of real interview transcripts from FAANG and top Indian companies. It adapts to your responses, asks relevant follow-ups, and provides feedback similar to a real interviewer.' },
  { q: 'What file formats does resume analyzer support?', a: 'We support PDF, DOC, DOCX, and TXT formats. Our AI extracts and analyzes all content including skills, experience, education, and formatting quality.' },
  { q: 'Can I practice for specific companies?', a: 'Yes! You can select specific companies like Google, Microsoft, Amazon, Flipkart, Infosys, and 190+ others. The AI tailors questions based on company culture and past interview patterns.' },
  { q: 'Is my data secure?', a: 'Absolutely. All data is encrypted end-to-end, interview recordings are stored securely, and we never share personal data with third parties. You can delete your data anytime.' },
  { q: 'Do certificates have value?', a: 'Our certificates are recognized by 200+ partner companies. Many users have successfully added them to their LinkedIn profiles and mentioned them in interviews.' },
];

const LandingPage = () => {
  const { navigate, login } = useApp();
  const [typedText, setTypedText] = useState('');
  const [faqOpen, setFaqOpen] = useState(null);
  const phrases = ['Software Engineers', 'Data Scientists', 'Product Managers', 'ML Engineers', 'Designers'];
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const phrase = phrases[phraseIdx];
    let i = 0;
    setTypedText('');
    const interval = setInterval(() => {
      setTypedText(phrase.slice(0, ++i));
      if (i === phrase.length) {
        clearInterval(interval);
        setTimeout(() => setPhraseIdx(p => (p + 1) % phrases.length), 2000);
      }
    }, 70);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phraseIdx]);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(91,104,243,0.15) 0%, transparent 60%)' }} />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2" style={{ background: 'radial-gradient(ellipse at 100% 100%, rgba(139,92,246,0.08) 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50" style={{ background: 'rgba(8,13,26,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg animated-gradient flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <span className="font-bold text-white">InterviewAI</span>
            <span className="text-xs bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full border border-brand-500/30">Beta</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('login')} className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2">Sign In</button>
            <button onClick={() => navigate('login')} className="btn-primary text-sm py-2 px-4">Get Started Free</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-slate-300 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>AI-powered by Claude · 50,000+ students trained</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              Land Your Dream Job as a{' '}
              <span className="gradient-text typing-cursor">{typedText}</span>
            </h1>

            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Practice AI-powered mock interviews, analyze your resume, track performance, and get personalized guidance — all in one platform built for Indian students.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={login}
                className="btn-primary text-lg px-8 py-4 rounded-2xl flex items-center gap-2 group"
              >
                <span>Start Practicing Free</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button className="btn-secondary text-lg px-8 py-4 rounded-2xl flex items-center gap-2">
                <span>🎬</span>
                <span>Watch Demo</span>
              </button>
            </div>

            <p className="mt-6 text-sm text-slate-600">No credit card required · 5 free interviews/month</p>
          </motion.div>

          {/* Hero Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 relative"
          >
            <div className="glass-card rounded-3xl p-1 overflow-hidden" style={{ boxShadow: '0 0 80px rgba(91,104,243,0.15), 0 40px 80px rgba(0,0,0,0.5)' }}>
              <div className="glass rounded-2xl p-6">
                {/* Fake dashboard preview */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  <div className="flex-1 mx-4 h-6 glass rounded-lg" />
                </div>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[{ l: 'Total Interviews', v: '47', c: 'text-brand-400' }, { l: 'Avg Score', v: '78%', c: 'text-green-400' }, { l: 'Day Streak', v: '14 🔥', c: 'text-orange-400' }, { l: 'Rank', v: '#142', c: 'text-yellow-400' }].map((m, i) => (
                    <div key={i} className="glass rounded-xl p-3 text-left">
                      <div className="text-xs text-slate-500 mb-1">{m.l}</div>
                      <div className={`text-xl font-bold ${m.c}`}>{m.v}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 glass rounded-xl p-4">
                    <div className="text-xs text-slate-500 mb-3">Performance Trend</div>
                    <div className="flex items-end gap-1 h-16">
                      {[55, 62, 58, 74, 68, 80, 76, 82, 78, 88, 85, 91].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: `rgba(91,104,243,${0.3 + h / 200})` }} />
                      ))}
                    </div>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <div className="text-xs text-slate-500 mb-2">AI Interview Active</div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-xs">AI</div>
                        <div className="flex-1 glass rounded-lg h-3 overflow-hidden">
                          <div className="h-full bg-brand-500/50 w-3/4 rounded-lg" />
                        </div>
                      </div>
                      <div className="h-2 glass rounded w-full" />
                      <div className="h-2 glass rounded w-3/4" />
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                        <span className="text-xs text-slate-500">Recording</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(91,104,243,0.15) 0%, transparent 70%)' }} />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-16 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{s.value}</div>
              <div className="text-slate-500 text-sm">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="text-sm text-brand-400 font-semibold mb-3 tracking-widest uppercase">Features</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything you need to get hired</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">A complete interview preparation ecosystem powered by cutting-edge AI technology.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card rounded-2xl p-6 cursor-default group"
              >
                <div className="w-12 h-12 glass rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-24 px-6" style={{ background: 'rgba(91,104,243,0.03)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="text-sm text-brand-400 font-semibold mb-3 tracking-widest uppercase">How It Works</div>
            <h2 className="text-4xl font-bold mb-4">From signup to job offer in weeks</h2>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', icon: '📝', title: 'Create Profile', desc: 'Tell us your target role, companies, and current level.' },
              { step: '02', icon: '🤖', title: 'AI Interview', desc: 'Practice with our adaptive AI interviewer in technical & HR modes.' },
              { step: '03', icon: '📊', title: 'Get Analysis', desc: 'Receive detailed feedback, scores, and improvement areas.' },
              { step: '04', icon: '🚀', title: 'Get Hired', desc: 'Apply with confidence using your improved skills and resume.' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center">
                <div className="text-5xl font-bold text-white/5 mb-2">{s.step}</div>
                <div className="w-14 h-14 mx-auto glass rounded-2xl flex items-center justify-center text-2xl mb-4 -mt-8 relative z-10">{s.icon}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm">{s.desc}</p>
                {i < 3 && <div className="hidden md:block absolute right-0 top-1/2 text-slate-700 text-2xl">→</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="text-sm text-brand-400 font-semibold mb-3 tracking-widest uppercase">Success Stories</div>
            <h2 className="text-4xl font-bold mb-4">Students who got their dream jobs</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center font-bold text-lg text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{t.name}</div>
                    <div className="text-sm text-slate-400">{t.role}</div>
                    <div className="text-xs text-slate-600">{t.college}</div>
                  </div>
                  <div className="ml-auto text-center">
                    <div className="text-xl font-bold text-green-400">{t.score}%</div>
                    <div className="text-xs text-slate-600">final score</div>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed italic">"{t.quote}"</p>
                <div className="flex mt-3">{'★★★★★'.split('').map((s, i) => <span key={i} className="text-yellow-400">{s}</span>)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 py-24 px-6" style={{ background: 'rgba(91,104,243,0.03)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="text-sm text-brand-400 font-semibold mb-3 tracking-widest uppercase">Pricing</div>
            <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400">Start free, upgrade when you're ready for more.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {pricing.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card rounded-2xl p-6 relative ${p.popular ? 'border-brand-500/40 border' : ''}`}
              >
                {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs px-3 py-1 rounded-full font-semibold">Most Popular</div>}
                <div className={`text-sm font-semibold mb-4 bg-gradient-to-r ${p.color} bg-clip-text text-transparent`}>{p.name}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-slate-400 text-sm">₹</span>
                  <span className="text-4xl font-bold text-white">{p.price === 0 ? '0' : p.price.toLocaleString()}</span>
                </div>
                <div className="text-slate-500 text-sm mb-6">/{p.period}</div>
                <ul className="space-y-3 mb-6">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="text-green-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={login}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${p.popular ? 'btn-primary' : 'btn-secondary hover:bg-white/10'}`}
                >
                  {p.price === 0 ? 'Get Started Free' : `Start ${p.name}`}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="text-sm text-brand-400 font-semibold mb-3 tracking-widest uppercase">FAQ</div>
            <h2 className="text-4xl font-bold">Frequently asked questions</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass-card rounded-2xl overflow-hidden">
                <button className="w-full text-left px-6 py-4 flex items-center justify-between" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  <span className="font-medium text-white">{faq.q}</span>
                  <span className={`text-slate-400 transition-transform ${faqOpen === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {faqOpen === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="px-6 pb-4 text-slate-400 text-sm leading-relaxed">
                    {faq.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-12" style={{ background: 'linear-gradient(135deg, rgba(91,104,243,0.15) 0%, rgba(139,92,246,0.1) 100%)' }}>
            <h2 className="text-4xl font-bold mb-4">Ready to ace your next interview?</h2>
            <p className="text-slate-400 mb-8">Join 50,000+ students who are already practicing smarter.</p>
            <button onClick={login} className="btn-primary text-lg px-10 py-4 rounded-2xl">
              Start Practicing — It's Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg animated-gradient flex items-center justify-center text-xs font-bold text-white">AI</div>
                <span className="font-bold text-white">InterviewAI</span>
              </div>
              <p className="text-slate-500 text-sm">The smartest way to prepare for interviews and land your dream job.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Support', links: ['Help Center', 'Community', 'Contact', 'Privacy Policy'] },
            ].map((col, i) => (
              <div key={i}>
                <div className="font-semibold text-white mb-4">{col.title}</div>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}><button className="text-slate-500 text-sm hover:text-slate-300 transition-colors">{link}</button></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
            <span>© 2025 InterviewAI. All rights reserved.</span>
            <span>Made with ❤️ for Indian students</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
