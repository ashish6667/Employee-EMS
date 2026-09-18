import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import EmployeeManager from './components/EmployeeManager';
import DepartmentsView from './components/DepartmentsView';
import PayrollView from './components/PayrollView';
import AuditLogsView from './components/AuditLogsView';
import CommandPalette from './components/CommandPalette';
import api from './services/api';

const MainContent = ({ activeView, setActiveView, isAddModalOpen, setIsAddModalOpen }) => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('login');

  if (loading) {
    return (
      <div className="main-content">
        <div className="auth-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem auto', width: '32px', height: '32px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Authenticating Enterprise Session...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <main className="main-content">
        {activeView === 'employees' && (
          <EmployeeManager 
            isAddModalOpenFromParent={isAddModalOpen} 
            onCloseParentAddModal={() => setIsAddModalOpen(false)}
          />
        )}
        {activeView === 'departments' && (
          <DepartmentsView setActiveView={setActiveView} />
        )}
        {activeView === 'payroll' && (
          <PayrollView setActiveView={setActiveView} />
        )}
        {activeView === 'audit' && (
          <AuditLogsView />
        )}
        {activeView === 'dashboard' && (
          <Dashboard 
            setActiveView={setActiveView} 
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}
      </main>
    );
  }

  return (
    <main className="main-content">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="tab-switcher">
            <button
              className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Sign In
            </button>
            <button
              className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => setActiveTab('signup')}
            >
              Create Account
            </button>
          </div>

          {activeTab === 'login' ? (
            <Login switchToSignup={() => setActiveTab('signup')} />
          ) : (
            <Signup switchToLogin={() => setActiveTab('login')} />
          )}
        </div>
      </div>
    </main>
  );
};

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('ems_theme') || 'light');
  const [employeesList, setEmployeesList] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ems_theme', theme);
  }, [theme]);

  useEffect(() => {
    // Fetch employee list for Command Palette quick search
    const fetchEmpList = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await api.get('/employees');
          setEmployeesList(res.data);
        }
      } catch (err) {
        // Silent fail
      }
    };
    fetchEmpList();
  }, [activeView]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleExportCsv = async () => {
    try {
      const response = await api.get('/employees/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `employees_report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('CSV Export failed', err);
    }
  };

  return (
    <AuthProvider>
      <div className="app-container">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>

        <Navbar 
          activeView={activeView} 
          setActiveView={setActiveView}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <MainContent 
          activeView={activeView} 
          setActiveView={setActiveView} 
          isAddModalOpen={isAddModalOpen}
          setIsAddModalOpen={setIsAddModalOpen}
        />

        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          setActiveView={setActiveView}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          handleExportCsv={handleExportCsv}
          toggleTheme={toggleTheme}
          currentTheme={theme}
          employees={employeesList}
        />

        <footer className="footer">
          <p>© 2026 ASP.NET Core 10 Web API + MySQL + React Enterprise CMS System • Version 3.5.0 Enterprise Pro</p>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;
