import React, { useRef } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, activeId, onChange, className = '' }) => {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const classNames = ['ep-tabs', className].filter(Boolean).join(' ');

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % items.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + items.length) % items.length;
    }

    if (nextIndex !== index) {
      const nextTab = items[nextIndex];
      if (!nextTab.disabled) {
        tabsRef.current[nextIndex]?.focus();
        onChange(nextTab.id);
      }
    }
  };

  return (
    <div className={classNames} role="tablist">
      {items.map((item, index) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            ref={(el) => (tabsRef.current[index] = el)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${item.id}`}
            id={`tab-${item.id}`}
            disabled={item.disabled}
            className={`ep-tab ${isActive ? 'ep-tab--active' : ''}`}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            tabIndex={isActive ? 0 : -1}
          >
            {item.icon && <span className="ep-tab__icon">{item.icon}</span>}
            <span className="ep-tab__label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
