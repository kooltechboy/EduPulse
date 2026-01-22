import React, { useState, useMemo, useEffect } from 'react';
import {
    BookOpen, Plus, Search, Filter,
    MoreVertical, ChevronRight, Users,
    GraduationCap, Calendar, BarChart3,
    Globe, School, Baby, RefreshCw,
    FileText, ShieldCheck, Database, Sparkles, Loader2
} from 'lucide-react';
import { Course, User, UserRole, GradeLevel } from '@/types';
import { courseService } from '@/services/courseService';

const DEFAULT_COURSES: Course[] = [
    {
        id: 'C1', name: 'Advanced Calculus & Topology', code: 'MATH-12A',
        teacherId: 'TCH-001', teacherName: 'Professor Mitchell',
        gradeLevel: GradeLevel.SENIOR_HIGH, room: 'B-102', students: ['STU-001', 'STU-002'],
        bannerColor: 'from-blue-600 via-indigo-600 to-violet-700',
        department: 'STEM', semester: 'Spring 2026',
        modules: [], liveSessions: [], materials: []
    },
    {
        id: 'C2', name: 'Early Literacy & Phonics', code: 'K-ENG',
        teacherId: 'TCH-006', teacherName: 'Mrs. Daisy',
        gradeLevel: GradeLevel.KINDERGARTEN, room: 'K-001', students: ['STU-003'],
        bannerColor: 'from-emerald-500 via-teal-600 to-cyan-700',
        department: 'Humanities', semester: 'Full Year 2026',
        modules: [], liveSessions: [], materials: []
    },
    {
        id: 'C3', name: 'Experimental Biology', code: 'BIO-11',
        teacherId: 'TCH-001', teacherName: 'Professor Mitchell',
        gradeLevel: GradeLevel.SENIOR_HIGH, room: 'S-201', students: ['STU-001'],
        bannerColor: 'from-rose-500 via-pink-600 to-purple-700',
        department: 'STEM', semester: 'Spring 2026',
        modules: [], liveSessions: [], materials: []
    },
    {
        id: 'C4', name: 'Renaissance Art History', code: 'ART-09',
        teacherId: 'TCH-004', teacherName: 'Mr. Bond',
        gradeLevel: GradeLevel.JUNIOR_HIGH, room: 'A-301', students: ['STU-102'],
        bannerColor: 'from-orange-400 via-amber-500 to-yellow-600',
        department: 'Arts', semester: 'Fall 2025',
        modules: [], liveSessions: [], materials: []
    }
];

