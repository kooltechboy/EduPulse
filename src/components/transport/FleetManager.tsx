import React, { useState } from 'react';
import { Bus, Map, Users, AlertCircle, Plus, CheckCircle, Navigation, Phone, X } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import './FleetManager.css';

interface BusRoute {
  id: string;
  name: string;
  busNumber: string;
  driver: string;
  driverPhone: string;
  capacityCurrent: number;
  capacityMax: number;
  stopsCount: number;
  stops: string;
  status: 'active' | 'inactive';
}

const INITIAL_ROUTES: BusRoute[] = [
  { id: '1', name: 'Route A - North Campus Express', busNumber: 'Bus #42', driver: 'Mike Smith', driverPhone: '555-0101', capacityCurrent: 35, capacityMax: 40, stopsCount: 12, stops: 'North Gate, Tech Park', status: 'active' },
  { id: '2', name: 'Route B - Westside Suburban', busNumber: 'Bus #18', driver: 'Sarah Jenkins', driverPhone: '555-0102', capacityCurrent: 28, capacityMax: 35, stopsCount: 15, stops: 'West Mall, Library', status: 'active' },
  { id: '3', name: 'Route C - East City Line', busNumber: 'Bus #09', driver: 'David Miller', driverPhone: '555-0103', capacityCurrent: 39, capacityMax: 40, stopsCount: 10, stops: 'East Ave, Stadium', status: 'inactive' },
  { id: '4', name: 'Route D - South Valley Shuttle', busNumber: 'Bus #27', driver: 'Robert Taylor', driverPhone: '555-0104', capacityCurrent: 14, capacityMax: 30, stopsCount: 8, stops: 'South Valley, Main', status: 'active' }
];

export const FleetManager: React.FC = () => {
  const addToast = useUIStore(s => s.addToast);
  const [routes, setRoutes] = useState<BusRoute[]>(INITIAL_ROUTES);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState<BusRoute | null>(null);
  const [formData, setFormData] = useState({ name: '', driver: '', driverPhone: '', busNumber: '', capacity: 40, stops: '' });

  const toggleStatus = (id: string) => {
    setRoutes(prev => prev.map(r => {
      if (r.id === id) {
        const newStatus = r.status === 'active' ? 'inactive' : 'active';
        addToast({ type: 'success', title: 'Status Updated', message: `Route ${r.name} marked as ${newStatus}.` });
        return { ...r, status: newStatus };
      }
      return r;
    }));
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoute: BusRoute = {
      id: Date.now().toString(),
      name: formData.name,
      busNumber: formData.busNumber,
      driver: formData.driver,
      driverPhone: formData.driverPhone,
      capacityMax: formData.capacity,
      capacityCurrent: 0,
      stopsCount: formData.stops.split(',').length,
      stops: formData.stops,
      status: 'active'
    };
    setRoutes([...routes, newRoute]);
    setShowAssignModal(false);
    addToast({ type: 'success', title: 'Route Added', message: 'New vehicle route has been successfully assigned.' });
  };
  return (
    <div className="ep-transport">
      {/* 1. Header */}
      <header className="ep-transport__header">
        <div>
          <h1 className="ep-transport__title">Campus Transport & Fleet Management</h1>
          <p className="ep-transport__subtitle">Track bus routes, driver assignments, GPS locations, and student transit rosters</p>
        </div>
        <button className="ep-btn ep-btn--primary" onClick={() => setShowAssignModal(true)}>
          <Plus size={16} /> + Assign Vehicle
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
            {routes.map(r => {
              const capacityPct = Math.round((r.capacityCurrent / r.capacityMax) * 100);
              return (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{r.name}</div>
                    <div className="ep-fleet__tracking-placeholder">
                      <div className="ep-fleet__tracking-dot"></div> Live Tracking Active
                    </div>
                  </td>
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
                    <button 
                      onClick={() => toggleStatus(r.id)}
                      className={`ep-badge ${r.status === 'active' ? 'ep-badge--success' : 'ep-badge--neutral'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                    >
                      {r.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="ep-btn ep-btn--secondary ep-btn--sm" onClick={() => setShowContactModal(r)}>
                        <Phone size={14} style={{ marginRight: 4 }} /> Contact Driver
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showContactModal && (
        <div className="ep-modal-overlay" onClick={() => setShowContactModal(null)}>
          <div className="ep-modal" onClick={e => e.stopPropagation()}>
            <div className="ep-modal-header">
              <h2>Contact Driver</h2>
              <button className="ep-btn ep-btn--ghost" onClick={() => setShowContactModal(null)}><X size={20} /></button>
            </div>
            <div className="ep-modal-content">
              <p><strong>Driver Name:</strong> {showContactModal.driver}</p>
              <p><strong>Phone:</strong> {showContactModal.driverPhone}</p>
              <p><strong>Vehicle Number:</strong> {showContactModal.busNumber}</p>
              <p><strong>Route:</strong> {showContactModal.name}</p>
            </div>
            <div className="ep-modal-footer">
              <button className="ep-btn ep-btn--secondary" onClick={() => setShowContactModal(null)}>Close</button>
              <a href={`tel:${showContactModal.driverPhone}`} className="ep-btn ep-btn--primary">Call</a>
            </div>
          </div>
        </div>
      )}

      {showAssignModal && (
        <div className="ep-modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="ep-modal" onClick={e => e.stopPropagation()}>
            <div className="ep-modal-header">
              <h2>Assign Vehicle</h2>
              <button className="ep-btn ep-btn--ghost" onClick={() => setShowAssignModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAssignSubmit}>
              <div className="ep-modal-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" placeholder="Route Name" required className="ep-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input type="text" placeholder="Driver Name" required className="ep-input" value={formData.driver} onChange={e => setFormData({...formData, driver: e.target.value})} />
                <input type="text" placeholder="Driver Phone" required className="ep-input" value={formData.driverPhone} onChange={e => setFormData({...formData, driverPhone: e.target.value})} />
                <input type="text" placeholder="Vehicle Number" required className="ep-input" value={formData.busNumber} onChange={e => setFormData({...formData, busNumber: e.target.value})} />
                <input type="number" placeholder="Capacity" required className="ep-input" value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} />
                <textarea placeholder="Stops (comma-separated)" required className="ep-input" value={formData.stops} onChange={e => setFormData({...formData, stops: e.target.value})}></textarea>
              </div>
              <div className="ep-modal-footer">
                <button type="button" className="ep-btn ep-btn--secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
                <button type="submit" className="ep-btn ep-btn--primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
