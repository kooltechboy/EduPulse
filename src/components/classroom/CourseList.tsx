import React, { useState } from 'react';
import { Search, Plus, Users, Clock, BookOpen, GraduationCap, CheckCircle, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SpeedGraderDrawer } from './SpeedGraderDrawer';
import './CourseList.css';

interface Course {
  id: string;
  name: string;
  code: string;
  teacher: string;
  tier: string;
  grade: string;
  enrolled: number;
  capacity: number;
  schedule: string;
  status: 'active' | 'upcoming' | 'archived';
}

const mockCourses: Course[] = [
  { id: '1', name: 'Advanced Mathematics', code: 'MATH401', teacher: 'Dr. Smith', tier: 'AP', grade: '12', enrolled: 24, capacity: 30, schedule: 'Mon, Wed, Fri 9:00 AM', status: 'active' },
  { id: '2', name: 'Physics I', code: 'PHY301', teacher: 'Prof. Johnson', tier: 'Honors', grade: '11', enrolled: 28, capacity: 30, schedule: 'Tue, Thu 10:30 AM', status: 'active' },
  { id: '3', name: 'World History', code: 'HIS201', teacher: 'Mr. Davis', tier: 'Standard', grade: '10', enrolled: 25, capacity: 25, schedule: 'Mon, Wed 1:00 PM', status: 'active' },
  { id: '4', name: 'English Literature', code: 'ENG401', teacher: 'Ms. Wilson', tier: 'AP', grade: '12', enrolled: 20, capacity: 25, schedule: 'Tue, Thu 9:00 AM', status: 'active' },
  { id: '5', name: 'Biology', code: 'BIO201', teacher: 'Dr. Brown', tier: 'Standard', grade: '10', enrolled: 29, capacity: 30, schedule: 'Mon, Wed, Fri 11:00 AM', status: 'active' },
  { id: '6', name: 'Chemistry', code: 'CHE301', teacher: 'Dr. Smith', tier: 'Honors', grade: '11', enrolled: 22, capacity: 25, schedule: 'Tue, Thu 1:00 PM', status: 'active' },
];

export const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [speedGraderCourse, setSpeedGraderCourse] = useState<string | null>(null);

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier ? course.tier === filterTier : true;
    const matchesGrade = filterGrade ? course.grade === filterGrade : true;
    return matchesSearch && matchesTier && matchesGrade;
  });

  const totalEnrolled = mockCourses.reduce((sum, course) => sum + course.enrolled, 0);

  return (
    <div className="ep-classroom">
      {/* 1. Header */}
      <header className="ep-classroom__header">
        <div>
          <h1 className="ep-classroom__title">Campus Course Catalog</h1>
          <p className="ep-classroom__subtitle">Manage subject curriculums, course sections, enrolled rosters, and class schedules</p>
        </div>
        <button className="ep-btn ep-btn--primary">
          <Plus size={16} /> + Create New Course
        </button>
      </header>

      {/* 2. KPI Cards */}
      <section className="ep-classroom__kpi-grid">
        <div className="ep-classroom__kpi-card">
          <div className="ep-classroom__kpi-icon ep-classroom__kpi-icon--blue">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="ep-classroom__kpi-val">{mockCourses.length}</div>
            <div className="ep-classroom__kpi-lbl">Total Active Courses</div>
          </div>
        </div>

        <div className="ep-classroom__kpi-card">
          <div className="ep-classroom__kpi-icon ep-classroom__kpi-icon--purple">
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="ep-classroom__kpi-val">{totalEnrolled}</div>
            <div className="ep-classroom__kpi-lbl">Total Student Enrollments</div>
          </div>
        </div>

        <div className="ep-classroom__kpi-card">
          <div className="ep-classroom__kpi-icon ep-classroom__kpi-icon--green">
            <Users size={22} />
          </div>
          <div>
            <div className="ep-classroom__kpi-val">25.4</div>
            <div className="ep-classroom__kpi-lbl">Avg Class Size</div>
          </div>
        </div>

        <div className="ep-classroom__kpi-card">
          <div className="ep-classroom__kpi-icon ep-classroom__kpi-icon--amber">
            <CheckCircle size={22} />
          </div>
          <div>
            <div className="ep-classroom__kpi-val">100%</div>
            <div className="ep-classroom__kpi-lbl">Teacher Assigned</div>
          </div>
        </div>
      </section>

      {/* 3. Filters & Grid */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-surface-50)', padding: '8px 16px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', flex: 1, minWidth: '280px' }}>
          <Search size={16} color="var(--color-text-tertiary)" />
          <input
            type="text"
            placeholder="Search course title or code (e.g. MATH401)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--color-text-primary)', width: '100%' }}
          />
        </div>
        <select value={filterTier} onChange={(e) => setFilterTier(e.target.value)} className="ep-input" style={{ width: '160px' }}>
          <option value="">All Tiers</option>
          <option value="Standard">Standard</option>
          <option value="Honors">Honors</option>
          <option value="AP">AP</option>
        </select>
        <select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)} className="ep-input" style={{ width: '160px' }}>
          <option value="">All Grades</option>
          <option value="9">Grade 9</option>
          <option value="10">Grade 10</option>
          <option value="11">Grade 11</option>
          <option value="12">Grade 12</option>
        </select>
      </div>

      <div className="ep-classroom__grid">
        {filteredCourses.map(course => (
          <div key={course.id} className="ep-course-card" onClick={() => navigate(`/classroom/${course.id}`)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="ep-badge ep-badge--primary">{course.tier}</span>
              <span className="ep-badge ep-badge--success">{course.status}</span>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0 2px 0', color: 'var(--color-text-primary)' }}>{course.name}</h3>
              <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-primary-400)' }}>{course.code}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> {course.enrolled} / {course.capacity} Students</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {course.schedule}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><GraduationCap size={14} /> Instructor: {course.teacher}</div>
            </div>
            
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px', marginTop: '6px' }} onClick={e => e.stopPropagation()}>
              <button 
                className="ep-btn ep-btn--secondary" 
                style={{ width: '100%', fontSize: '12px' }}
                onClick={() => setSpeedGraderCourse(course.name)}
              >
                <Award size={14} style={{ marginRight: 6 }} /> SpeedGrader™ Submissions
              </button>
            </div>
          </div>
        ))}
      </div>

      {speedGraderCourse && (
        <SpeedGraderDrawer
          courseName={speedGraderCourse}
          isOpen={!!speedGraderCourse}
          onClose={() => setSpeedGraderCourse(null)}
        />
      )}
    </div>
  );
};

export default CourseList;
