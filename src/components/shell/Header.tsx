import React from 'react';
import { Menu, Search, Bell, Sun, Moon, User, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { useLocation } from 'react-router-dom';
import './Shell.css';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useAuthStore();
  const { toggleSidebar, setCommandPaletteOpen, setNotificationDrawerOpen, toggleAiCopilot } = useUIStore();
  const { notifications } = useNotificationStore();
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.read).length;

  const breadcrumbs = location.pathname
    .split('/')
    .filter(Boolean)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' / ') || 'Dashboard';

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

        <button className="ep-header__icon-btn">
          <User size={20} />
        </button>
      </div>
    </header>
  );
};
