import React from 'react';
import { Bell, CheckCircle2, AlertCircle, Info, ShieldCheck, X } from 'lucide-react';

const NOTIFICATIONS = [
  { id: 1, title: 'System Security Sync', desc: 'JWT session key renewed & validated', time: '10m ago', type: 'success' },
  { id: 2, title: 'Database Pool Connected', desc: 'ASP.NET Core API established connection with MySQL', time: '25m ago', type: 'info' },
  { id: 3, title: 'Workforce Telemetry Active', desc: 'Live department headcount & payroll metrics updated', time: '1h ago', type: 'success' },
  { id: 4, title: 'Audit Engine Ready', desc: 'Enterprise audit logger tracking user actions', time: '2h ago', type: 'info' }
];

const NotificationDrawer = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '60px',
        right: '180px',
        width: '360px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-modal)',
        zIndex: 1500,
        padding: '1.25rem',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem' }}>
          <Bell size={18} className="text-accent" />
          <span>System Alerts</span>
          <span className="count-pill" style={{ fontSize: '0.75rem', padding: '0.15rem 0.6rem' }}>4 New</span>
        </div>
        <button className="modal-close" onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {NOTIFICATIONS.map((n) => (
          <div
            key={n.id}
            style={{
              padding: '0.85rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start'
            }}
          >
            {n.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald" style={{ marginTop: 2 }} />
            ) : (
              <Info size={18} className="text-accent" style={{ marginTop: 2 }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700 }}>
                <span>{n.title}</span>
                <small style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{n.time}</small>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationDrawer;
