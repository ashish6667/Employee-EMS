import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  PieChart,
  UserCheck,
  Award,
  ArrowRight,
  Plus,
  BarChart3,
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const DEPT_METADATA = {
  Engineering: { lead: 'Alex Vance', iconColor: 'icon-blue', description: 'Software Architecture, Cloud & Infrastructure Dev' },
  HR: { lead: 'Elena Rostova', iconColor: 'icon-purple', description: 'Workforce Planning, Talent Acquisition & Employee Relations' },
  Finance: { lead: 'Marcus Chen', iconColor: 'icon-emerald', description: 'Fiscal Planning, Accounting, Corporate Tax & Audit' },
  Marketing: { lead: 'Sophia Martinez', iconColor: 'icon-amber', description: 'Global Brand Strategy, Product Marketing & PR' },
  Sales: { lead: 'David Wright', iconColor: 'icon-blue', description: 'Enterprise Sales, Client Relations & Revenue Ops' },
  IT: { lead: 'Rachel Kim', iconColor: 'icon-purple', description: 'Internal Network Infrastructure, Security & Helpdesk' }
};

const DepartmentsView = ({ setActiveView }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/employees/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load department analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const departmentList = stats?.departmentStats || [];
  const totalEmployees = stats?.totalEmployees || 1;

  return (
    <div className="dashboard-container">
      {/* Module Header Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <div className="welcome-badge">
            <Building2 size={14} />
            <span>Enterprise CMS • Department Management</span>
          </div>
          <h2>Department Allocation & Team Telemetry</h2>
          <p>Manage organizational structure, department budgets, headcount ratios, and team leadership.</p>
        </div>
        <div className="welcome-actions">
          <button className="btn btn-primary" onClick={() => setActiveView('employees')}>
            <Users size={16} />
            Manage Employees
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Active Departments</span>
            <div className="kpi-icon icon-purple">
              <Building2 size={22} />
            </div>
          </div>
          <div className="kpi-value">{loading ? '...' : departmentList.length}</div>
          <div className="kpi-footer text-purple">
            <span>Core operational divisions</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Headcount</span>
            <div className="kpi-icon icon-blue">
              <Users size={22} />
            </div>
          </div>
          <div className="kpi-value">{loading ? '...' : totalEmployees}</div>
          <div className="kpi-footer text-emerald">
            <span>Across all business units</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Cumulative Department Budget</span>
            <div className="kpi-icon icon-emerald">
              <DollarSign size={22} />
            </div>
          </div>
          <div className="kpi-value">{loading ? '...' : formatCurrency(stats?.totalMonthlyPayroll)}</div>
          <div className="kpi-footer text-emerald">
            <span>Approved annual payroll</span>
          </div>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="dash-card">
        <div className="dash-card-header">
          <div className="dash-card-title">
            <BarChart3 size={20} className="text-accent" />
            <h3>Department Metrics & Performance Breakdown</h3>
          </div>
        </div>

        {loading ? (
          <div className="loading-state-card" style={{ padding: '3rem' }}>
            <div className="spinner-large" />
            <p>Loading department telemetry...</p>
          </div>
        ) : (
          <div className="employee-cards-grid">
            {departmentList.map((dept) => {
              const meta = DEPT_METADATA[dept.department] || {
                lead: 'Department Lead',
                iconColor: 'icon-blue',
                description: 'Operational business unit & team allocation'
              };
              const percentage = Math.round((dept.count / totalEmployees) * 100);
              const avgSalary = dept.count > 0 ? dept.totalSalary / dept.count : 0;

              return (
                <div key={dept.department} className="employee-card">
                  <div className="card-top-row">
                    <div className={`kpi-icon ${meta.iconColor}`} style={{ width: 44, height: 44, borderRadius: 12 }}>
                      <Building2 size={22} />
                    </div>
                    <span className="badge-status badge-status-active">
                      {dept.count} {dept.count === 1 ? 'Member' : 'Members'}
                    </span>
                  </div>

                  <div className="card-body">
                    <h3 className="emp-name" style={{ cursor: 'default' }}>
                      {dept.department} Division
                    </h3>
                    <p className="emp-position" style={{ marginBottom: '0.75rem' }}>
                      {meta.description}
                    </p>

                    <div className="card-meta" style={{ gap: '0.75rem' }}>
                      <div className="meta-row">
                        <UserCheck size={16} className="meta-icon text-accent" />
                        <span className="meta-text font-semibold">Lead: {meta.lead}</span>
                      </div>

                      <div className="meta-row">
                        <DollarSign size={16} className="meta-icon text-purple" />
                        <span className="meta-text text-purple font-bold">
                          Budget: {formatCurrency(dept.totalSalary)} / yr
                        </span>
                      </div>

                      <div className="meta-row">
                        <TrendingUp size={16} className="meta-icon text-emerald" />
                        <span className="meta-text text-emerald font-semibold">
                          Avg Salary: {formatCurrency(avgSalary)}
                        </span>
                      </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Workforce Share</span>
                        <span style={{ color: 'var(--text-primary)' }}>{percentage}%</span>
                      </div>
                      <div className="dept-bar-container">
                        <div className="dept-bar-fill" style={{ width: `${Math.max(percentage, 10)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentsView;
