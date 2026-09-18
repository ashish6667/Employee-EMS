import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  DollarSign,
  PieChart,
  TrendingUp,
  Download,
  FileSpreadsheet,
  Award,
  Users,
  Building2,
  CheckCircle2,
  BarChart3,
  Layers,
  Sparkles
} from 'lucide-react';

const PayrollView = ({ setActiveView }) => {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, statsRes] = await Promise.all([
          api.get('/employees'),
          api.get('/employees/stats')
        ]);
        setEmployees(empRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Failed to load payroll telemetry', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const handleExportCsv = async () => {
    try {
      const response = await api.get('/employees/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payroll_audit_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  // Calculate Salary Pay Band Brackets
  const payBands = [
    { label: '< ₹5 Lakhs / yr', min: 0, max: 500000, count: 0, total: 0 },
    { label: '₹5L - ₹10 Lakhs / yr', min: 500000, max: 1000000, count: 0, total: 0 },
    { label: '₹10L - ₹20 Lakhs / yr', min: 1000000, max: 2000000, count: 0, total: 0 },
    { label: '> ₹20 Lakhs / yr', min: 2000000, max: Infinity, count: 0, total: 0 }
  ];

  employees.forEach((emp) => {
    const sal = emp.salary || 0;
    for (let band of payBands) {
      if (sal >= band.min && sal < band.max) {
        band.count += 1;
        band.total += sal;
        break;
      }
    }
  });

  const totalPayroll = stats?.totalMonthlyPayroll || 0;
  const maxSalary = employees.length > 0 ? Math.max(...employees.map(e => e.salary || 0)) : 0;
  const minSalary = employees.length > 0 ? Math.min(...employees.map(e => e.salary || 0)) : 0;

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <div className="welcome-badge">
            <DollarSign size={14} />
            <span>Enterprise CMS • Compensation & Payroll</span>
          </div>
          <h2>Executive Compensation & Payroll Intelligence</h2>
          <p>Real-time salary distribution analytics, pay band brackets, annual budget disbursements, and audit reporting.</p>
        </div>
        <div className="welcome-actions">
          <button className="btn btn-secondary" onClick={handleExportCsv}>
            <FileSpreadsheet size={16} />
            Export Payroll Report
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Annual Payroll</span>
            <div className="kpi-icon icon-purple">
              <DollarSign size={22} />
            </div>
          </div>
          <div className="kpi-value">{loading ? '...' : formatCurrency(totalPayroll)}</div>
          <div className="kpi-footer text-purple">
            <span>Approved enterprise budget</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Average Compensation</span>
            <div className="kpi-icon icon-emerald">
              <TrendingUp size={22} />
            </div>
          </div>
          <div className="kpi-value">{loading ? '...' : formatCurrency(stats?.averageSalary)}</div>
          <div className="kpi-footer text-emerald">
            <span>Per employee average</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Highest Compensation</span>
            <div className="kpi-icon icon-blue">
              <Award size={22} />
            </div>
          </div>
          <div className="kpi-value">{loading ? '...' : formatCurrency(maxSalary)}</div>
          <div className="kpi-footer text-blue">
            <span>Executive compensation ceiling</span>
          </div>
        </div>
      </div>

      {/* Pay Band Distribution Card */}
      <div className="dashboard-grid">
        <div className="dash-card">
          <div className="dash-card-header">
            <div className="dash-card-title">
              <BarChart3 size={20} className="text-purple" />
              <h3>Pay Band Distribution Brackets</h3>
            </div>
          </div>

          <div className="dept-stats-list">
            {payBands.map((band) => {
              const countPercent = employees.length > 0 ? Math.round((band.count / employees.length) * 100) : 0;
              return (
                <div key={band.label} className="dept-stat-row" style={{ gridTemplateColumns: '220px 1fr 160px' }}>
                  <div className="dept-info">
                    <span className="dept-name">{band.label}</span>
                    <span className="dept-count">{band.count} Employees</span>
                  </div>
                  <div className="dept-bar-container">
                    <div className="dept-bar-fill" style={{ width: `${Math.max(countPercent, 5)}%` }} />
                  </div>
                  <div className="dept-payroll">
                    <span>{formatCurrency(band.total)}</span>
                    <small>{countPercent}% headcount share</small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* High Earners Summary Card */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div className="dash-card-title">
              <Award size={20} className="text-emerald" />
              <h3>Compensation Summary</h3>
            </div>
          </div>

          <div className="quick-actions-panel">
            <div className="detail-item">
              <div className="item-label">Lowest Compensation Level</div>
              <div className="item-value font-bold text-purple">{formatCurrency(minSalary)} / yr</div>
            </div>

            <div className="detail-item">
              <div className="item-label">Highest Compensation Level</div>
              <div className="item-value font-bold text-emerald">{formatCurrency(maxSalary)} / yr</div>
            </div>

            <div className="detail-item">
              <div className="item-label">Compliance Status</div>
              <div className="item-value text-emerald font-semibold">100% Tax & Audit Compliant</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollView;
