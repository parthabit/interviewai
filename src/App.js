import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import InterviewRoom from './pages/InterviewRoom';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Analytics from './pages/Analytics';
import Leaderboard from './pages/Leaderboard';
import AdminPanel from './pages/AdminPanel';
import Settings from './pages/Settings';
import CertificatePage from './pages/CertificatePage';

const pageMap = {
  dashboard: Dashboard, interview: InterviewRoom, resume: ResumeAnalyzer,
  analytics: Analytics, leaderboard: Leaderboard, admin: AdminPanel,
  settings: Settings, certificate: CertificatePage,
};

const AppContent = () => {
  const { currentPage, isAuthenticated, theme } = useApp();

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('dark', 'light');
    html.classList.add(theme);
  }, [theme]);

  if (currentPage === 'landing') return <LandingPage />;
  if (currentPage === 'login' || !isAuthenticated) return <LoginPage />;
  const Page = pageMap[currentPage] || Dashboard;
  return <Layout><Page key={currentPage} /></Layout>;
};

export default function App() {
  return <AppProvider><AppContent /></AppProvider>;
}
