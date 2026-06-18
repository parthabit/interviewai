import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const performanceData = [
  { week: 'W1', score: 55 }, { week: 'W2', score: 62 }, { week: 'W3', score: 58 },
  { week: 'W4', score: 74 }, { week: 'W5', score: 68 }, { week: 'W6', score: 80 },
  { week: 'W7', score: 76 }, { week: 'W8', score: 82 }, { week: 'W9', score: 78 },
  { week: 'W10', score: 88 }, { week: 'W11', score: 85 }, { week: 'W12', score: 91 },
];

const dailyChallenge = {
  topic: 'System Design',
  question: 'Design a URL shortening service like bit.ly. How would you handle 100M URLs with low latency?',
  difficulty: 'Hard',
  points: 150,
  timeLeft: '14h 23m',
  participants: 1247,
};

const roadmap = [
  { title: 'DSA Fundamentals', progress: 100, status: 'done', topics: ['Arrays', 'Strings', 'Trees', 'Graphs'] },
  { title: 'System Design Basics', progress: 75, status: 'active', topics: ['Caching', 'Load Balancing', 'Databases'] },
  { title: 'Behavioral Interviews', progress: 60, status: 'active', topics: ['STAR Method', 'Leadership', 'Conflict Resolution'] },
  { title: 'Company-Specific Prep', progress: 20, status: 'locked', topics: ['Google', 'Microsoft', 'Amazon', 'Flipkart'] },
  { title: 'Mock Interview Rounds', progress: 0, status: 'locked', topics: ['Technical Round 1', 'Technical Round 2', 'HR Round'] },
];

const recommended = [
  { q: 'Explain the difference between TCP and UDP', type: 'Technical', difficulty: 'Medium', company: 'Google' },
  { q: 'Tell me about a time you resolved a conflict at work', type: 'HR', difficulty: 'Easy', company: 'Microsoft' },
  { q: 'Design a notification system for 100M users', type: 'System Design', difficulty: 'Hard', company: 'Amazon' },
  { q: 'Implement LRU Cache from scratch', type: 'Technical', difficulty: 'Medium', company: 'Flipkart' },
];

const MetricCard = ({ icon, label, value, sub, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="metric-card"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
      <span className="text-xs text-slate-600 bg-white/5 px-2 py-1 rounded-full">{sub}</span>
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-slate-500">{label}</div>
  </motion.div>
);

const Dashboard = () => {
  const { user, interviewHistory, navigate } = useApp();

  const diffColor = (d) => d === 'Easy' ? 'text-green-400' : d === 'Medium' ? 'text-yellow-400' : 'text-red-400';
  const scoreColor = (s) => s >= 80 ? 'text-green-400' : s >= 65 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Good morning, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-slate-500 mt-1">You're on a <span className="text-orange-400 font-semibold">🔥 {user.streak}-day streak</span> · Keep it up!</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('interview')} className="btn-primary flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm">
            <span>🎤</span> Start Interview
          </button>
          <button onClick={() => navigate('resume')} className="btn-secondary flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm">
            <span>📄</span> Upload Resume
          </button>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon="🎤" label="Total Interviews" value={user.totalInterviews} sub="All time" color="bg-brand-500/20" delay={0.1} />
        <MetricCard icon="📈" label="Average Score" value={`${user.avgScore}%`} sub="+5% this week" color="bg-green-500/20" delay={0.15} />
        <MetricCard icon="🏆" label="Global Rank" value={`#${user.rank}`} sub="Top 3%" color="bg-yellow-500/20" delay={0.2} />
        <MetricCard icon="🎓" label="Certificates" value={user.certificates} sub="Earned" color="bg-purple-500/20" delay={0.25} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Performance Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-white">Performance Trend</h3>
              <p className="text-sm text-slate-500">12-week score history</p>
            </div>
            <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
              <span>↑ 36 pts improvement</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5b68f3" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5b68f3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="week" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }}
                formatter={(v) => [`${v}%`, 'Score']}
              />
              <Area type="monotone" dataKey="score" stroke="#5b68f3" strokeWidth={2} fill="url(#scoreGrad)" dot={{ fill: '#5b68f3', r: 3, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Daily Challenge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              ⚡ Daily Challenge
            </div>
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">{dailyChallenge.timeLeft} left</span>
          </div>

          <div className="flex-1">
            <span className={`text-xs px-2 py-1 rounded-full font-medium mb-3 inline-block ${dailyChallenge.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              {dailyChallenge.difficulty}
            </span>
            <div className="text-xs text-brand-400 font-semibold mb-2">{dailyChallenge.topic}</div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">{dailyChallenge.question}</p>

            <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
              <span>👥 {dailyChallenge.participants.toLocaleString()} practicing</span>
              <span>🏅 +{dailyChallenge.points} pts</span>
            </div>
          </div>

          <button onClick={() => navigate('interview')} className="btn-primary w-full py-3 rounded-xl text-sm">
            Accept Challenge
          </button>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Interviews */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">Recent Interviews</h3>
            <button onClick={() => navigate('analytics')} className="text-xs text-brand-400 hover:text-brand-300 transition-colors">View all →</button>
          </div>
          <div className="space-y-3">
            {interviewHistory.slice(0, 4).map((interview) => (
              <div key={interview.id} className="flex items-center gap-3 p-3 glass rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${interview.type === 'Technical' ? 'bg-brand-500/20' : 'bg-purple-500/20'}`}>
                  {interview.type === 'Technical' ? '💻' : '🗣️'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{interview.topic}</div>
                  <div className="text-xs text-slate-500">{interview.date} · {interview.duration}</div>
                </div>
                <div className={`text-sm font-bold ${scoreColor(interview.score)}`}>{interview.score}%</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommended Questions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">Recommended for You</h3>
            <button onClick={() => navigate('interview')} className="text-xs text-brand-400 hover:text-brand-300 transition-colors">Practice all →</button>
          </div>
          <div className="space-y-3">
            {recommended.map((q, i) => (
              <div key={i} onClick={() => navigate('interview')} className="flex items-start gap-3 p-3 glass rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 mb-1 line-clamp-1">{q.q}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">{q.type}</span>
                    <span className={`text-xs ${diffColor(q.difficulty)}`}>{q.difficulty}</span>
                    <span className="text-xs text-slate-600">{q.company}</span>
                  </div>
                </div>
                <span className="text-slate-600 group-hover:text-brand-400 transition-colors text-sm mt-0.5">→</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Placement Roadmap */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-white">Placement Roadmap</h3>
            <p className="text-sm text-slate-500">Your personalized preparation journey</p>
          </div>
          <div className="text-sm text-slate-400">
            <span className="text-white font-semibold">3</span> of 5 milestones
          </div>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {roadmap.map((item, i) => (
            <div key={i} className={`relative p-4 rounded-xl border transition-all cursor-pointer hover:border-brand-500/30 ${
              item.status === 'done' ? 'border-green-500/30 bg-green-500/5' :
              item.status === 'active' ? 'border-brand-500/30 bg-brand-500/5' :
              'border-white/5 bg-white/2 opacity-60'
            }`}>
              <div className="text-lg mb-2">
                {item.status === 'done' ? '✅' : item.status === 'active' ? '⏳' : '🔒'}
              </div>
              <div className="text-xs font-semibold text-white mb-2">{item.title}</div>
              <div className="h-1 glass rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.progress}%`,
                    background: item.status === 'done' ? '#22c55e' : item.status === 'active' ? '#5b68f3' : '#334155'
                  }}
                />
              </div>
              <div className="text-xs text-slate-500">{item.progress}%</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
