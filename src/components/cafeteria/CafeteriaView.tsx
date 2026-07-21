import React, { useState } from 'react';
import { Coffee, ShoppingBag, Wallet, Info, Plus, Utensils, DollarSign, CheckCircle } from 'lucide-react';
import './CafeteriaView.css';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  tags: string[];
}

const MENU_ITEMS: MenuItem[] = [
  { id: '1', name: 'Organic Vegetarian Penne Pasta', description: 'Whole wheat penne in house-made roasted tomato marinara sauce', price: '$5.50', category: 'Main', tags: ['Vegetarian', 'Gluten'] },
  { id: '2', name: 'Grilled Chicken Caesar Wrap', description: 'Free-range chicken breast, romaine lettuce, parmesan & Caesar dressing', price: '$6.25', category: 'Main', tags: ['High Protein'] },
  { id: '3', name: 'Fresh Garden Salad Bowl', description: 'Mixed organic greens, cherry tomatoes, cucumbers with balsamic vinaigrette', price: '$4.75', category: 'Sides', tags: ['Vegan', 'Gluten-Free'] },
  { id: '4', name: 'Crispy Sweet Potato Wedges', description: 'Oven-baked sweet potato wedges seasoned with sea salt', price: '$3.50', category: 'Sides', tags: ['Vegan'] },
  { id: '5', name: 'Fresh Fruit Parfait', description: 'Greek yogurtlayered with wild berries and honey oat granola', price: '$3.75', category: 'Dessert', tags: ['Dairy'] }
];

export const CafeteriaView: React.FC = () => {
  const [tab, setTab] = useState<'menu' | 'orders' | 'accounts' | 'dietary'>('menu');

  return (
    <div className="ep-cafeteria">
      {/* 1. Header */}
      <header className="ep-cafeteria__header">
        <div>
          <h1 className="ep-cafeteria__title">Campus Cafeteria & Meal Accounts</h1>
          <p className="ep-cafeteria__subtitle">Manage daily menus, student meal pass balances, and dietary allergies</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="ep-tabs" style={{ padding: '2px' }}>
            <button 
              className={`ep-tab ${tab === 'menu' ? 'ep-tab--active' : ''}`}
              onClick={() => setTab('menu')}
            >
              <Coffee size={14} style={{ marginRight: 4 }} /> Daily Menu
            </button>
            <button 
              className={`ep-tab ${tab === 'orders' ? 'ep-tab--active' : ''}`}
              onClick={() => setTab('orders')}
            >
              <ShoppingBag size={14} style={{ marginRight: 4 }} /> POS Orders
            </button>
            <button 
              className={`ep-tab ${tab === 'accounts' ? 'ep-tab--active' : ''}`}
              onClick={() => setTab('accounts')}
            >
              <Wallet size={14} style={{ marginRight: 4 }} /> Meal Accounts
            </button>
            <button 
              className={`ep-tab ${tab === 'dietary' ? 'ep-tab--active' : ''}`}
              onClick={() => setTab('dietary')}
            >
              <Info size={14} style={{ marginRight: 4 }} /> Dietary
            </button>
          </div>
          <button className="ep-btn ep-btn--primary">
            <Plus size={16} /> + Add Menu Item
          </button>
        </div>
      </header>

      {/* 2. KPI Cards */}
      <section className="ep-cafeteria__kpi-grid">
        <div className="ep-cafeteria__kpi-card">
          <div className="ep-cafeteria__kpi-icon ep-cafeteria__kpi-icon--amber">
            <Coffee size={22} />
          </div>
          <div>
            <div className="ep-cafeteria__kpi-val">1,120</div>
            <div className="ep-cafeteria__kpi-lbl">Meals Served Today</div>
          </div>
        </div>

        <div className="ep-cafeteria__kpi-card">
          <div className="ep-cafeteria__kpi-icon ep-cafeteria__kpi-icon--green">
            <DollarSign size={22} />
          </div>
          <div>
            <div className="ep-cafeteria__kpi-val">$5,840.50</div>
            <div className="ep-cafeteria__kpi-lbl">Daily POS Revenue</div>
          </div>
        </div>

        <div className="ep-cafeteria__kpi-card">
          <div className="ep-cafeteria__kpi-icon ep-cafeteria__kpi-icon--blue">
            <Wallet size={22} />
          </div>
          <div>
            <div className="ep-cafeteria__kpi-val">$42.80</div>
            <div className="ep-cafeteria__kpi-lbl">Avg Student Pass Balance</div>
          </div>
        </div>

        <div className="ep-cafeteria__kpi-card">
          <div className="ep-cafeteria__kpi-icon ep-cafeteria__kpi-icon--purple">
            <Utensils size={22} />
          </div>
          <div>
            <div className="ep-cafeteria__kpi-val">14</div>
            <div className="ep-cafeteria__kpi-lbl">Dietary Allergy Profiles</div>
          </div>
        </div>
      </section>

      {/* 3. Content */}
      <div className="ep-cafeteria__content">
        {tab === 'menu' && (
          <div className="ep-menu-grid">
            {MENU_ITEMS.map(item => (
              <div key={item.id} className="ep-menu-item">
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-text-primary)' }}>{item.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 12px 0' }}>{item.description}</p>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {item.tags.map(t => (
                      <span key={t} className="ep-badge ep-badge--primary" style={{ fontSize: '11px' }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-success-400)' }}>{item.price}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'orders' && (
          <div className="ep-table-wrapper">
            <table className="ep-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Student Name</th>
                  <th>Item</th>
                  <th>Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>#ORD-9021</td>
                  <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Alex Johnson</td>
                  <td>Vegetarian Penne + Water</td>
                  <td>12:15 PM</td>
                  <td style={{ fontWeight: 700 }}>$7.00</td>
                  <td><span className="ep-badge ep-badge--success"><CheckCircle size={12} style={{ marginRight: 4 }} /> Complete</span></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>#ORD-9022</td>
                  <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Mia Johnson</td>
                  <td>Chicken Caesar Wrap</td>
                  <td>12:22 PM</td>
                  <td style={{ fontWeight: 700 }}>$6.25</td>
                  <td><span className="ep-badge ep-badge--success"><CheckCircle size={12} style={{ marginRight: 4 }} /> Complete</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {tab === 'accounts' && (
          <div className="ep-card" style={{ padding: '32px', textAlign: 'center' }}>
            <Wallet size={40} style={{ color: 'var(--color-primary-500)', marginBottom: '12px' }} />
            <h3 style={{ margin: 0 }}>Student Meal Account Balances</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>All student digital meal balances auto-refill via parents' Finance portal.</p>
          </div>
        )}

        {tab === 'dietary' && (
          <div className="ep-card" style={{ padding: '32px', textAlign: 'center' }}>
            <Info size={40} style={{ color: 'var(--color-warning-500)', marginBottom: '12px' }} />
            <h3 style={{ margin: 0 }}>Campus Dietary & Allergy Registry</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>Nut-free and Gluten-free preparation zones strictly enforced in central kitchen.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CafeteriaView;
