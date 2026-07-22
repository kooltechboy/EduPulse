import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useAuthStore, UserRole } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { useNavigate } from 'react-router-dom';
import './Shell.css';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  roles: UserRole[];
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV_CONFIG: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', roles: ['admin', 'teacher', 'student', 'parent', 'coordinator'] },
      { path: '/communication', label: 'Communication', icon: 'MessageSquare', roles: ['admin', 'teacher', 'student', 'parent', 'coordinator'], badge: 3 },
      { path: '/events', label: 'Campus Events', icon: 'PartyPopper', roles: ['admin', 'teacher', 'student', 'parent', 'coordinator'] },
    ]
  },
  {
    title: 'Academic',
    items: [
      { path: '/students', label: 'Students', icon: 'GraduationCap', roles: ['admin', 'teacher', 'coordinator'] },
      { path: '/classroom', label: 'Classroom', icon: 'BookOpen', roles: ['admin', 'teacher', 'student', 'coordinator'] },
      { path: '/schedule', label: 'Schedule', icon: 'Calendar', roles: ['admin', 'teacher', 'student', 'parent', 'coordinator'] },
      { path: '/attendance', label: 'Attendance', icon: 'ClipboardCheck', roles: ['admin', 'teacher', 'coordinator', 'parent'] },
      { path: '/gradebook', label: 'Gradebook', icon: 'BookMarked', roles: ['admin', 'teacher', 'student', 'parent'] },
      { path: '/library', label: 'Library', icon: 'Library', roles: ['admin', 'teacher', 'student', 'coordinator'] },
    ]
  },
  {
    title: 'Operations',
    items: [
      { path: '/staff', label: 'Staff', icon: 'Users', roles: ['admin', 'coordinator'] },
      { path: '/teachers', label: 'Teachers', icon: 'UserSquare', roles: ['admin', 'coordinator', 'student', 'parent'] },
      { path: '/admissions', label: 'Admissions', icon: 'UserPlus', roles: ['admin', 'coordinator'] },
      { path: '/finance', label: 'Finance', icon: 'DollarSign', roles: ['admin', 'parent'] },
      { path: '/hr', label: 'HR', icon: 'Briefcase', roles: ['admin'] },
      { path: '/inventory', label: 'Inventory', icon: 'Package', roles: ['admin', 'coordinator'] },
      { path: '/transport', label: 'Transport', icon: 'Bus', roles: ['admin', 'coordinator', 'parent'] },
      { path: '/cafeteria', label: 'Cafeteria', icon: 'Coffee', roles: ['admin', 'coordinator', 'student'] },
    ]
  },
  {
    title: 'Support',
    items: [
      { path: '/behavior', label: 'Behavior', icon: 'Activity', roles: ['admin', 'teacher', 'coordinator'] },
      { path: '/health', label: 'Health', icon: 'HeartPulse', roles: ['admin', 'coordinator', 'parent'] },
      { path: '/counseling', label: 'Counseling', icon: 'HeartHandshake', roles: ['admin', 'teacher', 'coordinator', 'student'] },
      { path: '/security', label: 'Security', icon: 'ShieldCheck', roles: ['admin'] },
      { path: '/coordination', label: 'Coordination', icon: 'Network', roles: ['admin', 'coordinator'] },
    ]
  }
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, sidebarOpen, setSidebarOpen, toggleSidebarCollapse } = useUIStore();
  const { openTab } = useWorkspaceStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <>
      {sidebarOpen && (
        <div 
          className="ep-shell__backdrop" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside className={`ep-shell__sidebar ${sidebarCollapsed ? 'ep-shell__sidebar--collapsed' : ''} ${sidebarOpen ? 'ep-shell__sidebar--open' : ''}`}>
        <div className="ep-sidebar__brand">
          <span className="ep-sidebar__brand-text">{sidebarCollapsed ? 'EP' : 'EduPulse'}</span>
          <button 
            className="ep-header__icon-btn ep-sidebar__toggle hidden-mobile" 
            onClick={toggleSidebarCollapse}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{ marginLeft: 'auto' }}
          >
            {sidebarCollapsed ? <Icons.ChevronRight size={18} /> : <Icons.ChevronLeft size={18} />}
          </button>
        </div>
        
        <nav className="ep-sidebar__nav">
          {NAV_CONFIG.map((section, idx) => {
            const visibleItems = section.items.filter(item => item.roles.includes(user.role));
            if (visibleItems.length === 0) return null;
            
            return (
              <div key={idx} className="ep-sidebar__section">
                {!sidebarCollapsed && <div className="ep-sidebar__section-title">{section.title}</div>}
                {visibleItems.map(item => {
                  const isActive = location.pathname.startsWith(item.path);
                  const IconComponent = (Icons as any)[item.icon] || Icons.HelpCircle;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={`ep-sidebar__item ${isActive ? 'ep-sidebar__item--active' : ''}`}
                      title={sidebarCollapsed ? item.label : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        setSidebarOpen(false);
                        openTab(item.path, item.label, item.icon, item.path !== '/dashboard');
                        navigate(item.path);
                      }}
                    >
                      <IconComponent className="ep-sidebar__item-icon" size={20} />
                      {!sidebarCollapsed && (
                        <>
                          <span className="ep-sidebar__item-label">{item.label}</span>
                          {item.badge && <span className="ep-sidebar__item-badge">{item.badge}</span>}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="ep-sidebar__profile">
          <div className="ep-sidebar__item-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-surface-200)', flexShrink: 0 }}>
             <Icons.UserSquare size={20} />
          </div>
          {!sidebarCollapsed && (
            <div className="ep-sidebar__profile-info" style={{ flex: 1, marginLeft: 'var(--space-2)' }}>
              <span className="ep-sidebar__profile-name">{user.name}</span>
              <span className="ep-sidebar__profile-role">{user.role}</span>
            </div>
          )}
          {!sidebarCollapsed && (
            <button onClick={logout} className="ep-header__icon-btn" title="Logout" style={{ color: 'var(--color-danger-500)' }}>
              <Icons.LogOut size={18} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
