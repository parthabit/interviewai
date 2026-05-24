import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { id: 'dashboard',   icon: '⬡',  label: 'Dashboard'      },
  { id: 'interview',   icon: '🎤', label: 'AI Interview'    },
  { id: 'resume',      icon: '📄', label: 'Resume Analyzer' },
  { id: 'analytics',   icon: '📊', label: 'Analytics'       },
  { id: 'leaderboard', icon: '🏆', label: 'Leaderboard'     },
  { id: 'certificate', icon: '🎓', label: 'Certificates'    },
  { id: 'admin',       icon: '⚙️', label: 'Admin Panel'     },
  { id: 'settings',    icon: '👤', label: 'Profile'         },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { currentPage, navigate, user, logout, theme } = useApp();
  const isDark = theme === 'dark';
  const sidebarBg = isDark ? 'rgba(8,13,26,0.97)' : 'rgba(238,242,255,0.97)';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(91,104,243,0.15)';

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-full z-40 flex flex-col"
      style={{ background: sidebarBg, backdropFilter: 'blur(20px)', borderRight: `1px solid ${borderColor}` }}
    >
      <div className="flex items-center gap-3 p-5" style={{ borderBottom: `1px solid ${borderColor}` }}>
        <div className="w-9 h-9 rounded-xl animated-gradient flex items-center justify-center flex-shrink-0 shadow-glow">
          <span className="text-white font-bold text-sm">AI</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>InterviewAI</div>
              <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Smart Interview Platform</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = currentPage === item.id;
          return (
            <button key={item.id} onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left sidebar-item ${active ? 'active' : ''}`}>
              <span className="text-lg w-6 flex-shrink-0 text-center">{item.icon}</span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap">{item.label}</motion.span>
                )}
              </AnimatePresence>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />}
            </button>
          );
        })}
      </nav>

      <div className="p-3 space-y-2" style={{ borderTop: `1px solid ${borderColor}` }}>
        <button onClick={() => navigate('settings')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-white/5 transition-all">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
            {user.name.charAt(0)}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                <div className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{user.name}</div>
                <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{user.plan} Plan</div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all text-sm">
          <span className="text-base w-6 text-center">🚪</span>
          <AnimatePresence>
            {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Sign Out</motion.span>}
          </AnimatePresence>
        </button>
        <button onClick={() => setCollapsed(c => !c)} className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all text-xs ${isDark ? 'text-slate-600 hover:text-slate-400 hover:bg-white/5' : 'text-slate-400 hover:text-slate-600 hover:bg-black/5'}`}>
          {collapsed ? '→' : '← Collapse'}
        </button>
      </div>
    </motion.aside>
  );
};

const TopBar = () => {
  const { user, navigate, notifications, markNotificationRead, theme, toggleTheme } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);
  const unread = notifications.filter(n => !n.read).length;
  const isDark = theme === 'dark';
  const barBg = isDark ? 'rgba(8,13,26,0.85)' : 'rgba(238,242,255,0.92)';
  const borderColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(91,104,243,0.12)';

  return (
    <header className="h-16 flex items-center justify-between px-6" style={{ borderBottom: `1px solid ${borderColor}`, background: barBg, backdropFilter: 'blur(10px)' }}>
      <div className="glass rounded-xl px-4 py-2 flex items-center gap-2 w-64">
        <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>🔍</span>
        <input placeholder="Search interviews, topics..." className="bg-transparent text-sm placeholder-slate-500 outline-none w-full" style={{ color: isDark ? '#cbd5e1' : '#334155' }} />
      </div>

      <div className="flex items-center gap-3">
        <div className="glass rounded-xl px-3 py-1.5 flex items-center gap-2">
          <span>🔥</span>
          <span className="text-sm font-semibold text-orange-400">{user.streak}</span>
          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>day streak</span>
        </div>

        {/* Theme toggle */}
        <button onClick={toggleTheme} className="glass w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all" title="Toggle theme">
          <span className="text-base">{isDark ? '☀️' : '🌙'}</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotifs(s => !s)} className="glass w-10 h-10 rounded-xl flex items-center justify-center relative hover:bg-white/10 transition-all">
            <span>🔔</span>
            {unread > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 rounded-full text-xs flex items-center justify-center text-white font-bold">{unread}</span>}
          </button>
          <AnimatePresence>
            {showNotifs && (
              <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 glass-card rounded-2xl overflow-hidden z-50">
                <div className={`p-4 border-b ${isDark ? 'border-white/5' : 'border-black/5'}`}><div className="text-sm font-semibold" style={{ color: isDark ? '#fff' : '#1e293b' }}>Notifications</div></div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <button key={n.id} onClick={() => { markNotificationRead(n.id); setShowNotifs(false); }}
                      className={`w-full text-left p-4 hover:bg-white/5 transition-all border-b ${isDark ? 'border-white/3' : 'border-black/3'} ${!n.read ? 'bg-brand-500/5' : ''}`}>
                      <div className="text-sm" style={{ color: isDark ? '#e2e8f0' : '#334155' }}>{n.text}</div>
                      <div className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{n.time}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button onClick={() => navigate('settings')} className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center font-bold text-white text-sm">
          {user.name.charAt(0)}
        </button>
      </div>
    </header>
  );
};

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : ''}`} style={!isDark ? { background: '#f0f4ff' } : {}}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-brand-500/5' : 'bg-brand-500/8'}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-purple-500/5' : 'bg-purple-500/6'}`} />
      </div>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex flex-col min-h-screen transition-all duration-300" style={{ marginLeft: collapsed ? 72 : 260 }}>
        <TopBar />
        <main className="flex-1 p-6 relative z-10">
          <motion.div key={children?.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
