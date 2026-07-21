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
import { Plus, Eye, Edit, Trash2, Users, GraduationCap, Award, CheckCircle, LayoutGrid, List as ListIcon, Download, Upload, FileText, CheckSquare, Square, ArrowRight } from 'lucide-react';
import { StudentProfile } from './StudentProfile';
import { StudentForm } from './StudentForm';
import { ReportCardModal } from '../reports/ReportCardModal';
import { usePagination } from '@/hooks/usePagination';
import { useSearch } from '@/hooks/useSearch';
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

  const [gradeFilter, setGradeFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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
      return matchGrade && matchTier && matchStatus;
    });
  }, [filteredItems, gradeFilter, tierFilter, statusFilter]);

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

  const handleDelete = () => {
    if (studentToDelete) {
      setStudents(prev => prev.filter(s => s.id !== studentToDelete));
      setStudentToDelete(null);
    }
  };

  const handleSaveStudent = (studentData: any) => {
    if (studentToEdit) {
      setStudents(prev => prev.map(s => s.id === studentData.id ? studentData : s));
    } else {
      setStudents(prev => [...prev, { ...studentData, id: `std-${Date.now()}` }]);
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
        alert(`Successfully imported ${imported.length} student records into the directory!`);
      }
    };
    reader.readAsText(file);
  };

  const handleBatchPromote = () => {
    if (selectedIds.size === 0) return;
    setStudents(prev => prev.map(s => {
      if (selectedIds.has(s.id)) {
        const nextGrade = String(Math.min(12, parseInt(s.grade, 10) + 1));
        return { ...s, grade: nextGrade };
      }
      return s;
    }));
    alert(`Promoted ${selectedIds.size} students to the next academic grade level!`);
    setSelectedIds(new Set());
  };

  const columns = useMemo<Column<Student>[]>(() => [
    {
      key: 'id',
      label: 'Select',
      render: (_: unknown, student: Student) => (
        <input 
          type="checkbox" 
          checked={selectedIds.has(student.id)} 
          onChange={() => toggleSelectStudent(student.id)}
          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
        />
      )
    },
    {
      key: 'photo',
      label: 'Student Name',
      render: (_: unknown, student: Student) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar src={student.photo} name={`${student.firstName} ${student.lastName}`} size="md" />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{student.firstName} {student.lastName}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{student.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'grade',
      label: 'Grade & Section',
      render: (_: unknown, student: Student) => `Grade ${student.grade}-${student.section}`
    },
    {
      key: 'gpa',
      label: 'GPA',
      render: (val: unknown) => <span style={{ fontWeight: 700, color: 'var(--color-primary-400)' }}>{String(val)}</span>
    },
    {
      key: 'attendance',
      label: 'Attendance Rate',
      render: (value: unknown) => `${String(value)}%`
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => (
        <Badge variant={String(value) === 'active' ? 'success' : 'neutral'}>
          {String(value)}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: unknown, student: Student) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <Button variant="ghost" size="sm" icon={<FileText size={16} />} title="View Official Report Card" onClick={() => setReportCardStudent(student)} />
          <Button variant="ghost" size="sm" icon={<Eye size={16} />} onClick={() => { setSelectedStudent(student); setIsProfileOpen(true); }} />
          <Button variant="ghost" size="sm" icon={<Edit size={16} />} onClick={() => { setStudentToEdit(student); setIsFormOpen(true); }} />
          <Button variant="ghost" size="sm" icon={<Trash2 size={16} />} onClick={() => setStudentToDelete(student.id)} />
        </div>
      )
    }
  ], [selectedIds]);

  return (
    <div className="ep-student-list">
      {/* 1. Header */}
      <header className="ep-student-list__header">
        <div>
          <h1 className="ep-student-list__title">Student Directory Command Hub</h1>
          <p className="ep-student-list__subtitle">Manage student academic records, GPA standings, telemetry profiles, and enrollment</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
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

      {/* 2. KPI Cards */}
      <section className="ep-student-list__kpi-grid">
        <div className="ep-student-list__kpi-card">
          <div className="ep-student-list__kpi-icon ep-student-list__kpi-icon--blue">
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="ep-student-list__kpi-val">{totalStudents}</div>
            <div className="ep-student-list__kpi-lbl">Total Enrolled Students</div>
          </div>
        </div>

        <div className="ep-student-list__kpi-card">
          <div className="ep-student-list__kpi-icon ep-student-list__kpi-icon--green">
            <CheckCircle size={22} />
          </div>
          <div>
            <div className="ep-student-list__kpi-val">{activeStudents}</div>
            <div className="ep-student-list__kpi-lbl">Active Enrolment</div>
          </div>
        </div>

        <div className="ep-student-list__kpi-card">
          <div className="ep-student-list__kpi-icon ep-student-list__kpi-icon--amber">
            <Users size={22} />
          </div>
          <div>
            <div className="ep-student-list__kpi-val">{inactiveStudents}</div>
            <div className="ep-student-list__kpi-lbl">On Leave / Inactive</div>
          </div>
        </div>

        <div className="ep-student-list__kpi-card">
          <div className="ep-student-list__kpi-icon ep-student-list__kpi-icon--purple">
            <Award size={22} />
          </div>
          <div>
            <div className="ep-student-list__kpi-val">{avgGpa}</div>
            <div className="ep-student-list__kpi-lbl">Campus Avg GPA</div>
          </div>
        </div>
      </section>

      {/* Batch Operation Toolbar when students are selected */}
      {selectedIds.size > 0 && (
        <div style={{ background: 'var(--color-primary-900, #1e1b4b)', border: '1px solid var(--color-primary-500)', borderRadius: '10px', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, color: 'var(--color-primary-100)' }}>
            {selectedIds.size} student{selectedIds.size > 1 ? 's' : ''} selected
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

      {/* 3. Search & Filters */}
      <div className="ep-student-list__filters-bar">
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
              { label: 'All Grades', value: '' },
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
              { label: 'All Tiers', value: '' },
              { label: 'Standard', value: 'standard' },
              { label: 'Premium', value: 'premium' },
              { label: 'Scholarship', value: 'scholarship' },
            ]}
          />
          <Select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Status', value: '' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]}
          />
        </div>
      </div>

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
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-primary-400)' }}>{student.gpa} / 4.0</div>
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

      {isProfileOpen && selectedStudent && (
        <StudentProfile 
          student={selectedStudent} 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
          onEdit={() => { setIsProfileOpen(false); setStudentToEdit(selectedStudent); setIsFormOpen(true); }}
        />
      )}

      {isFormOpen && (
        <StudentForm 
          student={studentToEdit} 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          onSave={handleSaveStudent} 
        />
      )}

      {reportCardStudent && (
        <ReportCardModal
          student={reportCardStudent}
          isOpen={!!reportCardStudent}
          onClose={() => setReportCardStudent(null)}
        />
      )}

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
