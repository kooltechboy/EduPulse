
import React, { useState } from 'react';
import { Library, Book, Search, Plus, Filter, UserCheck, Clock, CheckCircle2, X, Bookmark, Globe, ArrowRight } from 'lucide-react';
import { LibraryBook } from '@/types';

const MOCK_BOOKS: LibraryBook[] = [
  { id: 'B-101', title: 'The Principia Mathematica', author: 'Isaac Newton', isbn: '978-01', category: 'Science', status: 'Borrowed', currentHolder: 'Alex Thompson', dueDate: '2026-05-25' },
  { id: 'B-102', title: 'History of Modern Europe', author: 'T.C. Blanning', isbn: '978-02', category: 'History', status: 'Available' },
  { id: 'B-103', title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell', isbn: '978-03', category: 'Technology', status: 'Available' },
];

const DigitalLibrary: React.FC = () => {
  const [books] = useState<LibraryBook[]>(MOCK_BOOKS);

  return (
    <div className="space-y-10 animate-in slide-in-from-right duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 px-1">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Knowledge Vault</h2>
          <p className="text-slate-500 font-bold italic mt-2 uppercase text-[10px] tracking-[0.4em] flex items-center gap-3">
            <Library size={18} className="text-indigo-500" /> Digital Library Node • Global Repository 2026
          </p>
        </div>
        <div className="flex gap-4">
           <button className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-3 font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-white transition-all">
              <Globe size={18} className="text-blue-500" /> Digital Archives
           </button>
           <button className="bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
             <Plus size={20} /> Catalog Resource
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-10">
           <div className="relative group">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={24} />
              <input type="text" placeholder="Query the global digital catalog by title, author, or ISBN core..." className="w-full pl-20 pr-10 py-8 bg-white border-none rounded-[40px] shadow-xl text-xl font-bold placeholder:text-slate-200 outline-none ring-offset-4 ring-indigo-100 focus:ring-8 transition-all" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {books.map(book => (
                <div key={book.id} className="glass-card p-10 rounded-[56px] bg-white border-none shadow-xl hover:translate-y-[-8px] transition-all group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Bookmark size={80} /></div>
                   <div className="flex justify-between items-start mb-10">
                      <div className="p-4 bg-indigo-50 text-indigo-600 rounded-[24px] shadow-inner"><Book size={28} /></div>
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${book.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                        {book.status}
                      </span>
                   </div>
                   <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{book.title}</h4>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">{book.author} • {book.category}</p>
                   
                   {book.status === 'Borrowed' && (
                     <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 mb-8">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Loaned To</p>
                        <p className="text-sm font-bold text-slate-900 flex items-center gap-2"><UserCheck size={14} className="text-blue-500" /> {book.currentHolder}</p>
                        <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-4">Due: {book.dueDate}</p>
                     </div>
                   )}

                   <div className="flex gap-4 pt-6 border-t border-slate-50">
                      <button className="flex-1 py-4 bg-slate-900 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all">Details</button>
                      <button className="p-4 bg-slate-100 text-slate-400 rounded-[24px] hover:text-indigo-600 transition-all"><Clock size={20} /></button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-8">
           <div className="glass-card p-10 rounded-[56px] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                 <h4 className="text-xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter"><Bookmark className="text-blue-400" /> Quick Loans</h4>
                 <div className="space-y-6">
                    {[
                      { name: 'Alex Thompson', item: 'Organic Chem V2', due: 'Today' },
                      { name: 'Sarah Miller', item: 'Calculus Advanced', due: 'Overdue' }
                    ].map((loan, i) => (
                      <div key={i} className="flex justify-between items-center py-4 border-b border-white/5">
                         <div>
                            <p className="text-sm font-black text-blue-100 leading-none mb-1">{loan.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{loan.item}</p>
                         </div>
                         <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${loan.due === 'Overdue' ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'}`}>{loan.due}</span>
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-10 py-5 bg-white text-slate-900 rounded-[28px] font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all">Loan Registry</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalLibrary;
