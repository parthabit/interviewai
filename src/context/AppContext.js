import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  const toggleTheme = useCallback(() => {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      return next;
    });
  }, []);

  const [user] = useState({
    name: 'Arjun Sharma', email: 'arjun.sharma@gmail.com', role: 'student',
    plan: 'Pro', joinDate: 'Jan 2025', streak: 14, totalInterviews: 47,
    avgScore: 78, certificates: 3, rank: 142,
    college: 'IIT Bombay', targetRole: 'Software Engineer',
    targetCompanies: ['Google', 'Microsoft', 'Flipkart'],
  });
  const [currentPage, setCurrentPage] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New AI interview feature unlocked!', time: '2m ago', read: false, type: 'feature' },
    { id: 2, text: 'Your resume score improved by 12 points', time: '1h ago', read: false, type: 'resume' },
    { id: 3, text: 'Daily challenge: System Design', time: '3h ago', read: true, type: 'challenge' },
    { id: 4, text: 'Certificate ready: JavaScript Expert', time: '1d ago', read: true, type: 'certificate' },
  ]);
  const [interviewHistory] = useState([
    { id: 1, type: 'Technical', topic: 'Data Structures & Algorithms', score: 82, date: '2025-05-10', duration: '45 min', status: 'completed', company: 'Google' },
    { id: 2, type: 'HR', topic: 'Behavioral Interview', score: 74, date: '2025-05-08', duration: '30 min', status: 'completed', company: 'Microsoft' },
    { id: 3, type: 'Technical', topic: 'System Design', score: 68, date: '2025-05-05', duration: '60 min', status: 'completed', company: 'Amazon' },
    { id: 4, type: 'Technical', topic: 'React & Frontend', score: 91, date: '2025-05-02', duration: '40 min', status: 'completed', company: 'Flipkart' },
    { id: 5, type: 'HR', topic: 'Leadership & Culture Fit', score: 85, date: '2025-04-29', duration: '25 min', status: 'completed', company: 'Infosys' },
    { id: 6, type: 'Technical', topic: 'Node.js & Backend', score: 77, date: '2025-04-25', duration: '50 min', status: 'completed', company: 'Wipro' },
  ]);

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);
  const navigate = useCallback((page) => { setCurrentPage(page); window.scrollTo(0, 0); }, []);
  const login = useCallback(() => { setIsAuthenticated(true); setCurrentPage('dashboard'); }, []);
  const logout = useCallback(() => { setIsAuthenticated(false); setCurrentPage('landing'); }, []);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, user, currentPage, navigate,
      isAuthenticated, login, logout,
      notifications, markNotificationRead, interviewHistory,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
