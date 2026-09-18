import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogOut, User as UserIcon, Users, LayoutDashboard } from 'lucide-react';

const Navbar = ({ activeView, setActiveView }) => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <a href="#" className="brand">
        <div className="brand-icon">
          <ShieldCheck size={20} />
        </div>
        AuthPortal & EMS
      </a>

      {user && (
        <nav className="nav-links">
          <button
            className={`nav-tab ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>
          <button
            className={`nav-tab ${activeView === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveView('employees')}
          >
            <Users size={16} />
            Employee Management
          </button>
        </nav>
      )}

      {user && (
        <div className="nav-user">
          <div className="user-badge">
            <UserIcon size={14} />
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
