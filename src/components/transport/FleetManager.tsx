import React from 'react';
import { Bus, Map, Users, AlertCircle, Plus, CheckCircle, Navigation } from 'lucide-react';
import './FleetManager.css';

interface BusRoute {
  id: string;
  name: string;
  busNumber: string;
  driver: string;
  capacityCurrent: number;
  capacityMax: number;
  stopsCount: number;
  status: 'on_time' | 'delayed' | 'maintenance';
}

const ROUTES: BusRoute[] = [
  { id: '1', name: 'Route A - North Campus Express', busNumber: 'Bus #42', driver: 'Mike Smith', capacityCurrent: 35, capacityMax: 40, stopsCount: 12, status: 'on_time' },
  { id: '2', name: 'Route B - Westside Suburban', busNumber: 'Bus #18', driver: 'Sarah Jenkins', capacityCurrent: 28, capacityMax: 35, stopsCount: 15, status: 'on_time' },
  { id: '3', name: 'Route C - East City Line', busNumber: 'Bus #09', driver: 'David Miller', capacityCurrent: 39, capacityMax: 40, stopsCount: 10, status: 'delayed' },
  { id: '4', name: 'Route D - South Valley Shuttle', busNumber: 'Bus #27', driver: 'Robert Taylor', capacityCurrent: 14, capacityMax: 30, stopsCount: 8, status: 'on_time' }
];

export const FleetManager: React.FC = () => {
  return (
    <div className="ep-transport">
      {/* 1. Header */}
      <header className="ep-transport__header">
        <div>
          <h1 className="ep-transport__title">Campus Transport & Fleet Management</h1>
          <p className="ep-transport__subtitle">Track bus routes, driver assignments, GPS locations, and student transit rosters</p>
        </div>
        <button className="ep-btn ep-btn--primary">
          <Plus size={16} /> + Dispatch New Route
        </button>
      </header>

      {/* 2. KPI Cards */}
      <section className="ep-transport__kpi-grid">
        <div className="ep-transport__kpi-card">
          <div className="ep-transport__kpi-icon ep-transport__kpi-icon--blue">
            <Bus size={22} />
          </div>
          <div>
            <div className="ep-transport__kpi-val">12</div>
            <div className="ep-transport__kpi-lbl">Active Bus Fleet Routes</div>
          </div>
        </div>

        <div className="ep-transport__kpi-card">
          <div className="ep-transport__kpi-icon ep-transport__kpi-icon--green">
            <Users size={22} />
          </div>
          <div>
            <div className="ep-transport__kpi-val">450</div>
            <div className="ep-transport__kpi-lbl">Students In Transit</div>
          </div>
        </div>

        <div className="ep-transport__kpi-card">
          <div className="ep-transport__kpi-icon ep-transport__kpi-icon--purple">
            <Map size={22} />
          </div>
          <div>
            <div className="ep-transport__kpi-val">85</div>
            <div className="ep-transport__kpi-lbl">Total Registered Bus Stops</div>
          </div>
        </div>

        <div className="ep-transport__kpi-card">
          <div className="ep-transport__kpi-icon ep-transport__kpi-icon--amber">
            <AlertCircle size={22} />
          </div>
          <div>
            <div className="ep-transport__kpi-val">1</div>
            <div className="ep-transport__kpi-lbl">Minor Traffic Delays</div>
          </div>
        </div>
      </section>

      {/* 3. Routes Table */}
      <div className="ep-table-wrapper">
        <table className="ep-table">
          <thead>
            <tr>
              <th>Route Name</th>
              <th>Vehicle & Driver</th>
              <th>Passengers / Capacity</th>
              <th>Total Stops</th>
              <th>Live Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ROUTES.map(r => {
              const capacityPct = Math.round((r.capacityCurrent / r.capacityMax) * 100);
              return (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{r.name}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.busNumber}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Driver: {r.driver}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                      {r.capacityCurrent} / {r.capacityMax} ({capacityPct}%)
                    </div>
                    <div className="ep-progress" style={{ height: '6px', width: '120px' }}>
                      <div className="ep-progress__bar" style={{ width: `${capacityPct}%` }} />
                    </div>
                  </td>
                  <td>{r.stopsCount} Stops</td>
                  <td>
                    <span className={`ep-badge ${r.status === 'on_time' ? 'ep-badge--success' : 'ep-badge--warning'}`}>
                      {r.status === 'on_time' && <CheckCircle size={12} style={{ marginRight: 4 }} />}
                      {r.status === 'delayed' && <AlertCircle size={12} style={{ marginRight: 4 }} />}
                      {r.status === 'on_time' ? 'On Time' : 'Delayed'}
                    </span>
                  </td>
                  <td>
                    <button className="ep-btn ep-btn--secondary ep-btn--sm">
                      <Navigation size={14} style={{ marginRight: 4 }} /> Live GPS
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
