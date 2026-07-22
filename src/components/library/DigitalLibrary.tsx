import React, { useState } from 'react';
import { BookOpen, Clock, AlertTriangle, Search, Plus, Bookmark } from 'lucide-react';
import './DigitalLibrary.css';

declare const addToast: (options: { type: 'success' | 'error' | 'info' | 'warning', title: string, message: string }) => void;

interface BookItem {
  id: string;
  title: string;
  author: string;
  genre: string;
  availableCopies: number;
  totalCopies: number;
  isbn: string;
  location?: string;
  coverUrl?: string;
}

interface BorrowRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerName: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
}

const BOOKS: BookItem[] = [
  { id: '1', title: 'Calculus: Early Transcendentals', author: 'James Stewart', genre: 'Mathematics', availableCopies: 4, totalCopies: 10, isbn: '978-1285741550' },
  { id: '2', title: 'Principles of Modern Physics', author: 'Dr. Robert Iceberg', genre: 'Science', availableCopies: 2, totalCopies: 5, isbn: '978-0471801801' },
  { id: '3', title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', availableCopies: 8, totalCopies: 12, isbn: '978-0060935467' },
  { id: '4', title: 'World History: Patterns of Interaction', author: 'Roger B. Beck', genre: 'History', availableCopies: 0, totalCopies: 8, isbn: '978-0547491127' }
];

export const DigitalLibrary: React.FC = () => {
  const [tab, setTab] = useState<'catalog' | 'borrowed' | 'overdue'>('catalog');
  const [query, setQuery] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  
  const [books, setBooks] = useState<BookItem[]>(BOOKS);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([
    { id: 'b1', bookId: '4', bookTitle: 'World History: Patterns of Interaction', borrowerName: 'Alice', borrowDate: '2026-06-01', dueDate: '2026-06-15', status: 'overdue' }
  ]);

  const [showAddBook, setShowAddBook] = useState(false);
  const [showBorrow, setShowBorrow] = useState<string | null>(null);

  const [bookForm, setBookForm] = useState<Partial<BookItem>>({ genre: 'Fiction', totalCopies: 1 });
  const [borrowForm, setBorrowForm] = useState({ borrowerName: '', borrowDate: new Date().toISOString().split('T')[0], dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0] });

  const safeAddToast = (opts: any) => {
    if (typeof addToast === 'function') addToast(opts);
    else if (typeof window !== 'undefined' && (window as any).addToast) (window as any).addToast(opts);
  };

  const handleAddBook = () => {
    if (!bookForm.title || !bookForm.author) return;
    const newBook: BookItem = {
      ...bookForm,
      id: Math.random().toString(),
      availableCopies: bookForm.totalCopies || 1,
      totalCopies: bookForm.totalCopies || 1,
    } as BookItem;
    setBooks([...books, newBook]);
    setShowAddBook(false);
    setBookForm({ genre: 'Fiction', totalCopies: 1 });
    safeAddToast({ type: 'success', title: 'Book Added', message: 'Book successfully added to catalog.' });
  };

  const handleBorrow = (bookId: string) => {
    if (!borrowForm.borrowerName) return;
    const book = books.find(b => b.id === bookId);
    if (!book || book.availableCopies <= 0) return;
    
    setBooks(books.map(b => b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b));
    setBorrowRecords([...borrowRecords, {
      id: Math.random().toString(),
      bookId,
      bookTitle: book.title,
      borrowerName: borrowForm.borrowerName,
      borrowDate: borrowForm.borrowDate,
      dueDate: borrowForm.dueDate,
      status: 'active'
    }]);
    setShowBorrow(null);
    setBorrowForm({ borrowerName: '', borrowDate: new Date().toISOString().split('T')[0], dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0] });
    safeAddToast({ type: 'success', title: 'Book Borrowed', message: 'Book borrowed successfully.' });
  };

  const handleReturn = (recordId: string) => {
    const record = borrowRecords.find(r => r.id === recordId);
    if (!record) return;
    setBooks(books.map(b => b.id === record.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b));
    setBorrowRecords(borrowRecords.map(r => r.id === recordId ? { ...r, status: 'returned', returnDate: new Date().toISOString().split('T')[0] } : r));
    safeAddToast({ type: 'success', title: 'Book Returned', message: 'Book returned successfully.' });
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const overdueCount = borrowRecords.filter(r => r.status !== 'returned' && r.dueDate < todayStr).length;

  const filteredBooks = books.filter(b => {
    const q = query.toLowerCase();
    const matchesQuery = b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || (b.isbn || '').includes(q);
    const matchesCat = filterCat === 'All' || b.genre === filterCat;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="ep-library">
      <header className="ep-library__header">
        <div>
          <h1 className="ep-library__title">Digital Library & E-Resources</h1>
          <p className="ep-library__subtitle">Search academic catalog, manage book reservations, and track overdue returns</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="ep-tabs" style={{ padding: '2px' }}>
            <button className={`ep-tab ${tab === 'catalog' ? 'ep-tab--active' : ''}`} onClick={() => setTab('catalog')}><BookOpen size={14} style={{ marginRight: 4 }} /> Catalog</button>
            <button className={`ep-tab ${tab === 'borrowed' ? 'ep-tab--active' : ''}`} onClick={() => setTab('borrowed')}><Clock size={14} style={{ marginRight: 4 }} /> Borrowed</button>
            <button className={`ep-tab ${tab === 'overdue' ? 'ep-tab--active' : ''}`} onClick={() => setTab('overdue')}><AlertTriangle size={14} style={{ marginRight: 4 }} /> Overdue ({overdueCount})</button>
          </div>
          <button className="ep-btn ep-btn--primary" onClick={() => setShowAddBook(true)}><Plus size={16} /> + Add Book</button>
        </div>
      </header>

      <section className="ep-library__kpi-grid">
        <div className="ep-library__kpi-card"><div className="ep-library__kpi-icon ep-library__kpi-icon--blue"><BookOpen size={22} /></div><div><div className="ep-library__kpi-val">{books.length}</div><div className="ep-library__kpi-lbl">Total Catalog Titles</div></div></div>
        <div className="ep-library__kpi-card"><div className="ep-library__kpi-icon ep-library__kpi-icon--purple"><Clock size={22} /></div><div><div className="ep-library__kpi-val">{borrowRecords.filter(r => r.status !== 'returned').length}</div><div className="ep-library__kpi-lbl">Books Active On Loan</div></div></div>
        <div className="ep-library__kpi-card"><div className="ep-library__kpi-icon ep-library__kpi-icon--amber"><AlertTriangle size={22} /></div><div><div className="ep-library__kpi-val">{overdueCount}</div><div className="ep-library__kpi-lbl">Overdue Notice Reminders</div></div></div>
        <div className="ep-library__kpi-card"><div className="ep-library__kpi-icon ep-library__kpi-icon--green"><Bookmark size={22} /></div><div><div className="ep-library__kpi-val">4,200+</div><div className="ep-library__kpi-lbl">E-Book Digital Access</div></div></div>
      </section>

      {tab === 'catalog' && (
        <>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--color-text-tertiary)' }} />
              <input type="text" placeholder="Search by title, author, or ISBN..." value={query} onChange={e => setQuery(e.target.value)} className="ep-library__form-input" style={{ paddingLeft: '32px' }} />
            </div>
            <select className="ep-library__form-input" style={{ width: 'auto' }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
              <option>All</option><option>Fiction</option><option>Non-Fiction</option><option>Science</option><option>Mathematics</option><option>History</option><option>Arts</option><option>Reference</option>
            </select>
          </div>
          <div className="ep-library__grid">
            {filteredBooks.map(book => (
              <div key={book.id} className="ep-book-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="ep-badge ep-badge--primary">{book.genre}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: book.availableCopies > 0 ? 'var(--color-success-400)' : 'var(--color-danger-400)' }}>
                    {book.availableCopies > 0 ? `${book.availableCopies}/${book.totalCopies} Available` : 'Not Available'}
                  </span>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '4px 0 2px 0', color: 'var(--color-text-primary)' }}>{book.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', margin: 0 }}>By {book.author}</p>
                </div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)', marginTop: 'auto' }}>
                  ISBN: {book.isbn}
                </div>
                <button className="ep-btn ep-btn--secondary ep-btn--sm" disabled={book.availableCopies === 0} style={{ marginTop: '8px' }} onClick={() => setShowBorrow(book.id)}>
                  {book.availableCopies > 0 ? 'Borrow' : 'Not Available'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {(tab === 'borrowed' || tab === 'overdue') && (
        <div className="ep-table-wrapper">
          <table className="ep-table">
            <thead><tr><th>Book Title</th><th>Borrower</th><th>Borrow Date</th><th>Due Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {borrowRecords.filter(r => tab === 'overdue' ? r.status !== 'returned' && r.dueDate < todayStr : true).map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700 }}>{r.bookTitle}</td>
                  <td>{r.borrowerName}</td>
                  <td>{r.borrowDate}</td>
                  <td>{r.dueDate}</td>
                  <td>
                    {r.status === 'returned' ? <span className="ep-badge ep-badge--neutral">Returned</span> :
                     r.dueDate < todayStr ? <span className="ep-badge ep-badge--danger">OVERDUE</span> :
                     <span className="ep-badge ep-badge--success">Active</span>}
                  </td>
                  <td>
                    {r.status !== 'returned' && <button className="ep-btn ep-btn--primary ep-btn--sm" onClick={() => handleReturn(r.id)}>Return</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddBook && (
        <div className="ep-library__modal-overlay">
          <div className="ep-library__modal">
            <h3 className="ep-library__modal-title">Add New Book</h3>
            <div className="ep-library__form-group"><label className="ep-library__form-label">Title</label><input className="ep-library__form-input" onChange={e => setBookForm({...bookForm, title: e.target.value})} /></div>
            <div className="ep-library__form-group"><label className="ep-library__form-label">Author</label><input className="ep-library__form-input" onChange={e => setBookForm({...bookForm, author: e.target.value})} /></div>
            <div className="ep-library__form-group"><label className="ep-library__form-label">ISBN</label><input className="ep-library__form-input" onChange={e => setBookForm({...bookForm, isbn: e.target.value})} /></div>
            <div className="ep-library__form-group"><label className="ep-library__form-label">Category</label>
              <select className="ep-library__form-input" onChange={e => setBookForm({...bookForm, genre: e.target.value})}>
                {['Fiction','Non-Fiction','Science','Mathematics','History','Arts','Reference'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="ep-library__form-group"><label className="ep-library__form-label">Total Copies</label><input type="number" className="ep-library__form-input" onChange={e => setBookForm({...bookForm, totalCopies: Number(e.target.value)})} /></div>
            <div className="ep-library__form-group"><label className="ep-library__form-label">Location / Shelf</label><input className="ep-library__form-input" onChange={e => setBookForm({...bookForm, location: e.target.value})} /></div>
            <div className="ep-library__form-group"><label className="ep-library__form-label">Cover URL (optional)</label><input className="ep-library__form-input" onChange={e => setBookForm({...bookForm, coverUrl: e.target.value})} /></div>
            <div className="ep-library__modal-footer">
              <button className="ep-btn ep-btn--secondary" onClick={() => setShowAddBook(false)}>Cancel</button>
              <button className="ep-btn ep-btn--primary" onClick={handleAddBook}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {showBorrow && (
        <div className="ep-library__modal-overlay">
          <div className="ep-library__modal">
            <h3 className="ep-library__modal-title">Borrow Book</h3>
            <div className="ep-library__form-group"><label className="ep-library__form-label">Borrower Name</label><input className="ep-library__form-input" onChange={e => setBorrowForm({...borrowForm, borrowerName: e.target.value})} /></div>
            <div className="ep-library__form-group"><label className="ep-library__form-label">Borrow Date</label><input type="date" className="ep-library__form-input" value={borrowForm.borrowDate} onChange={e => setBorrowForm({...borrowForm, borrowDate: e.target.value})} /></div>
            <div className="ep-library__form-group"><label className="ep-library__form-label">Due Date</label><input type="date" className="ep-library__form-input" value={borrowForm.dueDate} onChange={e => setBorrowForm({...borrowForm, dueDate: e.target.value})} /></div>
            <div className="ep-library__modal-footer">
              <button className="ep-btn ep-btn--secondary" onClick={() => setShowBorrow(null)}>Cancel</button>
              <button className="ep-btn ep-btn--primary" onClick={() => handleBorrow(showBorrow)}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
