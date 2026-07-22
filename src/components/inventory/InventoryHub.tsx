import React, { useState } from 'react';
import { Package, CalendarDays, Plus, Filter, DollarSign, Wrench, CheckCircle, Search, Download } from 'lucide-react';
import './InventoryHub.css';

declare const addToast: (options: { type: 'success' | 'error' | 'info' | 'warning', title: string, message: string }) => void;

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Broken';
  status: 'available' | 'checked-out';
  assignedTo?: string;
  expectedReturn?: string;
  value: number;
  serialNumber?: string;
  location?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  notes?: string;
}

const ITEMS: InventoryItem[] = [
  { id: '1', name: 'MacBook Pro M2 16"', category: 'Technology', condition: 'Good', status: 'checked-out', assignedTo: 'IT Lab 102', value: 2400 },
  { id: '2', name: 'Epson 4K Laser Projector', category: 'Technology', condition: 'Good', status: 'checked-out', assignedTo: 'Auditorium Hall', value: 1850 },
  { id: '3', name: 'Dell XPS 15 Workstation', category: 'Technology', condition: 'Broken', status: 'available', value: 1600 },
  { id: '4', name: 'Yamaha Grand Piano', category: 'Arts & Music', condition: 'Excellent', status: 'checked-out', assignedTo: 'Music Room B', value: 8500 }
];

