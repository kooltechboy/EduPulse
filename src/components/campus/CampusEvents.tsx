import React, { useState } from 'react';
import { Calendar as CalendarIcon, List, Plus, MapPin, Clock, Users, PartyPopper, Award, Sparkles, Filter } from 'lucide-react';
import './CampusEvents.css';

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
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredEvents = filterCategory === 'all' 
    ? EVENTS_DATA 
    : EVENTS_DATA.filter(e => e.category.toLowerCase() === filterCategory.toLowerCase());

  return (
    <div className="ep-campus-events">
      {/* 1. Header */}
      <header className="ep-campus-events__header">
        <div>
          <h1 className="ep-campus-events__title">Campus Events & Activities</h1>
          <p className="ep-campus-events__subtitle">Discover, organize, and manage upcoming institutional events</p>
        </div>
        <div className="ep-campus-events__controls">
          <div className="ep-tabs" style={{ padding: '2px' }}>
            <button 
              className={`ep-tab ${view === 'grid' ? 'ep-tab--active' : ''}`}
              onClick={() => setView('grid')}
            >
              <CalendarIcon size={14} style={{ marginRight: 6 }} /> Grid
            </button>
            <button 
              className={`ep-tab ${view === 'list' ? 'ep-tab--active' : ''}`}
              onClick={() => setView('list')}
            >
              <List size={14} style={{ marginRight: 6 }} /> List
            </button>
          </div>
          <button className="ep-btn ep-btn--primary">
            <Plus size={16} /> + Create Event
          </button>
        </div>
      </header>

      {/* 2. KPI Metrics */}
      <section className="ep-campus-events__kpi-grid">
        <div className="ep-campus-events__kpi-card">
          <div className="ep-campus-events__kpi-icon ep-campus-events__kpi-icon--blue">
            <PartyPopper size={22} />
          </div>
          <div>
            <div className="ep-campus-events__kpi-val">24</div>
            <div className="ep-campus-events__kpi-lbl">Total Events Scheduled</div>
          </div>
        </div>

        <div className="ep-campus-events__kpi-card">
          <div className="ep-campus-events__kpi-icon ep-campus-events__kpi-icon--purple">
            <Award size={22} />
          </div>
          <div>
            <div className="ep-campus-events__kpi-val">12</div>
            <div className="ep-campus-events__kpi-lbl">Academic & STEM Fairs</div>
          </div>
        </div>

        <div className="ep-campus-events__kpi-card">
          <div className="ep-campus-events__kpi-icon ep-campus-events__kpi-icon--amber">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="ep-campus-events__kpi-val">8</div>
            <div className="ep-campus-events__kpi-lbl">Sports & Cultural Meets</div>
          </div>
        </div>

        <div className="ep-campus-events__kpi-card">
          <div className="ep-campus-events__kpi-icon ep-campus-events__kpi-icon--green">
            <Users size={22} />
          </div>
          <div>
            <div className="ep-campus-events__kpi-val">96.4%</div>
            <div className="ep-campus-events__kpi-lbl">Average RSVP Rate</div>
          </div>
        </div>
      </section>

      {/* 3. Main Content Grid */}
      <section className="ep-campus-events__content-grid">
        <div className="ep-campus-events__main">
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
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

          {view === 'grid' ? (
            <div className="ep-campus-events__cards-grid">
              {filteredEvents.map(event => (
                <div key={event.id} className="ep-event-card">
                  <div className="ep-event-card__top">
                    <div className="ep-event-card__date-badge">
                      <span className="ep-event-card__month">{event.month}</span>
                      <span className="ep-event-card__day">{event.day}</span>
                    </div>
                    <div className="ep-event-card__info">
                      <h3 className="ep-event-card__title">{event.title}</h3>
                      <div className="ep-event-card__meta-list">
                        <div className="ep-event-card__meta-item">
                          <Clock size={12} color="var(--color-text-tertiary)" />
                          <span>{event.time}</span>
                        </div>
                        <div className="ep-event-card__meta-item">
                          <MapPin size={12} color="var(--color-text-tertiary)" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ep-event-card__footer">
                    <span className="ep-badge ep-badge--primary">{event.category}</span>
                    <span className="ep-event-card__rsvp">{event.attendees} Attendees</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
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
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map(e => (
                    <tr key={e.id}>
                      <td style={{ fontWeight: 700, color: 'var(--color-primary-400)' }}>{e.month} {e.day}</td>
                      <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{e.title}</td>
                      <td><span className="ep-badge ep-badge--primary">{e.category}</span></td>
                      <td>{e.location}</td>
                      <td>{e.time}</td>
                      <td>{e.attendees} RSVPs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sidebar Featured */}
        <aside className="ep-campus-events__side-panel">
          <div className="ep-campus-events__card">
            <h3 className="ep-campus-events__card-title">Featured Highlights</h3>
            <div className="ep-event-mini-list">
              {EVENTS_DATA.filter(e => e.featured).map(item => (
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

          <div className="ep-campus-events__card" style={{ background: 'linear-gradient(135deg, var(--color-surface-50) 0%, rgba(99, 102, 241, 0.08) 100%)' }}>
            <h3 className="ep-campus-events__card-title">Organizer Toolkit</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
              Need to broadcast an event alert to parents or issue digital event passes?
            </p>
            <button className="ep-btn ep-btn--secondary ep-btn--sm" style={{ marginTop: '8px' }}>
              Broadcast Event Alert
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
};
