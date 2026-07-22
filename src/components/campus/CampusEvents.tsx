import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  List, 
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  PartyPopper, 
  Award, 
  Sparkles, 
  Filter, 
  Trash2, 
  CheckCircle,
  Edit3,
  Share2,
  Download,
  Star,
  X,
  Search,
  Building,
  UserCheck,
  Tag,
  Globe,
  ChevronRight,
  Info,
  Bell,
  Send,
  Eye,
  UserPlus,
  Copy,
  Check,
  Printer,
  QrCode,
  MessageSquare,
  Mail,
  Smartphone,
  Megaphone,
  FileText
} from 'lucide-react';
import './CampusEvents.css';

declare const addToast: (options: { type: 'success' | 'error' | 'info' | 'warning', title: string, message: string }) => void;

export interface EventItem {
  id: string;
  title: string;
  month: string;
  day: string;
  date?: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  time: string;
  location: string;
  category: 'Academic' | 'Sports' | 'Culture' | 'Administrative';
  attendees: number;
  featured?: boolean;
  description?: string;
  organizer?: string;
  tier?: string;
  isRsvpd?: boolean;
  hasReminder?: boolean;
}

const INITIAL_EVENTS_DATA: EventItem[] = [
  { 
    id: '1', 
    title: 'Annual STEM & Innovation Fair 2026', 
    month: 'OCT', 
    day: '15',
    date: '2026-10-15',
    startTime: '10:00',
    endTime: '16:00',
    time: '10:00 AM - 04:00 PM', 
    location: 'Main Exhibition Hall', 
    category: 'Academic', 
    attendees: 450, 
    featured: true,
    organizer: 'Faculty of Science & Technology',
    tier: 'All School',
    description: 'Showcasing student-driven research projects, robotics demonstrations, AI prototypes, and interactive science experiments. Open to all students, faculty, parents, and industry partners.'
  },
  { 
    id: '2', 
    title: 'Inter-School Athletics Championship', 
    month: 'OCT', 
    day: '22', 
    date: '2026-10-22',
    startTime: '08:30',
    endTime: '17:00',
    time: '08:30 AM - 05:00 PM', 
    location: 'Campus Sports Arena', 
    category: 'Sports', 
    attendees: 800, 
    featured: true,
    organizer: 'Department of Athletics',
    tier: 'All School',
    description: 'Annual inter-school athletic competitions featuring track & field, basketball finals, swimming relays, and soccer matches across all grade divisions.'
  },
  { 
    id: '3', 
    title: 'Autumn Symphony & Jazz Concert', 
    month: 'NOV', 
    day: '05', 
    date: '2026-11-05',
    startTime: '18:00',
    endTime: '21:00',
    time: '06:00 PM - 09:00 PM', 
    location: 'Auditorium Center', 
    category: 'Culture', 
    attendees: 320,
    featured: false,
    organizer: 'School of Performing Arts',
    tier: 'All School',
    description: 'An evening of classical orchestral masterpieces followed by contemporary jazz ensemble performances featuring student soloists and faculty directors.'
  },
  { 
    id: '4', 
    title: 'Q3 Parent-Teacher Conference Day', 
    month: 'NOV', 
    day: '12', 
    date: '2026-11-12',
    startTime: '09:00',
    endTime: '15:00',
    time: '09:00 AM - 03:00 PM', 
    location: 'Classroom Block B', 
    category: 'Administrative', 
    attendees: 600,
    featured: false,
    organizer: 'Academic Advisory Board',
    tier: 'Parents Only',
    description: 'Quarterly individual consultations between parents and subject teachers to review student progress, learning metrics, and personal development goals.'
  },
  { 
    id: '5', 
    title: 'Cybersecurity & AI Workshop', 
    month: 'DEC', 
    day: '02', 
    date: '2026-12-02',
    startTime: '13:00',
    endTime: '16:00',
    time: '01:00 PM - 04:00 PM', 
    location: 'Tech Lab 104', 
    category: 'Academic', 
    attendees: 180,
    featured: false,
    organizer: 'Computer Science Club',
    tier: 'Students Only',
    description: 'Hands-on practical workshop covering fundamental web security, ethical hacking exercises, neural network fine-tuning, and modern cryptographic principles.'
  },
  { 
    id: '6', 
    title: 'Winter Gala & Charity Auction', 
    month: 'DEC', 
    day: '18', 
    date: '2026-12-18',
    startTime: '19:00',
    endTime: '22:00',
    time: '07:00 PM - 10:00 PM', 
    location: 'Grand Ballroom', 
    category: 'Culture', 
    attendees: 250,
    featured: true,
    organizer: 'Student Leadership Council',
    tier: 'All School',
    description: 'Formal end-of-term celebration featuring student musical performances, fine dining, and a live silent auction raising funds for local educational outreach initiatives.'
  }
];

const MOCK_ROSTER = [
  { name: 'Dr. Eleanor Vance', role: 'Faculty / Lead Organizer', status: 'Confirmed' },
  { name: 'Marcus Chen', role: 'Student Rep - Grade 12', status: 'Confirmed' },
  { name: 'Sarah Jenkins', role: 'Parent Association VP', status: 'Confirmed' },
  { name: 'Prof. Robert Sterling', role: 'Department Chair', status: 'Confirmed' },
  { name: 'David Miller', role: 'Student - Grade 11', status: 'Pending' }
];

