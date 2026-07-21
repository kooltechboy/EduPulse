import React, { useState } from 'react';
import { BookOpen, Clock, AlertTriangle, Search, Plus, Bookmark } from 'lucide-react';
import './DigitalLibrary.css';

interface BookItem {
  id: string;
  title: string;
  author: string;
  genre: string;
  availableCopies: number;
  totalCopies: number;
  isbn: string;
}

const BOOKS: BookItem[] = [
  { id: '1', title: 'Calculus: Early Transcendentals', author: 'James Stewart', genre: 'STEM & Math', availableCopies: 4, totalCopies: 10, isbn: '978-1285741550' },
  { id: '2', title: 'Principles of Modern Physics', author: 'Dr. Robert Iceberg', genre: 'STEM & Physics', availableCopies: 2, totalCopies: 5, isbn: '978-0471801801' },
  { id: '3', title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Classic Literature', availableCopies: 8, totalCopies: 12, isbn: '978-0060935467' },
  { id: '4', title: 'World History: Patterns of Interaction', author: 'Roger B. Beck', genre: 'Humanities', availableCopies: 0, totalCopies: 8, isbn: '978-0547491127' }
];

export const DigitalLibrary: React.FC = () => {
  const [tab, setTab] = useState<'catalog' | 'borrowed' | 'overdue'>('catalog');
  const [query, setQuery] = useState('');

  return (
    <div className="ep-library">
      {/* 1. Header */}
      <header className="ep-library__header">
        <div>
          <h1 className="ep-library__title">Digital Library & E-Resources</h1>
          <p className="ep-library__subtitle">Search academic catalog, manage book reservations, and track overdue returns</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="ep-tabs" style={{ padding: '2px' }}>
            <button 
              className={`ep-tab ${tab === 'catalog' ? 'ep-tab--active' : ''}`}
              onClick={() => setTab('catalog')}
            >
              <BookOpen size={14} style={{ marginRight: 4 }} /> Catalog
            </button>
            <button 
              className={`ep-tab ${tab === 'borrowed' ? 'ep-tab--active' : ''}`}
              onClick={() => setTab('borrowed')}
            >
              <Clock size={14} style={{ marginRight: 4 }} /> Borrowed (142)
            </button>
            <button 
              className={`ep-tab ${tab === 'overdue' ? 'ep-tab--active' : ''}`}
              onClick={() => setTab('overdue')}
            >
              <AlertTriangle size={14} style={{ marginRight: 4 }} /> Overdue (3)
            </button>
          </div>
          <button className="ep-btn ep-btn--primary">
            <Plus size={16} /> + Add Book Record
          </button>
        </div>
      </header>

      {/* 2. KPI Cards */}
      <section className="ep-library__kpi-grid">
        <div className="ep-library__kpi-card">
          <div className="ep-library__kpi-icon ep-library__kpi-icon--blue">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="ep-library__kpi-val">12,840</div>
            <div className="ep-library__kpi-lbl">Total Catalog Titles</div>
          </div>
        </div>

        <div className="ep-library__kpi-card">
          <div className="ep-library__kpi-icon ep-library__kpi-icon--purple">
            <Clock size={22} />
          </div>
          <div>
            <div className="ep-library__kpi-val">142</div>
            <div className="ep-library__kpi-lbl">Books Active On Loan</div>
          </div>
        </div>

        <div className="ep-library__kpi-card">
          <div className="ep-library__kpi-icon ep-library__kpi-icon--amber">
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="ep-library__kpi-val">3</div>
            <div className="ep-library__kpi-lbl">Overdue Notice Reminders</div>
          </div>
        </div>

        <div className="ep-library__kpi-card">
          <div className="ep-library__kpi-icon ep-library__kpi-icon--green">
            <Bookmark size={22} />
          </div>
          <div>
            <div className="ep-library__kpi-val">4,200+</div>
            <div className="ep-library__kpi-lbl">E-Book Digital Access</div>
          </div>
        </div>
      </section>

      {/* 3. Catalog View */}
      <div className="ep-library__grid">
        {BOOKS.filter(b => b.title.toLowerCase().includes(query.toLowerCase()) || b.author.toLowerCase().includes(query.toLowerCase())).map(book => (
          <div key={book.id} className="ep-book-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="ep-badge ep-badge--primary">{book.genre}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: book.availableCopies > 0 ? 'var(--color-success-400)' : 'var(--color-danger-400)' }}>
                {book.availableCopies > 0 ? `${book.availableCopies}/${book.totalCopies} Available` : 'Checked Out'}
              </span>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '4px 0 2px 0', color: 'var(--color-text-primary)' }}>{book.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', margin: 0 }}>By {book.author}</p>
            </div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)', marginTop: 'auto' }}>
              ISBN: {book.isbn}
            </div>
            <button className="ep-btn ep-btn--secondary ep-btn--sm" disabled={book.availableCopies === 0} style={{ marginTop: '8px' }}>
              {book.availableCopies > 0 ? 'Issue Loan Pass' : 'Reserve Hold'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DigitalLibrary;