export const InventoryHub: React.FC = () => {
  const [tab, setTab] = useState<'assets' | 'bookings'>('assets');
  const [assets, setAssets] = useState<InventoryItem[]>(ITEMS);
  const [query, setQuery] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [filterCond, setFilterCond] = useState('All');

  const [showAddAsset, setShowAddAsset] = useState(false);
  const [showCheckout, setShowCheckout] = useState<string | null>(null);

  const [assetForm, setAssetForm] = useState<Partial<InventoryItem>>({ category: 'Technology', condition: 'Good', value: 0 });
  const [checkoutForm, setCheckoutForm] = useState({ assignedTo: '', expectedReturn: '' });

  const safeAddToast = (opts: any) => {
    if (typeof addToast === 'function') addToast(opts);
    else if (typeof window !== 'undefined' && (window as any).addToast) (window as any).addToast(opts);
  };

  const handleAddAsset = () => {
    if (!assetForm.name) return;
    const newAsset: InventoryItem = {
      ...assetForm,
      id: Math.random().toString(),
      status: 'available',
    } as InventoryItem;
    setAssets([...assets, newAsset]);
    setShowAddAsset(false);
    setAssetForm({ category: 'Technology', condition: 'Good', value: 0 });
    safeAddToast({ type: 'success', title: 'Asset Added', message: 'The asset has been added to inventory.' });
  };

  const handleCheckout = (id: string) => {
    if (!checkoutForm.assignedTo) return;
    setAssets(assets.map(a => a.id === id ? { ...a, status: 'checked-out', assignedTo: checkoutForm.assignedTo, expectedReturn: checkoutForm.expectedReturn } : a));
    setShowCheckout(null);
    setCheckoutForm({ assignedTo: '', expectedReturn: '' });
    safeAddToast({ type: 'success', title: 'Asset Checked Out', message: 'Asset checked out successfully.' });
  };

  const handleCheckIn = (id: string) => {
    setAssets(assets.map(a => a.id === id ? { ...a, status: 'available', assignedTo: undefined, expectedReturn: undefined } : a));
    safeAddToast({ type: 'success', title: 'Asset Checked In', message: 'Asset checked in successfully.' });
  };

  const handleConditionChange = (id: string, condition: any) => {
    setAssets(assets.map(a => a.id === id ? { ...a, condition } : a));
    safeAddToast({ type: 'info', title: 'Updated', message: 'Asset condition updated.' });
  };

  const handleExport = () => {
    const csv = ['Name,Category,Condition,Status,Value,AssignedTo'];
    assets.forEach(a => csv.push(`${a.name},${a.category},${a.condition},${a.status},${a.value},${a.assignedTo || ''}`));
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventory.csv';
    link.click();
  };

  const filtered = assets.filter(a => {
    const mQ = a.name.toLowerCase().includes(query.toLowerCase()) || (a.serialNumber || '').toLowerCase().includes(query.toLowerCase());
    const mCat = filterCat === 'All' || a.category === filterCat;
    const mCond = filterCond === 'All' || a.condition === filterCond;
    return mQ && mCat && mCond;
  });

  return (
    <div className="ep-inventory">
      <header className="ep-inventory__header">
        <div>
          <h1 className="ep-inventory__title">Campus Assets & Inventory Hub</h1>
          <p className="ep-inventory__subtitle">Track institutional equipment, hardware assets, venue bookings, and maintenance logs</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="ep-tabs" style={{ padding: '2px' }}>
            <button className={`ep-tab ${tab === 'assets' ? 'ep-tab--active' : ''}`} onClick={() => setTab('assets')}>
              <Package size={14} style={{ marginRight: 4 }} /> Hardware Assets
            </button>
            <button className={`ep-tab ${tab === 'bookings' ? 'ep-tab--active' : ''}`} onClick={() => setTab('bookings')}>
              <CalendarDays size={14} style={{ marginRight: 4 }} /> Venue Bookings
            </button>
          </div>
          <button className="ep-btn ep-btn--secondary" onClick={handleExport}><Download size={16} /> Export CSV</button>
          <button className="ep-btn ep-btn--primary" onClick={() => setShowAddAsset(true)}><Plus size={16} /> + Add Asset</button>
        </div>
      </header>

      <section className="ep-inventory__kpi-grid">
        <div className="ep-inventory__kpi-card"><div className="ep-inventory__kpi-icon ep-inventory__kpi-icon--blue"><Package size={22} /></div><div><div className="ep-inventory__kpi-val">{assets.length}</div><div className="ep-inventory__kpi-lbl">Total Registered Assets</div></div></div>
        <div className="ep-inventory__kpi-card"><div className="ep-inventory__kpi-icon ep-inventory__kpi-icon--green"><DollarSign size={22} /></div><div><div className="ep-inventory__kpi-val">${assets.reduce((sum, a) => sum + (a.value || 0), 0).toLocaleString()}</div><div className="ep-inventory__kpi-lbl">Total Inventory Valuation</div></div></div>
        <div className="ep-inventory__kpi-card"><div className="ep-inventory__kpi-icon ep-inventory__kpi-icon--amber"><Wrench size={22} /></div><div><div className="ep-inventory__kpi-val">{assets.filter(a => a.condition === 'Broken' || a.condition === 'Poor').length}</div><div className="ep-inventory__kpi-lbl">Pending Repairs / Maintenance</div></div></div>
        <div className="ep-inventory__kpi-card"><div className="ep-inventory__kpi-icon ep-inventory__kpi-icon--purple"><CalendarDays size={22} /></div><div><div className="ep-inventory__kpi-val">8</div><div className="ep-inventory__kpi-lbl">Active Venue Reservations</div></div></div>
      </section>

      {tab === 'assets' && (
        <div className="ep-inventory__content">
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--color-text-tertiary)' }} />
              <input type="text" placeholder="Search assets..." value={query} onChange={e => setQuery(e.target.value)} className="ep-inventory__form-input" style={{ paddingLeft: '32px' }} />
            </div>
            <select className="ep-inventory__form-input" style={{ width: 'auto' }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
              <option>All</option><option>Technology</option><option>Furniture</option><option>Sports</option><option>Lab Equipment</option><option>Books</option><option>Vehicle</option><option>Other</option>
            </select>
            <select className="ep-inventory__form-input" style={{ width: 'auto' }} value={filterCond} onChange={e => setFilterCond(e.target.value)}>
              <option>All</option><option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option><option>Broken</option>
            </select>
          </div>

          <div className="ep-table-wrapper">
            <table className="ep-table">
              <thead><tr><th>Item Name</th><th>Category</th><th>Condition</th><th>Status / Assignment</th><th>Estimated Value</th><th>Action</th></tr></thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{item.name}</td>
                    <td><span className="ep-badge ep-badge--primary">{item.category}</span></td>
                    <td>
                      <select className={`ep-badge ${['Excellent','Good'].includes(item.condition) ? 'ep-badge--success' : item.condition === 'Fair' ? 'ep-badge--warning' : 'ep-badge--danger'}`} value={item.condition} onChange={e => handleConditionChange(item.id, e.target.value)} style={{ border: 'none', appearance: 'none', cursor: 'pointer' }}>
                        <option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option><option>Broken</option>
                      </select>
                    </td>
                    <td>
                      {item.status === 'checked-out' ? <><span className="ep-badge ep-badge--warning">Checked Out</span> <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>to {item.assignedTo}</span></> : <span className="ep-badge ep-badge--success">Available</span>}
                    </td>
                    <td style={{ fontWeight: 700 }}>${item.value.toLocaleString()}</td>
                    <td>
                      {item.status === 'available' ? (
                        <button className="ep-btn ep-btn--secondary ep-btn--sm" onClick={() => setShowCheckout(item.id)}>Check Out</button>
                      ) : (
                        <button className="ep-btn ep-btn--primary ep-btn--sm" onClick={() => handleCheckIn(item.id)}>Check In</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddAsset && (
        <div className="ep-inventory__modal-overlay">
          <div className="ep-inventory__modal">
            <h3 className="ep-inventory__modal-title">Add Asset</h3>
            <div className="ep-inventory__form-group"><label className="ep-inventory__form-label">Asset Name</label><input className="ep-inventory__form-input" onChange={e => setAssetForm({...assetForm, name: e.target.value})} /></div>
            <div className="ep-inventory__form-group"><label className="ep-inventory__form-label">Category</label>
              <select className="ep-inventory__form-input" onChange={e => setAssetForm({...assetForm, category: e.target.value})}>
                {['Technology','Furniture','Sports','Lab Equipment','Books','Vehicle','Other'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="ep-inventory__form-group"><label className="ep-inventory__form-label">Serial Number</label><input className="ep-inventory__form-input" onChange={e => setAssetForm({...assetForm, serialNumber: e.target.value})} /></div>
            <div className="ep-inventory__form-group"><label className="ep-inventory__form-label">Location</label><input className="ep-inventory__form-input" onChange={e => setAssetForm({...assetForm, location: e.target.value})} /></div>
            <div className="ep-inventory__form-group"><label className="ep-inventory__form-label">Condition</label>
              <select className="ep-inventory__form-input" onChange={e => setAssetForm({...assetForm, condition: e.target.value as any})}>
                {['Excellent','Good','Fair','Poor','Broken'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="ep-inventory__form-group"><label className="ep-inventory__form-label">Purchase Date</label><input type="date" className="ep-inventory__form-input" onChange={e => setAssetForm({...assetForm, purchaseDate: e.target.value})} /></div>
            <div className="ep-inventory__form-group"><label className="ep-inventory__form-label">Warranty Expiry (optional)</label><input type="date" className="ep-inventory__form-input" onChange={e => setAssetForm({...assetForm, warrantyExpiry: e.target.value})} /></div>
            <div className="ep-inventory__form-group"><label className="ep-inventory__form-label">Value ($)</label><input type="number" className="ep-inventory__form-input" onChange={e => setAssetForm({...assetForm, value: Number(e.target.value)})} /></div>
            <div className="ep-inventory__form-group"><label className="ep-inventory__form-label">Notes</label><textarea className="ep-inventory__form-input" onChange={e => setAssetForm({...assetForm, notes: e.target.value})}></textarea></div>
            <div className="ep-inventory__modal-footer">
              <button className="ep-btn ep-btn--secondary" onClick={() => setShowAddAsset(false)}>Cancel</button>
              <button className="ep-btn ep-btn--primary" onClick={handleAddAsset}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {showCheckout && (
        <div className="ep-inventory__modal-overlay">
          <div className="ep-inventory__modal">
            <h3 className="ep-inventory__modal-title">Checkout Asset</h3>
            <div className="ep-inventory__form-group"><label className="ep-inventory__form-label">Assigned To</label><input className="ep-inventory__form-input" onChange={e => setCheckoutForm({...checkoutForm, assignedTo: e.target.value})} /></div>
            <div className="ep-inventory__form-group"><label className="ep-inventory__form-label">Expected Return Date</label><input type="date" className="ep-inventory__form-input" onChange={e => setCheckoutForm({...checkoutForm, expectedReturn: e.target.value})} /></div>
            <div className="ep-inventory__modal-footer">
              <button className="ep-btn ep-btn--secondary" onClick={() => setShowCheckout(null)}>Cancel</button>
              <button className="ep-btn ep-btn--primary" onClick={() => handleCheckout(showCheckout)}>Confirm Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
