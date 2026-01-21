
import React, { useState } from 'react';
import { Coffee, Info, Heart, CheckCircle2, Star, Clock, ChevronRight, AlertCircle, ShoppingCart } from 'lucide-react';
import { CanteenMenu } from '@/types';

const MOCK_MENUS: CanteenMenu[] = [
  { id: 'M-01', day: 'Monday', items: [
    { name: 'Quinoa Power Bowl', calories: 420, allergens: ['None'], type: 'Veg' },
    { name: 'Grilled Chicken Pesto', calories: 580, allergens: ['Dairy', 'Nuts'], type: 'Non-Veg' },
    { name: 'Steamed Broccoli Side', calories: 85, allergens: ['None'], type: 'Veg' }
  ]},
  { id: 'M-02', day: 'Tuesday', items: [
    { name: 'Spinach Lasagna', calories: 480, allergens: ['Dairy', 'Gluten'], type: 'Veg' },
    { name: 'Beef Stew w/ Roots', calories: 620, allergens: ['Gluten'], type: 'Non-Veg' }
  ]},
];

const CanteenView: React.FC = () => {
  const [activeDay, setActiveDay] = useState('Monday');
  const currentMenu = MOCK_MENUS.find(m => m.day === activeDay);

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 px-1">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Nutritional Hub</h2>
          <p className="text-slate-500 font-bold italic mt-2 uppercase text-[10px] tracking-[0.4em] flex items-center gap-3">
            <Coffee size={18} className="text-amber-500" /> Campus Canteen & Meal Planning 2026
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-md p-2 rounded-[24px] shadow-sm border border-slate-100 flex gap-2">
           {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
             <button key={day} onClick={() => setActiveDay(day)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeDay === day ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
                {day.substring(0,3)}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
        <div className="xl:col-span-3 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentMenu?.items.map((item, i) => (
                <div key={i} className="glass-card p-10 rounded-[56px] bg-white border-none shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Coffee size={100} /></div>
                   <div className="flex justify-between items-start mb-10">
                      <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${item.type === 'Veg' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                        {item.type} Option
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                         <Clock size={14} /> <span className="text-[10px] font-black uppercase tracking-widest">Lunch Session</span>
                      </div>
                   </div>
                   <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-4 group-hover:text-amber-600 transition-colors">{item.name}</h4>
                   <div className="flex flex-wrap gap-4 mb-10">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg">{item.calories} kCal</span>
                      {item.allergens.map(a => (
                        <span key={a} className="text-[10px] font-bold text-rose-500 uppercase tracking-widest bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 flex items-center gap-2">
                           <AlertCircle size={10} /> {a}
                        </span>
                      ))}
                   </div>
                   <button className="w-full py-5 bg-slate-900 text-white rounded-[28px] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-amber-600 transition-all active:scale-95 flex items-center justify-center gap-3">
                      Pre-Order Meal <ShoppingCart size={18} />
                   </button>
                </div>
              ))}
              {!currentMenu && (
                <div className="md:col-span-2 py-40 text-center glass-card rounded-[64px] bg-white/40">
                   <AlertCircle size={64} className="mx-auto text-slate-100 mb-6" />
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Menu registry pending for this cycle.</p>
                </div>
              )}
           </div>
        </div>

        <div className="space-y-8">
           <div className="glass-card p-10 rounded-[56px] bg-emerald-900 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                 <h4 className="text-xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter"><Heart className="text-emerald-400" /> Health Insight</h4>
                 <p className="text-sm text-emerald-50 leading-relaxed font-medium mb-10 italic">"Unified menu planning focuses on cognitive health. High-omega nutrients are prioritized this week for exam prep support."</p>
                 <button className="w-full py-5 bg-white text-emerald-900 rounded-[28px] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-50 transition-all">Nutritional Report</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CanteenView;
