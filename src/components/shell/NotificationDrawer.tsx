import React from 'react';
import { X, Check, CheckCircle2 } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useNotificationStore } from '@/stores/notificationStore';
import './Shell.css';

export const NotificationDrawer: React.FC = () => {
  const { notificationDrawerOpen, setNotificationDrawerOpen } = useUIStore();
  const { notifications, markAsRead, markAllAsRead, dismiss } = useNotificationStore();

  const handleClearAll = () => {
    notifications.forEach(n => dismiss(n.id));
  };

  const getIcon = (type?: string) => {
    switch (type) {
      case 'info': return <div style={{ color: 'var(--color-primary-500)' }}><CheckCircle2 size={18} /></div>;
      case 'warning': return <div style={{ color: 'var(--color-warning-500)' }}><CheckCircle2 size={18} /></div>;
      case 'success': return <div style={{ color: 'var(--color-success-500)' }}><Check size={18} /></div>;
      case 'error': return <div style={{ color: 'var(--color-danger-500)' }}><X size={18} /></div>;
      case 'action': return <div style={{ color: 'var(--color-purple-500)' }}><CheckCircle2 size={18} /></div>;
      default: return <div style={{ color: 'var(--color-primary-500)' }}><CheckCircle2 size={18} /></div>;
    }
  };

  const getRelativeTime = (date: string) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const diff = new Date().getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return rtf.format(-minutes, 'minute');
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return rtf.format(-hours, 'hour');
    return rtf.format(-Math.floor(hours / 24), 'day');
  };

  React.useEffect(() => {
    if (notifications.length === 0) {
      useNotificationStore.setState({
        notifications: [
          { id: 'n1', title: 'Welcome', body: 'Welcome to EduPulse', date: new Date().toISOString(), read: false, type: 'info' },
          { id: 'n2', title: 'System Update', body: 'System update completed', date: new Date(Date.now() - 3600000).toISOString(), read: false, type: 'success' },
          { id: 'n3', title: 'Payment Due', body: 'Invoice #1024 is due', date: new Date(Date.now() - 7200000).toISOString(), read: false, type: 'warning' },
          { id: 'n4', title: 'Low Attendance', body: 'Grade 9B attendance below 85%', date: new Date(Date.now() - 86400000).toISOString(), read: false, type: 'error' },
        ] as any
      });
    }
  }, []);

  if (!notificationDrawerOpen) return null;

  return (
    <>
      <div className="ep-drawer-overlay" onClick={() => setNotificationDrawerOpen(false)} />
      <div className={`ep-drawer ${notificationDrawerOpen ? 'ep-drawer--open' : ''}`}>
        <div className="ep-drawer__header">
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Notifications</h2>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button className="ep-btn ep-btn--text" onClick={handleClearAll} style={{ fontSize: 'var(--text-xs)' }}>
              Clear all
            </button>
            <button className="ep-header__icon-btn" onClick={markAllAsRead} title="Mark all as read">
              <CheckCircle2 size={18} />
            </button>
            <button className="ep-header__icon-btn" onClick={() => setNotificationDrawerOpen(false)}>
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="ep-drawer__content">
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-tertiary)' }}>
              No notifications
            </div>
          ) : (
            notifications.map(n => (
              <div 
                key={n.id} 
                onClick={() => markAsRead(n.id)}
                style={{ 
                  padding: 'var(--space-4)', 
                  borderBottom: '1px solid var(--color-border)',
                  backgroundColor: n.read ? 'transparent' : 'var(--color-primary-50)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-2)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    {getIcon((n as any).type)}
                    <h3 style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{n.title}</h3>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); dismiss(n.id); }} style={{ color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>{n.body}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-2)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                    {getRelativeTime(n.date)}
                  </span>
                  {!n.read && (
                    <button onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }} style={{ color: 'var(--color-primary-600)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={14} /> Mark read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
