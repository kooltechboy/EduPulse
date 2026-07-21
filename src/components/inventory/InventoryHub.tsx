import React, { useState } from 'react';
import { Package, CalendarDays, Plus, Filter, DollarSign, Wrench, CheckCircle } from 'lucide-react';
import './InventoryHub.css';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  condition: 'Good' | 'Fair' | 'Needs Repair';
  assignedTo: string;
  value: string;
}

const ITEMS: InventoryItem[] = [
  { id: '1', name: 'MacBook Pro M2 16"', category: 'Electronics', condition: 'Good', assignedTo: 'IT Lab 102', value: '$2,400' },
  { id: '2', name: 'Epson 4K Laser Projector', category: 'AV Equipment', condition: 'Good', assignedTo: 'Auditorium Hall', value: '$1,850' },
  { id: '3', name: 'Dell XPS 15 Workstation', category: 'Electronics', condition: 'Needs Repair', assignedTo: 'Computer Science Dept', value: '$1,600' },
  { id: '4', name: 'Yamaha Grand Piano', category: 'Arts & Music', condition: 'Good', assignedTo: 'Music Room B', value: '$8,500' }
];

export const InventoryHub: React.FC = () => {
  const [tab, setTab] = useState<'assets' | 'bookings'>('assets');

  return (
    <div className="ep-inventory">
      {/* 1. Header */}
      <header className="ep-inventory__header">
        <div>
          <h1 className="ep-inventory__title">Campus Assets & Inventory Hub</h1>
          <p className="ep-inventory__subtitle">Track institutional equipment, hardware assets, venue bookings, and maintenance logs</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="ep-tabs" style={{ padding: '2px' }}>
            <button 
              className={`ep-tab ${tab === 'assets' ? 'ep-tab--active' : ''}`}
              onClick={() => setTab('assets')}
            >
              <Package size={14} style={{ marginRight: 4 }} /> Hardware Assets
            </button>
            <button 
              className={`ep-tab ${tab === 'bookings' ? 'ep-tab--active' : ''}`}
              onClick={() => setTab('bookings')}
            >
              <CalendarDays size={14} style={{ marginRight: 4 }} /> Venue Bookings
            </button>
          </div>
          <button className="ep-btn ep-btn--primary">
            <Plus size={16} /> + Register Asset
          </button>
        </div>
      </header>

      {/* 2. KPI Cards */}
      <section className="ep-inventory__kpi-grid">
        <div className="ep-inventory__kpi-card">
          <div className="ep-inventory__kpi-icon ep-inventory__kpi-icon--blue">
            <Package size={22} />
          </div>
          <div>
            <div className="ep-inventory__kpi-val">245</div>
            <div className="ep-inventory__kpi-lbl">Total Registered Assets</div>
          </div>
        </div>

        <div className="ep-inventory__kpi-card">
          <div className="ep-inventory__kpi-icon ep-inventory__kpi-icon--green">
            <DollarSign size={22} />
          </div>
          <div>
            <div className="ep-inventory__kpi-val">$145,200</div>
            <div className="ep-inventory__kpi-lbl">Total Inventory Valuation</div>
          </div>
        </div>

        <div className="ep-inventory__kpi-card">
          <div className="ep-inventory__kpi-icon ep-inventory__kpi-icon--amber">
            <Wrench size={22} />
          </div>
          <div>
            <div className="ep-inventory__kpi-val">12</div>
            <div className="ep-inventory__kpi-lbl">Pending Repairs / Maintenance</div>
          </div>
        </div>

        <div className="ep-inventory__kpi-card">
          <div className="ep-inventory__kpi-icon ep-inventory__kpi-icon--purple">
            <CalendarDays size={22} />
          </div>
          <div>
            <div className="ep-inventory__kpi-val">8</div>
            <div className="ep-inventory__kpi-lbl">Active Venue Reservations</div>
          </div>
        </div>
      </section>

      {/* 3. Table */}
      <div className="ep-table-wrapper">
        <table className="ep-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Condition</th>
              <th>Assigned Department</th>
              <th>Estimated Value</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ITEMS.map(item => (
              <tr key={item.id}>
                <td style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{item.name}</td>
                <td><span className="ep-badge ep-badge--primary">{item.category}</span></td>
                <td>
                  <span className={`ep-badge ${item.condition === 'Good' ? 'ep-badge--success' : 'ep-badge--warning'}`}>
                    {item.condition}
                  </span>
                </td>
                <td>{item.assignedTo}</td>
                <td style={{ fontWeight: 700 }}>{item.value}</td>
                <td>
                  <button className="ep-btn ep-btn--secondary ep-btn--sm">Edit Audit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryHub;
