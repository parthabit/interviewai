import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const Settings = () => {
  const { user, logout } = useApp();
  const [tab, setTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const tabs = ['profile', 'preferences', 'notifications', 'security', 'billing'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Settings & Profile</h1>
        <p className="text-slate-500 mt-1">Manage your account and preferences</p>
      </motion.div>

      <div className="flex gap-1 glass rounded-2xl p-1 w-fit">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${tab === t ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-3xl font-bold text-white mb-4">
              {user.name.charAt(0)}
            </div>
            <div className="font-bold text-white text-lg">{user.name}</div>
            <div className="text-slate-500 text-sm mb-1">{user.email}</div>
            <div className="text-xs bg-brand-500/20 text-brand-300 px-2 py-1 rounded-full border border-brand-500/30 mb-4">{user.plan} Plan</div>
            <button className="btn-secondary text-xs py-2 px-4 rounded-xl w-full">Change Avatar</button>
            <div className="mt-4 grid grid-cols-3 gap-3 w-full text-center">
              {[{ v: user.totalInterviews, l: 'Interviews' }, { v: `${user.avgScore}%`, l: 'Avg Score' }, { v: user.streak, l: 'Streak' }].map((s, i) => (
                <div key={i} className="glass rounded-xl p-2">
                  <div className="text-sm font-bold text-white">{s.v}</div>
                  <div className="text-xs text-slate-600">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2 glass-card rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-white">Personal Information</h3>
            {[
              { label: 'Full Name', value: user.name, type: 'text' },
              { label: 'Email Address', value: user.email, type: 'email' },
              { label: 'College / University', value: user.college, type: 'text' },
              { label: 'Target Role', value: user.targetRole, type: 'text' },
            ].map((f, i) => (
              <div key={i}>
                <label className="block text-xs text-slate-500 mb-1.5">{f.label}</label>
                <input defaultValue={f.value} type={f.type}
                  className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none border border-transparent focus:border-brand-500/40 transition-all" />
              </div>
            ))}
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Target Companies</label>
              <div className="flex flex-wrap gap-2">
                {user.targetCompanies.map(c => (
                  <span key={c} className="glass text-xs text-slate-300 px-3 py-1.5 rounded-xl flex items-center gap-1">
                    {c} <button className="text-slate-600 hover:text-red-400 ml-1">×</button>
                  </span>
                ))}
                <button className="glass text-xs text-brand-400 px-3 py-1.5 rounded-xl">+ Add</button>
              </div>
            </div>
            <button onClick={save} className={`btn-primary py-2.5 px-6 rounded-xl text-sm transition-all ${saved ? 'bg-green-500' : ''}`}>
              {saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      )}

      {tab === 'preferences' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-6 space-y-6">
          <h3 className="font-semibold text-white">Preferences</h3>
          {[
            { label: 'Dark Mode', desc: 'Use dark theme across the platform', enabled: true },
            { label: 'AI Voice Responses', desc: 'AI reads questions aloud during interviews', enabled: false },
            { label: 'Auto-save Interviews', desc: 'Automatically save interview transcripts', enabled: true },
            { label: 'Show Timer', desc: 'Display countdown timer during interviews', enabled: true },
            { label: 'Daily Challenge Reminders', desc: 'Get reminders for daily challenges', enabled: true },
            { label: 'Public Profile', desc: 'Appear on the leaderboard', enabled: true },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div>
                <div className="text-sm font-medium text-white">{s.label}</div>
                <div className="text-xs text-slate-500">{s.desc}</div>
              </div>
              <div className={`w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-all ${s.enabled ? 'bg-brand-500' : 'bg-white/10'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-all ${s.enabled ? 'translate-x-5' : ''}`} />
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {tab === 'notifications' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-white">Notification Settings</h3>
          {[
            { group: 'Email Notifications', items: ['Interview reminders', 'Resume analysis complete', 'Weekly performance report', 'New features & updates'] },
            { group: 'Push Notifications', items: ['Daily challenge available', 'Streak at risk', 'Leaderboard rank change', 'Certificate earned'] },
          ].map((g, gi) => (
            <div key={gi}>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{g.group}</div>
              <div className="space-y-3">
                {g.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{item}</span>
                    <div className="w-10 h-5 rounded-full bg-brand-500 flex items-center px-0.5 cursor-pointer">
                      <div className="w-4 h-4 rounded-full bg-white translate-x-5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {tab === 'security' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-white">Change Password</h3>
            {['Current Password', 'New Password', 'Confirm New Password'].map((l, i) => (
              <div key={i}>
                <label className="block text-xs text-slate-500 mb-1.5">{l}</label>
                <input type="password" placeholder="••••••••"
                  className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none border border-transparent focus:border-brand-500/40 transition-all" />
              </div>
            ))}
            <button className="btn-primary py-2.5 px-6 rounded-xl text-sm">Update Password</button>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4">Danger Zone</h3>
            <div className="flex items-center justify-between p-4 border border-red-500/20 rounded-xl bg-red-500/5">
              <div>
                <div className="text-sm font-medium text-red-400">Delete Account</div>
                <div className="text-xs text-slate-500">Permanently delete your account and all data</div>
              </div>
              <button className="text-xs glass px-3 py-2 rounded-xl text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all">Delete</button>
            </div>
          </div>
        </motion.div>
      )}

      {tab === 'billing' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-white">Current Plan</h3>
                <p className="text-sm text-slate-500">Manage your subscription</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold gradient-text">Pro Plan</div>
                <div className="text-sm text-slate-500">₹499/month</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {['Unlimited AI Interviews', 'Advanced Analytics', 'Voice Analysis', 'Certificates', 'Priority Support', 'Resume AI'].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-green-300">
                  <span className="text-green-400">✓</span> {f}
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button className="btn-primary py-2.5 px-6 rounded-xl text-sm">Upgrade to Premium</button>
              <button className="btn-secondary py-2.5 px-6 rounded-xl text-sm text-red-400">Cancel Plan</button>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4">Payment History</h3>
            <div className="space-y-3">
              {[
                { date: 'May 1, 2025', amount: '₹499', status: 'Paid', plan: 'Pro' },
                { date: 'Apr 1, 2025', amount: '₹499', status: 'Paid', plan: 'Pro' },
                { date: 'Mar 1, 2025', amount: '₹499', status: 'Paid', plan: 'Pro' },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between glass rounded-xl px-4 py-3 text-sm">
                  <span className="text-slate-400">{p.date}</span>
                  <span className="text-slate-300">{p.plan} Plan</span>
                  <span className="text-white font-medium">{p.amount}</span>
                  <span className="text-green-400 text-xs">{p.status}</span>
                  <button className="text-xs text-brand-400 hover:text-brand-300">Download</button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Settings;
