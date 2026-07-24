import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, BarChart3, Brain, FileText, Database,
  Upload, TrendingUp, Activity, Zap, Target, GitBranch,
  LogOut, User
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <BarChart3 />
          <span>BI Dashboard</span>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <div className="sidebar-section-title">Dashboard</div>
            <NavLink to="/dashboard" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard /> Overview
            </NavLink>
            <NavLink to="/dashboard/activity" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Activity /> Activity Analysis
            </NavLink>
            <NavLink to="/dashboard/focus" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Target /> Focus Analysis
            </NavLink>
            <NavLink to="/dashboard/energy" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Zap /> Energy Analysis
            </NavLink>
            <NavLink to="/dashboard/kpis" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <TrendingUp /> KPI Dashboard
            </NavLink>
            <NavLink to="/dashboard/correlations" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <GitBranch /> Correlations
            </NavLink>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-title">Data</div>
            <NavLink to="/dashboard/datasets" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Database /> Datasets
            </NavLink>
            <NavLink to="/dashboard/analysis" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <BarChart3 /> BI Analysis
            </NavLink>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-title">Intelligence</div>
            <NavLink to="/dashboard/mining" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Brain /> Data Mining
            </NavLink>
            <NavLink to="/dashboard/clustering" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <GitBranch /> Clustering
            </NavLink>
            <NavLink to="/dashboard/reporting" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FileText /> Reporting
            </NavLink>
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '12px' }}>{user?.username}</div>
              <div style={{ fontSize: '10px', opacity: 0.6 }}>{user?.role}</div>
            </div>
          </div>
          <button onClick={handleLogout}>
            <LogOut size={12} style={{ marginRight: 4 }} /> Sign Out
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
