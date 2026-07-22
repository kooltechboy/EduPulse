import React, { useState, useMemo, useRef } from 'react';
import { 
  Table, 
  Button, 
  Badge, 
  Avatar, 
  SearchInput, 
  Pagination, 
  EmptyState, 
  ConfirmDialog, 
  Select,
  type Column
} from '@/components/ui';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Users, 
  GraduationCap, 
  Award, 
  CheckCircle, 
  LayoutGrid, 
  List as ListIcon, 
  Download, 
  Upload, 
  FileText, 
  CheckSquare, 
  Square, 
  ArrowRight,
  ChevronRight,
  TrendingUp,
  BarChart2,
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { StudentProfile } from './StudentProfile';
import { StudentForm } from './StudentForm';
import { ReportCardModal } from '../reports/ReportCardModal';
import { usePagination } from '@/hooks/usePagination';
import { useSearch } from '@/hooks/useSearch';
import { useUIStore } from '@/stores/uiStore';
import './StudentList.css';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  section: string;
  gpa: string;
  attendance: number;
  status: string;
  tier: string;
  photo: string;
  guardianName: string;
  guardianPhone: string;
  enrollmentDate: string;
}

const MOCK_STUDENTS: Student[] = Array.from({ length: 25 }, (_, i) => ({
  id: `std-${i + 1}`,
  firstName: `Student${i + 1}`,
  lastName: `Lastname${i + 1}`,
  email: `student${i + 1}@edupulse.edu`,
  grade: ['9', '10', '11', '12'][i % 4],
  section: ['A', 'B', 'C'][i % 3],
  gpa: (2.5 + (i % 15) * 0.1).toFixed(2),
  attendance: 85 + (i % 15),
  status: i % 10 === 0 ? 'inactive' : 'active',
  tier: ['standard', 'premium', 'scholarship'][i % 3],
  photo: `https://i.pravatar.cc/150?u=std${i}`,
  guardianName: `Guardian ${i + 1}`,
  guardianPhone: `555-010${i % 10}`,
  enrollmentDate: `2023-09-01`,
}));

