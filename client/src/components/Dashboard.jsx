import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  DollarSign,
  TrendingUp,
  Building2,
  FileSpreadsheet,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers
} from 'lucide-react';

const Dashboard = ({ setActiveView, onOpenAddModal }) => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const fetchStats = async () => {
    setLoadingStats(true);
    setStatsError(null);
    try {
      const res = await api.get('/employees/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
      setStatsError('Could not fetch real-time analytics data.');
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
      alert('Failed to export employee directory CSV.');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <div className="welcome-badge">
            <Sparkles size={14} />
            <span>Executive EMS Command Center</span>
          </div>
          <h2>Welcome back, {user?.fullName || 'Administrator'}!</h2>
          <p>Here is your real-time workforce telemetry and operational overview for today.</p>
        </div>
        <div className="welcome-actions">
          <button 
            className="btn btn-secondary" 
            onClick={handleExportCsv}
            title="Download CSV report of all employees"
          >
            <FileSpreadsheet size={16} />
            Export CSV
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => {
              if (onOpenAddModal) onOpenAddModal();
              setActiveView('employees');
            }}
          >
            <UserPlus size={16} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Staff</span>
            <div className="kpi-icon icon-blue">
              <Users size={20} />
            </div>
          </div>
          <div className="kpi-value">{loadingStats ? '...' : (stats?.totalEmployees ?? 0)}</div>
          <div className="kpi-footer text-muted">
            <span>Across all departments</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Active Employees</span>
            <div className="kpi-icon icon-emerald">
              <UserCheck size={20} />
            </div>
          </div>
          <div className="kpi-value">{loadingStats ? '...' : (stats?.activeEmployees ?? 0)}</div>
          <div className="kpi-footer text-emerald">
            <span>
              {stats?.totalEmployees 
                ? `${Math.round((stats.activeEmployees / stats.totalEmployees) * 100)}% of total workforce`
                : '100% operational'}
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">On Leave</span>
            <div className="kpi-icon icon-amber">
              <Clock size={20} />
            </div>
          </div>
          <div className="kpi-value">{loadingStats ? '...' : (stats?.onLeaveEmployees ?? 0)}</div>
          <div className="kpi-footer text-amber">
            <span>Scheduled temporary absence</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Annual Payroll Spend</span>
            <div className="kpi-icon icon-purple">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="kpi-value">
            {loadingStats ? '...' : formatCurrency(stats?.totalMonthlyPayroll)}
          </div>
          <div className="kpi-footer text-purple">
            <span>Avg {loadingStats ? '...' : formatCurrency(stats?.averageSalary)} / staff</span>
          </div>
        </div>
      </div>

      {/* Main Content Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Department Distribution Section */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div className="dash-card-title">
              <Building2 size={18} className="text-accent" />
              <h3>Department Allocation & Headcount</h3>
            </div>
            <button className="btn-text" onClick={() => setActiveView('employees')}>
              View Directory <ArrowRight size={14} />
            </button>
          </div>

          <div className="dept-stats-list">
            {loadingStats ? (
              <div className="loading-state">
                <div className="spinner" />
                <span>Aggregating analytics...</span>
              </div>
            ) : stats?.departmentStats?.length > 0 ? (
              stats.departmentStats.map((dept) => {
                const percentage = stats.totalEmployees > 0 
                  ? Math.round((dept.count / stats.totalEmployees) * 100)
                  : 0;
                return (
                  <div key={dept.department} className="dept-stat-row">
                    <div className="dept-info">
                      <span className="dept-name">{dept.department}</span>
                      <span className="dept-count">{dept.count} {dept.count === 1 ? 'employee' : 'employees'}</span>
                    </div>
                    <div className="dept-bar-container">
                      <div 
                        className="dept-bar-fill" 
                        style={{ width: `${Math.max(percentage, 8)}%` }} 
                      />
                    </div>
                    <div className="dept-payroll">
                      <span>{formatCurrency(dept.totalSalary)}</span>
                      <small>{percentage}%</small>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="empty-text">No department metrics available.</p>
            )}
          </div>
        </div>

        {/* User Account & Quick Actions Panel */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div className="dash-card-title">
              <ShieldCheck size={18} className="text-emerald" />
              <h3>User & System Context</h3>
            </div>
          </div>

          <div className="profile-mini-card">
            <div className="avatar-lg">{getInitials(user?.fullName)}</div>
            <div className="profile-details">
              <h4>{user?.fullName}</h4>
              <p>{user?.email}</p>
              <div className="role-tag">
                <Layers size={12} />
                <span>{user?.role || 'Administrator'}</span>
              </div>
            </div>
          </div>

          <div className="quick-actions-panel">
            <h4 className="panel-subtitle">Management Shortcuts</h4>
            <div className="action-buttons-stack">
              <button 
                className="action-btn"
                onClick={() => setActiveView('employees')}
              >
                <Users size={16} />
                <span>Browse Full Directory</span>
                <ArrowRight size={14} className="action-arrow" />
              </button>

              <button 
                className="action-btn"
                onClick={handleExportCsv}
              >
                <FileSpreadsheet size={16} />
                <span>Export Directory to CSV</span>
                <ArrowRight size={14} className="action-arrow" />
              </button>
            </div>
          </div>

          <div className="system-status-footer">
            <div className="status-badge-green">
              <span className="status-dot"></span>
              <span>ASP.NET Core Web API + MySQL Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
