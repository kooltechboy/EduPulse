import React, { useState, useMemo } from 'react';
import { 
  Table, 
  Button, 
  Badge, 
  Avatar, 
  SearchInput, 
  Pagination, 
  EmptyState, 
  ConfirmDialog,
  Select 
} from '@/components/ui';
import { Eye, Users, BookOpen, Award, CheckCircle, Plus, LayoutGrid, List as ListIcon, Edit, Trash2, Download, Calendar, Book } from 'lucide-react';
import { TeacherProfile } from './TeacherProfile';
import { usePagination } from '@/hooks/usePagination';
import { useSearch } from '@/hooks/useSearch';
import { useUIStore } from '@/stores/uiStore';
import './TeacherList.css';

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  subjects: string;
  classesCount: number;
  qualification: string;
  status: string;
  photo: string;
  hireDate: string;
}

const MOCK_TEACHERS: Teacher[] = Array.from({ length: 12 }, (_, i) => ({
  id: `tch-${i + 1}`,
  firstName: `Teacher${i + 1}`,
  lastName: `Name${i + 1}`,
  email: `teacher${i + 1}@edupulse.edu`,
  phone: `555-030${i % 10}`,
  department: ['Science', 'Mathematics', 'English', 'History', 'Arts'][i % 5],
  subjects: ['Physics', 'Algebra', 'Literature', 'World History', 'Music'].slice(i % 5, (i % 5) + 2).join(', '),
  classesCount: 3 + (i % 4),
  qualification: ['M.Sc. Education', 'B.A. Literature', 'Ph.D. Physics', 'M.A. History'][i % 4],
  status: i % 8 === 0 ? 'on leave' : 'active',
  photo: `https://i.pravatar.cc/150?u=tch${i}`,
  hireDate: `2018-08-15`,
}));

