import React, { useState } from 'react';
import { Search, Plus, Users, Clock, BookOpen, GraduationCap, CheckCircle, Award, Edit, Archive, Sparkles, Loader, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SpeedGraderDrawer } from './SpeedGraderDrawer';
import { LMSConnectorModal } from './LMSConnectorModal';
import { useAcademicStore } from '@/stores/academicStore';
import { useUIStore } from '@/stores/uiStore';
import { generateLessonPlan } from '@/services/geminiService';
import { Button } from '@/components/ui';
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
  { id: '1', name: 'Pre-K Sunshine Explorers Classroom', code: 'PREK-101', teacher: 'Ms. Emily Parker', tier: 'Early Childhood', grade: 'Pre-K', enrolled: 18, capacity: 20, schedule: 'Mon-Fri 8:30 AM - 12:00 PM', status: 'active' },
  { id: '2', name: 'Kindergarten Discovery Classroom', code: 'KND-102', teacher: 'Mrs. Sarah Jenkins', tier: 'Early Childhood', grade: 'Kindergarten', enrolled: 22, capacity: 25, schedule: 'Mon-Fri 8:30 AM - 2:30 PM', status: 'active' },
  { id: '3', name: 'Primary Grade 3 Math & Science', code: 'ELEM-301', teacher: 'Mr. David Thompson', tier: 'Primary School', grade: 'Grade 3', enrolled: 24, capacity: 25, schedule: 'Mon-Fri 9:00 AM - 3:00 PM', status: 'active' },
  { id: '4', name: 'Primary Grade 5 Reading & Social Studies', code: 'ELEM-502', teacher: 'Ms. Clara Oswald', tier: 'Primary School', grade: 'Grade 5', enrolled: 26, capacity: 28, schedule: 'Mon-Fri 9:00 AM - 3:00 PM', status: 'active' },
  { id: '5', name: 'Junior High Grade 8 Physical Science', code: 'JH-SCI801', teacher: 'Dr. Robert Brown', tier: 'Junior High', grade: 'Grade 8', enrolled: 28, capacity: 30, schedule: 'Mon, Wed, Fri 10:00 AM', status: 'active' },
  { id: '6', name: 'Junior High Grade 9 Algebra I', code: 'JH-ALG901', teacher: 'Mr. James Davis', tier: 'Junior High', grade: 'Grade 9', enrolled: 27, capacity: 30, schedule: 'Tue, Thu 9:00 AM', status: 'active' },
  { id: '7', name: 'Senior High AP Calculus BC', code: 'SH-MATH401', teacher: 'Dr. Smith', tier: 'Senior High', grade: 'Grade 12', enrolled: 24, capacity: 30, schedule: 'Mon, Wed, Fri 9:00 AM', status: 'active' },
  { id: '8', name: 'Senior High Physics I', code: 'SH-PHY301', teacher: 'Prof. Johnson', tier: 'Senior High', grade: 'Grade 11', enrolled: 28, capacity: 30, schedule: 'Tue, Thu 10:30 AM', status: 'active' },
  { id: '9', name: 'College Computer Science 101 (Python)', code: 'UNIV-CS101', teacher: 'Prof. Alan Turing', tier: 'College & University', grade: 'Undergraduate (Yr 1)', enrolled: 45, capacity: 50, schedule: 'Mon, Wed 2:00 PM', status: 'active' },
  { id: '10', name: 'College Organic Chemistry II', code: 'UNIV-CHEM302', teacher: 'Dr. Marie Curie', tier: 'College & University', grade: 'Undergraduate (Yr 3)', enrolled: 32, capacity: 35, schedule: 'Tue, Thu 1:00 PM', status: 'active' }
];

