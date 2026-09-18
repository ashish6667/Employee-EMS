import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  LogOut,
  User as UserIcon,
  Users,
  LayoutDashboard,
  Building2,
  DollarSign,
  Terminal,
  Calendar,
  Search,
  Bell,
  Sun,
  Moon
} from 'lucide-react';
import NotificationDrawer from './NotificationDrawer';

const Navbar = ({ activeView, setActiveView, onOpenCommandPalette, theme, toggleTheme }) => {
  const { user, logout } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header className="navbar" style={{ position: 'relative' }}>
      <a href="#" className="brand">
        <div className="brand-icon">
          <ShieldCheck size={22} />
        </div>
        AuthPortal & Enterprise CMS
      </a>

      {user && (
        <nav className="nav-links">
          <button
            className={`nav-tab ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button
            className={`nav-tab ${activeView === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveView('employees')}
          >
            <Users size={18} />
            Workforce Directory
          </button>
          <button
            className={`nav-tab ${activeView === 'departments' ? 'active' : ''}`}
            onClick={() => setActiveView('departments')}
          >
            <Building2 size={18} />
            Departments
          </button>
          <button
            className={`nav-tab ${activeView === 'payroll' ? 'active' : ''}`}
            onClick={() => setActiveView('payroll')}
          >
            <DollarSign size={18} />
            Payroll & Pay Bands
          </button>
          <button
            className={`nav-tab ${activeView === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveView('audit')}
          >
            <Terminal size={18} />
            Audit Logs
          </button>
        </nav>
      )}

      {user && (
        <div className="nav-user">
          {/* Command Palette Trigger */}
          <button
            className="action-btn"
            onClick={onOpenCommandPalette}
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            title="Open Command Palette (Ctrl+K)"
          >
            <Search size={15} />
            <span>Search (Ctrl+K)</span>
          </button>

          {/* Theme Switcher */}
          <button
            className="icon-btn-sm"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            style={{ padding: '0.55rem' }}
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber" /> : <Moon size={18} className="text-purple" />}
          </button>

          {/* Notifications Drawer Toggle */}
          <div style={{ position: 'relative' }}>
            <button
              className="icon-btn-sm"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              title="System Notifications"
              style={{ padding: '0.55rem', position: 'relative' }}
            >
              <Bell size={18} />
              <span
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  background: '#ef4444',
                  borderRadius: '50%'
                }}
              />
            </button>
            <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          <div className="nav-date-pill">
            <Calendar size={15} />
            <span>{todayDate}</span>
          </div>

          <div className="user-badge">
            <UserIcon size={16} />
            <span>{user.fullName}</span>
          </div>

          <button onClick={logout} className="btn-logout" title="Sign out of account">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
