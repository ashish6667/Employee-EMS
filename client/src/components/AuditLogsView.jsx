import React, { useState } from 'react';
import {
  ShieldCheck,
  Activity,
  CheckCircle2,
  Lock,
  Key,
  Server,
  Database,
  RefreshCw,
  AlertTriangle,
  Clock,
  Layers,
  Terminal
} from 'lucide-react';

const SYSTEM_LOGS = [
  { id: 'LOG-8801', timestamp: '2026-09-18 18:15:02', user: 'Admin User', event: 'JWT Security Session Authenticated', status: 'Success', severity: 'low' },
  { id: 'LOG-8802', timestamp: '2026-09-18 18:14:40', user: 'Admin User', event: 'Workforce Directory Query (MySQL EF Core)', status: 'Success', severity: 'low' },
  { id: 'LOG-8803', timestamp: '2026-09-18 18:10:15', user: 'Admin User', event: 'Employee Dossier Export (CSV Stream)', status: 'Success', severity: 'medium' },
  { id: 'LOG-8804', timestamp: '2026-09-18 18:05:22', user: 'System Telemetry', event: 'ASP.NET Core Web API Route Healthcheck', status: 'Success', severity: 'low' },
  { id: 'LOG-8805', timestamp: '2026-09-18 17:58:10', user: 'Admin User', event: 'Database Connection Pool Synced (200 OK)', status: 'Success', severity: 'low' }
];

const AuditLogsView = () => {
  const [logs, setLogs] = useState(SYSTEM_LOGS);

  return (
    <div className="dashboard-container">
      {/* Module Header Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <div className="welcome-badge">
            <ShieldCheck size={14} />
            <span>Enterprise CMS • Audit & Telemetry</span>
          </div>
          <h2>System Security, Audit Trail & Telemetry</h2>
          <p>Real-time audit logging, database health indicators, role-based access permissions, and API event telemetry.</p>
        </div>
        <div className="welcome-actions">
          <button className="btn btn-secondary" onClick={() => setLogs([...SYSTEM_LOGS])}>
            <RefreshCw size={16} />
            Refresh Telemetry
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">API Gate Status</span>
            <div className="kpi-icon icon-emerald">
              <Server size={22} />
            </div>
          </div>
          <div className="kpi-value text-emerald">ONLINE</div>
          <div className="kpi-footer text-emerald">
            <span>ASP.NET Core 10 Web API (5000)</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Database Engine</span>
            <div className="kpi-icon icon-blue">
              <Database size={22} />
            </div>
          </div>
          <div className="kpi-value text-blue">CONNECTED</div>
          <div className="kpi-footer text-blue">
            <span>MySQL EF Core Orm Cluster</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">JWT Security Policy</span>
            <div className="kpi-icon icon-purple">
              <Lock size={22} />
            </div>
          </div>
          <div className="kpi-value text-purple">ENFORCED</div>
          <div className="kpi-footer text-purple">
            <span>HMAC-SHA256 Token Encryption</span>
          </div>
        </div>
      </div>

      {/* Audit Log Table Card */}
      <div className="table-responsive-card">
        <div className="dash-card-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <div className="dash-card-title">
            <Terminal size={20} className="text-accent" />
            <h3>Real-Time Audit Trail & Access Events</h3>
          </div>
        </div>

        <table className="employee-table">
          <thead>
            <tr>
              <th>Log Event ID</th>
              <th>Timestamp</th>
              <th>Triggered By</th>
              <th>System Event Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="table-row">
                <td className="font-semibold text-purple">{log.id}</td>
                <td style={{ fontSize: '0.875rem' }}>{log.timestamp}</td>
                <td className="font-bold">{log.user}</td>
                <td>{log.event}</td>
                <td>
                  <span className="badge-status badge-status-active">
                    <CheckCircle2 size={12} /> {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogsView;