export const CampusEvents: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS_DATA);
  
  // Primary Detail Modal state
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<'details' | 'edit' | 'roster'>('details');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [rosterList, setRosterList] = useState(MOCK_ROSTER);
  const [newAttendeeName, setNewAttendeeName] = useState('');

  // Dedicated Broadcast Modal State
  const [broadcastEvent, setBroadcastEvent] = useState<EventItem | null>(null);
  const [broadcastForm, setBroadcastForm] = useState({
    subject: '',
    targetAudience: 'All Confirmed Attendees',
    channels: { email: true, push: true, portalBanner: true, sms: false },
    message: ''
  });

  // Dedicated Share Modal State
  const [shareEvent, setShareEvent] = useState<EventItem | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Form state for creating or editing
  const [eventForm, setEventForm] = useState({
    id: '',
    title: '',
    description: '',
    category: 'Academic',
    date: '',
    startTime: '09:00',
    endTime: '12:00',
    location: '',
    organizer: '',
    tier: 'All School',
    featured: false
  });

  const [currentMonth] = useState('October 2026');

  const safeAddToast = (opts: { type: 'success' | 'error' | 'info' | 'warning', title: string, message: string }) => {
    if (typeof addToast === 'function') addToast(opts);
    else if (typeof window !== 'undefined' && (window as any).addToast) (window as any).addToast(opts);
  };

  const parseDateToMonthDay = (dateStr: string) => {
    if (!dateStr) return { month: 'OCT', day: '15' };
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const monthIdx = parseInt(parts[1], 10) - 1;
      const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      return {
        month: months[monthIdx] || 'OCT',
        day: parts[2].padStart(2, '0')
      };
    }
    return { month: 'OCT', day: '15' };
  };

  const formatTimeRange = (start?: string, end?: string) => {
    if (!start || !end) return '09:00 AM - 05:00 PM';
    const formatSingle = (t: string) => {
      const [hStr, mStr] = t.split(':');
      let h = parseInt(hStr, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return `${h.toString().padStart(2, '0')}:${mStr || '00'} ${ampm}`;
    };
    return `${formatSingle(start)} - ${formatSingle(end)}`;
  };

  const openEventModal = (eventId: string, tab: 'details' | 'edit' | 'roster' = 'details', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const ev = events.find(item => item.id === eventId);
    if (!ev) return;
    setSelectedEventId(eventId);
    setModalTab(tab);
    setEventForm({
      id: ev.id,
      title: ev.title,
      description: ev.description || '',
      category: ev.category,
      date: ev.date || '2026-10-15',
      startTime: ev.startTime || '09:00',
      endTime: ev.endTime || '12:00',
      location: ev.location,
      organizer: ev.organizer || '',
      tier: ev.tier || 'All School',
      featured: !!ev.featured
    });
  };

  const handleOpenCreateModal = () => {
    setEventForm({
      id: '',
      title: '',
      description: '',
      category: 'Academic',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '12:00',
      location: '',
      organizer: '',
      tier: 'All School',
      featured: false
    });
    setShowCreateModal(true);
  };

  const handleSaveEvent = () => {
    if (!eventForm.title.trim()) {
      safeAddToast({ type: 'warning', title: 'Missing Title', message: 'Please enter an event title.' });
      return;
    }

    const { month, day } = parseDateToMonthDay(eventForm.date);
    const formattedTime = formatTimeRange(eventForm.startTime, eventForm.endTime);

    if (eventForm.id) {
      // Update existing
      const updatedEvents = events.map(ev => {
        if (ev.id === eventForm.id) {
          return {
            ...ev,
            title: eventForm.title,
            description: eventForm.description,
            category: eventForm.category as any,
            date: eventForm.date,
            startTime: eventForm.startTime,
            endTime: eventForm.endTime,
            time: formattedTime,
            month,
            day,
            location: eventForm.location,
            organizer: eventForm.organizer,
            tier: eventForm.tier,
            featured: eventForm.featured
          };
        }
        return ev;
      });
      setEvents(updatedEvents);
      setModalTab('details');
      safeAddToast({ type: 'success', title: 'Event Saved', message: `"${eventForm.title}" details updated successfully.` });
    } else {
      // Create new
      const newEv: EventItem = {
        id: Math.random().toString(36).substring(2, 9),
        title: eventForm.title,
        description: eventForm.description,
        category: eventForm.category as any,
        date: eventForm.date,
        startTime: eventForm.startTime,
        endTime: eventForm.endTime,
        time: formattedTime,
        month,
        day,
        location: eventForm.location || 'Main Campus',
        organizer: eventForm.organizer || 'Administration',
        tier: eventForm.tier || 'All School',
        attendees: 0,
        featured: eventForm.featured,
        isRsvpd: false
      };
      setEvents([newEv, ...events]);
      setShowCreateModal(false);
      safeAddToast({ type: 'success', title: 'Event Published', message: `"${eventForm.title}" scheduled on campus calendar.` });
    }
  };

  const toggleRSVP = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEvents(prev => prev.map(ev => {
      if (ev.id === id) {
        const isRsvpd = !ev.isRsvpd;
        safeAddToast({ 
          type: isRsvpd ? 'success' : 'info', 
          title: isRsvpd ? 'RSVP Confirmed' : 'RSVP Cancelled', 
          message: isRsvpd ? `You are registered for "${ev.title}".` : `Your registration for "${ev.title}" was removed.` 
        });
        return { ...ev, isRsvpd, attendees: ev.attendees + (isRsvpd ? 1 : -1) };
      }
      return ev;
    }));
  };

  const toggleReminder = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEvents(prev => prev.map(ev => {
      if (ev.id === id) {
        const hasReminder = !ev.hasReminder;
        safeAddToast({
          type: 'info',
          title: hasReminder ? 'Reminder Scheduled' : 'Reminder Cancelled',
          message: hasReminder ? `Push notification set 2 hours before "${ev.title}".` : `Notification reminder turned off.`
        });
        return { ...ev, hasReminder };
      }
      return ev;
    }));
  };

  const toggleFeatured = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEvents(prev => prev.map(ev => {
      if (ev.id === id) {
        const featured = !ev.featured;
        safeAddToast({ 
          type: 'info', 
          title: featured ? 'Featured Highlight' : 'Unfeatured', 
          message: featured ? `"${ev.title}" is pinned to featured highlights.` : `"${ev.title}" unpinned from highlights.` 
        });
        return { ...ev, featured };
      }
      return ev;
    }));
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const target = events.find(ev => ev.id === id);
    if (window.confirm(`Are you sure you want to cancel and remove "${target?.title || 'this event'}"?`)) {
      setEvents(prev => prev.filter(ev => ev.id !== id));
      if (selectedEventId === id) setSelectedEventId(null);
      safeAddToast({ type: 'warning', title: 'Event Cancelled', message: 'The event has been deleted.' });
    }
  };

  const handleExportICS = (event: EventItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//EduPulse//Campus Events//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n')}`,
      `LOCATION:${event.location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    safeAddToast({ type: 'success', title: 'Calendar Exported', message: `Downloaded iCal event file for "${event.title}".` });
  };

  // --- BROADCAST FUNCTIONALITY ---
  const handleOpenBroadcast = (event: EventItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBroadcastEvent(event);
    setBroadcastForm({
      subject: `Important Update: ${event.title}`,
      targetAudience: `All ${event.attendees} Confirmed Attendees`,
      channels: { email: true, push: true, portalBanner: true, sms: false },
      message: `Dear Attendees,\n\nPlease note the upcoming event details for "${event.title}" on ${event.month} ${event.day} at ${event.location}.\n\nAgenda Summary:\n${event.description || 'We look forward to seeing you there!'}\n\nBest regards,\nCampus Event Management`
    });
  };

  const handleExecuteBroadcast = () => {
    if (!broadcastEvent) return;
    if (!broadcastForm.message.trim()) {
      safeAddToast({ type: 'warning', title: 'Empty Message', message: 'Please enter a message for the announcement.' });
      return;
    }

    const selectedChannels = Object.entries(broadcastForm.channels)
      .filter(([_, enabled]) => enabled)
      .map(([channel]) => channel.toUpperCase())
      .join(', ');

    safeAddToast({
      type: 'success',
      title: 'Broadcast Distributed Successfully',
      message: `Announcement sent to ${broadcastForm.targetAudience} via ${selectedChannels || 'Portal Banner'}.`
    });

    setBroadcastEvent(null);
  };

  // --- SHARE FUNCTIONALITY ---
  const handleOpenShare = (event: EventItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShareEvent(event);
    setCopiedLink(false);
    setCopiedSummary(false);
  };

  const handleCopyShareLink = (event: EventItem) => {
    const url = `${window.location.origin}/events?id=${event.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
      safeAddToast({ type: 'info', title: 'Link Copied', message: 'Direct event URL copied to clipboard.' });
    }
  };

  const handleCopySummaryText = (event: EventItem) => {
    const text = `📌 ${event.title}\n📅 Date: ${event.month} ${event.day} (${event.time})\n📍 Venue: ${event.location}\n🏛️ Organizer: ${event.organizer || 'Campus Admin'}\n👥 Audience: ${event.tier || 'All School'}\n\nSummary:\n${event.description || 'Institutional Campus Event'}\n\nRSVP & Info: ${window.location.origin}/events?id=${event.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
      safeAddToast({ type: 'info', title: 'Summary Copied', message: 'Full event details formatted for messaging.' });
    }
  };

  const handlePrintFlyer = (event: EventItem) => {
    const printWin = window.open('', '_blank');
    if (!printWin) {
      safeAddToast({ type: 'warning', title: 'Pop-up Blocked', message: 'Please allow pop-ups to print event flyer.' });
      return;
    }

    printWin.document.write(`
      <html>
        <head>
          <title>Event Flyer - ${event.title}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; background: #fff; }
            .flyer { border: 4px double #6366f1; padding: 32px; border-radius: 16px; max-width: 600px; margin: 0 auto; text-align: center; }
            .badge { display: inline-block; background: #6366f1; color: white; padding: 6px 16px; border-radius: 20px; font-weight: 700; font-size: 14px; text-transform: uppercase; }
            h1 { font-size: 28px; margin: 20px 0 10px 0; color: #0f172a; }
            .meta { font-size: 16px; color: #475569; margin-bottom: 20px; font-weight: 600; }
            .desc { font-size: 15px; color: #334155; line-height: 1.6; text-align: left; background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #6366f1; }
            .footer { margin-top: 30px; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; }
          </style>
        </head>
        <body>
          <div class="flyer">
            <span class="badge">${event.category} Event</span>
            <h1>${event.title}</h1>
            <div class="meta">📅 ${event.month} ${event.day} | ⏰ ${event.time}<br/>📍 Location: ${event.location}</div>
            <div class="desc"><strong>About Event:</strong><br/>${event.description || 'Official Institutional Event.'}</div>
            <div class="footer">Organized by ${event.organizer || 'Campus Administration'} • Target Audience: ${event.tier || 'All School'}</div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWin.document.close();
    safeAddToast({ type: 'success', title: 'Flyer Generator', message: 'Print window opened for event poster.' });
  };

  const handleAddRosterAttendee = () => {
    if (!newAttendeeName.trim()) return;
    setRosterList([...rosterList, { name: newAttendeeName.trim(), role: 'Guest Attendee', status: 'Confirmed' }]);
    if (selectedEventId) {
      setEvents(events.map(e => e.id === selectedEventId ? { ...e, attendees: e.attendees + 1 } : e));
    }
    setNewAttendeeName('');
    safeAddToast({ type: 'success', title: 'Attendee Added', message: `${newAttendeeName} registered for event.` });
  };

  // Filtered list based on search and category
  const filteredEvents = events.filter(ev => {
    const matchesCategory = filterCategory === 'all' || ev.category.toLowerCase() === filterCategory.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      ev.title.toLowerCase().includes(q) ||
      ev.location.toLowerCase().includes(q) ||
      ev.category.toLowerCase().includes(q) ||
      (ev.organizer && ev.organizer.toLowerCase().includes(q)) ||
      (ev.description && ev.description.toLowerCase().includes(q))
    );
    return matchesCategory && matchesSearch;
  });

  const selectedEvent = events.find(ev => ev.id === selectedEventId);

  return (
    <div className="ep-campus-events">
      {/* Header Bar */}
      <header className="ep-campus-events__header">
        <div>
          <h1 className="ep-campus-events__title">Campus Events & Activities</h1>
          <p className="ep-campus-events__subtitle">Discover, organize, and manage upcoming institutional events</p>
        </div>
        <div className="ep-campus-events__controls">
          <div className="ep-tabs" style={{ padding: '2px' }}>
            <button className={`ep-tab ${view === 'grid' ? 'ep-tab--active' : ''}`} onClick={() => setView('grid')}>
              <CalendarIcon size={14} style={{ marginRight: 6 }} /> Grid
            </button>
            <button className={`ep-tab ${view === 'list' ? 'ep-tab--active' : ''}`} onClick={() => setView('list')}>
              <List size={14} style={{ marginRight: 6 }} /> List
            </button>
            <button className={`ep-tab ${view === 'calendar' ? 'ep-tab--active' : ''}`} onClick={() => setView('calendar')}>
              <CalendarIcon size={14} style={{ marginRight: 6 }} /> Calendar
            </button>
          </div>
          <button className="ep-btn ep-btn--primary" onClick={handleOpenCreateModal}>
            <Plus size={16} /> + Create Event
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <section className="ep-campus-events__kpi-grid">
        <div className="ep-campus-events__kpi-card">
          <div className="ep-campus-events__kpi-icon ep-campus-events__kpi-icon--blue"><PartyPopper size={22} /></div>
          <div>
            <div className="ep-campus-events__kpi-val">{events.length}</div>
            <div className="ep-campus-events__kpi-lbl">Total Events Scheduled</div>
          </div>
        </div>
        <div className="ep-campus-events__kpi-card">
          <div className="ep-campus-events__kpi-icon ep-campus-events__kpi-icon--purple"><Award size={22} /></div>
          <div>
            <div className="ep-campus-events__kpi-val">{events.filter(e => e.category === 'Academic').length}</div>
            <div className="ep-campus-events__kpi-lbl">Academic & STEM Fairs</div>
          </div>
        </div>
        <div className="ep-campus-events__kpi-card">
          <div className="ep-campus-events__kpi-icon ep-campus-events__kpi-icon--amber"><Sparkles size={22} /></div>
          <div>
            <div className="ep-campus-events__kpi-val">{events.filter(e => e.category === 'Sports' || e.category === 'Culture').length}</div>
            <div className="ep-campus-events__kpi-lbl">Sports & Cultural Meets</div>
          </div>
        </div>
        <div className="ep-campus-events__kpi-card">
          <div className="ep-campus-events__kpi-icon ep-campus-events__kpi-icon--green"><Users size={22} /></div>
          <div>
            <div className="ep-campus-events__kpi-val">96.4%</div>
            <div className="ep-campus-events__kpi-lbl">Average RSVP Rate</div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="ep-campus-events__content-grid">
        <div className="ep-campus-events__main">
          {/* Search & Filter Toolbar */}
          <div className="ep-campus-events__toolbar">
            <div className="ep-campus-events__search-box">
              <Search size={14} className="ep-campus-events__search-icon" />
              <input 
                type="text" 
                placeholder="Search events, locations, organizers..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="ep-campus-events__search-input"
              />
              {searchQuery && (
                <button className="ep-campus-events__search-clear" onClick={() => setSearchQuery('')}>
                  <X size={12} />
                </button>
              )}
            </div>
            <div className="ep-campus-events__filters">
              <span className="ep-campus-events__filter-label">
                <Filter size={14} /> Filter:
              </span>
              {['all', 'academic', 'sports', 'culture', 'administrative'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setFilterCategory(cat)} 
                  className={`ep-badge ${filterCategory === cat ? 'ep-badge--primary' : 'ep-badge--neutral'}`} 
                  style={{ cursor: 'pointer', textTransform: 'capitalize' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* GRID VIEW */}
          {view === 'grid' && (
            <div className="ep-campus-events__cards-grid">
              {filteredEvents.length === 0 ? (
                <div className="ep-campus-events__empty">
                  <Info size={32} color="var(--color-text-tertiary)" />
                  <p>No events found matching your filter criteria.</p>
                </div>
              ) : (
                filteredEvents.map(event => (
                  <div 
                    key={event.id} 
                    className="ep-event-card"
                    onClick={(e) => openEventModal(event.id, 'details', e)}
                    title="Click to view details & edit event"
                  >
                    <div className="ep-event-card__top">
                      <div className="ep-event-card__date-badge">
                        <span className="ep-event-card__month">{event.month}</span>
                        <span className="ep-event-card__day">{event.day}</span>
                      </div>
                      <div className="ep-event-card__info">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <h3 
                            className="ep-event-card__title"
                            onClick={(e) => openEventModal(event.id, 'details', e)}
                          >
                            {event.title}
                          </h3>
                          <div className="ep-event-card__quick-actions">
                            <button 
                              className="ep-event-card__action-btn"
                              title={event.hasReminder ? 'Reminder active' : 'Set reminder'}
                              onClick={(e) => toggleReminder(event.id, e)}
                            >
                              <Bell size={14} color={event.hasReminder ? '#3b82f6' : 'var(--color-text-tertiary)'} fill={event.hasReminder ? '#3b82f6' : 'none'} />
                            </button>
                            <button 
                              className="ep-event-card__action-btn"
                              title={event.featured ? 'Featured event' : 'Feature event'}
                              onClick={(e) => toggleFeatured(event.id, e)}
                            >
                              <Star size={14} color={event.featured ? '#f59e0b' : 'var(--color-text-tertiary)'} fill={event.featured ? '#f59e0b' : 'none'} />
                            </button>
                            <button 
                              className="ep-event-card__action-btn"
                              title="Broadcast Announcement"
                              onClick={(e) => handleOpenBroadcast(event, e)}
                            >
                              <Send size={14} color="var(--color-primary-400)" />
                            </button>
                            <button 
                              className="ep-event-card__action-btn"
                              title="Share Event"
                              onClick={(e) => handleOpenShare(event, e)}
                            >
                              <Share2 size={14} color="var(--color-text-secondary)" />
                            </button>
                            <button 
                              className="ep-event-card__action-btn"
                              title="Edit Event Details"
                              onClick={(e) => openEventModal(event.id, 'edit', e)}
                            >
                              <Edit3 size={14} color="var(--color-text-secondary)" />
                            </button>
                            <button 
                              className="ep-event-card__action-btn ep-event-card__action-btn--danger"
                              title="Delete Event"
                              onClick={(e) => handleDelete(event.id, e)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="ep-event-card__meta-list">
                          <div className="ep-event-card__meta-item"><Clock size={12} color="var(--color-text-tertiary)" /><span>{event.time}</span></div>
                          <div className="ep-event-card__meta-item"><MapPin size={12} color="var(--color-text-tertiary)" /><span>{event.location}</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="ep-event-card__footer">
                      <span className="ep-badge ep-badge--primary">{event.category}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="ep-event-card__rsvp">{event.attendees} Attendees</span>
                        <button 
                          className={`ep-btn ep-btn--sm ${event.isRsvpd ? 'ep-btn--success' : 'ep-btn--secondary'}`} 
                          onClick={(e) => toggleRSVP(event.id, e)}
                        >
                          {event.isRsvpd ? <><CheckCircle size={14} /> Attending</> : 'RSVP'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* LIST VIEW */}
          {view === 'list' && (
            <div className="ep-table-wrapper">
              <table className="ep-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Event Title</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Time</th>
                    <th>Attendees</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map(e => (
                    <tr 
                      key={e.id}
                      className="ep-table-row--interactive"
                      onClick={(evt) => openEventModal(e.id, 'details', evt)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ fontWeight: 700, color: 'var(--color-primary-400)' }}>{e.month} {e.day}</td>
                      <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {e.featured && <Star size={12} color="#f59e0b" fill="#f59e0b" style={{ marginRight: 6 }} />}
                        {e.title}
                      </td>
                      <td><span className="ep-badge ep-badge--primary">{e.category}</span></td>
                      <td>{e.location}</td>
                      <td>{e.time}</td>
                      <td>{e.attendees} RSVPs</td>
                      <td onClick={evt => evt.stopPropagation()}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button 
                            className={`ep-btn ep-btn--sm ${e.isRsvpd ? 'ep-btn--success' : 'ep-btn--secondary'}`} 
                            onClick={(evt) => toggleRSVP(e.id, evt)}
                          >
                            {e.isRsvpd ? 'Attending' : 'RSVP'}
                          </button>
                          <button className="ep-btn ep-btn--sm ep-btn--secondary" title="Broadcast" onClick={(evt) => handleOpenBroadcast(e, evt)}>
                            <Send size={14} />
                          </button>
                          <button className="ep-btn ep-btn--sm ep-btn--secondary" title="Share" onClick={(evt) => handleOpenShare(e, evt)}>
                            <Share2 size={14} />
                          </button>
                          <button className="ep-btn ep-btn--sm ep-btn--secondary" title="Edit" onClick={(evt) => openEventModal(e.id, 'edit', evt)}>
                            <Edit3 size={14} />
                          </button>
                          <button className="ep-btn ep-btn--sm ep-btn--danger" title="Delete" onClick={(evt) => handleDelete(e.id, evt)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* CALENDAR VIEW */}
          {view === 'calendar' && (
            <div className="ep-events__calendar-view">
              <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-text-primary)' }}>{currentMonth}</h3>
              <div className="ep-events__calendar-grid">
                {Array.from({length: 31}, (_, i) => i + 1).map(day => {
                  const dayEvents = filteredEvents.filter(e => parseInt(e.day, 10) === day);
                  return (
                    <div key={day} className="ep-events__calendar-cell">
                      <span className="ep-events__calendar-daynum">{day}</span>
                      <div className="ep-events__calendar-dots">
                        {dayEvents.map(e => (
                          <div 
                            key={e.id} 
                            className="ep-events__calendar-dot" 
                            title={`${e.title} (${e.time})`}
                            onClick={(evt) => openEventModal(e.id, 'details', evt)} 
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Panel */}
        <aside className="ep-campus-events__side-panel">
          <div className="ep-campus-events__card">
            <h3 className="ep-campus-events__card-title">Featured Highlights</h3>
            <div className="ep-event-mini-list">
              {events.filter(e => e.featured).map(item => (
                <div 
                  key={item.id} 
                  className="ep-event-mini-item"
                  onClick={(evt) => openEventModal(item.id, 'details', evt)}
                  title="Click to view details"
                >
                  <div className="ep-event-mini-dot" />
                  <div style={{ flex: 1 }}>
                    <h4 className="ep-event-mini-title">{item.title}</h4>
                    <span className="ep-event-mini-date">{item.month} {item.day} • {item.location}</span>
                  </div>
                  <ChevronRight size={14} color="var(--color-text-tertiary)" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {/* EVENT DETAILS & EDIT HUB MODAL */}
      {selectedEvent && (
        <div className="ep-events__modal-overlay" onClick={() => setSelectedEventId(null)}>
          <div className="ep-events__modal ep-events__detail-modal" onClick={e => e.stopPropagation()}>
            
            {/* Modal Navigation Header */}
            <div className="ep-events__modal-nav">
              <div className="ep-tabs">
                <button className={`ep-tab ${modalTab === 'details' ? 'ep-tab--active' : ''}`} onClick={() => setModalTab('details')}>
                  <Eye size={14} style={{ marginRight: 6 }} /> Overview
                </button>
                <button className={`ep-tab ${modalTab === 'edit' ? 'ep-tab--active' : ''}`} onClick={() => setModalTab('edit')}>
                  <Edit3 size={14} style={{ marginRight: 6 }} /> Edit Event
                </button>
                <button className={`ep-tab ${modalTab === 'roster' ? 'ep-tab--active' : ''}`} onClick={() => setModalTab('roster')}>
                  <Users size={14} style={{ marginRight: 6 }} /> Attendees ({selectedEvent.attendees})
                </button>
              </div>
              <button className="ep-events__close-btn" onClick={() => setSelectedEventId(null)}>
                <X size={18} />
              </button>
            </div>

            {/* TAB 1: OVERVIEW & DETAILS */}
            {modalTab === 'details' && (
              <>
                <div className="ep-events__detail-header" style={{ marginTop: 12 }}>
                  <div className="ep-events__detail-badge-group">
                    <span className="ep-badge ep-badge--primary">{selectedEvent.category}</span>
                    {selectedEvent.featured && (
                      <span className="ep-badge ep-badge--warning" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={12} fill="#f59e0b" /> Featured Highlight
                      </span>
                    )}
                    {selectedEvent.isRsvpd && (
                      <span className="ep-badge ep-badge--success" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <UserCheck size={12} /> You are Attending
                      </span>
                    )}
                    {selectedEvent.hasReminder && (
                      <span className="ep-badge ep-badge--info" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Bell size={12} /> Reminder Active
                      </span>
                    )}
                  </div>
                </div>

                <div className="ep-events__detail-hero">
                  <div className="ep-event-card__date-badge" style={{ width: 64, height: 68 }}>
                    <span className="ep-event-card__month" style={{ fontSize: 12 }}>{selectedEvent.month}</span>
                    <span className="ep-event-card__day" style={{ fontSize: 24 }}>{selectedEvent.day}</span>
                  </div>
                  <div>
                    <h2 className="ep-events__detail-title">{selectedEvent.title}</h2>
                    <div className="ep-events__detail-meta-row">
                      <span><Clock size={14} /> {selectedEvent.time}</span>
                      <span><MapPin size={14} /> {selectedEvent.location}</span>
                    </div>
                  </div>
                </div>

                <div className="ep-events__detail-grid">
                  <div className="ep-events__detail-card">
                    <Building size={16} color="var(--color-primary-400)" />
                    <div>
                      <span className="ep-events__detail-label">Organizer</span>
                      <span className="ep-events__detail-value">{selectedEvent.organizer || 'Campus Administration'}</span>
                    </div>
                  </div>
                  <div className="ep-events__detail-card">
                    <Tag size={16} color="var(--color-primary-400)" />
                    <div>
                      <span className="ep-events__detail-label">Target Audience</span>
                      <span className="ep-events__detail-value">{selectedEvent.tier || 'All School'}</span>
                    </div>
                  </div>
                  <div className="ep-events__detail-card">
                    <Users size={16} color="var(--color-primary-400)" />
                    <div>
                      <span className="ep-events__detail-label">Confirmed RSVPs</span>
                      <span className="ep-events__detail-value">{selectedEvent.attendees} Registered</span>
                    </div>
                  </div>
                  <div className="ep-events__detail-card">
                    <Globe size={16} color="var(--color-primary-400)" />
                    <div>
                      <span className="ep-events__detail-label">Visibility</span>
                      <span className="ep-events__detail-value">Public Campus Calendar</span>
                    </div>
                  </div>
                </div>

                {selectedEvent.description && (
                  <div className="ep-events__detail-section">
                    <h4>About this Event</h4>
                    <p>{selectedEvent.description}</p>
                  </div>
                )}

                <div className="ep-events__detail-actions">
                  <button 
                    className={`ep-btn ${selectedEvent.isRsvpd ? 'ep-btn--success' : 'ep-btn--primary'}`}
                    onClick={() => toggleRSVP(selectedEvent.id)}
                  >
                    <CheckCircle size={16} /> {selectedEvent.isRsvpd ? 'Attending (Cancel)' : 'RSVP Now'}
                  </button>
                  <button className="ep-btn ep-btn--secondary" onClick={() => setModalTab('edit')}>
                    <Edit3 size={16} /> Edit Form
                  </button>
                  <button className="ep-btn ep-btn--secondary" onClick={(e) => handleOpenBroadcast(selectedEvent, e)}>
                    <Send size={16} /> Broadcast
                  </button>
                  <button className="ep-btn ep-btn--secondary" onClick={(e) => handleOpenShare(selectedEvent, e)}>
                    <Share2 size={16} /> Share
                  </button>
                  <button className="ep-btn ep-btn--secondary" onClick={() => toggleReminder(selectedEvent.id)}>
                    <Bell size={16} /> {selectedEvent.hasReminder ? 'Reminder On' : 'Remind Me'}
                  </button>
                  <button className="ep-btn ep-btn--secondary" onClick={() => handleExportICS(selectedEvent)}>
                    <Download size={16} /> iCal Export
                  </button>
                  <button className="ep-btn ep-btn--danger" onClick={() => handleDelete(selectedEvent.id)}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </>
            )}

            {/* TAB 2: EDIT EVENT FORM */}
            {modalTab === 'edit' && (
              <div style={{ marginTop: 16 }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--color-text-primary)' }}>Edit Event Information</h3>
                <div className="ep-events__form-grid">
                  <div className="ep-events__form-group ep-events__form-group--full">
                    <label className="ep-events__form-label">Event Title *</label>
                    <input 
                      type="text"
                      className="ep-events__form-input" 
                      value={eventForm.title}
                      onChange={e => setEventForm({...eventForm, title: e.target.value})} 
                    />
                  </div>

                  <div className="ep-events__form-group">
                    <label className="ep-events__form-label">Category</label>
                    <select 
                      className="ep-events__form-input" 
                      value={eventForm.category}
                      onChange={e => setEventForm({...eventForm, category: e.target.value as any})}
                    >
                      <option value="Academic">Academic</option>
                      <option value="Sports">Sports</option>
                      <option value="Culture">Culture</option>
                      <option value="Administrative">Administrative</option>
                    </select>
                  </div>

                  <div className="ep-events__form-group">
                    <label className="ep-events__form-label">Date</label>
                    <input 
                      type="date" 
                      className="ep-events__form-input" 
                      value={eventForm.date}
                      onChange={e => setEventForm({...eventForm, date: e.target.value})} 
                    />
                  </div>

                  <div className="ep-events__form-group">
                    <label className="ep-events__form-label">Start Time</label>
                    <input 
                      type="time" 
                      className="ep-events__form-input" 
                      value={eventForm.startTime}
                      onChange={e => setEventForm({...eventForm, startTime: e.target.value})} 
                    />
                  </div>

                  <div className="ep-events__form-group">
                    <label className="ep-events__form-label">End Time</label>
                    <input 
                      type="time" 
                      className="ep-events__form-input" 
                      value={eventForm.endTime}
                      onChange={e => setEventForm({...eventForm, endTime: e.target.value})} 
                    />
                  </div>

                  <div className="ep-events__form-group">
                    <label className="ep-events__form-label">Location / Venue</label>
                    <input 
                      type="text"
                      className="ep-events__form-input" 
                      value={eventForm.location}
                      onChange={e => setEventForm({...eventForm, location: e.target.value})} 
                    />
                  </div>

                  <div className="ep-events__form-group">
                    <label className="ep-events__form-label">Organizer / Department</label>
                    <input 
                      type="text"
                      className="ep-events__form-input" 
                      value={eventForm.organizer}
                      onChange={e => setEventForm({...eventForm, organizer: e.target.value})} 
                    />
                  </div>

                  <div className="ep-events__form-group">
                    <label className="ep-events__form-label">Target Audience / Tier</label>
                    <select 
                      className="ep-events__form-input" 
                      value={eventForm.tier}
                      onChange={e => setEventForm({...eventForm, tier: e.target.value})}
                    >
                      <option value="All School">All School</option>
                      <option value="Staff Only">Staff Only</option>
                      <option value="Students Only">Students Only</option>
                      <option value="Parents Only">Parents Only</option>
                      <option value="External">External Guests</option>
                    </select>
                  </div>

                  <div className="ep-events__form-group" style={{ display: 'flex', alignItems: 'center', marginTop: 24 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      <input 
                        type="checkbox"
                        checked={eventForm.featured}
                        onChange={e => setEventForm({...eventForm, featured: e.target.checked})}
                      />
                      Mark as Featured Highlight
                    </label>
                  </div>

                  <div className="ep-events__form-group ep-events__form-group--full">
                    <label className="ep-events__form-label">Description & Agenda</label>
                    <textarea 
                      rows={4}
                      className="ep-events__form-input" 
                      value={eventForm.description}
                      onChange={e => setEventForm({...eventForm, description: e.target.value})}
                    />
                  </div>
                </div>

                <div className="ep-events__modal-footer">
                  <button className="ep-btn ep-btn--secondary" onClick={() => setModalTab('details')}>
                    Cancel
                  </button>
                  <button className="ep-btn ep-btn--primary" onClick={handleSaveEvent}>
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: ATTENDEE ROSTER */}
            {modalTab === 'roster' && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--color-text-primary)' }}>Registered Guest List</h3>
                  <span className="ep-badge ep-badge--primary">{selectedEvent.attendees} Confirmed</span>
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  <input 
                    type="text" 
                    placeholder="Register new attendee name..."
                    className="ep-events__form-input"
                    value={newAttendeeName}
                    onChange={e => setNewAttendeeName(e.target.value)}
                  />
                  <button className="ep-btn ep-btn--primary" style={{ flexShrink: 0 }} onClick={handleAddRosterAttendee}>
                    <UserPlus size={14} /> Add
                  </button>
                </div>

                <div className="ep-table-wrapper" style={{ maxHeight: 280, overflowY: 'auto' }}>
                  <table className="ep-table">
                    <thead>
                      <tr>
                        <th>Attendee Name</th>
                        <th>Role / Group</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rosterList.map((person, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{person.name}</td>
                          <td>{person.role}</td>
                          <td>
                            <span className={`ep-badge ${person.status === 'Confirmed' ? 'ep-badge--success' : 'ep-badge--warning'}`}>
                              {person.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="ep-events__modal-footer">
                  <button className="ep-btn ep-btn--secondary" onClick={() => setModalTab('details')}>
                    Back to Overview
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* DEDICATED BROADCAST ANNOUNCEMENT MODAL */}
      {broadcastEvent && (
        <div className="ep-events__modal-overlay" onClick={() => setBroadcastEvent(null)}>
          <div className="ep-events__modal ep-events__broadcast-modal" onClick={e => e.stopPropagation()}>
            <div className="ep-events__modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Megaphone size={20} color="var(--color-primary-400)" />
                <h3 className="ep-events__modal-title">Broadcast Event Notice</h3>
              </div>
              <button className="ep-events__close-btn" onClick={() => setBroadcastEvent(null)}>
                <X size={18} />
              </button>
            </div>

            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              Send instant announcements & push notifications to all guests registered for <strong>{broadcastEvent.title}</strong>.
            </p>

            <div className="ep-events__form-group">
              <label className="ep-events__form-label">Subject / Announcement Heading</label>
              <input 
                type="text"
                className="ep-events__form-input" 
                value={broadcastForm.subject}
                onChange={e => setBroadcastForm({ ...broadcastForm, subject: e.target.value })}
              />
            </div>

            <div className="ep-events__form-group">
              <label className="ep-events__form-label">Target Audience</label>
              <select 
                className="ep-events__form-input"
                value={broadcastForm.targetAudience}
                onChange={e => setBroadcastForm({ ...broadcastForm, targetAudience: e.target.value })}
              >
                <option value={`All ${broadcastEvent.attendees} Confirmed Attendees`}>All {broadcastEvent.attendees} Confirmed Attendees</option>
                <option value="Faculty & Staff Only">Faculty & Staff Only</option>
                <option value="Students Only">Students Only</option>
                <option value="Parents Only">Parents Only</option>
              </select>
            </div>

            <div className="ep-events__form-group">
              <label className="ep-events__form-label">Delivery Channels</label>
              <div className="ep-events__channels-grid">
                <label className="ep-events__channel-card">
                  <input 
                    type="checkbox" 
                    checked={broadcastForm.channels.email}
                    onChange={e => setBroadcastForm({ ...broadcastForm, channels: { ...broadcastForm.channels, email: e.target.checked } })}
                  />
                  <Mail size={16} /> Email Blast
                </label>
                <label className="ep-events__channel-card">
                  <input 
                    type="checkbox" 
                    checked={broadcastForm.channels.push}
                    onChange={e => setBroadcastForm({ ...broadcastForm, channels: { ...broadcastForm.channels, push: e.target.checked } })}
                  />
                  <Smartphone size={16} /> Mobile Push
                </label>
                <label className="ep-events__channel-card">
                  <input 
                    type="checkbox" 
                    checked={broadcastForm.channels.portalBanner}
                    onChange={e => setBroadcastForm({ ...broadcastForm, channels: { ...broadcastForm.channels, portalBanner: e.target.checked } })}
                  />
                  <Globe size={16} /> Portal Banner
                </label>
                <label className="ep-events__channel-card">
                  <input 
                    type="checkbox" 
                    checked={broadcastForm.channels.sms}
                    onChange={e => setBroadcastForm({ ...broadcastForm, channels: { ...broadcastForm.channels, sms: e.target.checked } })}
                  />
                  <MessageSquare size={16} /> SMS Alert
                </label>
              </div>
            </div>

            <div className="ep-events__form-group">
              <label className="ep-events__form-label">Message Content</label>
              <textarea 
                rows={5}
                className="ep-events__form-input"
                value={broadcastForm.message}
                onChange={e => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
              />
            </div>

            <div className="ep-events__modal-footer">
              <button className="ep-btn ep-btn--secondary" onClick={() => setBroadcastEvent(null)}>
                Cancel
              </button>
              <button className="ep-btn ep-btn--primary" onClick={handleExecuteBroadcast}>
                <Send size={14} /> Send Broadcast Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED SHARE EVENT DIALOG */}
      {shareEvent && (
        <div className="ep-events__modal-overlay" onClick={() => setShareEvent(null)}>
          <div className="ep-events__modal ep-events__share-modal" onClick={e => e.stopPropagation()}>
            <div className="ep-events__modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Share2 size={20} color="var(--color-primary-400)" />
                <h3 className="ep-events__modal-title">Share Event</h3>
              </div>
              <button className="ep-events__close-btn" onClick={() => setShareEvent(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'var(--color-text-primary)' }}>{shareEvent.title}</h4>
              <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>{shareEvent.month} {shareEvent.day} • {shareEvent.location}</span>
            </div>

            <div className="ep-events__share-section">
              <label className="ep-events__form-label">Direct Event Link</label>
              <div className="ep-events__share-input-group">
                <input 
                  type="text" 
                  readOnly 
                  className="ep-events__form-input" 
                  value={`${window.location.origin}/events?id=${shareEvent.id}`} 
                />
                <button className="ep-btn ep-btn--primary" onClick={() => handleCopyShareLink(shareEvent)}>
                  {copiedLink ? <Check size={14} /> : <Copy size={14} />} {copiedLink ? 'Copied' : 'Copy Link'}
                </button>
              </div>
            </div>

            <div className="ep-events__share-section" style={{ marginTop: 16 }}>
              <label className="ep-events__form-label">Copy Formatted Text Summary</label>
              <button className="ep-btn ep-btn--secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleCopySummaryText(shareEvent)}>
                {copiedSummary ? <Check size={14} /> : <FileText size={14} />} {copiedSummary ? 'Summary Copied to Clipboard!' : 'Copy Summary Snippet'}
              </button>
            </div>

            <div className="ep-events__share-actions-grid" style={{ marginTop: 20 }}>
              <button className="ep-events__share-action-card" onClick={() => handlePrintFlyer(shareEvent)}>
                <Printer size={20} color="#3b82f6" />
                <span>Print Poster / Flyer</span>
              </button>
              <button className="ep-events__share-action-card" onClick={() => handleExportICS(shareEvent)}>
                <Download size={20} color="#8b5cf6" />
                <span>Export iCal (.ics)</span>
              </button>
              <button className="ep-events__share-action-card" onClick={() => handleOpenBroadcast(shareEvent)}>
                <Megaphone size={20} color="#f59e0b" />
                <span>Broadcast Alert</span>
              </button>
            </div>

            <div className="ep-events__modal-footer">
              <button className="ep-btn ep-btn--secondary" onClick={() => setShareEvent(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW EVENT MODAL */}
      {showCreateModal && (
        <div className="ep-events__modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="ep-events__modal ep-events__form-modal" onClick={e => e.stopPropagation()}>
            <div className="ep-events__modal-header">
              <h3 className="ep-events__modal-title">Create New Campus Event</h3>
              <button className="ep-events__close-btn" onClick={() => setShowCreateModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ep-events__form-grid">
              <div className="ep-events__form-group ep-events__form-group--full">
                <label className="ep-events__form-label">Event Title *</label>
                <input 
                  type="text"
                  className="ep-events__form-input" 
                  value={eventForm.title}
                  placeholder="e.g. Annual STEM Fair 2026"
                  onChange={e => setEventForm({...eventForm, title: e.target.value})} 
                />
              </div>

              <div className="ep-events__form-group">
                <label className="ep-events__form-label">Category</label>
                <select 
                  className="ep-events__form-input" 
                  value={eventForm.category}
                  onChange={e => setEventForm({...eventForm, category: e.target.value as any})}
                >
                  <option value="Academic">Academic</option>
                  <option value="Sports">Sports</option>
                  <option value="Culture">Culture</option>
                  <option value="Administrative">Administrative</option>
                </select>
              </div>

              <div className="ep-events__form-group">
                <label className="ep-events__form-label">Date</label>
                <input 
                  type="date" 
                  className="ep-events__form-input" 
                  value={eventForm.date}
                  onChange={e => setEventForm({...eventForm, date: e.target.value})} 
                />
              </div>

              <div className="ep-events__form-group">
                <label className="ep-events__form-label">Start Time</label>
                <input 
                  type="time" 
                  className="ep-events__form-input" 
                  value={eventForm.startTime}
                  onChange={e => setEventForm({...eventForm, startTime: e.target.value})} 
                />
              </div>

              <div className="ep-events__form-group">
                <label className="ep-events__form-label">End Time</label>
                <input 
                  type="time" 
                  className="ep-events__form-input" 
                  value={eventForm.endTime}
                  onChange={e => setEventForm({...eventForm, endTime: e.target.value})} 
                />
              </div>

              <div className="ep-events__form-group">
                <label className="ep-events__form-label">Location / Venue</label>
                <input 
                  type="text"
                  className="ep-events__form-input" 
                  value={eventForm.location}
                  placeholder="e.g. Auditorium Hall B"
                  onChange={e => setEventForm({...eventForm, location: e.target.value})} 
                />
              </div>

              <div className="ep-events__form-group">
                <label className="ep-events__form-label">Organizer / Department</label>
                <input 
                  type="text"
                  className="ep-events__form-input" 
                  value={eventForm.organizer}
                  placeholder="e.g. Department of Athletics"
                  onChange={e => setEventForm({...eventForm, organizer: e.target.value})} 
                />
              </div>

              <div className="ep-events__form-group">
                <label className="ep-events__form-label">Target Audience / Tier</label>
                <select 
                  className="ep-events__form-input" 
                  value={eventForm.tier}
                  onChange={e => setEventForm({...eventForm, tier: e.target.value})}
                >
                  <option value="All School">All School</option>
                  <option value="Staff Only">Staff Only</option>
                  <option value="Students Only">Students Only</option>
                  <option value="Parents Only">Parents Only</option>
                  <option value="External">External Guests</option>
                </select>
              </div>

              <div className="ep-events__form-group" style={{ display: 'flex', alignItems: 'center', marginTop: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  <input 
                    type="checkbox"
                    checked={eventForm.featured}
                    onChange={e => setEventForm({...eventForm, featured: e.target.checked})}
                  />
                  Mark as Featured Highlight
                </label>
              </div>

              <div className="ep-events__form-group ep-events__form-group--full">
                <label className="ep-events__form-label">Description & Agenda</label>
                <textarea 
                  rows={4}
                  className="ep-events__form-input" 
                  value={eventForm.description}
                  placeholder="Enter detailed event description..."
                  onChange={e => setEventForm({...eventForm, description: e.target.value})}
                />
              </div>
            </div>

            <div className="ep-events__modal-footer">
              <button 
                className="ep-btn ep-btn--secondary" 
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button className="ep-btn ep-btn--primary" onClick={handleSaveEvent}>
                Publish Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
