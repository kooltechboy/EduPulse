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
  Select,
  type Column
} from '@/components/ui';
import { Plus, Eye, Edit, Trash2, Users, Briefcase, UserCheck, Clock, LayoutGrid, List as ListIcon } from 'lucide-react';
import { StaffProfile } from './StaffProfile';
import { StaffForm } from './StaffForm';
import { usePagination } from '@/hooks/usePagination';
import { useSearch } from '@/hooks/useSearch';
import './StaffList.css';

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: string;
  photo: string;
  hireDate: string;
}

const MOCK_STAFF: StaffMember[] = Array.from({ length: 15 }, (_, i) => ({
  id: `stf-${i + 1}`,
  firstName: `Staff${i + 1}`,
  lastName: `Member${i + 1}`,
  email: `staff${i + 1}@edupulse.edu`,
  phone: `555-020${i % 10}`,
  department: ['Administration', 'Support', 'IT', 'Maintenance'][i % 4],
  position: ['Manager', 'Specialist', 'Coordinator', 'Assistant'][i % 4],
  status: i % 12 === 0 ? 'on leave' : 'active',
  photo: `https://i.pravatar.cc/150?u=stf${i}`,
  hireDate: `2020-01-15`,
}));

export const StaffList: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>(MOCK_STAFF);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<StaffMember | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { query, setQuery, filteredItems } = useSearch(
    staff,
    ['firstName', 'lastName', 'email', 'department', 'position']
  );

  const filteredStaff = useMemo(() => {
    return (filteredItems as StaffMember[]).filter(s => {
      const matchDept = deptFilter ? s.department === deptFilter : true;
      const matchStatus = statusFilter ? s.status === statusFilter : true;
      return matchDept && matchStatus;
    });
  }, [filteredItems, deptFilter, statusFilter]);

  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
  } = usePagination(filteredStaff, 12);

  const handleDelete = () => {
    if (staffToDelete) {
      setStaff(prev => prev.filter(s => s.id !== staffToDelete));
      setStaffToDelete(null);
    }
  };

  const handleSaveStaff = (staffData: any) => {
    if (staffToEdit) {
      setStaff(prev => prev.map(s => s.id === staffData.id ? staffData : s));
    } else {
      setStaff(prev => [...prev, { ...staffData, id: `stf-${Date.now()}` }]);
    }
    setIsFormOpen(false);
    setStaffToEdit(null);
  };

  const columns = useMemo<Column<StaffMember>[]>(() => [
    {
      key: 'photo',
      label: 'Staff Member',
      render: (_: unknown, s: StaffMember) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar src={s.photo} name={`${s.firstName} ${s.lastName}`} size="md" />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{s.firstName} {s.lastName}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{s.email}</div>
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
      key: 'position',
      label: 'Position'
    },
    {
      key: 'phone',
      label: 'Phone'
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
      render: (_: unknown, s: StaffMember) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <Button variant="ghost" size="sm" icon={<Eye size={16} />} onClick={() => { setSelectedStaff(s); setIsProfileOpen(true); }} />
          <Button variant="ghost" size="sm" icon={<Edit size={16} />} onClick={() => { setStaffToEdit(s); setIsFormOpen(true); }} />
          <Button variant="ghost" size="sm" icon={<Trash2 size={16} />} onClick={() => setStaffToDelete(s.id)} />
        </div>
      )
    }
  ], []);

  return (
    <div className="ep-staff-list">
      {/* 1. Header */}
      <header className="ep-staff-list__header">
        <div>
          <h1 className="ep-staff-list__title">Staff & HR Directory Command Hub</h1>
          <p className="ep-staff-list__subtitle">Manage non-teaching faculty, administration, IT, and campus operations personnel</p>
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
          <Button variant="primary" icon={<Plus size={16} />} onClick={() => { setStaffToEdit(null); setIsFormOpen(true); }}>
            + Add Staff Member
          </Button>
        </div>
      </header>

      {/* 2. KPI Cards */}
      <section className="ep-staff-list__kpi-grid">
        <div className="ep-staff-list__kpi-card">
          <div className="ep-staff-list__kpi-icon ep-staff-list__kpi-icon--blue">
            <Users size={22} />
          </div>
          <div>
            <div className="ep-staff-list__kpi-val">{staff.length}</div>
            <div className="ep-staff-list__kpi-lbl">Total Staff Personnel</div>
          </div>
        </div>

        <div className="ep-staff-list__kpi-card">
          <div className="ep-staff-list__kpi-icon ep-staff-list__kpi-icon--green">
            <UserCheck size={22} />
          </div>
          <div>
            <div className="ep-staff-list__kpi-val">{staff.filter(s => s.status === 'active').length}</div>
            <div className="ep-staff-list__kpi-lbl">Active & On Duty</div>
          </div>
        </div>

        <div className="ep-staff-list__kpi-card">
          <div className="ep-staff-list__kpi-icon ep-staff-list__kpi-icon--amber">
            <Clock size={22} />
          </div>
          <div>
            <div className="ep-staff-list__kpi-val">{staff.filter(s => s.status !== 'active').length}</div>
            <div className="ep-staff-list__kpi-lbl">On Leave / PTO</div>
          </div>
        </div>

        <div className="ep-staff-list__kpi-card">
          <div className="ep-staff-list__kpi-icon ep-staff-list__kpi-icon--purple">
            <Briefcase size={22} />
          </div>
          <div>
            <div className="ep-staff-list__kpi-val">4</div>
            <div className="ep-staff-list__kpi-lbl">Operational Divisions</div>
          </div>
        </div>
      </section>

      {/* 3. Filters */}
      <div className="ep-staff-list__filters-bar">
        <div style={{ flex: 1, minWidth: '280px' }}>
          <SearchInput 
            value={query} 
            onChange={setQuery} 
            placeholder="Search staff by name, email, department..." 
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Select 
            value={deptFilter} 
            onChange={e => setDeptFilter(e.target.value)}
            options={[
              { label: 'All Departments', value: '' },
              { label: 'Administration', value: 'Administration' },
              { label: 'Support', value: 'Support' },
              { label: 'IT', value: 'IT' },
              { label: 'Maintenance', value: 'Maintenance' },
            ]}
          />
          <Select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Status', value: '' },
              { label: 'Active', value: 'active' },
              { label: 'On Leave', value: 'on leave' },
            ]}
          />
        </div>
      </div>

      {/* 4. Main Body Grid / List */}
      {paginatedItems.length === 0 ? (
        <EmptyState 
          icon={<Users size={48} />} 
          title="No staff members found" 
          description="Try adjusting your search or filters." 
        />
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {paginatedItems.map(s => (
                <div 
                  key={s.id} 
                  className="ep-card" 
                  style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onClick={() => { setSelectedStaff(s); setIsProfileOpen(true); }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Avatar src={s.photo} name={`${s.firstName} ${s.lastName}`} size="lg" />
                      <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{s.firstName} {s.lastName}</h3>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{s.email}</div>
                      </div>
                    </div>
                    <Badge variant={s.status === 'active' ? 'success' : 'warning'}>{s.status}</Badge>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'var(--color-surface-100)', padding: '12px', borderRadius: '10px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Department</div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-text-primary)' }}>{s.department}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Position</div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-primary-400)' }}>{s.position}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--color-text-tertiary)', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                    <div>Phone: {s.phone}</div>
                    <div style={{ display: 'flex', gap: '4px' }} onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" icon={<Edit size={14} />} onClick={() => { setStaffToEdit(s); setIsFormOpen(true); }} />
                      <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} onClick={() => setStaffToDelete(s.id)} />
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
            totalItems={filteredStaff.length}
            itemsPerPage={12}
          />
        </>
      )}

      {isProfileOpen && selectedStaff && (
        <StaffProfile 
          staff={selectedStaff} 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
          onEdit={() => { setIsProfileOpen(false); setStaffToEdit(selectedStaff); setIsFormOpen(true); }}
        />
      )}

      {isFormOpen && (
        <StaffForm 
          staff={staffToEdit} 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          onSave={handleSaveStaff} 
        />
      )}

      <ConfirmDialog
        isOpen={!!staffToDelete}
        title="Delete Staff Member"
        message="Are you sure you want to delete this staff member record? This action cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setStaffToDelete(null)}
      />
    </div>
  );
};

export default StaffList;