const LMSCenter: React.FC<{ user: User }> = ({ user }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCourses = async () => {
            setIsLoading(true);
            const data = await courseService.fetchAll();
            if (data.length === 0) {
                // Use defaults if no data in Supabase
                setCourses(DEFAULT_COURSES);
                // Also save to localStorage as fallback
                localStorage.setItem('edupulse_courses_registry', JSON.stringify(DEFAULT_COURSES));
            } else {
                setCourses(data);
            }
            setIsLoading(false);
        };
        loadCourses();
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        tier: 'All',
        grade: 'All',
        department: 'All',
        semester: 'All',
        teacher: 'All'
    });

    const departments = useMemo(() => ['All', ...Array.from(new Set(courses.map(c => c.department || 'Unassigned')))], [courses]);
    const semesters = useMemo(() => ['All', ...Array.from(new Set(courses.map(c => c.semester || 'Unassigned')))], [courses]);
    const teachers = useMemo(() => ['All', ...Array.from(new Set(courses.map(c => c.teacherName)))], [courses]);
    const grades = useMemo(() => ['All', ...Array.from(new Set(courses.map(c => c.code.split('-')[0])))], [courses]);
    const levels = ['All', 'Senior High', 'Junior High', 'Elementary', 'Kindergarten'];

    const filteredCourses = useMemo(() => {
        return courses.filter(c => {
            const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.teacherName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchTier = filters.tier === 'All' || c.gradeLevel === filters.tier;
            const matchGrade = filters.grade === 'All' || c.code.startsWith(filters.grade);
            const matchDept = filters.department === 'All' || c.department === filters.department;
            const matchSem = filters.semester === 'All' || c.semester === filters.semester;
            const matchTeacher = filters.teacher === 'All' || c.teacherName === filters.teacher;

            return matchSearch && matchTier && matchGrade && matchDept && matchSem && matchTeacher;
        });
    }, [courses, searchQuery, filters]);

    const stats = useMemo(() => ({
        total: filteredCourses.length,
        students: filteredCourses.reduce((acc, c) => acc + c.students.length, 0),
        teachers: new Set(filteredCourses.map(c => c.teacherName)).size
    }), [filteredCourses]);

    return (
        <div className="flex flex-col lg:flex-row gap-10 animate-in fade-in duration-700 pb-20">
            {/* FACETED EXPLORER SIDEBAR */}
            <aside className="w-full lg:w-80 shrink-0 space-y-8">
                <div className="glass-card p-10 rounded-[48px] bg-slate-900 shadow-2xl relative overflow-hidden group border border-white/5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000"></div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-4 relative z-10">
                        <div className="p-3 bg-white/10 rounded-2xl"><Filter size={20} className="text-indigo-400" /></div>
                        Explorer Node
                    </h3>

                    <div className="space-y-10 relative z-10">
                        <section>
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 block ml-2">Academic Level</label>
                            <div className="space-y-2">
                                {levels.map(level => (
                                    <button
                                        key={level}
                                        onClick={() => setFilters(f => ({ ...f, tier: level }))}
                                        className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filters.tier === level ? 'bg-indigo-600 text-white shadow-xl translate-x-1' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {level === 'All' ? 'Global Campus' : level}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section>
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 block ml-2">Department</label>
                            <div className="space-y-2">
                                {departments.map(dept => (
                                    <button
                                        key={dept}
                                        onClick={() => setFilters(f => ({ ...f, department: dept }))}
                                        className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filters.department === dept ? 'bg-indigo-600 text-white shadow-xl translate-x-1' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {dept}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section>
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 block ml-2">Active Semester</label>
                            <select
                                value={filters.semester}
                                onChange={(e) => setFilters(f => ({ ...f, semester: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black text-indigo-400 uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                                {semesters.map(sem => <option key={sem} value={sem} className="bg-slate-900">{sem}</option>)}
                            </select>
                        </section>

                        <section>
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 block ml-2">Grade Node</label>
                            <select
                                value={filters.grade}
                                onChange={(e) => setFilters(f => ({ ...f, grade: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black text-indigo-400 uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                                {grades.map(g => <option key={g} value={g} className="bg-slate-900">{g === 'All' ? 'All Grades' : g}</option>)}
                            </select>
                        </section>

                        <button
                            onClick={() => {
                                setFilters({ tier: 'All', grade: 'All', department: 'All', semester: 'All', teacher: 'All' });
                                setSearchQuery('');
                            }}
                            className="w-full py-5 rounded-2xl border border-white/10 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all flex items-center justify-center gap-3"
                        >
                            <RefreshCw size={14} /> Reset Global Search
                        </button>
                    </div>
                </div>

                <div className="glass-card p-10 rounded-[48px] bg-indigo-600 text-white shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] opacity-60 mb-2">Live Sync</p>
                        <h4 className="text-2xl font-black tracking-tighter uppercase mb-6 leading-none">Institutional Insight</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl">
                                <span className="text-[8px] font-black uppercase">Nodes Active</span>
                                <span className="text-sm font-black">{stats.total}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl">
                                <span className="text-[8px] font-black uppercase">Synced Staff</span>
                                <span className="text-sm font-black">{stats.teachers}</span>
                            </div>
                        </div>
                    </div>
                    <Sparkles className="absolute -bottom-6 -right-6 text-white/10 w-32 h-32" />
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 space-y-10">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
                    <div>
                        <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">LMS<br /><span className="text-indigo-600">Explorer</span></h2>
                        <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.5em] mt-6 flex items-center gap-3">
                            <Globe size={18} className="text-indigo-600" /> {filters.tier !== 'All' ? filters.tier : 'Institutional'} Hub • {filters.department !== 'All' ? filters.department : 'Global'} Directorate
                        </p>
                    </div>
                    <button className="bg-slate-950 text-white px-10 py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-600 transition-all flex items-center gap-4 active:scale-95 group">
                        <Plus size={22} className="group-hover:rotate-90 transition-transform" /> Auth New Syllabus
                    </button>
                </div>

                <div className="relative group">
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={24} />
                    <input
                        type="text"
                        placeholder="Search course registry by node name, subject code, or faculty lead..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-20 pr-10 py-8 bg-white border border-slate-100 shadow-2xl rounded-[40px] font-bold focus:ring-8 focus:ring-indigo-100/50 transition-all text-lg"
                    />
                </div>
                <div className="bg-white rounded-[56px] shadow-2xl overflow-hidden border border-slate-100">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Course Identity</th>
                                <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Faculty Lead</th>
                                <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Sync Metrics</th>
                                <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredCourses.map(course => (
                                <tr key={course.id} className="hover:bg-indigo-50/10 transition-colors group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${course.bannerColor} shadow-lg`}></div>
                                            <div>
                                                <p className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tight">{course.name}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{course.code} • {course.gradeLevel}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.teacherName}`} className="w-10 h-10 rounded-xl" />
                                            <span className="text-sm font-black text-slate-700">{course.teacherName}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-10">
                                            <div>
                                                <p className="text-lg font-black text-slate-900 leading-none">{course.students.length}</p>
                                                <p className="text-[8px] font-black text-slate-400 uppercase mt-1">Learners</p>
                                            </div>
                                            <div className="w-[1px] h-10 bg-slate-100"></div>
                                            <div>
                                                <p className="text-lg font-black text-indigo-600 leading-none">Active</p>
                                                <p className="text-[8px] font-black text-slate-400 uppercase mt-1">Status</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <button className="p-4 bg-slate-50 text-slate-300 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                            <ChevronRight size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LMSCenter;