export const TeacherList: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState<Teacher | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { addToast } = useUIStore();
  const [courseAssignmentOpen, setCourseAssignmentOpen] = useState<string | null>(null);
  const [scheduleViewerOpen, setScheduleViewerOpen] = useState<string | null>(null);

  const [deptFilter, setDeptFilter] = useState('');

  const { query, setQuery, filteredItems } = useSearch(
    teachers,
    ['firstName', 'lastName', 'email', 'department', 'subjects']
  );

  const filteredTeachers = useMemo(() => {
    return (filteredItems as Teacher[]).filter(t => {
      const matchDept = deptFilter ? t.department === deptFilter : true;
      return matchDept;
    });
  }, [filteredItems, deptFilter]);

  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
  } = usePagination(filteredTeachers, 12);

  const handleDelete = () => {
    if (teacherToDelete) {
      setTeachers(prev => prev.filter(t => t.id !== teacherToDelete));
      setTeacherToDelete(null);
      addToast({ type: 'warning', title: 'Deleted', message: 'Teacher removed.' });
    }
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    if (teacherToEdit) {
      setTeachers(prev => prev.map(t => t.id === teacherToEdit.id ? { ...t, ...data } as unknown as Teacher : t));
      addToast({ type: 'success', title: 'Success', message: 'Teacher updated successfully' });
    } else {
      setTeachers(prev => [...prev, { ...data, classesCount: 0, id: `tch-${crypto.randomUUID()}` } as unknown as Teacher]);
      addToast({ type: 'success', title: 'Success', message: 'Teacher added successfully' });
    }
    setIsFormOpen(false);
    setTeacherToEdit(null);
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Department', 'Subjects', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredTeachers.map(t => `"${t.firstName} ${t.lastName}","${t.email}","${t.department}","${t.subjects}","${t.status}"`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teacher_list.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const columns = useMemo(() => [
    {
      key: 'photo',
      label: 'Faculty Member',
      render: (_: unknown, t: Teacher) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar src={t.photo} name={`${t.firstName} ${t.lastName}`} size="md" />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{t.firstName} {t.lastName}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{t.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'department',
      label: 'Department',
      render: (value: unknown) => <Badge variant="neutral">{String(value)}</Badge>
    },
    {
      key: 'subjects',
      label: 'Subjects Taught'
    },
    {
      key: 'classesCount',
      label: 'Active Classes',
      render: (val: unknown) => <span style={{ fontWeight: 700 }}>{String(val)} Sections</span>
    },
    {
      key: 'qualification',
      label: 'Qualification'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => (
        <Badge variant={String(value) === 'active' ? 'success' : 'warning'}>
          {String(value)}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: unknown, t: Teacher) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <Button variant="ghost" size="sm" icon={<Book size={16} />} onClick={() => setCourseAssignmentOpen(t.id)} />
          <Button variant="ghost" size="sm" icon={<Calendar size={16} />} onClick={() => setScheduleViewerOpen(t.id)} />
          <Button variant="ghost" size="sm" icon={<Eye size={16} />} onClick={() => { setSelectedTeacher(t); setIsProfileOpen(true); }} />
          <Button variant="ghost" size="sm" icon={<Edit size={16} />} onClick={() => { setTeacherToEdit(t); setIsFormOpen(true); }} />
          <Button variant="ghost" size="sm" icon={<Trash2 size={16} />} onClick={() => setTeacherToDelete(t.id)} />
        </div>
      )
    }
  ], []);

  return (
    <div className="ep-teacher-list">
      {/* 1. Header */}
      <header className="ep-teacher-list__header">
        <div>
          <h1 className="ep-teacher-list__title">Faculty & Teacher Directory Command Hub</h1>
          <p className="ep-teacher-list__subtitle">Academic department heads, course instructors, teaching loads, and faculty dossiers</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="ep-tabs" style={{ padding: '2px' }}>
            <button 
              className={`ep-tab ${viewMode === 'grid' ? 'ep-tab--active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={14} style={{ marginRight: 6 }} /> Grid View
            </button>
            <button 
              className={`ep-tab ${viewMode === 'list' ? 'ep-tab--active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <ListIcon size={14} style={{ marginRight: 6 }} /> List View
            </button>
          </div>
          <Button variant="ghost" icon={<Download size={16} />} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="primary" icon={<Plus size={16} />} onClick={() => { setTeacherToEdit(null); setIsFormOpen(true); }}>
            + Add Faculty Teacher
          </Button>
        </div>
      </header>

      {/* 2. KPI Cards */}
      <section className="ep-teacher-list__kpi-grid">
        <div className="ep-teacher-list__kpi-card">
          <div className="ep-teacher-list__kpi-icon ep-teacher-list__kpi-icon--blue">
            <Users size={22} />
          </div>
          <div>
            <div className="ep-teacher-list__kpi-val">{teachers.length}</div>
            <div className="ep-teacher-list__kpi-lbl">Total Faculty Teachers</div>
          </div>
        </div>

        <div className="ep-teacher-list__kpi-card">
          <div className="ep-teacher-list__kpi-icon ep-teacher-list__kpi-icon--green">
            <CheckCircle size={22} />
          </div>
          <div>
            <div className="ep-teacher-list__kpi-val">{teachers.filter(t => t.status === 'active').length}</div>
            <div className="ep-teacher-list__kpi-lbl">Active In Class</div>
          </div>
        </div>

        <div className="ep-teacher-list__kpi-card">
          <div className="ep-teacher-list__kpi-icon ep-teacher-list__kpi-icon--purple">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="ep-teacher-list__kpi-val">42</div>
            <div className="ep-teacher-list__kpi-lbl">Total Active Courses</div>
          </div>
        </div>

        <div className="ep-teacher-list__kpi-card">
          <div className="ep-teacher-list__kpi-icon ep-teacher-list__kpi-icon--amber">
            <Award size={22} />
          </div>
          <div>
            <div className="ep-teacher-list__kpi-val">85%</div>
            <div className="ep-teacher-list__kpi-lbl">Advanced Degrees (M.Sc / Ph.D)</div>
          </div>
        </div>
      </section>

      {/* 3. Filters */}
      <div className="ep-teacher-list__filters-bar">
        <div style={{ flex: 1, minWidth: '280px' }}>
          <SearchInput 
            value={query} 
            onChange={setQuery} 
            placeholder="Search teachers by name, subject, department..." 
          />
        </div>
        <Select 
          value={deptFilter} 
          onChange={e => setDeptFilter(e.target.value)}
          options={[
            { label: 'All Departments', value: '' },
            { label: 'Science', value: 'Science' },
            { label: 'Mathematics', value: 'Mathematics' },
            { label: 'English', value: 'English' },
            { label: 'History', value: 'History' },
            { label: 'Arts', value: 'Arts' },
          ]}
        />
      </div>

      {/* 4. Main Body Grid / List */}
      {paginatedItems.length === 0 ? (
        <EmptyState 
          icon={<Users size={48} />} 
          title="No teachers found" 
          description="Try adjusting your search or filters." 
        />
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {paginatedItems.map(teacher => (
                <div 
                  key={teacher.id} 
                  className="ep-card" 
                  style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onClick={() => { setSelectedTeacher(teacher); setIsProfileOpen(true); }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Avatar src={teacher.photo} name={`${teacher.firstName} ${teacher.lastName}`} size="lg" />
                      <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{teacher.firstName} {teacher.lastName}</h3>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{teacher.email}</div>
                      </div>
                    </div>
                    <Badge variant={teacher.status === 'active' ? 'success' : 'warning'}>{teacher.status}</Badge>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'var(--color-surface-100)', padding: '12px', borderRadius: '10px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Department</div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-text-primary)' }}>{teacher.department}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Class Load</div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-primary-400)' }}>{teacher.classesCount} Sections</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--color-text-tertiary)', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                    <div>Subjects: {teacher.subjects}</div>
                    <div style={{ display: 'flex', gap: '4px' }} onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" icon={<Book size={14} />} onClick={() => setCourseAssignmentOpen(teacher.id)} />
                      <Button variant="ghost" size="sm" icon={<Calendar size={14} />} onClick={() => setScheduleViewerOpen(teacher.id)} />
                      <Button variant="ghost" size="sm" icon={<Edit size={14} />} onClick={() => { setTeacherToEdit(teacher); setIsFormOpen(true); }} />
                      <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} onClick={() => setTeacherToDelete(teacher.id)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="ep-table-wrapper">
              <Table
                columns={columns}
                data={paginatedItems}
              />
            </div>
          )}

          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={goToPage} 
            totalItems={filteredTeachers.length}
            itemsPerPage={12}
          />
        </>
      )}

      {isProfileOpen && selectedTeacher && (
        <TeacherProfile 
          teacher={selectedTeacher} 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
          onEdit={() => { setIsProfileOpen(false); setTeacherToEdit(selectedTeacher); setIsFormOpen(true); }}
        />
      )}

      {isFormOpen && (
        <div className="ep-teacher__modal-overlay">
          <div className="ep-teacher__modal">
            <h2 className="ep-teacher__modal-title">{teacherToEdit ? 'Edit Teacher' : 'Add Teacher'}</h2>
            <form onSubmit={handleSaveTeacher} className="ep-teacher__modal-form">
              <div className="ep-teacher__modal-grid">
                <div className="ep-teacher__modal-field">
                  <label className="ep-teacher__modal-label">First Name</label>
                  <input name="firstName" defaultValue={teacherToEdit?.firstName} required className="ep-teacher__modal-input" />
                </div>
                <div className="ep-teacher__modal-field">
                  <label className="ep-teacher__modal-label">Last Name</label>
                  <input name="lastName" defaultValue={teacherToEdit?.lastName} required className="ep-teacher__modal-input" />
                </div>
                <div className="ep-teacher__modal-field">
                  <label className="ep-teacher__modal-label">Email</label>
                  <input name="email" type="email" defaultValue={teacherToEdit?.email} required className="ep-teacher__modal-input" />
                </div>
                <div className="ep-teacher__modal-field">
                  <label className="ep-teacher__modal-label">Phone</label>
                  <input name="phone" defaultValue={teacherToEdit?.phone} className="ep-teacher__modal-input" />
                </div>
                <div className="ep-teacher__modal-field">
                  <label className="ep-teacher__modal-label">Subject Specialization</label>
                  <input name="subjects" defaultValue={teacherToEdit?.subjects} className="ep-teacher__modal-input" />
                </div>
                <div className="ep-teacher__modal-field">
                  <label className="ep-teacher__modal-label">Department</label>
                  <select name="department" defaultValue={teacherToEdit?.department || 'Science'} className="ep-teacher__modal-select">
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="History">History</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>
                <div className="ep-teacher__modal-field">
                  <label className="ep-teacher__modal-label">Qualifications</label>
                  <input name="qualification" defaultValue={teacherToEdit?.qualification} className="ep-teacher__modal-input" />
                </div>
                <div className="ep-teacher__modal-field">
                  <label className="ep-teacher__modal-label">Hire Date</label>
                  <input name="hireDate" type="date" defaultValue={teacherToEdit?.hireDate} required className="ep-teacher__modal-input" />
                </div>
              </div>
              <div className="ep-teacher__modal-actions">
                <Button variant="ghost" type="button" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Save Teacher</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {courseAssignmentOpen && (
        <div className="ep-teacher__modal-overlay">
          <div className="ep-teacher__modal">
            <h2 className="ep-teacher__modal-title">Assign Courses</h2>
            <div className="ep-teacher__modal-grid">
              {['Physics 101', 'Algebra I', 'World History', 'Literature', 'Biology'].map(course => (
                <label key={course} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" defaultChecked={Math.random() > 0.5} /> {course}
                </label>
              ))}
            </div>
            <div className="ep-teacher__modal-actions">
              <Button variant="ghost" onClick={() => setCourseAssignmentOpen(null)}>Cancel</Button>
              <Button variant="primary" onClick={() => {
                setCourseAssignmentOpen(null);
                addToast({ type: 'success', title: 'Success', message: 'Courses assigned successfully' });
              }}>Save Assignments</Button>
            </div>
          </div>
        </div>
      )}

      {scheduleViewerOpen && (
        <div className="ep-teacher__modal-overlay">
          <div className="ep-teacher__modal">
            <h2 className="ep-teacher__modal-title">Weekly Schedule</h2>
            <div className="ep-teacher__schedule-grid">
              <div className="ep-teacher__schedule-cell ep-teacher__schedule-header">Period</div>
              <div className="ep-teacher__schedule-cell ep-teacher__schedule-header">Mon</div>
              <div className="ep-teacher__schedule-cell ep-teacher__schedule-header">Tue</div>
              <div className="ep-teacher__schedule-cell ep-teacher__schedule-header">Wed</div>
              <div className="ep-teacher__schedule-cell ep-teacher__schedule-header">Thu</div>
              <div className="ep-teacher__schedule-cell ep-teacher__schedule-header">Fri</div>
              {[1,2,3,4,5,6,7,8].map(period => (
                <React.Fragment key={period}>
                  <div className="ep-teacher__schedule-cell" style={{ fontWeight: 'bold' }}>{period}</div>
                  {[1,2,3,4,5].map(day => (
                    <div key={`${period}-${day}`} className="ep-teacher__schedule-cell">
                      {Math.random() > 0.6 ? 'Class' : ''}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
            <div className="ep-teacher__modal-actions">
              <Button variant="ghost" onClick={() => setScheduleViewerOpen(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!teacherToDelete}
        title="Delete Faculty Member"
        message="Are you sure you want to delete this teacher record? This action cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setTeacherToDelete(null)}
      />
    </div>
  );
};

export default TeacherList;
