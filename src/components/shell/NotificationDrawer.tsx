import React from 'react';
import { X, Check, CheckCircle2 } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useNotificationStore } from '@/stores/notificationStore';
import './Shell.css';

export const NotificationDrawer: React.FC = () => {
  const { notificationDrawerOpen, setNotificationDrawerOpen } = useUIStore();
  const { notifications, markAsRead, markAllAsRead, dismiss } = useNotificationStore();

  if (!notificationDrawerOpen) return null;

  return (
    <>
      <div className="ep-drawer-overlay" onClick={() => setNotificationDrawerOpen(false)} />
      <div className={`ep-drawer ${notificationDrawerOpen ? 'ep-drawer--open' : ''}`}>
        <div className="ep-drawer__header">
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Notifications</h2>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
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
                style={{ 
                  padding: 'var(--space-4)', 
                  borderBottom: '1px solid var(--color-border)',
                  backgroundColor: n.read ? 'transparent' : 'var(--color-primary-50)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-2)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{n.title}</h3>
                  <button onClick={() => dismiss(n.id)} style={{ color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>{n.body}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-2)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                    {new Date(n.date).toLocaleDateString()}
                  </span>
                  {!n.read && (
                    <button onClick={() => markAsRead(n.id)} style={{ color: 'var(--color-primary-600)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