export const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [speedGraderCourse, setSpeedGraderCourse] = useState<string | null>(null);

  const academicStore = useAcademicStore();
  const { addToast } = useUIStore();

  const [courses, setCourses] = useState<Course[]>(mockCourses);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  
  const [enrollmentOpen, setEnrollmentOpen] = useState<string | null>(null);
  
  const [aiPlanOpen, setAiPlanOpen] = useState<string | null>(null);
  const [aiPlanContent, setAiPlanContent] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier ? course.tier === filterTier : true;
    const matchesGrade = filterGrade ? course.grade === filterGrade : true;
    return matchesSearch && matchesTier && matchesGrade;
  });

  const totalEnrolled = courses.reduce((sum, course) => sum + course.enrolled, 0);

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    const courseData = {
      ...data,
      enrolled: Number(data.enrolled) || 0,
      capacity: Number(data.capacity) || 30
    } as unknown as Course;

    if (courseToEdit) {
      setCourses(prev => prev.map(c => c.id === courseToEdit.id ? { ...c, ...courseData } : c));
      addToast({ type: 'success', title: 'Success', message: 'Course updated successfully' });
    } else {
      const newCourse = { ...courseData, id: `crs-${Date.now()}` };
      setCourses(prev => [...prev, newCourse]);
      addToast({ type: 'success', title: 'Success', message: 'Course created successfully' });
    }
    setIsFormOpen(false);
    setCourseToEdit(null);
  };

  const handleArchive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCourses(prev => prev.map(c => c.id === id ? { ...c, status: 'archived' } : c));
    academicStore.updateCourse(id, { status: 'archived' });
    addToast({ type: 'warning', title: 'Archived', message: 'Course archived.' });
  };

  const handleGenerateLessonPlan = async (course: Course, e: React.MouseEvent) => {
    e.stopPropagation();
    setAiPlanOpen(course.id);
    setIsAiLoading(true);
    try {
      const result = await generateLessonPlan(course.name, 'Introduction to the subject', course.grade, '45 Minutes');
      setAiPlanContent(result.success && result.content ? result.content : (result.error || 'Could not generate lesson plan.'));
    } catch (error) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to generate lesson plan.' });
      setAiPlanOpen(null);
    } finally {
      setIsAiLoading(false);
    }
  };

  const [isLmsModalOpen, setIsLmsModalOpen] = useState(false);

  return (
    <div className="ep-classroom">
      {/* 1. Header */}
      <header className="ep-classroom__header">
        <div>
          <h1 className="ep-classroom__title">Campus Course Catalog</h1>
          <p className="ep-classroom__subtitle">Manage subject curriculums, course sections, enrolled rosters, and class schedules</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="ep-btn ep-btn--secondary" onClick={() => setIsLmsModalOpen(true)}>
            <Share2 size={16} /> LMS Connectors (LTI 1.3)
          </button>
          <button className="ep-btn ep-btn--primary" onClick={() => { setCourseToEdit(null); setIsFormOpen(true); }}>
            <Plus size={16} /> + Create New Course
          </button>
        </div>
      </header>

      {/* 2. KPI Cards */}
      <section className="ep-classroom__kpi-grid">
        <div className="ep-classroom__kpi-card">
          <div className="ep-classroom__kpi-icon ep-classroom__kpi-icon--blue">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="ep-classroom__kpi-val">{courses.length}</div>
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
        <select value={filterTier} onChange={(e) => setFilterTier(e.target.value)} className="ep-input" style={{ width: '180px' }}>
          <option value="">All Tiers & Levels</option>
          <option value="Early Childhood">Early Childhood</option>
          <option value="Primary School">Primary School</option>
          <option value="Junior High">Junior High School</option>
          <option value="Senior High">Senior High School</option>
          <option value="College & University">College & University</option>
        </select>
        <select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)} className="ep-input" style={{ width: '180px' }}>
          <option value="">All Grade Levels</option>
          <option value="Pre-K">Pre-K</option>
          <option value="Kindergarten">Kindergarten</option>
          <option value="Grade 1">Grade 1</option>
          <option value="Grade 2">Grade 2</option>
          <option value="Grade 3">Grade 3</option>
          <option value="Grade 4">Grade 4</option>
          <option value="Grade 5">Grade 5</option>
          <option value="Grade 6">Grade 6</option>
          <option value="Grade 7">Grade 7</option>
          <option value="Grade 8">Grade 8</option>
          <option value="Grade 9">Grade 9</option>
          <option value="Grade 10">Grade 10</option>
          <option value="Grade 11">Grade 11</option>
          <option value="Grade 12">Grade 12</option>
          <option value="Undergraduate (Yr 1)">College - Freshman</option>
          <option value="Undergraduate (Yr 2)">College - Sophomore</option>
          <option value="Undergraduate (Yr 3)">College - Junior</option>
          <option value="Undergraduate (Yr 4)">College - Senior</option>
        </select>
      </div>

      <div className="ep-classroom__grid">
        {filteredCourses.map(course => (
          <div key={course.id} className="ep-course-card" onClick={() => navigate(`/classroom/${course.id}`)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="ep-badge ep-badge--primary">{course.tier}</span>
                <span className="ep-badge ep-badge--success" style={{ marginLeft: 8 }}>{course.status}</span>
              </div>
              <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                <Button variant="ghost" size="sm" icon={<Sparkles size={14} color="#a855f7" />} onClick={(e) => handleGenerateLessonPlan(course, e)} />
                <Button variant="ghost" size="sm" icon={<Edit size={14} />} onClick={(e) => { e.stopPropagation(); setCourseToEdit(course); setIsFormOpen(true); }} />
                <Button variant="ghost" size="sm" icon={<Archive size={14} />} onClick={(e) => handleArchive(course.id, e)} />
              </div>
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
            
            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '10px', marginTop: '6px' }} onClick={e => e.stopPropagation()}>
              <button 
                className="ep-btn ep-btn--secondary" 
                style={{ flex: 1, fontSize: '12px' }}
                onClick={() => setSpeedGraderCourse(course.name)}
              >
                <Award size={14} style={{ marginRight: 6 }} /> SpeedGrader™
              </button>
              <button 
                className="ep-btn ep-btn--secondary" 
                style={{ flex: 1, fontSize: '12px' }}
                onClick={() => setEnrollmentOpen(course.id)}
              >
                <Users size={14} style={{ marginRight: 6 }} /> Enroll Students
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

      {isFormOpen && (
        <div className="ep-course__modal-overlay">
          <div className="ep-course__modal">
            <h2 className="ep-course__modal-title">{courseToEdit ? 'Edit Course' : 'Create Course'}</h2>
            <form onSubmit={handleSaveCourse} className="ep-course__modal-form">
              <div className="ep-course__modal-grid">
                <div className="ep-course__modal-field">
                  <label className="ep-course__modal-label">Course Name</label>
                  <input name="name" defaultValue={courseToEdit?.name} required className="ep-course__modal-input" />
                </div>
                <div className="ep-course__modal-field">
                  <label className="ep-course__modal-label">Course Code</label>
                  <input name="code" defaultValue={courseToEdit?.code} required className="ep-course__modal-input" placeholder="e.g. MATH401" />
                </div>
                <div className="ep-course__modal-field">
                  <label className="ep-course__modal-label">Educational Level / Tier</label>
                  <select name="tier" defaultValue={courseToEdit?.tier || 'Senior High'} className="ep-course__modal-select">
                    <option value="Early Childhood">Early Childhood (Pre-K & Kindergarten)</option>
                    <option value="Primary School">Primary School (Grades 1 - 6)</option>
                    <option value="Junior High">Junior High School (Grades 7 - 9)</option>
                    <option value="Senior High">Senior High School (Grades 10 - 12)</option>
                    <option value="College & University">College & University (Higher Ed)</option>
                    <option value="AP & Honors">AP & Honors</option>
                  </select>
                </div>
                <div className="ep-course__modal-field">
                  <label className="ep-course__modal-label">Grade Level / Year</label>
                  <select name="grade" defaultValue={courseToEdit?.grade || 'Grade 10'} className="ep-course__modal-select">
                    <option value="Pre-K">Pre-K</option>
                    <option value="Kindergarten">Kindergarten</option>
                    <option value="Grade 1">Grade 1 (Primary)</option>
                    <option value="Grade 2">Grade 2 (Primary)</option>
                    <option value="Grade 3">Grade 3 (Primary)</option>
                    <option value="Grade 4">Grade 4 (Primary)</option>
                    <option value="Grade 5">Grade 5 (Primary)</option>
                    <option value="Grade 6">Grade 6 (Primary)</option>
                    <option value="Grade 7">Grade 7 (Junior High)</option>
                    <option value="Grade 8">Grade 8 (Junior High)</option>
                    <option value="Grade 9">Grade 9 (Junior High)</option>
                    <option value="Grade 10">Grade 10 (Senior High)</option>
                    <option value="Grade 11">Grade 11 (Senior High)</option>
                    <option value="Grade 12">Grade 12 (Senior High)</option>
                    <option value="Undergraduate (Yr 1)">College - Freshman (Yr 1)</option>
                    <option value="Undergraduate (Yr 2)">College - Sophomore (Yr 2)</option>
                    <option value="Undergraduate (Yr 3)">College - Junior (Yr 3)</option>
                    <option value="Undergraduate (Yr 4)">College - Senior (Yr 4)</option>
                    <option value="Postgraduate / Masters">Postgraduate / Masters / PhD</option>
                  </select>
                </div>
                <div className="ep-course__modal-field">
                  <label className="ep-course__modal-label">Teacher</label>
                  <select name="teacher" defaultValue={courseToEdit?.teacher} className="ep-course__modal-select">
                    <option value="Dr. Smith">Dr. Smith</option>
                    <option value="Prof. Johnson">Prof. Johnson</option>
                    <option value="Mr. Davis">Mr. Davis</option>
                    <option value="Ms. Wilson">Ms. Wilson</option>
                  </select>
                </div>
                <div className="ep-course__modal-field">
                  <label className="ep-course__modal-label">Credits/Units</label>
                  <input name="credits" type="number" defaultValue={3} className="ep-course__modal-input" />
                </div>
                <div className="ep-course__modal-field">
                  <label className="ep-course__modal-label">Max Enrollment</label>
                  <input name="capacity" type="number" defaultValue={courseToEdit?.capacity || 30} className="ep-course__modal-input" />
                </div>
                <div className="ep-course__modal-field">
                  <label className="ep-course__modal-label">Status</label>
                  <select name="status" defaultValue={courseToEdit?.status || 'active'} className="ep-course__modal-select">
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="ep-course__modal-field" style={{ gridColumn: '1 / -1', marginTop: 12 }}>
                <label className="ep-course__modal-label">Description</label>
                <textarea name="description" className="ep-course__modal-textarea" rows={3}></textarea>
              </div>
              <div className="ep-course__modal-actions">
                <Button variant="ghost" type="button" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Save Course</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {enrollmentOpen && (
        <div className="ep-course__modal-overlay">
          <div className="ep-course__modal">
            <h2 className="ep-course__modal-title">Enroll Students</h2>
            <div className="ep-course__modal-grid" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {academicStore.students.length > 0 ? (
                academicStore.students.map(s => (
                  <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" defaultChecked={Math.random() > 0.7} /> {s.firstName} {s.lastName} (Grade {s.gradeLevel})
                  </label>
                ))
              ) : (
                <div style={{ color: 'var(--color-text-secondary)' }}>No students in store. Please add students first.</div>
              )}
            </div>
            <div className="ep-course__modal-actions">
              <Button variant="ghost" onClick={() => setEnrollmentOpen(null)}>Cancel</Button>
              <Button variant="primary" onClick={() => {
                setEnrollmentOpen(null);
                addToast({ type: 'success', title: 'Success', message: 'Enrollment updated' });
              }}>Save Enrollment</Button>
            </div>
          </div>
        </div>
      )}

      {aiPlanOpen && (
        <div className="ep-course__modal-overlay">
          <div className="ep-course__modal" style={{ maxWidth: 800 }}>
            <h2 className="ep-course__modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={20} color="#a855f7" /> AI Lesson Plan Generator
            </h2>
            {isAiLoading ? (
              <div className="ep-course__lesson-loader">
                <Loader size={32} className="ep-spin" style={{ animation: 'spin 2s linear infinite' }} />
                <p>Generating a custom lesson plan...</p>
              </div>
            ) : (
              <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)', fontSize: 13, background: 'var(--color-surface-100)', padding: 16, borderRadius: 8 }}>
                {aiPlanContent}
              </div>
            )}
            <div className="ep-course__modal-actions">
              {!isAiLoading && (
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(aiPlanContent).then(() => addToast({ type: 'info', title: 'Copied', message: 'Copied to clipboard' }))}>
                  Copy Plan
                </Button>
              )}
              <Button variant="ghost" onClick={() => setAiPlanOpen(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* LMS Connector Modal */}
      <LMSConnectorModal isOpen={isLmsModalOpen} onClose={() => setIsLmsModalOpen(false)} />
    </div>
  );
};

export default CourseList;
