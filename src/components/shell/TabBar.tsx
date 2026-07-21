import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useWorkspaceStore, type WorkspaceTab } from '@/stores/workspaceStore';
import './TabBar.css';

// Type-safe icon renderer from lucide-react name
const TabIcon: React.FC<{ name: string; size?: number; className?: string }> = ({ name, size = 16, className = '' }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.HelpCircle size={size} className={className} />;
  return <IconComponent size={size} className={className} />;
};

export const TabBar: React.FC = () => {
  const { tabs, activeTabId, closeTab, setActiveTabId } = useWorkspaceStore();
  const navigate = useNavigate();

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    navigate(tabId);
  };

  const handleCloseClick = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    closeTab(tabId);
    
    // Get store snapshot to find out the new active tab and navigate to it
    const newActiveId = useWorkspaceStore.getState().activeTabId;
    navigate(newActiveId);
  };

  return (
    <div className="ep-tabbar">
      <div className="ep-tabbar__scroll-container">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`ep-tabbar__tab ${isActive ? 'ep-tabbar__tab--active' : ''}`}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleTabClick(tab.id);
                }
              }}
            >
              <TabIcon name={tab.iconName} size={14} className="ep-tabbar__tab-icon" />
              <span className="ep-tabbar__tab-label">{tab.label}</span>
              {tab.closable && (
                <button
                  className="ep-tabbar__tab-close"
                  onClick={(e) => handleCloseClick(e, tab.id)}
                  aria-label={`Close ${tab.label} tab`}
                >
                  <Icons.X size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default TabBar;
