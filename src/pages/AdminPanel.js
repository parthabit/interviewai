import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const users = [
  { id: 1, name: 'Priya Menon', email: 'priya@iitd.ac.in', college: 'IIT Delhi', plan: 'Pro', interviews: 89, status: 'active', joined: '2025-01-10' },
  { id: 2, name: 'Rahul Verma', email: 'rahul@iitb.ac.in', college: 'IIT Bombay', plan: 'Free', interviews: 23, status: 'active', joined: '2025-02-05' },
  { id: 3, name: 'Sneha Patel', email: 'sneha@nitt.edu', college: 'NIT Trichy', plan: 'Premium', interviews: 82, status: 'active', joined: '2025-01-20' },
  { id: 4, name: 'Amit Kumar', email: 'amit@bits.com', college: 'BITS Pilani', plan: 'Pro', interviews: 71, status: 'inactive', joined: '2025-03-01' },
  { id: 5, name: 'Divya Sharma', email: 'divya@iitm.ac.in', college: 'IIT Madras', plan: 'Free', interviews: 12, status: 'active', joined: '2025-04-15' },
  { id: 6, name: 'Ravi Teja', email: 'ravi@nitw.ac.in', college: 'NIT Warangal', plan: 'Pro', interviews: 65, status: 'suspended', joined: '2025-02-28' },
];

const dailyActivity = [
  { day: 'Mon', interviews: 342, resumes: 89, signups: 45 },
  { day: 'Tue', interviews: 418, resumes: 112, signups: 67 },
  { day: 'Wed', interviews: 389, resumes: 98, signups: 52 },
  { day: 'Thu', interviews: 521, resumes: 134, signups: 88 },
  { day: 'Fri', interviews: 476, resumes: 121, signups: 71 },
  { day: 'Sat', interviews: 298, resumes: 78, signups: 34 },
  { day: 'Sun', interviews: 187, resumes: 45, signups: 21 },
];

const categories = [
  { name: 'Data Structures', questions: 240, usage: 89, icon: '🌳' },
  { name: 'System Design', questions: 85, usage: 67, icon: '🏗️' },
  { name: 'Behavioral HR', questions: 120, usage: 74, icon: '🗣️' },
  { name: 'Frontend React', questions: 95, usage: 81, icon: '⚛️' },
  { name: 'Node.js Backend', questions: 78, usage: 56, icon: '🟢' },
  { name: 'Database SQL', questions: 60, usage: 48, icon: '🗄️' },
];

