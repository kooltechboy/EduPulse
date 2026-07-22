import React, { useState } from 'react';
import { Coffee, ShoppingBag, Wallet, Info, Plus, Utensils, DollarSign, CheckCircle, X } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import './CafeteriaView.css';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
}

interface PublishedMenu {
  id: string;
  date: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  notes: string;
}

interface StudentAccount {
  id: string;
  name: string;
  balance: number;
  dietary: string;
}

interface Order {
  id: string;
  orderNum: string;
  name: string;
  item: string;
  time: string;
  amount: number;
  status: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: '1', name: 'Organic Vegetarian Penne Pasta', description: 'Whole wheat penne in house-made roasted tomato marinara sauce', price: 5.50, category: 'Main', tags: ['Vegetarian', 'Gluten'] },
  { id: '2', name: 'Grilled Chicken Caesar Wrap', description: 'Free-range chicken breast, romaine lettuce, parmesan & Caesar dressing', price: 6.25, category: 'Main', tags: ['High Protein'] }
];

const INITIAL_ACCOUNTS: StudentAccount[] = [
  { id: '1', name: 'Alex Johnson', balance: 15.00, dietary: 'Vegan' },
  { id: '2', name: 'Mia Miller', balance: 3.50, dietary: 'None' },
  { id: '3', name: 'Lucas Brown', balance: 42.00, dietary: 'Gluten-Free' }
];

