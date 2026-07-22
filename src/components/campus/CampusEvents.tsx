import React, { useState } from 'react';
import { Calendar as CalendarIcon, List, Plus, MapPin, Clock, Users, PartyPopper, Award, Sparkles, Filter, Trash2, CheckCircle } from 'lucide-react';
import './CampusEvents.css';

declare const addToast: (options: { type: 'success' | 'error' | 'info' | 'warning', title: string, message: string }) => void;

interface EventItem {
  id: string;
  title: string;
  month: string;
  day: string;
  time: string;
  location: string;
  category: 'Academic' | 'Sports' | 'Culture' | 'Administrative';
  attendees: number;
  featured?: boolean;
  description?: string;
  organizer?: string;
  tier?: string;
  isRsvpd?: boolean;
}

const EVENTS_DATA: EventItem[] = [
  { id: '1', title: 'Annual STEM & Innovation Fair 2026', month: 'OCT', day: '15', time: '10:00 AM - 04:00 PM', location: 'Main Exhibition Hall', category: 'Academic', attendees: 450, featured: true },
  { id: '2', title: 'Inter-School Athletics Championship', month: 'OCT', day: '22', time: '08:30 AM - 05:00 PM', location: 'Campus Sports Arena', category: 'Sports', attendees: 800, featured: true },
  { id: '3', title: 'Autumn Symphony & Jazz Concert', month: 'NOV', day: '05', time: '06:00 PM - 09:00 PM', location: 'Auditorium Center', category: 'Culture', attendees: 320 },
  { id: '4', title: 'Q3 Parent-Teacher Conference Day', month: 'NOV', day: '12', time: '09:00 AM - 03:00 PM', location: 'Classroom Block B', category: 'Administrative', attendees: 600 },
  { id: '5', title: 'Cybersecurity & AI Workshop', month: 'DEC', day: '02', time: '01:00 PM - 04:00 PM', location: 'Tech Lab 104', category: 'Academic', attendees: 180 },
  { id: '6', title: 'Winter Gala & Charity Auction', month: 'DEC', day: '18', time: '07:00 PM - 10:00 PM', location: 'Grand Ballroom', category: 'Culture', attendees: 250 }
];

