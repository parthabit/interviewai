import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, Legend
} from 'recharts';

const weeklyData = [
  { week: 'W1', score: 55, communication: 50, technical: 58, confidence: 52 },
  { week: 'W2', score: 62, communication: 58, technical: 65, confidence: 60 },
  { week: 'W3', score: 58, communication: 55, technical: 60, confidence: 56 },
  { week: 'W4', score: 74, communication: 72, technical: 76, confidence: 68 },
  { week: 'W5', score: 68, communication: 65, technical: 70, confidence: 64 },
  { week: 'W6', score: 80, communication: 78, technical: 82, confidence: 78 },
  { week: 'W7', score: 76, communication: 74, technical: 79, confidence: 72 },
  { week: 'W8', score: 82, communication: 80, technical: 84, confidence: 80 },
  { week: 'W9', score: 78, communication: 76, technical: 80, confidence: 74 },
  { week: 'W10', score: 88, communication: 86, technical: 90, confidence: 85 },
  { week: 'W11', score: 85, communication: 84, technical: 87, confidence: 82 },
  { week: 'W12', score: 91, communication: 90, technical: 93, confidence: 89 },
];

const radarData = [
  { skill: 'Problem Solving', score: 85 },
  { skill: 'Communication', score: 78 },
  { skill: 'System Design', score: 68 },
  { skill: 'Data Structures', score: 88 },
  { skill: 'Confidence', score: 72 },
  { skill: 'Clarity', score: 82 },
  { skill: 'Technical Depth', score: 76 },
];

const topicData = [
  { topic: 'DSA', attempted: 18, avgScore: 84 },
  { topic: 'System Design', attempted: 8, avgScore: 67 },
  { topic: 'React/Frontend', attempted: 12, avgScore: 91 },
  { topic: 'Node.js/Backend', attempted: 6, avgScore: 76 },
  { topic: 'HR Behavioral', attempted: 9, avgScore: 80 },
  { topic: 'Database/SQL', attempted: 5, avgScore: 72 },
];

const milestones = [
  { text: 'First interview completed', date: 'Jan 12', done: true, icon: '🎯' },
  { text: 'Scored 80%+ for the first time', date: 'Feb 3', done: true, icon: '🌟' },
  { text: '10-day practice streak', date: 'Feb 18', done: true, icon: '🔥' },
  { text: 'DSA Expert certificate earned', date: 'Mar 5', done: true, icon: '🏆' },
  { text: 'Reached Top 200 on leaderboard', date: 'Mar 22', done: true, icon: '🎖️' },
  { text: 'Complete System Design track', date: 'In progress', done: false, icon: '⏳' },
  { text: 'Score 90%+ overall average', date: 'Upcoming', done: false, icon: '🔒' },
];

const tooltipStyle = {
  contentStyle: { background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 },
  itemStyle: { color: '#94a3b8' },
};

const Analytics = () => {
  const [period, setPeriod] = useState('12w');

  const data = period === '4w' ? weeklyData.slice(-4) : period === '8w' ? weeklyData.slice(-8) : weeklyData;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Performance Analytics</h1>
          <p className="text-slate-500 mt-1">Track your growth and identify improvement areas</p>
        </div>
        <div className="glass rounded-xl p-1 flex gap-1">
          {['4w', '8w', '12w'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === p ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Last {p}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Overall Avg', value: '78%', delta: '+23%', icon: '📈', color: 'text-green-400' },
          { label: 'Communication', value: '80%', delta: '+40%', icon: '💬', color: 'text-brand-400' },
          { label: 'Technical', value: '83%', delta: '+35%', icon: '🧠', color: 'text-purple-400' },
          { label: 'Confidence', value: '71%', delta: '+37%', icon: '💪', color: 'text-yellow-400' },
          { label: 'Interviews', value: '47', delta: 'total', icon: '🎤', color: 'text-cyan-400' },
        ].map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl">{m.icon}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white/5 ${m.color}`}>{m.delta}</span>
            </div>
            <div className={`text-2xl font-bold ${m.color} mb-1`}>{m.value}</div>
            <div className="text-xs text-slate-500">{m.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Score Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-2 glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-1">Score Progression</h3>
          <p className="text-sm text-slate-500 mb-5">All metrics tracked over time</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data}>
              <defs>
                {[
                  { id: 'total', color: '#5b68f3' },
                  { id: 'comm', color: '#22c55e' },
                  { id: 'tech', color: '#a78bfa' },
                ].map(({ id, color }) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="week" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="score" stroke="#5b68f3" strokeWidth={2} fill="url(#total)" name="Overall" />
              <Area type="monotone" dataKey="communication" stroke="#22c55e" strokeWidth={1.5} fill="url(#comm)" name="Communication" />
              <Area type="monotone" dataKey="technical" stroke="#a78bfa" strokeWidth={1.5} fill="url(#tech)" name="Technical" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-1">Skills Radar</h3>
          <p className="text-sm text-slate-500 mb-4">Current skill distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: '#475569', fontSize: 9 }} />
              <Radar name="Score" dataKey="score" stroke="#5b68f3" fill="#5b68f3" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Topic Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-1">Topic Performance</h3>
          <p className="text-sm text-slate-500 mb-5">Scores by interview topic</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topicData} layout="vertical" margin={{ left: 60, right: 20 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="topic" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="avgScore" name="Avg Score" fill="#5b68f3" radius={[0, 4, 4, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Milestones */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-5">Achievement Timeline</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {milestones.map((m, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl text-sm ${m.done ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-base ${m.done ? 'bg-brand-500/20' : 'glass'}`}>
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium ${m.done ? 'text-white' : 'text-slate-500'} truncate`}>{m.text}</div>
                  <div className="text-xs text-slate-600">{m.date}</div>
                </div>
                {m.done && <div className="text-green-400 text-xs">✓</div>}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Speaking Analysis */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-6">Communication Analysis</h3>
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Speaking Speed', value: '142 WPM', target: '130-150 WPM', good: true, icon: '⏱️', desc: 'Optimal pace for interviews' },
            { label: 'Filler Words', value: '3.2%', target: '<5%', good: true, icon: '💬', desc: '"Um", "Uh", "Like" usage rate' },
            { label: 'Answer Length', value: '~3.5 min', target: '2-4 min', good: true, icon: '📏', desc: 'Avg per question (STAR method)' },
            { label: 'Pause Ratio', value: '12%', target: '10-15%', good: true, icon: '⏸️', desc: 'Natural pauses in speech' },
          ].map((item, i) => (
            <div key={i} className="glass rounded-2xl p-4 text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className={`text-xl font-bold mb-1 ${item.good ? 'text-green-400' : 'text-red-400'}`}>{item.value}</div>
              <div className="text-xs font-medium text-white mb-1">{item.label}</div>
              <div className="text-xs text-slate-600 mb-2">{item.desc}</div>
              <div className={`text-xs px-2 py-1 rounded-full inline-block ${item.good ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                Target: {item.target}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
