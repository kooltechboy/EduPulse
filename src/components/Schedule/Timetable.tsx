
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ChevronRight, Filter, School, GraduationCap, Globe, UserCheck, LayoutGrid, Baby, Fingerprint } from 'lucide-react';
import { GradeLevel, ScheduleEntry } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const TIME_SLOTS = ['08:00', '09:30', '11:00', '13:00', '14:30'];

const MOCK_SCHEDULE: ScheduleEntry[] = [
  { id: '1', day: 'Mon', time: '08:00', subject: 'Calculus Advanced', room: 'A-201', teacher: 'Prof. Mitchell', teacherId: 'TCH001', grade: '12-A', gradeLevel: GradeLevel.SENIOR_HIGH, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: '2', day: 'Mon', time: '11:00', subject: 'Modern History', room: 'B-102', teacher: 'Ms. Clara', teacherId: 'TCH002', grade: '11-B', gradeLevel: GradeLevel.SENIOR_HIGH, color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: '3', day: 'Tue', time: '09:30', subject: 'Quantum Physics', room: 'Lab 4', teacher: 'Dr. Sarah', teacherId: 'TCH003', grade: '12-A', gradeLevel: GradeLevel.SENIOR_HIGH, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: '4', day: 'Wed', time: '08:00', subject: 'Early Literacy', room: 'C-001', teacher: 'Mr. Bond', teacherId: 'TCH004', grade: '2-A', gradeLevel: GradeLevel.ELEMENTARY, color: 'bg-rose-100 text-rose-700 border-rose-200' },
  { id: '5', day: 'Thu', time: '13:00', subject: 'World of Insects', room: 'Lab 2', teacher: 'Dr. Heisenberg', teacherId: 'TCH005', grade: '5-C', gradeLevel: GradeLevel.ELEMENTARY, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { id: '6', day: 'Mon', time: '09:30', subject: 'Musical Theory', room: 'Hall 1', teacher: 'Ms. Clara', teacherId: 'TCH002', grade: '10-A', gradeLevel: GradeLevel.SENIOR_HIGH, color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: '7', day: 'Tue', time: '08:00', subject: 'Sensory Play', room: 'Playroom 1', teacher: 'Mrs. Daisy', teacherId: 'TCH006', grade: 'K-Alpha', gradeLevel: GradeLevel.KINDERGARTEN, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: '8', day: 'Fri', time: '11:00', subject: 'Storytime Circle', room: 'Nursery 1', teacher: 'Mrs. Daisy', teacherId: 'TCH006', grade: 'N-Sun', gradeLevel: GradeLevel.NURSERY, color: 'bg-teal-100 text-teal-700 border-teal-200' },
];

const Timetable: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'Global' | 'Level' | 'Teacher' | 'Grade'>('Global');
  const [selectedLevel, setSelectedLevel] = useState<GradeLevel | 'All'>('All');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');

  const { user } = useAuth();

  useEffect(() => {
    const loadSchedule = async () => {
      if (!user?.schoolId) return;
      setIsLoading(true);
      try {
        const { scheduleService } = await import('@/services/scheduleService');
        const data = await scheduleService.fetchAll(user.schoolId);
        setSchedule(data);
      } catch (e) {
        console.error("Failed to load schedule", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSchedule();
  }, []);

  const filteredSchedule = schedule.filter(entry => {
    if (filterType === 'Global') return true;
    if (filterType === 'Level') return selectedLevel === 'All' || entry.gradeLevel === selectedLevel;
    if (filterType === 'Teacher') return selectedTeacher === 'All' || entry.teacher === selectedTeacher;
    if (filterType === 'Grade') return selectedGrade === 'All' || entry.grade === selectedGrade;
    return true;
  });

  const uniqueTeachers = Array.from(new Set(schedule.map(s => s.teacher)));
  const uniqueGrades = Array.from(new Set(schedule.map(s => s.grade)));

  const getLevelIcon = (level: GradeLevel) => {
    switch (level) {
      case GradeLevel.NURSERY:
      case GradeLevel.PRE_SCHOOL:
      case GradeLevel.KINDERGARTEN: return <Baby size={14} />;
      case GradeLevel.ELEMENTARY: return <School size={14} />;
      case GradeLevel.JUNIOR_HIGH: return <GraduationCap size={14} />;
      case GradeLevel.SENIOR_HIGH: return <Globe size={14} />;
      default: return <LayoutGrid size={14} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 px-1 pb-12">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Campus Master Ledger</h2>
          <p className="text-slate-500 font-bold italic mt-2 uppercase text-[10px] tracking-[0.4em] flex items-center gap-3">
            <Calendar size={18} className="text-blue-500" /> Multi-Tier Academic Schedule 2026
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-2 rounded-[32px] shadow-2xl border border-slate-100 flex gap-2 w-full xl:w-auto overflow-x-auto scrollbar-hide">
          {['Global', 'Level', 'Teacher', 'Grade'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-8 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all ${filterType === type ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              {type} Perspective
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-white/60 backdrop-blur-md p-6 rounded-[36px] border border-white/50 shadow-sm animate-in slide-in-from-top-4 duration-500">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Filter size={18} /></div>
        {filterType === 'Level' && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {['All', ...Object.values(GradeLevel)].map(level => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level as any)}
                className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${selectedLevel === level ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}
              >
                {level !== 'All' && getLevelIcon(level as GradeLevel)}
                {level}
              </button>
            ))}
          </div>
        )}
        {filterType === 'Teacher' && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {['All', ...uniqueTeachers].map(t => (
              <button key={t} onClick={() => setSelectedTeacher(t)} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedTeacher === t ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}>{t}</button>
            ))}
          </div>
        )}
        {filterType === 'Grade' && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {['All', ...uniqueGrades].map(g => (
              <button key={g} onClick={() => setSelectedGrade(g)} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedGrade === g ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}>{g}</button>
            ))}
          </div>
        )}
        {filterType === 'Global' && (
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-2">Unified institutional view: Cross-tier visibility active</p>
        )}
      </div>

      <div className="hidden xl:block glass-card rounded-[56px] overflow-hidden p-10 border-none shadow-2xl bg-white/40">
        <div className="grid grid-cols-6 gap-6">
          <div className="p-4"></div>
          {DAYS.map(day => (
            <div key={day} className="p-4 text-center font-black text-slate-400 uppercase tracking-[0.25em] text-[10px]">{day}</div>
          ))}

          {TIME_SLOTS.map(time => (
            <React.Fragment key={time}>
              <div className="p-4 flex flex-col items-center justify-center border-t border-slate-100/50">
                <span className="text-sm font-black text-slate-900">{time}</span>
                <span className="text-[8px] font-black text-slate-300 uppercase mt-1 tracking-widest">90 Mins</span>
              </div>
              {DAYS.map(day => {
                const items = filteredSchedule.filter(s => s.day === day && s.time === time);
                return (
                  <div key={`${day}-${time}`} className="p-2 border-t border-slate-100/50 min-h-[160px] relative">
                    <div className="space-y-2 h-full overflow-y-auto scrollbar-hide">
                      {items.map(item => (
                        <div key={item.id} className={`p-4 rounded-3xl border ${item.color} shadow-sm transition-all hover:scale-[1.03] hover:shadow-lg cursor-pointer group`}>
                          <p className="font-black text-xs mb-2 leading-tight uppercase tracking-tight">{item.subject}</p>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-[9px] font-black opacity-80 uppercase tracking-widest">
                              <MapPin size={10} /> {item.room}
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] font-black opacity-70 uppercase tracking-widest">
                              <UserCheck size={10} /> {item.teacher.split(' ')[1]}
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] font-black opacity-70 uppercase tracking-widest text-indigo-600">
                              {getLevelIcon(item.gradeLevel)} {item.grade}
                            </div>
                          </div>
                        </div>
                      ))}
                      {items.length === 0 && (
                        <div className="h-full rounded-[28px] border border-dashed border-slate-100 bg-slate-50/10 transition-colors hover:bg-white/40"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="xl:hidden space-y-6 px-1">
        {DAYS.map(day => {
          const daySchedule = filteredSchedule.filter(s => s.day === day);
          if (daySchedule.length === 0) return null;
          return (
            <div key={day} className="space-y-4">
              <h3 className="px-6 text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> {day} Ledger
              </h3>
              <div className="space-y-3">
                {daySchedule.map((item, idx) => (
                  <div key={idx} className={`glass-card p-6 rounded-[36px] border-l-[12px] ${item.color.split(' ')[2]} flex justify-between items-center group shadow-xl bg-white`}>
                    <div className="flex items-center gap-6">
                      <div className="text-center min-w-[70px]">
                        <p className="text-lg font-black text-slate-900">{item.time}</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Clock</p>
                      </div>
                      <div className="h-10 w-px bg-slate-100"></div>
                      <div>
                        <p className="font-black text-slate-900 leading-none mb-2 uppercase tracking-tight">{item.subject}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5 text-blue-600"><UserCheck size={12} /> {item.teacher}</span>
                          <span className="flex items-center gap-1.5"><MapPin size={12} /> {item.room}</span>
                          <span className="flex items-center gap-1.5 text-indigo-600">
                            {getLevelIcon(item.gradeLevel)} {item.grade}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={24} className="text-slate-200 group-hover:text-blue-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {filteredSchedule.length === 0 && (
          <div className="bg-white/40 p-20 rounded-[56px] text-center glass-card border-none shadow-xl">
            <Calendar className="mx-auto text-slate-200 mb-6" size={64} />
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">No active sessions detected for the current filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timetable;
