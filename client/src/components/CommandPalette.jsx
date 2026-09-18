import React, { useState, useEffect } from 'react';
import {
  Search,
  LayoutDashboard,
  Users,
  Building2,
  DollarSign,
  Terminal,
  UserPlus,
  Download,
  Moon,
  Sun,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const CommandPalette = ({ isOpen, onClose, setActiveView, onOpenAddModal, handleExportCsv, toggleTheme, currentTheme, employees = [] }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filtered employees for quick jump
  const matchedEmployees = query.trim()
    ? employees.filter((e) =>
        (e.fullName || '').toLowerCase().includes(query.toLowerCase()) ||
        (e.department || '').toLowerCase().includes(query.toLowerCase()) ||
        (e.position || '').toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : [];

  const handleAction = (action) => {
    action();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 2000, padding: '1rem' }}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 640, borderRadius: 16, padding: '1.25rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>
          <Search size={20} className="text-accent" />
          <input
            type="text"
            autoFocus
            className="search-input"
            style={{ border: 'none', boxShadow: 'none', fontSize: '1.1rem', paddingLeft: 0 }}
            placeholder="Type a command or search employees (Ctrl+K)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ maxHeight: 380, overflowY: 'auto', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Matched Employees */}
          {matchedEmployees.length > 0 && (
            <div>
              <div className="panel-subtitle" style={{ marginBottom: '0.5rem' }}>Matching Workforce Records</div>
              {matchedEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="action-btn"
                  onClick={() => handleAction(() => setActiveView('employees'))}
                  style={{ justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="avatar-sm" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                      {emp.firstName?.[0]}{emp.lastName?.[0]}
                    </div>
                    <div>
                      <div className="font-bold">{emp.fullName}</div>
                      <small className="text-muted">{emp.position} • {emp.department}</small>
                    </div>
                  </div>
                  <ArrowRight size={14} className="action-arrow" />
                </div>
              ))}
            </div>
          )}

          {/* Navigation Commands */}
          <div>
            <div className="panel-subtitle" style={{ marginBottom: '0.5rem' }}>Modules Navigation</div>
            <div className="action-btn" onClick={() => handleAction(() => setActiveView('dashboard'))}>
              <LayoutDashboard size={18} className="text-accent" />
              <span>Go to Executive Dashboard</span>
            </div>

            <div className="action-btn" onClick={() => handleAction(() => setActiveView('employees'))}>
              <Users size={18} className="text-blue" />
              <span>Go to Workforce Directory</span>
            </div>

            <div className="action-btn" onClick={() => handleAction(() => setActiveView('departments'))}>
              <Building2 size={18} className="text-emerald" />
              <span>Go to Department Management</span>
            </div>

            <div className="action-btn" onClick={() => handleAction(() => setActiveView('payroll'))}>
              <DollarSign size={18} className="text-purple" />
              <span>Go to Payroll & Compensation</span>
            </div>

            <div className="action-btn" onClick={() => handleAction(() => setActiveView('audit'))}>
              <Terminal size={18} className="text-rose" />
              <span>Go to Audit Logs & Telemetry</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="panel-subtitle" style={{ margin: '0.5rem 0' }}>Quick System Actions</div>
            <div className="action-btn" onClick={() => handleAction(() => { onOpenAddModal(); setActiveView('employees'); })}>
              <UserPlus size={18} className="text-emerald" />
              <span>Register New Employee</span>
            </div>

            {handleExportCsv && (
              <div className="action-btn" onClick={() => handleAction(handleExportCsv)}>
                <Download size={18} className="text-purple" />
                <span>Export Directory CSV Report</span>
              </div>
            )}

            <div className="action-btn" onClick={() => handleAction(toggleTheme)}>
              {currentTheme === 'dark' ? <Sun size={18} className="text-amber" /> : <Moon size={18} className="text-purple" />}
              <span>Switch to {currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
          </div>
        </div>

        <div style={{ paddingTop: '0.85rem', marginTop: '0.85rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>Press <strong>ESC</strong> to exit</span>
          <span>Enterprise Command Palette v3.0</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