export const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [reportCardStudent, setReportCardStudent] = useState<Student | null>(null);

  const addToast = useUIStore(s => s.addToast);

  const [gradeFilter, setGradeFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeKpiFilter, setActiveKpiFilter] = useState<'all' | 'active' | 'inactive' | 'gpa' | null>(null);
  const [gpaMinFilter, setGpaMinFilter] = useState<number | null>(null);
  const [gpaMaxFilter, setGpaMaxFilter] = useState<number | null>(null);

  const [isGpaModalOpen, setIsGpaModalOpen] = useState(false);

  const csvInputRef = useRef<HTMLInputElement>(null);

  const { query, setQuery, filteredItems } = useSearch(
    students,
    ['firstName', 'lastName', 'email', 'grade']
  );

  const filteredStudents = useMemo(() => {
    return (filteredItems as Student[]).filter(student => {
      const matchGrade = gradeFilter ? student.grade === gradeFilter : true;
      const matchTier = tierFilter ? student.tier === tierFilter : true;
      const matchStatus = statusFilter ? student.status === statusFilter : true;
      const gpaNum = parseFloat(student.gpa);
      const matchMinGpa = gpaMinFilter !== null ? gpaNum >= gpaMinFilter : true;
      const matchMaxGpa = gpaMaxFilter !== null ? gpaNum <= gpaMaxFilter : true;
      return matchGrade && matchTier && matchStatus && matchMinGpa && matchMaxGpa;
    });
  }, [filteredItems, gradeFilter, tierFilter, statusFilter, gpaMinFilter, gpaMaxFilter]);

  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
  } = usePagination(filteredStudents, 12);

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const inactiveStudents = students.filter(s => s.status === 'inactive').length;
  const avgGpa = (students.reduce((acc, s) => acc + parseFloat(s.gpa), 0) / totalStudents).toFixed(2);

  // KPI Card Action Handlers
  const handleKpiTotalClick = () => {
    setQuery('');
    setGradeFilter('');
    setTierFilter('');
    setStatusFilter('');
    setGpaMinFilter(null);
    setGpaMaxFilter(null);
    setActiveKpiFilter('all');
    setSelectedIds(new Set(students.map(s => s.id)));
    goToPage(1);
    if (typeof addToast === 'function') {
      addToast({ type: 'success', title: 'Total Enrolled Roster', message: 'Displaying and selecting all 25 enrolled students.' });
    }
    document.getElementById('student-roster-view')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKpiActiveClick = () => {
    setQuery('');
    setGradeFilter('');
    setTierFilter('');
    setGpaMinFilter(null);
    setGpaMaxFilter(null);
    setStatusFilter('active');
    setActiveKpiFilter('active');
    const activeList = students.filter(s => s.status === 'active');
    setSelectedIds(new Set(activeList.map(s => s.id)));
    goToPage(1);
    if (typeof addToast === 'function') {
      addToast({ type: 'info', title: 'Active Enrolment Filtered', message: `Displaying ${activeList.length} active enrolled students.` });
    }
    document.getElementById('student-roster-view')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKpiInactiveClick = () => {
    setQuery('');
    setGradeFilter('');
    setTierFilter('');
    setGpaMinFilter(null);
    setGpaMaxFilter(null);
    setStatusFilter('inactive');
    setActiveKpiFilter('inactive');
    const inactiveList = students.filter(s => s.status === 'inactive');
    setSelectedIds(new Set(inactiveList.map(s => s.id)));
    goToPage(1);
    if (typeof addToast === 'function') {
      addToast({ type: 'warning', title: 'On Leave / Inactive Filtered', message: `Displaying ${inactiveList.length} students on leave/inactive.` });
    }
    document.getElementById('student-roster-view')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKpiGpaClick = () => {
    setActiveKpiFilter('gpa');
    setIsGpaModalOpen(true);
  };

  const handleApplyGpaFilter = (min: number | null, max: number | null, label: string) => {
    setGpaMinFilter(min);
    setGpaMaxFilter(max);
    setIsGpaModalOpen(false);
    goToPage(1);
    if (typeof addToast === 'function') {
      addToast({ type: 'success', title: 'GPA Filter Applied', message: `Filtered student roster by ${label}.` });
    }
    document.getElementById('student-roster-view')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = () => {
    if (studentToDelete) {
      setStudents(prev => prev.filter(s => s.id !== studentToDelete));
      setStudentToDelete(null);
      if (typeof addToast === 'function') {
        addToast({ type: 'success', title: 'Deleted', message: 'Student deleted successfully.' });
      }
    }
  };

  const handleSaveStudent = (studentData: any) => {
    if (studentToEdit) {
      setStudents(prev => prev.map(s => s.id === studentData.id ? studentData : s));
      if (typeof addToast === 'function') {
        addToast({ type: 'success', title: 'Updated', message: 'Student updated successfully.' });
      }
    } else {
      setStudents(prev => [...prev, { ...studentData, id: `std-${Date.now()}` }]);
      if (typeof addToast === 'function') {
        addToast({ type: 'success', title: 'Created', message: 'Student created successfully.' });
      }
    }
    setIsFormOpen(false);
    setStudentToEdit(null);
  };

  const toggleSelectStudent = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const selectAllCurrentPage = () => {
    if (selectedIds.size === paginatedItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedItems.map(s => s.id)));
    }
  };

  const exportStudentsCSV = () => {
    const targetStudents = selectedIds.size > 0 
      ? students.filter(s => selectedIds.has(s.id))
      : filteredStudents;

    let csv = `ID,First Name,Last Name,Email,Grade,Section,GPA,Attendance %,Status,Tier,Guardian,Guardian Phone\n`;
    targetStudents.forEach(s => {
      csv += `"${s.id}","${s.firstName}","${s.lastName}","${s.email}","${s.grade}","${s.section}","${s.gpa}",${s.attendance},"${s.status}","${s.tier}","${s.guardianName}","${s.guardianPhone}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EduPulse_Students_Roster_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (typeof addToast === 'function') {
      addToast({ type: 'success', title: 'Exported', message: 'CSV exported successfully.' });
    }
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length <= 1) return;

      const imported: Student[] = [];
      lines.slice(1).forEach((line, i) => {
        const p = line.split(',').map(item => item.replace(/^"|"$/g, ''));
        if (p.length >= 4) {
          imported.push({
            id: p[0] || `std-imp-${Date.now()}-${i}`,
            firstName: p[1] || `First${i}`,
            lastName: p[2] || `Last${i}`,
            email: p[3] || `student${i}@edupulse.edu`,
            grade: p[4] || '10',
            section: p[5] || 'A',
            gpa: p[6] || '3.50',
            attendance: parseInt(p[7] || '95', 10),
            status: p[8] || 'active',
            tier: p[9] || 'standard',
            photo: `https://i.pravatar.cc/150?u=imp${i}`,
            guardianName: p[10] || 'Guardian',
            guardianPhone: p[11] || '555-0199',
            enrollmentDate: '2025-09-01'
          });
        }
      });

      if (imported.length > 0) {
        setStudents(prev => [...imported, ...prev]);
        if (typeof addToast === 'function') {
          addToast({ type: 'success', title: 'Imported', message: `Successfully imported ${imported.length} student records.` });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleBatchPromote = () => {
    setStudents(prev => prev.map(s => {
      if (selectedIds.has(s.id)) {
        const nextGrade = parseInt(s.grade, 10) ? String(parseInt(s.grade, 10) + 1) : s.grade;
        return { ...s, grade: nextGrade };
      }
      return s;
    }));
    if (typeof addToast === 'function') {
      addToast({ type: 'success', title: 'Batch Promoted', message: `Promoted ${selectedIds.size} students to next grade.` });
    }
  };

  const columns: Column<Student>[] = [
    {
      key: 'select',
      label: 'Select',
      render: (_, s: Student) => (
        <input 
          type="checkbox" 
          checked={selectedIds.has(s.id)}
          onChange={(e) => { e.stopPropagation(); toggleSelectStudent(s.id); }}
          style={{ cursor: 'pointer' }}
        />
      ),
    },
    {
      key: 'firstName',
      label: 'Student',
      sortable: true,
      render: (_, s: Student) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar src={s.photo} name={`${s.firstName} ${s.lastName}`} size="md" />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{s.firstName} {s.lastName}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{s.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'grade',
      label: 'Grade & Section',
      sortable: true,
      render: (_, s: Student) => `Grade ${s.grade}-${s.section}`,
    },
    {
      key: 'gpa',
      label: 'GPA',
      sortable: true,
      render: (_, s: Student) => (
        <span style={{ fontWeight: 700, color: parseFloat(s.gpa) >= 3.5 ? 'var(--color-success-500)' : 'var(--color-text-primary)' }}>
          {s.gpa}
        </span>
      ),
    },
    {
      key: 'attendance',
      label: 'Attendance',
      sortable: true,
      render: (_, s: Student) => `${s.attendance}%`,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (_, s: Student) => (
        <Badge variant={s.status === 'active' ? 'success' : 'neutral'}>
          {s.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, s: Student) => (
        <div style={{ display: 'flex', gap: '8px' }} onClick={e => e.stopPropagation()}>
          <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => { setSelectedStudent(s); setIsProfileOpen(true); }} />
          <Button variant="ghost" size="sm" icon={<FileText size={14} />} title="Report Card" onClick={() => setReportCardStudent(s)} />
          <Button variant="ghost" size="sm" icon={<Edit size={14} />} onClick={() => { setStudentToEdit(s); setIsFormOpen(true); }} />
          <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} onClick={() => setStudentToDelete(s.id)} />
        </div>
      ),
    },
  ];

  // GPA breakdown calculations
  const honorRollCount = students.filter(s => parseFloat(s.gpa) >= 3.5).length;
  const goodStandingCount = students.filter(s => parseFloat(s.gpa) >= 3.0 && parseFloat(s.gpa) < 3.5).length;
  const warningCount = students.filter(s => parseFloat(s.gpa) < 3.0).length;

  return (
    <div className="ep-student-list">
      {/* 1. Header with Title & Action Buttons */}
      <header className="ep-student-list__header">
        <div>
          <h1 className="ep-student-list__title">Student Information System</h1>
          <p className="ep-student-list__subtitle">Manage student enrollment, academic standings, and batch administrative rosters</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', background: 'var(--color-surface-100)', padding: '3px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <button 
              className={`ep-btn ep-btn--sm ${viewMode === 'grid' ? 'ep-btn--primary' : 'ep-btn--ghost'}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <LayoutGrid size={16} /> Grid
            </button>
            <button 
              className={`ep-btn ep-btn--sm ${viewMode === 'list' ? 'ep-btn--primary' : 'ep-btn--ghost'}`}
              onClick={() => setViewMode('list')}
              title="List Table View"
            >
              <ListIcon size={16} /> Table
            </button>
          </div>

          <button className="ep-btn ep-btn--secondary" onClick={exportStudentsCSV} title="Export Roster CSV">
            <Download size={16} /> Export CSV
          </button>

          <input type="file" ref={csvInputRef} accept=".csv" style={{ display: 'none' }} onChange={handleImportCSV} />
          <button className="ep-btn ep-btn--secondary" onClick={() => csvInputRef.current?.click()} title="Import Roster CSV">
            <Upload size={16} /> Bulk Import
          </button>

          <Button variant="primary" icon={<Plus size={16} />} onClick={() => { setStudentToEdit(null); setIsFormOpen(true); }}>
            + Add New Student
          </Button>
        </div>
      </header>

      {/* 2. Interactive KPI Cards */}
      <section className="ep-student-list__kpi-grid">
        {/* CARD 1: TOTAL ENROLLED */}
        <div 
          className={`ep-student-list__kpi-card ep-student-list__kpi-card--blue ${activeKpiFilter === 'all' ? 'ep-student-list__kpi-card--active' : ''}`}
          onClick={handleKpiTotalClick}
          title="Click to view & select all 25 enrolled students"
        >
          <div className="ep-student-list__kpi-left">
            <div className="ep-student-list__kpi-icon ep-student-list__kpi-icon--blue">
              <GraduationCap size={22} />
            </div>
            <div>
              <div className="ep-student-list__kpi-val">{totalStudents}</div>
              <div className="ep-student-list__kpi-lbl">Total Enrolled Students</div>
            </div>
          </div>
          <span className="ep-student-list__kpi-action-hint">
            Roster <ChevronRight size={14} />
          </span>
        </div>

        {/* CARD 2: ACTIVE ENROLMENT */}
        <div 
          className={`ep-student-list__kpi-card ep-student-list__kpi-card--green ${activeKpiFilter === 'active' ? 'ep-student-list__kpi-card--active' : ''}`}
          onClick={handleKpiActiveClick}
          title="Click to filter 22 active enrolled students"
        >
          <div className="ep-student-list__kpi-left">
            <div className="ep-student-list__kpi-icon ep-student-list__kpi-icon--green">
              <CheckCircle size={22} />
            </div>
            <div>
              <div className="ep-student-list__kpi-val">{activeStudents}</div>
              <div className="ep-student-list__kpi-lbl">Active Enrolment</div>
            </div>
          </div>
          <span className="ep-student-list__kpi-action-hint">
            Filter <ChevronRight size={14} />
          </span>
        </div>

        {/* CARD 3: ON LEAVE / INACTIVE */}
        <div 
          className={`ep-student-list__kpi-card ep-student-list__kpi-card--amber ${activeKpiFilter === 'inactive' ? 'ep-student-list__kpi-card--active' : ''}`}
          onClick={handleKpiInactiveClick}
          title="Click to filter 3 inactive / on leave students"
        >
          <div className="ep-student-list__kpi-left">
            <div className="ep-student-list__kpi-icon ep-student-list__kpi-icon--amber">
              <Users size={22} />
            </div>
            <div>
              <div className="ep-student-list__kpi-val">{inactiveStudents}</div>
              <div className="ep-student-list__kpi-lbl">On Leave / Inactive</div>
            </div>
          </div>
          <span className="ep-student-list__kpi-action-hint">
            Filter <ChevronRight size={14} />
          </span>
        </div>

        {/* CARD 4: CAMPUS AVG GPA */}
        <div 
          className={`ep-student-list__kpi-card ep-student-list__kpi-card--purple ${activeKpiFilter === 'gpa' ? 'ep-student-list__kpi-card--active' : ''}`}
          onClick={handleKpiGpaClick}
          title="Click to inspect GPA Analytics & Honor Roll performance"
        >
          <div className="ep-student-list__kpi-left">
            <div className="ep-student-list__kpi-icon ep-student-list__kpi-icon--purple">
              <Award size={22} />
            </div>
            <div>
              <div className="ep-student-list__kpi-val">{avgGpa}</div>
              <div className="ep-student-list__kpi-lbl">Campus Avg GPA</div>
            </div>
          </div>
          <span className="ep-student-list__kpi-action-hint">
            Insights <ChevronRight size={14} />
          </span>
        </div>
      </section>

      {/* Batch Operation Toolbar when students are selected */}
      {selectedIds.size > 0 && (
        <div style={{ background: 'var(--color-primary-900, #1e1b4b)', border: '1px solid var(--color-primary-500)', borderRadius: '12px', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, color: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={18} color="var(--color-primary-400)" />
            <span>{selectedIds.size} student{selectedIds.size > 1 ? 's' : ''} selected in roster</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="ep-btn ep-btn--secondary" onClick={handleBatchPromote}>
              <ArrowRight size={14} /> Promote Grade Level
            </button>
            <button className="ep-btn ep-btn--secondary" onClick={exportStudentsCSV}>
              <Download size={14} /> Export Selected CSV
            </button>
            <button className="ep-btn ep-btn--ghost" onClick={() => setSelectedIds(new Set())}>
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* 3. Search & Filters Bar */}
      <div id="student-roster-view" className="ep-student-list__filters-bar">
        <div className="ep-student-list__search-group">
          <SearchInput 
            value={query} 
            onChange={setQuery} 
            placeholder="Search students by name, email, grade..." 
          />
        </div>
        <div className="ep-student-list__filter-selects">
          <Select 
            value={gradeFilter} 
            onChange={e => setGradeFilter(e.target.value)}
            options={[
              { label: 'All Grade Levels', value: '' },
              { label: 'Grade 9', value: '9' },
              { label: 'Grade 10', value: '10' },
              { label: 'Grade 11', value: '11' },
              { label: 'Grade 12', value: '12' },
            ]}
          />
          <Select 
            value={tierFilter} 
            onChange={e => setTierFilter(e.target.value)}
            options={[
              { label: 'All Educational Tiers', value: '' },
              { label: 'Standard Track', value: 'standard' },
              { label: 'Premium Track', value: 'premium' },
              { label: 'Scholarship Track', value: 'scholarship' },
            ]}
          />
          <Select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Status', value: '' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive / On Leave', value: 'inactive' },
            ]}
          />
          {(gradeFilter || tierFilter || statusFilter || gpaMinFilter !== null || query) && (
            <button 
              className="ep-btn ep-btn--ghost ep-btn--sm" 
              onClick={() => {
                setGradeFilter('');
                setTierFilter('');
                setStatusFilter('');
                setGpaMinFilter(null);
                setGpaMaxFilter(null);
                setQuery('');
                setActiveKpiFilter(null);
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Indicator Badge */}
      {activeKpiFilter && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}>
          <Sparkles size={14} color="var(--color-primary-400)" />
          <span>
            {activeKpiFilter === 'all' && 'Active Filter: All 25 Enrolled Students'}
            {activeKpiFilter === 'active' && 'Active Filter: 22 Active Students Only'}
            {activeKpiFilter === 'inactive' && 'Active Filter: 3 On Leave / Inactive Students'}
            {activeKpiFilter === 'gpa' && gpaMinFilter !== null && `Active Filter: GPA range (${gpaMinFilter} - ${gpaMaxFilter || '4.0'})`}
          </span>
        </div>
      )}

      {/* 4. Main View Body (Grid / List) */}
      {paginatedItems.length === 0 ? (
        <EmptyState 
          icon={<Users size={48} />} 
          title="No students found" 
          description="Try adjusting your search or filters." 
        />
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {paginatedItems.map(student => (
                <div 
                  key={student.id} 
                  className="ep-card" 
                  style={{ 
                    padding: '20px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '16px', 
                    cursor: 'pointer', 
                    transition: 'all 0.2s ease',
                    border: selectedIds.has(student.id) ? '2px solid var(--color-primary-400)' : undefined
                  }}
                  onClick={() => { setSelectedStudent(student); setIsProfileOpen(true); }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.has(student.id)} 
                        onChange={(e) => { e.stopPropagation(); toggleSelectStudent(student.id); }}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <Avatar src={student.photo} name={`${student.firstName} ${student.lastName}`} size="lg" />
                      <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{student.firstName} {student.lastName}</h3>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{student.email}</div>
                      </div>
                    </div>
                    <Badge variant={student.status === 'active' ? 'success' : 'neutral'}>{student.status}</Badge>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'var(--color-surface-100)', padding: '12px', borderRadius: '10px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Grade & Section</div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-text-primary)' }}>Grade {student.grade}-{student.section}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>GPA Standing</div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: parseFloat(student.gpa) >= 3.5 ? 'var(--color-success-500)' : 'var(--color-primary-400)' }}>
                        {student.gpa} / 4.0
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--color-text-tertiary)', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                    <div>Guardian: {student.guardianName}</div>
                    <div style={{ display: 'flex', gap: '4px' }} onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" icon={<FileText size={14} />} title="View Report Card" onClick={() => setReportCardStudent(student)} />
                      <Button variant="ghost" size="sm" icon={<Edit size={14} />} onClick={() => { setStudentToEdit(student); setIsFormOpen(true); }} />
                      <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} onClick={() => setStudentToDelete(student.id)} />
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
            totalItems={filteredStudents.length}
            itemsPerPage={12}
          />
        </>
      )}

      {/* GPA ANALYTICS & ACADEMIC STANDING MODAL */}
      {isGpaModalOpen && (
        <div className="ep-events__modal-overlay" onClick={() => setIsGpaModalOpen(false)}>
          <div className="ep-events__modal ep-events__form-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
            <div className="ep-events__modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Award size={22} color="var(--color-primary-400)" />
                <div>
                  <h3 className="ep-events__modal-title">Campus GPA Analytics & Standing Hub</h3>
                  <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>Cumulative academic performance across all enrolled students</span>
                </div>
              </div>
              <button className="ep-events__close-btn" onClick={() => setIsGpaModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ep-modal-content" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Overall Banner */}
              <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 16, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Campus Mean Cumulative GPA</div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--color-text-primary)', marginTop: 4 }}>{avgGpa} <span style={{ fontSize: 18, color: 'var(--color-text-tertiary)' }}>/ 4.00</span></div>
                  <div style={{ fontSize: 12, color: 'var(--color-success-500)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <TrendingUp size={14} /> +0.15 GPA increase compared to previous quarter
                  </div>
                </div>
                <button className="ep-btn ep-btn--primary" onClick={exportStudentsCSV}>
                  <Download size={15} /> Export Standing Report
                </button>
              </div>

              {/* Tiers Distribution */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {/* Tier 1: Honors */}
                <div 
                  className="ep-gpa-tier-card"
                  onClick={() => handleApplyGpaFilter(3.5, 4.0, 'High Honor Roll (GPA ≥ 3.5)')}
                  style={{ cursor: 'pointer', border: '1px solid rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.05)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>High Honor Roll</span>
                    <Sparkles size={14} color="#10b981" />
                  </div>
                  <div className="ep-gpa-tier-card__val" style={{ color: '#10b981' }}>{honorRollCount} <span style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>({Math.round((honorRollCount / totalStudents) * 100)}%)</span></div>
                  <span className="ep-gpa-tier-card__lbl">GPA ≥ 3.50</span>
                  <button className="ep-btn ep-btn--secondary ep-btn--sm" style={{ marginTop: 4, fontSize: 11 }}>Filter Roster →</button>
                </div>

                {/* Tier 2: Good Standing */}
                <div 
                  className="ep-gpa-tier-card"
                  onClick={() => handleApplyGpaFilter(3.0, 3.49, 'Good Standing (3.0 - 3.49 GPA)')}
                  style={{ cursor: 'pointer', border: '1px solid rgba(59, 130, 246, 0.3)', background: 'rgba(59, 130, 246, 0.05)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6' }}>Good Standing</span>
                    <CheckCircle size={14} color="#3b82f6" />
                  </div>
                  <div className="ep-gpa-tier-card__val" style={{ color: '#3b82f6' }}>{goodStandingCount} <span style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>({Math.round((goodStandingCount / totalStudents) * 100)}%)</span></div>
                  <span className="ep-gpa-tier-card__lbl">3.00 - 3.49 GPA</span>
                  <button className="ep-btn ep-btn--secondary ep-btn--sm" style={{ marginTop: 4, fontSize: 11 }}>Filter Roster →</button>
                </div>

                {/* Tier 3: Support Warning */}
                <div 
                  className="ep-gpa-tier-card"
                  onClick={() => handleApplyGpaFilter(0.0, 2.99, 'Academic Warning (GPA < 3.0)')}
                  style={{ cursor: 'pointer', border: '1px solid rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.05)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>Academic Warning</span>
                    <AlertTriangle size={14} color="#f59e0b" />
                  </div>
                  <div className="ep-gpa-tier-card__val" style={{ color: '#f59e0b' }}>{warningCount} <span style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>({Math.round((warningCount / totalStudents) * 100)}%)</span></div>
                  <span className="ep-gpa-tier-card__lbl">GPA &lt; 3.00</span>
                  <button className="ep-btn ep-btn--secondary ep-btn--sm" style={{ marginTop: 4, fontSize: 11 }}>Filter Roster →</button>
                </div>
              </div>

              {/* Top Honor Roll Roster Preview */}
              <div>
                <h4 style={{ margin: '0 0 10px 0', fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>Top Honor Performers Preview</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {students.filter(s => parseFloat(s.gpa) >= 3.5).slice(0, 4).map(st => (
                    <div key={st.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface-100)', padding: '10px 14px', borderRadius: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar src={st.photo} name={`${st.firstName} ${st.lastName}`} size="sm" />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>{st.firstName} {st.lastName}</div>
                          <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>Grade {st.grade}-{st.section} • {st.email}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontWeight: 800, fontSize: 14, color: '#10b981' }}>{st.gpa} GPA</span>
                        <button className="ep-btn ep-btn--ghost ep-btn--sm" onClick={() => { setIsGpaModalOpen(false); setSelectedStudent(st); setIsProfileOpen(true); }}>
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="ep-events__modal-footer">
              <button type="button" className="ep-btn ep-btn--secondary" onClick={() => setIsGpaModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT PROFILE MODAL */}
      {isProfileOpen && selectedStudent && (
        <StudentProfile 
          student={selectedStudent} 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
          onEdit={() => { setIsProfileOpen(false); setStudentToEdit(selectedStudent); setIsFormOpen(true); }}
        />
      )}

      {/* EDIT/NEW STUDENT FORM */}
      {isFormOpen && (
        <StudentForm 
          student={studentToEdit} 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          onSave={handleSaveStudent} 
        />
      )}

      {/* REPORT CARD MODAL */}
      {reportCardStudent && (
        <ReportCardModal
          student={reportCardStudent}
          isOpen={!!reportCardStudent}
          onClose={() => setReportCardStudent(null)}
        />
      )}

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={!!studentToDelete}
        title="Delete Student Record"
        message="Are you sure you want to delete this student record? This action cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setStudentToDelete(null)}
      />
    </div>
  );
};

export default StudentList;