export const CampusEvents: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [events, setEvents] = useState<EventItem[]>(EVENTS_DATA);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', description: '', category: 'Academic', date: '', startTime: '', endTime: '', location: '', organizer: '', tier: 'All School' });
  const [currentMonth] = useState('October 2026');

  const safeAddToast = (opts: any) => {
    if (typeof addToast === 'function') addToast(opts);
    else if (typeof window !== 'undefined' && (window as any).addToast) (window as any).addToast(opts);
  };

  const handleCreateEvent = () => {
    if (!eventForm.title) return;
    const [year, monthNum, day] = eventForm.date.split('-');
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const month = months[parseInt(monthNum)-1] || 'UNK';
    
    const newEvent: EventItem = {
      id: Math.random().toString(),
      title: eventForm.title,
      description: eventForm.description,
      category: eventForm.category as any,
      month,
      day,
      time: `${eventForm.startTime} - ${eventForm.endTime}`,
      location: eventForm.location,
      organizer: eventForm.organizer,
      tier: eventForm.tier,
      attendees: 0
    };
    setEvents([...events, newEvent]);
    setShowCreateModal(false);
    setEventForm({ title: '', description: '', category: 'Academic', date: '', startTime: '', endTime: '', location: '', organizer: '', tier: 'All School' });
    safeAddToast({ type: 'success', title: 'Event Created', message: 'The event has been successfully scheduled.' });
  };

  const toggleRSVP = (id: string) => {
    setEvents(events.map(e => {
      if (e.id === id) {
        const isRsvpd = !e.isRsvpd;
        if (isRsvpd) safeAddToast({ type: 'success', title: 'RSVP Confirmed', message: `You are registered for ${e.title}.` });
        return { ...e, isRsvpd, attendees: e.attendees + (isRsvpd ? 1 : -1) };
      }
      return e;
    }));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Cancel this event?')) {
      setEvents(events.filter(e => e.id !== id));
      safeAddToast({ type: 'warning', title: 'Event Cancelled', message: 'The event has been deleted.' });
    }
  };

  const filteredEvents = filterCategory === 'all' ? events : events.filter(e => e.category.toLowerCase() === filterCategory.toLowerCase());

  return (
    <div className="ep-campus-events">
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
          <button className="ep-btn ep-btn--primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> + Create Event
          </button>
        </div>
      </header>

      <section className="ep-campus-events__kpi-grid">
        <div className="ep-campus-events__kpi-card"><div className="ep-campus-events__kpi-icon ep-campus-events__kpi-icon--blue"><PartyPopper size={22} /></div><div><div className="ep-campus-events__kpi-val">{events.length}</div><div className="ep-campus-events__kpi-lbl">Total Events Scheduled</div></div></div>
        <div className="ep-campus-events__kpi-card"><div className="ep-campus-events__kpi-icon ep-campus-events__kpi-icon--purple"><Award size={22} /></div><div><div className="ep-campus-events__kpi-val">{events.filter(e => e.category === 'Academic').length}</div><div className="ep-campus-events__kpi-lbl">Academic & STEM Fairs</div></div></div>
        <div className="ep-campus-events__kpi-card"><div className="ep-campus-events__kpi-icon ep-campus-events__kpi-icon--amber"><Sparkles size={22} /></div><div><div className="ep-campus-events__kpi-val">{events.filter(e => e.category === 'Sports').length}</div><div className="ep-campus-events__kpi-lbl">Sports & Cultural Meets</div></div></div>
        <div className="ep-campus-events__kpi-card"><div className="ep-campus-events__kpi-icon ep-campus-events__kpi-icon--green"><Users size={22} /></div><div><div className="ep-campus-events__kpi-val">96.4%</div><div className="ep-campus-events__kpi-lbl">Average RSVP Rate</div></div></div>
      </section>

      <section className="ep-campus-events__content-grid">
        <div className="ep-campus-events__main">
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={14} /> Filter:
            </span>
            {['all', 'academic', 'sports', 'culture', 'administrative'].map(cat => (
              <button key={cat} onClick={() => setFilterCategory(cat)} className={`ep-badge ${filterCategory === cat ? 'ep-badge--primary' : 'ep-badge--neutral'}`} style={{ cursor: 'pointer', textTransform: 'capitalize' }}>
                {cat}
              </button>
            ))}
          </div>

          {view === 'grid' && (
            <div className="ep-campus-events__cards-grid">
              {filteredEvents.map(event => (
                <div key={event.id} className="ep-event-card">
                  <div className="ep-event-card__top">
                    <div className="ep-event-card__date-badge">
                      <span className="ep-event-card__month">{event.month}</span>
                      <span className="ep-event-card__day">{event.day}</span>
                    </div>
                    <div className="ep-event-card__info">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 className="ep-event-card__title">{event.title}</h3>
                        <button className="ep-btn ep-btn--sm" style={{ padding: '4px', background: 'transparent', color: 'var(--color-danger-500)', border: 'none' }} onClick={() => handleDelete(event.id)}>
                          <Trash2 size={14} />
                        </button>
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
                      <button className={`ep-btn ep-btn--sm ${event.isRsvpd ? 'ep-btn--success' : 'ep-btn--secondary'}`} onClick={() => toggleRSVP(event.id)}>
                        {event.isRsvpd ? <><CheckCircle size={14} /> Attending</> : 'RSVP'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {view === 'list' && (
            <div className="ep-table-wrapper">
              <table className="ep-table">
                <thead><tr><th>Date</th><th>Event Title</th><th>Category</th><th>Location</th><th>Time</th><th>Attendees</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredEvents.map(e => (
                    <tr key={e.id}>
                      <td style={{ fontWeight: 700, color: 'var(--color-primary-400)' }}>{e.month} {e.day}</td>
                      <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{e.title}</td>
                      <td><span className="ep-badge ep-badge--primary">{e.category}</span></td>
                      <td>{e.location}</td>
                      <td>{e.time}</td>
                      <td>{e.attendees} RSVPs</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className={`ep-btn ep-btn--sm ${e.isRsvpd ? 'ep-btn--success' : 'ep-btn--secondary'}`} onClick={() => toggleRSVP(e.id)}>{e.isRsvpd ? 'Attending' : 'RSVP'}</button>
                          <button className="ep-btn ep-btn--sm ep-btn--danger" onClick={() => handleDelete(e.id)}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {view === 'calendar' && (
            <div className="ep-events__calendar-view">
              <h3 style={{ margin: '0 0 16px 0' }}>{currentMonth}</h3>
              <div className="ep-events__calendar-grid">
                {Array.from({length: 31}, (_, i) => i + 1).map(day => {
                  const dayEvents = filteredEvents.filter(e => parseInt(e.day) === day && (e.month === 'OCT' || e.month === 'October')); // rough matching for demo
                  return (
                    <div key={day} className="ep-events__calendar-cell">
                      <span className="ep-events__calendar-daynum">{day}</span>
                      <div className="ep-events__calendar-dots">
                        {dayEvents.map(e => <div key={e.id} className="ep-events__calendar-dot" title={e.title} />)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <aside className="ep-campus-events__side-panel">
          <div className="ep-campus-events__card">
            <h3 className="ep-campus-events__card-title">Featured Highlights</h3>
            <div className="ep-event-mini-list">
              {events.filter(e => e.featured).map(item => (
                <div key={item.id} className="ep-event-mini-item">
                  <div className="ep-event-mini-dot" />
                  <div>
                    <h4 className="ep-event-mini-title">{item.title}</h4>
                    <span className="ep-event-mini-date">{item.month} {item.day} • {item.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {showCreateModal && (
        <div className="ep-events__modal-overlay">
          <div className="ep-events__modal">
            <h3 className="ep-events__modal-title">Create New Event</h3>
            <div className="ep-events__form-group"><label className="ep-events__form-label">Title</label><input className="ep-events__form-input" onChange={e => setEventForm({...eventForm, title: e.target.value})} /></div>
            <div className="ep-events__form-group"><label className="ep-events__form-label">Description</label><textarea className="ep-events__form-input" onChange={e => setEventForm({...eventForm, description: e.target.value})}></textarea></div>
            <div className="ep-events__form-group"><label className="ep-events__form-label">Event Type</label>
              <select className="ep-events__form-input" onChange={e => setEventForm({...eventForm, category: e.target.value})}>
                {['Academic','Sports','Cultural','Administrative','Social'].map(c => <option key={c} value={c=== 'Cultural' ? 'Culture' : c}>{c}</option>)}
              </select>
            </div>
            <div className="ep-events__form-group"><label className="ep-events__form-label">Date</label><input type="date" className="ep-events__form-input" onChange={e => setEventForm({...eventForm, date: e.target.value})} /></div>
            <div className="ep-events__form-group"><label className="ep-events__form-label">Start Time</label><input type="time" className="ep-events__form-input" onChange={e => setEventForm({...eventForm, startTime: e.target.value})} /></div>
            <div className="ep-events__form-group"><label className="ep-events__form-label">End Time</label><input type="time" className="ep-events__form-input" onChange={e => setEventForm({...eventForm, endTime: e.target.value})} /></div>
            <div className="ep-events__form-group"><label className="ep-events__form-label">Location</label><input className="ep-events__form-input" onChange={e => setEventForm({...eventForm, location: e.target.value})} /></div>
            <div className="ep-events__form-group"><label className="ep-events__form-label">Organizer</label><input className="ep-events__form-input" onChange={e => setEventForm({...eventForm, organizer: e.target.value})} /></div>
            <div className="ep-events__form-group"><label className="ep-events__form-label">Tier/Audience</label>
              <select className="ep-events__form-input" onChange={e => setEventForm({...eventForm, tier: e.target.value})}>
                {['All School','Staff Only','Students Only','Parents Only','External'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="ep-events__modal-footer">
              <button className="ep-btn ep-btn--secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className="ep-btn ep-btn--primary" onClick={handleCreateEvent}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
