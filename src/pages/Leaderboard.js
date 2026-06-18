import React, { useState } from 'react';
import { motion } from 'framer-motion';

const leaderboardData = [
  { rank: 1, name: 'Priya Menon', college: 'IIT Delhi', score: 96, interviews: 89, streak: 45, badge: '🥇', change: 0 },
  { rank: 2, name: 'Rahul Verma', college: 'IIT Bombay', score: 94, interviews: 76, streak: 38, badge: '🥈', change: 1 },
  { rank: 3, name: 'Sneha Patel', college: 'NIT Trichy', score: 93, interviews: 82, streak: 41, badge: '🥉', change: -1 },
  { rank: 4, name: 'Amit Kumar', college: 'BITS Pilani', score: 91, interviews: 71, streak: 29, badge: null, change: 2 },
  { rank: 5, name: 'Divya Sharma', college: 'IIT Madras', score: 90, interviews: 68, streak: 35, badge: null, change: 0 },
  { rank: 6, name: 'Ravi Teja', college: 'NIT Warangal', score: 88, interviews: 65, streak: 22, badge: null, change: -2 },
  { rank: 7, name: 'Ananya Singh', college: 'VIT Vellore', score: 87, interviews: 60, streak: 18, badge: null, change: 3 },
  { rank: 8, name: 'Karthik Raj', college: 'IIIT Hyderabad', score: 86, interviews: 58, streak: 16, badge: null, change: 1 },
  { rank: 9, name: 'Pooja Nair', college: 'IIT Kharagpur', score: 85, interviews: 55, streak: 21, badge: null, change: -1 },
  { rank: 10, name: 'Vijay Mishra', college: 'NIT Surathkal', score: 84, interviews: 52, streak: 14, badge: null, change: 0 },
  { rank: 142, name: 'Arjun Sharma', college: 'IIT Bombay', score: 78, interviews: 47, streak: 14, badge: null, change: 5, isUser: true },
];

const categories = ['Overall', 'Technical', 'HR', 'System Design', 'This Week'];

const Leaderboard = () => {
  const [category, setCategory] = useState('Overall');

  const topThree = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3).filter(u => !u.isUser);
  const userEntry = leaderboardData.find(u => u.isUser);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
        <p className="text-slate-500 mt-1">Compete with top students across India</p>
      </motion.div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${category === c ? 'bg-brand-500 text-white' : 'glass text-slate-400 hover:text-white'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-8">
        <div className="flex items-end justify-center gap-4">
          {/* 2nd */}
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-xl font-bold text-white mb-2">
              {topThree[1].name.charAt(0)}
            </div>
            <div className="text-sm font-semibold text-white">{topThree[1].name.split(' ')[0]}</div>
            <div className="text-xs text-slate-500 mb-2">{topThree[1].college}</div>
            <div className="w-20 h-16 rounded-t-xl bg-slate-700/50 flex items-center justify-center">
              <span className="text-2xl">🥈</span>
            </div>
          </div>

          {/* 1st */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl font-bold text-white mb-2 shadow-glow">
              {topThree[0].name.charAt(0)}
            </div>
            <div className="text-sm font-bold text-white">{topThree[0].name.split(' ')[0]}</div>
            <div className="text-xs text-slate-400 mb-2">{topThree[0].college}</div>
            <div className="text-lg font-bold text-yellow-400 mb-1">{topThree[0].score}%</div>
            <div className="w-20 h-24 rounded-t-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
              <span className="text-3xl">🥇</span>
            </div>
          </div>

          {/* 3rd */}
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-xl font-bold text-white mb-2">
              {topThree[2].name.charAt(0)}
            </div>
            <div className="text-sm font-semibold text-white">{topThree[2].name.split(' ')[0]}</div>
            <div className="text-xs text-slate-500 mb-2">{topThree[2].college}</div>
            <div className="w-20 h-12 rounded-t-xl bg-amber-900/30 flex items-center justify-center">
              <span className="text-2xl">🥉</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Full Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl overflow-hidden">
        <div className="grid grid-cols-6 gap-4 px-6 py-3 text-xs text-slate-500 font-semibold uppercase tracking-wider border-b border-white/5">
          <span>Rank</span>
          <span className="col-span-2">Student</span>
          <span className="text-center">Score</span>
          <span className="text-center">Interviews</span>
          <span className="text-center">Streak</span>
        </div>

        <div className="divide-y divide-white/3">
          {rest.map((user, i) => (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-6 gap-4 px-6 py-4 items-center hover:bg-white/3 transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-mono text-sm font-semibold">#{user.rank}</span>
                <span className={`text-xs ${user.change > 0 ? 'text-green-400' : user.change < 0 ? 'text-red-400' : 'text-slate-700'}`}>
                  {user.change > 0 ? `↑${user.change}` : user.change < 0 ? `↓${Math.abs(user.change)}` : '—'}
                </span>
              </div>
              <div className="col-span-2 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400/50 to-purple-500/50 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.college}</div>
                </div>
              </div>
              <div className="text-center">
                <span className={`text-sm font-bold ${user.score >= 90 ? 'text-green-400' : user.score >= 80 ? 'text-brand-400' : 'text-yellow-400'}`}>
                  {user.score}%
                </span>
              </div>
              <div className="text-center text-sm text-slate-400">{user.interviews}</div>
              <div className="text-center text-sm text-orange-400">🔥 {user.streak}</div>
            </motion.div>
          ))}
        </div>

        {/* User row (sticky) */}
        {userEntry && (
          <div className="border-t-2 border-brand-500/30 bg-brand-500/5 grid grid-cols-6 gap-4 px-6 py-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-brand-400 font-mono text-sm font-bold">#{userEntry.rank}</span>
              <span className="text-xs text-green-400">↑{userEntry.change}</span>
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {userEntry.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium text-white">{userEntry.name} <span className="text-xs text-brand-400">(You)</span></div>
                <div className="text-xs text-slate-500">{userEntry.college}</div>
              </div>
            </div>
            <div className="text-center"><span className="text-sm font-bold text-yellow-400">{userEntry.score}%</span></div>
            <div className="text-center text-sm text-slate-400">{userEntry.interviews}</div>
            <div className="text-center text-sm text-orange-400">🔥 {userEntry.streak}</div>
          </div>
        )}
      </motion.div>

      {/* Your Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">Your Position</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Current Rank', value: '#142', sub: 'Top 3%', color: 'text-yellow-400' },
            { label: 'Points to #100', value: '+180 pts', sub: 'Keep practicing!', color: 'text-brand-400' },
            { label: 'This Week', value: '+5 ranks', sub: 'Moving up fast', color: 'text-green-400' },
            { label: 'Best Rank', value: '#138', sub: 'All time', color: 'text-purple-400' },
          ].map((s, i) => (
            <div key={i} className="glass rounded-xl p-4 text-center">
              <div className={`text-xl font-bold ${s.color} mb-1`}>{s.value}</div>
              <div className="text-xs font-medium text-white mb-0.5">{s.label}</div>
              <div className="text-xs text-slate-600">{s.sub}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
