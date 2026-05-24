import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const LoginPage = () => {
  const { login, navigate } = useApp();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: 'demo@interviewai.in', password: 'demo1234', college: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    login();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f1729 0%, #1a1b52 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 p-10">
          <button onClick={() => navigate('landing')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <span>←</span> <span className="text-sm">Back to home</span>
          </button>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center p-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-16 h-16 rounded-2xl animated-gradient flex items-center justify-center text-2xl font-bold text-white mb-8 shadow-glow-lg">AI</div>
            <h2 className="text-3xl font-bold text-white mb-4">Your AI Interview Coach</h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">Practice thousands of questions, get instant feedback, and land your dream job.</p>

            <div className="space-y-4">
              {[
                { icon: '🤖', text: 'AI adapts to your skill level' },
                { icon: '📊', text: 'Detailed performance insights' },
                { icon: '🎯', text: 'Company-specific preparation' },
                { icon: '🏆', text: 'Industry-recognized certificates' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 glass rounded-lg flex items-center justify-center text-sm">{item.icon}</div>
                  <span className="text-slate-300 text-sm">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 p-10">
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">P</div>
              <div>
                <div className="text-sm text-white font-medium">Priya Menon</div>
                <div className="text-xs text-slate-500">SDE at Google · IIT Delhi</div>
              </div>
              <div className="ml-auto text-green-400 text-sm font-bold">+32 pts</div>
            </div>
            <p className="text-slate-400 text-xs">"Cracked Google SWE with 94% final score on InterviewAI. Best investment ever!"</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl animated-gradient flex items-center justify-center font-bold text-white">AI</div>
            <span className="font-bold text-white text-xl">InterviewAI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
            <p className="text-slate-400">{mode === 'login' ? 'Sign in to continue your practice journey' : 'Join 50,000+ students getting hired'}</p>
          </div>

          {/* Tabs */}
          <div className="glass rounded-2xl p-1 flex mb-8">
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${mode === m ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="glass-card rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
              <span>🔵</span> <span className="text-sm text-slate-300">Google</span>
            </button>
            <button className="glass-card rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
              <span>🔷</span> <span className="text-sm text-slate-300">LinkedIn</span>
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-600 text-xs">or continue with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm text-slate-400 mb-2">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Arjun Sharma"
                  className="w-full glass rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-brand-500/50 border border-transparent transition-all text-sm"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-slate-400 mb-2">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full glass rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-brand-500/50 border border-transparent transition-all text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full glass rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-brand-500/50 border border-transparent transition-all text-sm"
                required
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm text-slate-400 mb-2">College / University</label>
                <input
                  type="text"
                  value={form.college}
                  onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
                  placeholder="IIT Bombay, NIT Trichy, ..."
                  className="w-full glass rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none border border-transparent text-sm"
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">Forgot password?</button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 rounded-xl text-base flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(m => m === 'login' ? 'register' : 'login')}
              className="text-brand-400 hover:text-brand-300 transition-colors font-medium"
            >
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          <div className="mt-6 glass rounded-xl p-3 flex items-center gap-3">
            <span className="text-lg">💡</span>
            <p className="text-xs text-slate-500">Demo: use <span className="text-slate-300">demo@interviewai.in</span> / <span className="text-slate-300">demo1234</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