const tooltipStyle = {
  contentStyle: { background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }
};

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userFilter, setUserFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = userFilter === 'all' || u.status === userFilter || u.plan.toLowerCase() === userFilter;
    return matchSearch && matchFilter;
  });

  const statusColor = (s) => ({ active: 'text-green-400 bg-green-500/10', inactive: 'text-yellow-400 bg-yellow-500/10', suspended: 'text-red-400 bg-red-500/10' }[s]);
  const planColor = (p) => ({ Free: 'text-slate-400 bg-white/5', Pro: 'text-brand-400 bg-brand-500/10', Premium: 'text-yellow-400 bg-yellow-500/10' }[p]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-slate-500 mt-1">Manage users, analytics, and platform settings</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">● System Online</span>
          <span className="text-xs px-2 py-1 glass rounded-full text-slate-400">v2.4.1</span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 glass rounded-2xl p-1 w-fit">
        {['overview', 'users', 'categories', 'ai-settings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Users', value: '52,847', delta: '+1,234 this week', icon: '👥', color: 'text-brand-400' },
              { label: 'Active Interviews', value: '1,247', delta: 'Right now', icon: '🎤', color: 'text-green-400' },
              { label: 'AI API Calls Today', value: '48,392', delta: '+12% vs yesterday', icon: '🤖', color: 'text-purple-400' },
              { label: 'Monthly Revenue', value: '₹8.4L', delta: '+23% MoM', icon: '💰', color: 'text-yellow-400' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-xs text-slate-500">{s.delta}</span>
                </div>
                <div className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Activity Chart */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-5">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dailyActivity}>
                <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="interviews" name="Interviews" fill="#5b68f3" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="resumes" name="Resumes" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="signups" name="Sign-ups" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { title: 'Plan Distribution', items: [{ l: 'Free', v: '67%', c: 'bg-slate-500' }, { l: 'Pro', v: '24%', c: 'bg-brand-500' }, { l: 'Premium', v: '9%', c: 'bg-yellow-500' }] },
              { title: 'Top Colleges', items: [{ l: 'IIT Bombay', v: '2,841' }, { l: 'IIT Delhi', v: '2,156' }, { l: 'NIT Trichy', v: '1,892' }] },
              { title: 'System Health', items: [{ l: 'API Uptime', v: '99.9%', c: 'text-green-400' }, { l: 'Avg Latency', v: '124ms', c: 'text-green-400' }, { l: 'Error Rate', v: '0.02%', c: 'text-green-400' }] },
            ].map((block, bi) => (
              <div key={bi} className="glass-card rounded-2xl p-5">
                <h4 className="text-sm font-semibold text-white mb-4">{block.title}</h4>
                <div className="space-y-3">
                  {block.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{item.l}</span>
                      <span className={item.c ? `font-semibold ${item.c}` : 'text-white font-medium'}>{item.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 glass rounded-xl px-4 py-2.5 flex items-center gap-2">
              <span className="text-slate-500">🔍</span>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search users by name or email..."
                className="bg-transparent text-sm text-white placeholder-slate-600 outline-none flex-1"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'active', 'inactive', 'pro', 'free'].map(f => (
                <button key={f} onClick={() => setUserFilter(f)} className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${userFilter === f ? 'bg-brand-500 text-white' : 'glass text-slate-400 hover:text-white'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="grid grid-cols-7 gap-3 px-6 py-3 text-xs text-slate-500 font-semibold uppercase tracking-wider border-b border-white/5">
              <span className="col-span-2">User</span>
              <span>College</span>
              <span>Plan</span>
              <span>Interviews</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-white/3">
              {filteredUsers.map((user, i) => (
                <motion.div key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="grid grid-cols-7 gap-3 px-6 py-4 items-center hover:bg-white/2 transition-all">
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400/40 to-purple-500/40 flex items-center justify-center text-xs font-bold text-white">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400">{user.college}</div>
                  <div><span className={`text-xs px-2 py-1 rounded-lg font-medium ${planColor(user.plan)}`}>{user.plan}</span></div>
                  <div className="text-sm text-slate-300">{user.interviews}</div>
                  <div><span className={`text-xs px-2 py-1 rounded-lg font-medium ${statusColor(user.status)}`}>{user.status}</span></div>
                  <div className="flex gap-2">
                    <button className="text-xs glass px-2 py-1 rounded-lg text-slate-400 hover:text-white transition-all">View</button>
                    <button className="text-xs glass px-2 py-1 rounded-lg text-red-400 hover:text-red-300 transition-all">Suspend</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'categories' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">{categories.length} interview categories</p>
            <button className="btn-primary py-2 px-4 rounded-xl text-sm">+ Add Category</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">{cat.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-white mb-1">{cat.name}</div>
                  <div className="text-xs text-slate-500 mb-2">{cat.questions} questions</div>
                  <div className="h-1.5 glass rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: `${cat.usage}%` }} />
                  </div>
                  <div className="text-xs text-slate-600 mt-1">{cat.usage}% usage rate</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="text-xs glass px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all">Edit</button>
                  <button className="text-xs glass px-3 py-1.5 rounded-lg text-red-400 hover:text-red-300 transition-all">Delete</button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'ai-settings' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            {[
              { title: 'AI Model', desc: 'Choose the underlying model for interview AI', current: 'claude-sonnet-4-20250514', options: ['claude-sonnet-4-20250514', 'claude-haiku-4-5', 'claude-opus-4'] },
              { title: 'Response Style', desc: 'How the AI interviewer responds', current: 'Professional & Adaptive', options: ['Professional & Adaptive', 'Strict & Formal', 'Friendly & Encouraging'] },
            ].map((setting, i) => (
              <div key={i} className="glass-card rounded-2xl p-5">
                <h4 className="font-semibold text-white mb-1">{setting.title}</h4>
                <p className="text-xs text-slate-500 mb-4">{setting.desc}</p>
                <div className="space-y-2">
                  {setting.options.map(opt => (
                    <button key={opt} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${setting.current === opt ? 'bg-brand-500/20 border border-brand-500/30 text-white' : 'glass text-slate-400 hover:text-white'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="glass-card rounded-2xl p-5">
              <h4 className="font-semibold text-white mb-1">AI Limits</h4>
              <p className="text-xs text-slate-500 mb-4">Configure usage limits per plan</p>
              <div className="space-y-4">
                {[
                  { plan: 'Free', limit: '5 interviews/month', color: 'text-slate-400' },
                  { plan: 'Pro', limit: 'Unlimited interviews', color: 'text-brand-400' },
                  { plan: 'Premium', limit: 'Unlimited + Mentors', color: 'text-yellow-400' },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${p.color}`}>{p.plan}</span>
                    <span className="text-sm text-slate-400">{p.limit}</span>
                    <button className="text-xs glass px-2 py-1 rounded-lg text-slate-400 hover:text-white">Edit</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h4 className="font-semibold text-white mb-1">Safety & Moderation</h4>
              <p className="text-xs text-slate-500 mb-4">Content filtering and safety settings</p>
              <div className="space-y-3">
                {[
                  { label: 'Content filtering', enabled: true },
                  { label: 'Profanity detection', enabled: true },
                  { label: 'Anti-cheating detection', enabled: true },
                  { label: 'Response logging', enabled: false },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{s.label}</span>
                    <div className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-all cursor-pointer ${s.enabled ? 'bg-brand-500' : 'bg-white/10'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-all ${s.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminPanel;
