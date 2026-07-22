import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Search, ArrowRight, UserPlus, FileText, CheckCircle } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useNavigate } from 'react-router-dom';
import './CommandPalette.css';

const COMMANDS_BASE = [
  { id: 'nav-dashboard', label: 'Go to Dashboard', icon: 'LayoutDashboard', action: (nav: any, t: any, a: any) => nav('/dashboard') },
  { id: 'nav-students', label: 'Student Directory', icon: 'Users', action: (nav: any, t: any, a: any) => nav('/students') },
  { id: 'nav-gradebook', label: 'Open Gradebook', icon: 'BookOpen', action: (nav: any, t: any, a: any) => nav('/gradebook') },
  { id: 'nav-finance', label: 'Finance & Billing', icon: 'DollarSign', action: (nav: any, t: any, a: any) => nav('/finance') },
  { id: 'nav-attendance', label: 'Mark Attendance', icon: 'Calendar', action: (nav: any, t: any, a: any) => nav('/attendance') },
  { id: 'nav-behavior', label: 'Behavior Matrix', icon: 'Shield', action: (nav: any, t: any, a: any) => nav('/behavior') },
  { id: 'nav-hr', label: 'HR Management', icon: 'UserCheck', action: (nav: any, t: any, a: any) => nav('/hr') },
  { id: 'nav-library', label: 'Digital Library', icon: 'Book', action: (nav: any, t: any, a: any) => nav('/library') },
  { id: 'nav-health', label: 'Medical Clinic', icon: 'Heart', action: (nav: any, t: any, a: any) => nav('/health') },
  { id: 'nav-security', label: 'Security & Audit', icon: 'Lock', action: (nav: any, t: any, a: any) => nav('/security') },
  { id: 'nav-events', label: 'Campus Events', icon: 'Calendar', action: (nav: any, t: any, a: any) => nav('/events') },
  { id: 'nav-transport', label: 'Fleet Transport', icon: 'Bus', action: (nav: any, t: any, a: any) => nav('/transport') },
  { id: 'nav-cafeteria', label: 'Cafeteria', icon: 'Coffee', action: (nav: any, t: any, a: any) => nav('/cafeteria') },
  { id: 'nav-counseling', label: 'Counseling', icon: 'MessageCircle', action: (nav: any, t: any, a: any) => nav('/counseling') },
  { id: 'nav-coordination', label: 'Coordination', icon: 'BarChart', action: (nav: any, t: any, a: any) => nav('/coordination') },
  { id: 'action-ai', label: 'Open AI Copilot', icon: 'Sparkles', action: (nav: any, t: any, a: any) => t() },
  { id: 'action-theme', label: 'Toggle Dark/Light Mode', icon: 'Sun', action: (nav: any, t: any, a: any) => a() },
];

import { useAcademicStore } from '@/stores/academicStore';
import { useAuthStore } from '@/stores/authStore';
import * as Icons from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, setCommandPaletteOpen, toggleAiCopilot } = useUIStore();
  const { toggleTheme } = useAuthStore();
  const { students, courses } = useAcademicStore();
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

  const COMMANDS = useMemo(() => {
    let cmds = [...COMMANDS_BASE];
    students?.forEach(s => {
      cmds.push({ id: `student-${s.id}`, label: `Student: ${s.firstName} ${s.lastName}`, icon: 'User', action: (nav) => nav(`/students/${s.id}`) });
    });
    courses?.forEach(c => {
      cmds.push({ id: `course-${c.id}`, label: `Course: ${c.name}`, icon: 'BookOpen', action: (nav) => nav(`/classroom/${c.id}`) });
    });
    return cmds;
  }, [students, courses]);

  const results = COMMANDS.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

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
        results[selectedIndex].action(navigate, toggleAiCopilot, toggleTheme);
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
            results.map((action, idx) => {
              const IconComp = (Icons as any)[action.icon as any] || Icons.ArrowRight;
              return (
              <div
                key={action.id}
                className={`ep-command-palette__item ${idx === selectedIndex ? 'ep-command-palette__item--selected' : ''}`}
                onClick={() => {
                  action.action(navigate, toggleAiCopilot, toggleTheme);
                  setCommandPaletteOpen(false);
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <IconComp size={18} />
                <span>{action.label}</span>
              </div>
            )})
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