export const CafeteriaView: React.FC = () => {
  const addToast = useUIStore(s => s.addToast);
  const [tab, setTab] = useState<'menu' | 'orders' | 'accounts' | 'dietary'>('menu');
  
  const [menus, setMenus] = useState<PublishedMenu[]>([]);
  const [accounts, setAccounts] = useState<StudentAccount[]>(INITIAL_ACCOUNTS);
  const [orders, setOrders] = useState<Order[]>([{ id: '1', orderNum: '#ORD-9021', name: 'Alex Johnson', item: 'Breakfast Menu', time: '12:15 PM', amount: 7.00, status: 'Complete' }]);
  
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [menuForm, setMenuForm] = useState({ date: new Date().toISOString().split('T')[0], breakfast: '', lunch: '', dinner: '', notes: '' });

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState({ accountId: INITIAL_ACCOUNTS[0].id, meal: 'Lunch', quantity: 1 });
  const MEAL_PRICES: Record<string, number> = { Breakfast: 4.5, Lunch: 6.5, Dinner: 8.0 };

  const [showTopUp, setShowTopUp] = useState<StudentAccount | null>(null);
  const [topUpAmount, setTopUpAmount] = useState(10);
  
  const [dietaryFilter, setDietaryFilter] = useState('All');

  const today = new Date().toISOString().split('T')[0];
  const todayMenu = menus.find(m => m.date === today);

  const handlePublishMenu = (e: React.FormEvent) => {
    e.preventDefault();
    setMenus([{ ...menuForm, id: Date.now().toString() }, ...menus]);
    setShowMenuModal(false);
    addToast({ type: 'success', title: 'Menu Published', message: 'Daily menu has been updated.' });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const account = accounts.find(a => a.id === orderForm.accountId);
    if (!account) return;
    const total = MEAL_PRICES[orderForm.meal] * orderForm.quantity;
    if (account.balance < total) {
      addToast({ type: 'error', title: 'Insufficient Balance', message: 'Please top up the meal account.' });
      return;
    }
    setAccounts(prev => prev.map(a => a.id === account.id ? { ...a, balance: a.balance - total } : a));
    setOrders([{
      id: Date.now().toString(),
      orderNum: `#ORD-${Math.floor(Math.random()*10000)}`,
      name: account.name,
      item: `${orderForm.meal} x${orderForm.quantity}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }),
      amount: total,
      status: 'Complete'
    }, ...orders]);
    setShowOrderModal(false);
    addToast({ type: 'success', title: 'Order Placed', message: 'Meal order processed successfully.' });
  };

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showTopUp) return;
    setAccounts(prev => prev.map(a => a.id === showTopUp.id ? { ...a, balance: a.balance + topUpAmount } : a));
    setShowTopUp(null);
    addToast({ type: 'success', title: 'Account Topped Up', message: `Added $${topUpAmount} to account.` });
  };

  const filteredAccounts = accounts.filter(a => dietaryFilter === 'All' || a.dietary === dietaryFilter);

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
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="ep-btn ep-btn--secondary" onClick={() => setShowOrderModal(true)}>
              Place Order
            </button>
            <button className="ep-btn ep-btn--primary" onClick={() => setShowMenuModal(true)}>
              <Plus size={16} /> + Publish Menu
            </button>
          </div>
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
          <div className="ep-menu-section">
            <div style={{ marginBottom: '24px', padding: '16px', background: 'var(--color-surface-100)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              {todayMenu ? (
                <>
                  <h3 style={{ margin: '0 0 12px 0', color: 'var(--color-text-primary)' }}>Today's Menu ({todayMenu.date})</h3>
                  <div style={{ display: 'grid', gap: '8px', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                    <div><strong>Breakfast:</strong> {todayMenu.breakfast}</div>
                    <div><strong>Lunch:</strong> {todayMenu.lunch}</div>
                    {todayMenu.dinner && <div><strong>Dinner:</strong> {todayMenu.dinner}</div>}
                    {todayMenu.notes && <div style={{ color: 'var(--color-warning-500)' }}><strong>Notes:</strong> {todayMenu.notes}</div>}
                  </div>
                </>
              ) : (
                <div style={{ color: 'var(--color-text-tertiary)', textAlign: 'center' }}>No menu published today.</div>
              )}
            </div>
            
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
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-success-400)' }}>${item.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
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
                {orders.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{o.orderNum}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{o.name}</td>
                    <td>{o.item}</td>
                    <td>{o.time}</td>
                    <td style={{ fontWeight: 700 }}>${o.amount.toFixed(2)}</td>
                    <td><span className="ep-badge ep-badge--success"><CheckCircle size={12} style={{ marginRight: 4 }} /> {o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'accounts' && (
          <div>
            <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
              {['All', 'Vegan', 'Vegetarian', 'Gluten-Free', 'Nut Allergy'].map(f => (
                <button key={f} className={`ep-badge ${dietaryFilter === f ? 'ep-badge--primary' : 'ep-badge--neutral'}`} onClick={() => setDietaryFilter(f)} style={{ cursor: 'pointer', border: 'none' }}>
                  {f}
                </button>
              ))}
            </div>
            <div className="ep-table-wrapper">
              <table className="ep-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Dietary Profile</th>
                    <th>Current Balance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map(a => (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{a.name}</td>
                      <td><span className="ep-badge ep-badge--warning">{a.dietary}</span></td>
                      <td style={{ fontWeight: 700, color: a.balance < 5 ? 'var(--color-danger-500)' : 'var(--color-success-500)' }}>${a.balance.toFixed(2)}</td>
                      <td>
                        <button className="ep-btn ep-btn--secondary ep-btn--sm" onClick={() => setShowTopUp(a)}>Top Up</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'dietary' && (
          <div className="ep-card" style={{ padding: '32px', textAlign: 'center' }}>
            <Info size={40} style={{ color: 'var(--color-warning-500)', margin: '0 auto 12px auto' }} />
            <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Campus Dietary & Allergy Registry</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>Nut-free and Gluten-free preparation zones strictly enforced in central kitchen.</p>
          </div>
        )}
      </div>

      {showMenuModal && (
        <div className="ep-modal-overlay" onClick={() => setShowMenuModal(false)}>
          <div className="ep-modal" onClick={e => e.stopPropagation()}>
            <div className="ep-modal-header">
              <h2>Publish Daily Menu</h2>
              <button className="ep-btn ep-btn--ghost" onClick={() => setShowMenuModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handlePublishMenu}>
              <div className="ep-modal-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="date" required className="ep-input" value={menuForm.date} onChange={e => setMenuForm({...menuForm, date: e.target.value})} />
                <textarea placeholder="Breakfast Items (e.g. Scrambled Eggs)" required className="ep-input" value={menuForm.breakfast} onChange={e => setMenuForm({...menuForm, breakfast: e.target.value})}></textarea>
                <textarea placeholder="Lunch Items" required className="ep-input" value={menuForm.lunch} onChange={e => setMenuForm({...menuForm, lunch: e.target.value})}></textarea>
                <textarea placeholder="Dinner/Snack (optional)" className="ep-input" value={menuForm.dinner} onChange={e => setMenuForm({...menuForm, dinner: e.target.value})}></textarea>
                <textarea placeholder="Special Notes (allergy alerts)" className="ep-input" value={menuForm.notes} onChange={e => setMenuForm({...menuForm, notes: e.target.value})}></textarea>
              </div>
              <div className="ep-modal-footer">
                <button type="button" className="ep-btn ep-btn--secondary" onClick={() => setShowMenuModal(false)}>Cancel</button>
                <button type="submit" className="ep-btn ep-btn--primary">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showOrderModal && (
        <div className="ep-modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="ep-modal" onClick={e => e.stopPropagation()}>
            <div className="ep-modal-header">
              <h2>Place Order</h2>
              <button className="ep-btn ep-btn--ghost" onClick={() => setShowOrderModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handlePlaceOrder}>
              <div className="ep-modal-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <select className="ep-input" value={orderForm.accountId} onChange={e => setOrderForm({...orderForm, accountId: e.target.value})}>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name} (${a.balance.toFixed(2)})</option>)}
                </select>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Breakfast', 'Lunch', 'Dinner'].map(m => (
                    <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-primary)' }}>
                      <input type="radio" name="meal" checked={orderForm.meal === m} onChange={() => setOrderForm({...orderForm, meal: m})} /> {m}
                    </label>
                  ))}
                </div>
                <input type="number" min={1} className="ep-input" value={orderForm.quantity} onChange={e => setOrderForm({...orderForm, quantity: parseInt(e.target.value)})} />
                <div style={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>Total: ${(MEAL_PRICES[orderForm.meal] * orderForm.quantity).toFixed(2)}</div>
              </div>
              <div className="ep-modal-footer">
                <button type="button" className="ep-btn ep-btn--secondary" onClick={() => setShowOrderModal(false)}>Cancel</button>
                <button type="submit" className="ep-btn ep-btn--primary">Place Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTopUp && (
        <div className="ep-modal-overlay" onClick={() => setShowTopUp(null)}>
          <div className="ep-modal" onClick={e => e.stopPropagation()}>
            <div className="ep-modal-header">
              <h2>Top Up Account</h2>
              <button className="ep-btn ep-btn--ghost" onClick={() => setShowTopUp(null)}><X size={20} /></button>
            </div>
            <form onSubmit={handleTopUp}>
              <div className="ep-modal-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" readOnly className="ep-input" value={showTopUp.name} />
                <input type="text" readOnly className="ep-input" value={`Current Balance: $${showTopUp.balance.toFixed(2)}`} />
                <input type="number" step="0.01" min={1} required className="ep-input" value={topUpAmount} onChange={e => setTopUpAmount(parseFloat(e.target.value))} />
              </div>
              <div className="ep-modal-footer">
                <button type="button" className="ep-btn ep-btn--secondary" onClick={() => setShowTopUp(null)}>Cancel</button>
                <button type="submit" className="ep-btn ep-btn--primary">Confirm Top-up</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CafeteriaView;
