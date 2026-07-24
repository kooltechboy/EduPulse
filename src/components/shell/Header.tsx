import React, { useEffect, useState } from 'react';
import { Menu, Search, Bell, Sun, Moon, User, Sparkles, Activity } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { useLocation } from 'react-router-dom';
import { UserRole } from '@/stores/authStore';
import { MissionControlModal } from './MissionControlModal';
import { telemetryService, HealthStatus } from '@/services/telemetryService';
import './Shell.css';

export const Header: React.FC = () => {
  const { theme, toggleTheme, user, switchRole, logout } = useAuthStore();
  const { toggleSidebar, setCommandPaletteOpen, setNotificationDrawerOpen, toggleAiCopilot } = useUIStore();
  const { notifications } = useNotificationStore();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [missionControlOpen, setMissionControlOpen] = useState(false);
  const [healthStatus, setHealthStatus] = useState<HealthStatus>('nominal');

  useEffect(() => {
    const unsub = telemetryService.subscribe((m) => setHealthStatus(m.status));
    return () => unsub();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const breadcrumbs = location.pathname
    .split('/')
    .filter(Boolean)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' / ') || 'Dashboard';

  const statusColor =
    healthStatus === 'nominal' ? '#22c55e' : healthStatus === 'degraded' ? '#f59e0b' : '#ef4444';

  return (
    <header className="ep-shell__header">
      <div className="ep-header__left">
        <button 
          className="ep-header__icon-btn" 
          onClick={toggleSidebar}
          style={{ display: 'block' }}
        >
          <Menu size={20} />
        </button>
        <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>
          {breadcrumbs}
        </span>
      </div>

      <div className="ep-header__center">
        {/* Empty or mobile brand */}
      </div>

      <div className="ep-header__right">
        {/* NASA Mission Control Telemetry Trigger */}
        <button
          className="ep-header__icon-btn"
          onClick={() => setMissionControlOpen(true)}
          title="EduPulse Telemetry & Mission Control"
          style={{ position: 'relative', border: '1px solid rgba(59, 130, 246, 0.3)', background: 'rgba(59, 130, 246, 0.1)' }}
        >
          <Activity size={18} style={{ color: '#3b82f6' }} />
          <span
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: statusColor,
              boxShadow: `0 0 6px ${statusColor}`,
            }}
          />
        </button>

        <button 
          className="ep-header__icon-btn" 
          onClick={toggleAiCopilot}
          title="EduPulse AI Copilot"
          style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2))', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#a78bfa' }}
        >
          <Sparkles size={18} />
        </button>

        <button 
          className="ep-header__icon-btn" 
          onClick={() => setCommandPaletteOpen(true)}
          title="Search (Ctrl+K)"
        >
          <Search size={20} />
        </button>
        
        <button 
          className="ep-header__icon-btn" 
          onClick={() => setNotificationDrawerOpen(true)}
          style={{ position: 'relative' }}
          title="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span style={{ 
              position: 'absolute', 
              top: 0, 
              right: 0, 
              backgroundColor: 'var(--color-danger-500)', 
              color: 'white', 
              fontSize: '10px', 
              fontWeight: 'bold',
              borderRadius: '9999px',
              padding: '2px 5px',
              transform: 'translate(25%, -25%)'
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        <button 
          className="ep-header__icon-btn" 
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button className="ep-header__icon-btn" onClick={() => setProfileOpen(!profileOpen)}>
          {user?.avatar ? <img src={user.avatar} alt="Avatar" style={{ width: 24, height: 24, borderRadius: '50%' }} /> : <User size={20} />}
        </button>
        {profileOpen && (
          <div style={{ position: 'absolute', top: '100%', right: '16px', backgroundColor: 'var(--color-surface-50)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2)', minWidth: '160px', zIndex: 100, boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ padding: 'var(--space-2)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--space-2)' }}>
              <div style={{ fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', padding: 'var(--space-2)', textTransform: 'uppercase' }}>Switch Role</div>
            {['admin', 'teacher', 'student', 'parent', 'coordinator'].map(role => (
              <button 
                key={role}
                className="ep-btn ep-btn--text" 
                style={{ width: '100%', textAlign: 'left', padding: 'var(--space-2)', fontSize: 'var(--text-sm)', justifyContent: 'flex-start' }}
                onClick={() => { switchRole(role as UserRole); setProfileOpen(false); }}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
            <div style={{ borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-2)', paddingTop: 'var(--space-2)' }}>
              <button className="ep-btn ep-btn--text" style={{ width: '100%', textAlign: 'left', padding: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-danger-500)', justifyContent: 'flex-start' }} onClick={() => { logout(); setProfileOpen(false); }}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mission Control Modal */}
      <MissionControlModal
        isOpen={missionControlOpen}
        onClose={() => setMissionControlOpen(false)}
      />
    </header>
  );
};

