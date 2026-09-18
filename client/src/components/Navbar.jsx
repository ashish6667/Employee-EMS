import React from 'react';
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
  Calendar
} from 'lucide-react';

const Navbar = ({ activeView, setActiveView }) => {
  const { user, logout } = useAuth();
  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header className="navbar">
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
