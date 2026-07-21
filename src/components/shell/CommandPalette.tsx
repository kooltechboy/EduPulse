import React, { useEffect, useState, useRef } from 'react';
import { Search, ArrowRight, UserPlus, FileText, CheckCircle } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useNavigate } from 'react-router-dom';
import './CommandPalette.css';

const ACTIONS = [
  { id: '1', label: 'Add Student', icon: UserPlus, path: '/students' },
  { id: '2', label: 'Create Invoice', icon: FileText, path: '/finance' },
  { id: '3', label: 'Mark Attendance', icon: CheckCircle, path: '/attendance' },
  { id: '4', label: 'Go to Dashboard', icon: ArrowRight, path: '/dashboard' },
  { id: '5', label: 'View Schedule', icon: ArrowRight, path: '/schedule' }
];

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const results = ACTIONS.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        navigate(results[selectedIndex].path);
        setCommandPaletteOpen(false);
      }
    }
  };

  return (
    <div className="ep-command-palette-overlay" onClick={() => setCommandPaletteOpen(false)}>
      <div className="ep-command-palette" onClick={e => e.stopPropagation()}>
        <div className="ep-command-palette__input-wrapper">
          <Search size={20} />
          <input
            ref={inputRef}
            type="text"
            className="ep-command-palette__input"
            placeholder="Search commands, actions, or jump to..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="ep-command-palette__results">
          {results.length > 0 ? (
            results.map((action, idx) => (
              <div
                key={action.id}
                className={`ep-command-palette__item ${idx === selectedIndex ? 'ep-command-palette__item--selected' : ''}`}
                onClick={() => {
                  navigate(action.path);
                  setCommandPaletteOpen(false);
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <action.icon size={18} />
                <span>{action.label}</span>
              </div>
            ))
          ) : (
            <div className="ep-command-palette__empty">
              No results found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
