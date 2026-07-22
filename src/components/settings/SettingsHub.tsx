import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useSettingsStore } from '@/stores/settingsStore';
import { Classroom, ClassroomType, RoomStatus, RolePermissionKey } from '@/types/settings';
import './SettingsHub.css';

export default function SettingsHub() {
  const {
    classrooms,
    maintenanceRecords,
    schoolProfile,
    academicConfig,
    gradingScale,
    notifications,
    security,
    integrations,
    rolePermissions,
    auditLogs,
    loadData,
    addClassroom,
    updateClassroom,
    deleteClassroom,
    addMaintenanceRecord,
    resolveMaintenanceRecord,
    bulkImportClassrooms,
    addGradeThreshold,
    updateGradeThreshold,
    removeGradeThreshold,
    addAcademicTerm,
    deleteAcademicTerm,
    toggleRolePermission,
    testIntegrationConnection,
    updateSchoolProfile,
    updateAcademicConfig,
    updateGradingScale,
    updateNotificationSettings,
    updateSecuritySettings,
    updateIntegrationSettings,
    exportSystemBackup,
    importSystemBackup,
    resetToFactoryDefaults,
  } = useSettingsStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<
    'classrooms' | 'academic' | 'profile' | 'notifications' | 'security' | 'integrations' | 'audit' | 'backup'
  >('classrooms');

  // Classroom Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Modals State
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Classroom | null>(null);
  const [isMaintModalOpen, setIsMaintModalOpen] = useState(false);
  const [maintTargetRoomId, setMaintTargetRoomId] = useState<string>('');
  const [maintForm, setMaintForm] = useState({ reason: '', technician: 'Apex Facilities', expectedDate: '' });

  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [gradeForm, setGradeForm] = useState({ grade: 'A+', minPercentage: 97, maxPercentage: 100, gpaPoint: 4.0 });

  const [isTermModalOpen, setIsTermModalOpen] = useState(false);
  const [termForm, setTermForm] = useState({ name: '', startDate: '', endDate: '', status: 'upcoming' as const });

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Form State for Classroom Modal
  const [roomFormData, setRoomFormData] = useState({
    roomNumber: '',
    name: '',
    building: 'Main Academic Block',
    floor: 1,
    capacity: 30,
    roomType: 'classroom' as ClassroomType,
    equipmentStr: 'Interactive Smartboard, Projector',
    status: 'available' as RoomStatus,
    primaryTeacherName: '',
    homeroomGrade: '',
  });

  // Open Add Room Modal
  const handleOpenAddModal = () => {
    setEditingRoom(null);
    setRoomFormData({
      roomNumber: '',
      name: '',
      building: 'Main Academic Block',
      floor: 1,
      capacity: 30,
      roomType: 'classroom',
      equipmentStr: 'Interactive Smartboard, Projector',
      status: 'available',
      primaryTeacherName: '',
      homeroomGrade: '',
    });
    setIsRoomModalOpen(true);
  };

  // Open Edit Room Modal
  const handleOpenEditModal = (room: Classroom) => {
    setEditingRoom(room);
    setRoomFormData({
      roomNumber: room.roomNumber,
      name: room.name,
      building: room.building,
      floor: room.floor,
      capacity: room.capacity,
      roomType: room.roomType,
      equipmentStr: room.equipment.join(', '),
      status: room.status,
      primaryTeacherName: room.primaryTeacherName || '',
      homeroomGrade: room.homeroomGrade || '',
    });
    setIsRoomModalOpen(true);
  };

  // Save Room Modal
  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const equipment = roomFormData.equipmentStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingRoom) {
      updateClassroom(editingRoom.id, {
        roomNumber: roomFormData.roomNumber,
        name: roomFormData.name,
        building: roomFormData.building,
        floor: Number(roomFormData.floor),
        capacity: Number(roomFormData.capacity),
        roomType: roomFormData.roomType,
        equipment,
        status: roomFormData.status,
        primaryTeacherName: roomFormData.primaryTeacherName || undefined,
        homeroomGrade: roomFormData.homeroomGrade || undefined,
      });
    } else {
      addClassroom({
        roomNumber: roomFormData.roomNumber,
        name: roomFormData.name,
        building: roomFormData.building,
        floor: Number(roomFormData.floor),
        capacity: Number(roomFormData.capacity),
        roomType: roomFormData.roomType,
        equipment,
        status: roomFormData.status,
        primaryTeacherName: roomFormData.primaryTeacherName || undefined,
        homeroomGrade: roomFormData.homeroomGrade || undefined,
      });
    }
    setIsRoomModalOpen(false);
  };

  // Open Maintenance Modal
  const handleOpenMaintModal = (roomId: string) => {
    setMaintTargetRoomId(roomId);
    setMaintForm({ reason: '', technician: 'Apex Facilities Services', expectedDate: '' });
    setIsMaintModalOpen(true);
  };

  // Submit Maintenance
  const handleSaveMaint = (e: React.FormEvent) => {
    e.preventDefault();
    addMaintenanceRecord(maintTargetRoomId, maintForm.reason, maintForm.technician, maintForm.expectedDate);
    setIsMaintModalOpen(false);
  };

  // Save Grade Threshold
  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    addGradeThreshold({
      grade: gradeForm.grade,
      minPercentage: Number(gradeForm.minPercentage),
      maxPercentage: Number(gradeForm.maxPercentage),
      gpaPoint: Number(gradeForm.gpaPoint),
    });
    setIsGradeModalOpen(false);
  };

  // Save Academic Term
  const handleSaveTerm = (e: React.FormEvent) => {
    e.preventDefault();
    addAcademicTerm({
      name: termForm.name,
      startDate: termForm.startDate,
      endDate: termForm.endDate,
      status: termForm.status,
    });
    setIsTermModalOpen(false);
  };

  // Export Backup File Download
  const handleDownloadBackup = () => {
    const jsonStr = exportSystemBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edupulse-settings-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export Classrooms CSV
  const handleExportClassroomsCSV = () => {
    const headers = ['Room Number', 'Name', 'Building', 'Floor', 'Capacity', 'Room Type', 'Status', 'Lead Teacher'];
    const rows = classrooms.map((r) => [
      r.roomNumber,
      `"${r.name}"`,
      `"${r.building}"`,
      r.floor,
      r.capacity,
      r.roomType,
      r.status,
      `"${r.primaryTeacherName || ''}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `classrooms-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Restore Backup Form Submit
  const handleRestoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (importSystemBackup(importJsonText)) {
      setIsImportModalOpen(false);
      setImportJsonText('');
    }
  };

  // Filtered Classrooms
  const filteredClassrooms = classrooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.building.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTypeFilter === 'all' || room.roomType === selectedTypeFilter;
    const matchesStatus = selectedStatusFilter === 'all' || room.status === selectedStatusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate Stats
  const totalCapacity = classrooms.reduce((sum, r) => sum + r.capacity, 0);
  const availableRooms = classrooms.filter((r) => r.status === 'available').length;
  const maintenanceCount = classrooms.filter((r) => r.status === 'maintenance').length;
  const labCount = classrooms.filter((r) => r.roomType.includes('lab')).length;

  return (
    <div className="ep-settings">
      {/* Header */}
      <div className="ep-settings__header">
        <div className="ep-settings__title-group">
          <h1>
            <Icons.SlidersHorizontal size={28} style={{ color: 'var(--color-primary-400, #818cf8)' }} />
            System Settings & Governance
          </h1>
          <p>NASA-Grade System Administration: Classrooms, Academic Calendar, Security Policy, Audit Logging & Disaster Recovery.</p>
        </div>
        <span className="ep-settings__nasa-badge">
          <Icons.ShieldCheck size={14} />
          NASA-GRADE AUDITED
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="ep-settings__tabs">
        <button
          className={`ep-settings__tab-btn ${activeTab === 'classrooms' ? 'ep-settings__tab-btn--active' : ''}`}
          onClick={() => setActiveTab('classrooms')}
        >
          <Icons.Building2 size={18} />
          Classrooms & Facilities
        </button>

        <button
          className={`ep-settings__tab-btn ${activeTab === 'academic' ? 'ep-settings__tab-btn--active' : ''}`}
          onClick={() => setActiveTab('academic')}
        >
          <Icons.GraduationCap size={18} />
          Academic & Grading
        </button>

        <button
          className={`ep-settings__tab-btn ${activeTab === 'profile' ? 'ep-settings__tab-btn--active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <Icons.School size={18} />
          School Profile
        </button>

        <button
          className={`ep-settings__tab-btn ${activeTab === 'notifications' ? 'ep-settings__tab-btn--active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Icons.Bell size={18} />
          Notifications
        </button>

        <button
          className={`ep-settings__tab-btn ${activeTab === 'security' ? 'ep-settings__tab-btn--active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Icons.ShieldCheck size={18} />
          Security & Permissions
        </button>

        <button
          className={`ep-settings__tab-btn ${activeTab === 'integrations' ? 'ep-settings__tab-btn--active' : ''}`}
          onClick={() => setActiveTab('integrations')}
        >
          <Icons.Layers size={18} />
          Integrations & Ping
        </button>

        <button
          className={`ep-settings__tab-btn ${activeTab === 'audit' ? 'ep-settings__tab-btn--active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          <Icons.FileText size={18} />
          Audit Logs ({auditLogs.length})
        </button>

        <button
          className={`ep-settings__tab-btn ${activeTab === 'backup' ? 'ep-settings__tab-btn--active' : ''}`}
          onClick={() => setActiveTab('backup')}
        >
          <Icons.Database size={18} />
          Backup & Recovery
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="ep-settings__content">
        {/* 1. CLASSROOMS & FACILITIES TAB */}
        {activeTab === 'classrooms' && (
          <div>
            {/* Stats Grid */}
            <div className="ep-settings__stats-grid">
              <div className="ep-settings__stat-card">
                <div className="ep-settings__stat-icon">
                  <Icons.DoorOpen size={24} />
                </div>
                <div className="ep-settings__stat-info">
                  <h4>Total Rooms</h4>
                  <span>{classrooms.length}</span>
                </div>
              </div>

              <div className="ep-settings__stat-card">
                <div className="ep-settings__stat-icon" style={{ color: '#34d399', background: 'rgba(16, 185, 129, 0.15)' }}>
                  <Icons.Users size={24} />
                </div>
                <div className="ep-settings__stat-info">
                  <h4>Total Student Capacity</h4>
                  <span>{totalCapacity}</span>
                </div>
              </div>

              <div className="ep-settings__stat-card">
                <div className="ep-settings__stat-icon" style={{ color: '#fbbf24', background: 'rgba(245, 158, 11, 0.15)' }}>
                  <Icons.CheckCircle2 size={24} />
                </div>
                <div className="ep-settings__stat-info">
                  <h4>Available Rooms</h4>
                  <span>{availableRooms}</span>
                </div>
              </div>

              <div className="ep-settings__stat-card">
                <div className="ep-settings__stat-icon" style={{ color: '#f87171', background: 'rgba(239, 68, 68, 0.15)' }}>
                  <Icons.Wrench size={24} />
                </div>
                <div className="ep-settings__stat-info">
                  <h4>Under Maintenance</h4>
                  <span>{maintenanceCount}</span>
                </div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="ep-settings__controls-bar">
              <div className="ep-settings__search-box">
                <Icons.Search size={18} style={{ color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search by room #, name, or building..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="ep-settings__filter-group">
                <select
                  className="ep-settings__select"
                  value={selectedTypeFilter}
                  onChange={(e) => setSelectedTypeFilter(e.target.value)}
                >
                  <option value="all">All Room Types</option>
                  <option value="classroom">Standard Classroom</option>
                  <option value="science-lab">Science Lab</option>
                  <option value="computer-lab">Computer Lab</option>
                  <option value="auditorium">Auditorium</option>
                  <option value="art-studio">Art Studio</option>
                  <option value="gymnasium">Gymnasium</option>
                  <option value="lecture-hall">Lecture Hall</option>
                </select>

                <select
                  className="ep-settings__select"
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Under Maintenance</option>
                </select>

                <button className="ep-settings__btn-secondary" onClick={handleExportClassroomsCSV} title="Export CSV">
                  <Icons.Download size={16} />
                  Export CSV
                </button>

                <button className="ep-settings__btn-primary" onClick={handleOpenAddModal}>
                  <Icons.Plus size={18} />
                  Add Classroom
                </button>
              </div>
            </div>

            {/* Classrooms Grid */}
            <div className="ep-settings__rooms-grid">
              {filteredClassrooms.map((room) => (
                <div key={room.id} className="ep-settings__room-card">
                  <div className="ep-settings__room-header">
                    <div>
                      <h3 className="ep-settings__room-num">
                        <Icons.DoorClosed size={18} style={{ color: 'var(--color-primary-400)' }} />
                        Room {room.roomNumber}
                      </h3>
                      <div className="ep-settings__room-sub">{room.name}</div>
                    </div>
                    <span className={`ep-settings__badge ep-settings__badge--${room.status}`}>
                      {room.status}
                    </span>
                  </div>

                  <div className="ep-settings__room-details">
                    <div className="ep-settings__detail-item">
                      <span className="ep-settings__detail-label">Building / Floor</span>
                      <span className="ep-settings__detail-val">{room.building} (Fl. {room.floor})</span>
                    </div>

                    <div className="ep-settings__detail-item">
                      <span className="ep-settings__detail-label">Max Capacity</span>
                      <span className="ep-settings__detail-val">{room.capacity} seats</span>
                    </div>

                    <div className="ep-settings__detail-item">
                      <span className="ep-settings__detail-label">Room Type</span>
                      <span className="ep-settings__detail-val" style={{ textTransform: 'capitalize' }}>
                        {room.roomType.replace('-', ' ')}
                      </span>
                    </div>

                    <div className="ep-settings__detail-item">
                      <span className="ep-settings__detail-label">Assigned Lead Teacher</span>
                      <span className="ep-settings__detail-val">{room.primaryTeacherName || 'Unassigned'}</span>
                    </div>
                  </div>

                  {room.equipment.length > 0 && (
                    <div className="ep-settings__equip-tags">
                      {room.equipment.map((eq, i) => (
                        <span key={i} className="ep-settings__equip-tag">
                          {eq}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="ep-settings__room-actions">
                    {room.status === 'maintenance' ? (
                      <button
                        className="ep-settings__btn-secondary"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        onClick={() => {
                          const activeMaint = maintenanceRecords.find((m) => m.roomId === room.id && m.status === 'active');
                          if (activeMaint) resolveMaintenanceRecord(activeMaint.id);
                        }}
                      >
                        <Icons.CheckCircle size={14} />
                        Resolve Maintenance
                      </button>
                    ) : (
                      <button
                        className="ep-settings__icon-btn"
                        title="Schedule Maintenance"
                        onClick={() => handleOpenMaintModal(room.id)}
                      >
                        <Icons.Wrench size={16} />
                      </button>
                    )}

                    <button
                      className="ep-settings__icon-btn"
                      title="Edit Room"
                      onClick={() => handleOpenEditModal(room)}
                    >
                      <Icons.Pencil size={16} />
                    </button>
                    <button
                      className="ep-settings__icon-btn ep-settings__icon-btn--danger"
                      title="Delete Room"
                      onClick={() => deleteClassroom(room.id)}
                    >
                      <Icons.Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. ACADEMIC & GRADING TAB */}
        {activeTab === 'academic' && (
          <div>
            <div className="ep-settings__card-panel">
              <div className="ep-settings__card-panel-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Icons.Calendar size={20} style={{ color: 'var(--color-primary-400)' }} />
                  Academic Calendar & Term Management
                </span>
                <button className="ep-settings__btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => setIsTermModalOpen(true)}>
                  <Icons.Plus size={16} />
                  Add Term
                </button>
              </div>

              <div className="ep-settings__form-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="ep-settings__form-group">
                  <label>Active Academic Year</label>
                  <input
                    type="text"
                    className="ep-settings__input"
                    value={academicConfig.activeAcademicYear}
                    onChange={(e) => updateAcademicConfig({ activeAcademicYear: e.target.value })}
                  />
                </div>
                <div className="ep-settings__form-group">
                  <label>Current Active Term</label>
                  <select
                    className="ep-settings__select"
                    value={academicConfig.currentTermId}
                    onChange={(e) => updateAcademicConfig({ currentTermId: e.target.value })}
                  >
                    {academicConfig.terms.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <table className="ep-settings__table">
                <thead>
                  <tr>
                    <th>Term Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {academicConfig.terms.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 600 }}>{t.name}</td>
                      <td>{t.startDate}</td>
                      <td>{t.endDate}</td>
                      <td>
                        <span className={`ep-settings__badge ep-settings__badge--${t.status === 'active' ? 'available' : 'occupied'}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="ep-settings__icon-btn ep-settings__icon-btn--danger"
                          onClick={() => deleteAcademicTerm(t.id)}
                        >
                          <Icons.Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ep-settings__card-panel">
              <div className="ep-settings__card-panel-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Icons.Award size={20} style={{ color: 'var(--color-primary-400)' }} />
                  Grading Scale Matrix (Editable)
                </span>
                <button className="ep-settings__btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => setIsGradeModalOpen(true)}>
                  <Icons.Plus size={16} />
                  Add Grade Level
                </button>
              </div>

              <div className="ep-settings__toggle-row">
                <div className="ep-settings__toggle-info">
                  <h4>Allow Grade Curving</h4>
                  <p>Permit teachers to apply percentage curving to assessment scores.</p>
                </div>
                <label className="ep-settings__switch">
                  <input
                    type="checkbox"
                    checked={gradingScale.allowGradeCurving}
                    onChange={(e) => updateGradingScale({ allowGradeCurving: e.target.checked })}
                  />
                  <span className="ep-settings__slider"></span>
                </label>
              </div>

              <table className="ep-settings__table">
                <thead>
                  <tr>
                    <th>Letter Grade</th>
                    <th>Min Percentage (%)</th>
                    <th>Max Percentage (%)</th>
                    <th>GPA Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gradingScale.thresholds.map((row) => (
                    <tr key={row.id}>
                      <td style={{ fontWeight: 700, color: 'var(--color-primary-300)' }}>{row.grade}</td>
                      <td>
                        <input
                          type="number"
                          step="0.1"
                          className="ep-settings__input"
                          style={{ width: '80px', padding: '0.3rem' }}
                          value={row.minPercentage}
                          onChange={(e) => updateGradeThreshold(row.id, { minPercentage: Number(e.target.value) })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.1"
                          className="ep-settings__input"
                          style={{ width: '80px', padding: '0.3rem' }}
                          value={row.maxPercentage}
                          onChange={(e) => updateGradeThreshold(row.id, { maxPercentage: Number(e.target.value) })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.1"
                          className="ep-settings__input"
                          style={{ width: '80px', padding: '0.3rem' }}
                          value={row.gpaPoint}
                          onChange={(e) => updateGradeThreshold(row.id, { gpaPoint: Number(e.target.value) })}
                        />
                      </td>
                      <td>
                        <button
                          className="ep-settings__icon-btn ep-settings__icon-btn--danger"
                          onClick={() => removeGradeThreshold(row.id)}
                        >
                          <Icons.Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. SCHOOL PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="ep-settings__card-panel">
            <div className="ep-settings__card-panel-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icons.School size={20} style={{ color: 'var(--color-primary-400)' }} />
                Institution Identity & Contact Information
              </span>
            </div>

            <div className="ep-settings__form-grid">
              <div className="ep-settings__form-group">
                <label>Institution Name</label>
                <input
                  type="text"
                  className="ep-settings__input"
                  value={schoolProfile.name}
                  onChange={(e) => updateSchoolProfile({ name: e.target.value })}
                />
              </div>

              <div className="ep-settings__form-group">
                <label>School Motto / Tagline</label>
                <input
                  type="text"
                  className="ep-settings__input"
                  value={schoolProfile.motto}
                  onChange={(e) => updateSchoolProfile({ motto: e.target.value })}
                />
              </div>

              <div className="ep-settings__form-group">
                <label>Institutional Code</label>
                <input
                  type="text"
                  className="ep-settings__input"
                  value={schoolProfile.code}
                  onChange={(e) => updateSchoolProfile({ code: e.target.value })}
                />
              </div>

              <div className="ep-settings__form-group">
                <label>Principal / Head of School</label>
                <input
                  type="text"
                  className="ep-settings__input"
                  value={schoolProfile.principalName}
                  onChange={(e) => updateSchoolProfile({ principalName: e.target.value })}
                />
              </div>

              <div className="ep-settings__form-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  className="ep-settings__input"
                  value={schoolProfile.email}
                  onChange={(e) => updateSchoolProfile({ email: e.target.value })}
                />
              </div>

              <div className="ep-settings__form-group">
                <label>Contact Phone</label>
                <input
                  type="text"
                  className="ep-settings__input"
                  value={schoolProfile.phone}
                  onChange={(e) => updateSchoolProfile({ phone: e.target.value })}
                />
              </div>

              <div className="ep-settings__form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Campus Physical Address</label>
                <input
                  type="text"
                  className="ep-settings__input"
                  value={schoolProfile.address}
                  onChange={(e) => updateSchoolProfile({ address: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="ep-settings__card-panel">
            <div className="ep-settings__card-panel-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icons.Bell size={20} style={{ color: 'var(--color-primary-400)' }} />
                Communication & Notification Preferences
              </span>
            </div>

            <div className="ep-settings__toggle-row">
              <div className="ep-settings__toggle-info">
                <h4>System Email Notifications</h4>
                <p>Send automated email notifications for announcements, grade releases, and events.</p>
              </div>
              <label className="ep-settings__switch">
                <input
                  type="checkbox"
                  checked={notifications.emailAlerts}
                  onChange={(e) => updateNotificationSettings({ emailAlerts: e.target.checked })}
                />
                <span className="ep-settings__slider"></span>
              </label>
            </div>

            <div className="ep-settings__toggle-row">
              <div className="ep-settings__toggle-info">
                <h4>SMS Alert System</h4>
                <p>Dispatch SMS broadcasts for urgent school closures and safety alerts.</p>
              </div>
              <label className="ep-settings__switch">
                <input
                  type="checkbox"
                  checked={notifications.smsAlerts}
                  onChange={(e) => updateNotificationSettings({ smsAlerts: e.target.checked })}
                />
                <span className="ep-settings__slider"></span>
              </label>
            </div>

            <div className="ep-settings__toggle-row">
              <div className="ep-settings__toggle-info">
                <h4>Automated Absence Alerts</h4>
                <p>Trigger automated notification to guardians when a student is marked absent.</p>
              </div>
              <label className="ep-settings__switch">
                <input
                  type="checkbox"
                  checked={notifications.automatedAttendanceAlerts}
                  onChange={(e) => updateNotificationSettings({ automatedAttendanceAlerts: e.target.checked })}
                />
                <span className="ep-settings__slider"></span>
              </label>
            </div>
          </div>
        )}

        {/* 5. SECURITY & PERMISSIONS TAB */}
        {activeTab === 'security' && (
          <div>
            <div className="ep-settings__card-panel">
              <div className="ep-settings__card-panel-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Icons.ShieldCheck size={20} style={{ color: 'var(--color-primary-400)' }} />
                  Security Policies & Password Rules
                </span>
              </div>

              <div className="ep-settings__toggle-row">
                <div className="ep-settings__toggle-info">
                  <h4>Enforce Two-Factor Authentication (2FA)</h4>
                  <p>Require staff and administrators to log in using 2FA verification.</p>
                </div>
                <label className="ep-settings__switch">
                  <input
                    type="checkbox"
                    checked={security.require2FA}
                    onChange={(e) => updateSecuritySettings({ require2FA: e.target.checked })}
                  />
                  <span className="ep-settings__slider"></span>
                </label>
              </div>

              <div className="ep-settings__form-grid" style={{ marginTop: '1rem' }}>
                <div className="ep-settings__form-group">
                  <label>Session Timeout (Minutes)</label>
                  <input
                    type="number"
                    className="ep-settings__input"
                    value={security.sessionTimeoutMinutes}
                    onChange={(e) => updateSecuritySettings({ sessionTimeoutMinutes: Number(e.target.value) })}
                  />
                </div>

                <div className="ep-settings__form-group">
                  <label>Minimum Password Length</label>
                  <input
                    type="number"
                    className="ep-settings__input"
                    value={security.passwordMinLength}
                    onChange={(e) => updateSecuritySettings({ passwordMinLength: Number(e.target.value) })}
                  />
                </div>

                <div className="ep-settings__form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Allowed IP Whitelist Ranges (CIDR Notation)</label>
                  <input
                    type="text"
                    className="ep-settings__input"
                    value={security.ipWhitelist}
                    onChange={(e) => updateSecuritySettings({ ipWhitelist: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Role Permissions Matrix */}
            <div className="ep-settings__card-panel">
              <div className="ep-settings__card-panel-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Icons.Lock size={20} style={{ color: 'var(--color-primary-400)' }} />
                  Dynamic Role-Permissions Privilege Matrix
                </span>
              </div>

              <table className="ep-settings__table ep-settings__matrix-table">
                <thead>
                  <tr>
                    <th>Privilege Capability</th>
                    <th>Admin</th>
                    <th>Coordinator</th>
                    <th>Teacher</th>
                    <th>Parent</th>
                    <th>Student</th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ['viewDashboard', 'View Dashboard'],
                      ['manageStudents', 'Manage Students & SIS'],
                      ['manageClassrooms', 'Manage Classrooms & Facilities'],
                      ['manageGrading', 'Gradebook & Marking'],
                      ['manageFinance', 'Financial Records & Tuition'],
                      ['manageStaff', 'Manage Staff Directory'],
                      ['manageSettings', 'Configure System Settings'],
                      ['accessAuditLogs', 'View Governance Audit Logs'],
                    ] as [RolePermissionKey, string][]
                  ).map(([key, label]) => (
                    <tr key={key}>
                      <td>{label}</td>
                      {['admin', 'coordinator', 'teacher', 'parent', 'student'].map((r) => (
                        <td key={r}>
                          <input
                            type="checkbox"
                            checked={rolePermissions[r]?.[key] || false}
                            onChange={() => toggleRolePermission(r, key)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. INTEGRATIONS & PING TAB */}
        {activeTab === 'integrations' && (
          <div className="ep-settings__card-panel">
            <div className="ep-settings__card-panel-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icons.Layers size={20} style={{ color: 'var(--color-primary-400)' }} />
                External Integrations & Live Ping Diagnostics
              </span>
            </div>

            {[
              { id: 'canvas', title: 'Canvas LMS Sync', desc: 'Canvas Webhook Sync' },
              { id: 'google', title: 'Google Classroom', desc: 'GSuite Classroom Domain Sync' },
              { id: 'stripe', title: 'Stripe Payments', desc: 'Tuition & Fee Processing' },
              { id: 'supabase', title: 'Supabase Database', desc: 'Live PostgreSQL Backend Sync' },
            ].map(({ id, title, desc }) => {
              const diag = integrations.diagnostics?.[id];
              return (
                <div key={id as string} className="ep-settings__toggle-row">
                  <div className="ep-settings__toggle-info">
                    <h4>
                      {title as string}
                      {diag?.status === 'connected' && (
                        <span className="ep-settings__badge ep-settings__badge--available" style={{ marginLeft: '0.5rem' }}>
                          {diag.latencyMs}ms Ping
                        </span>
                      )}
                    </h4>
                    <p>{desc as string}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                      className="ep-settings__btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      onClick={() => testIntegrationConnection(id as string)}
                    >
                      <Icons.Activity size={14} />
                      Test Connection
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 7. AUDIT LOG TAB */}
        {activeTab === 'audit' && (
          <div className="ep-settings__card-panel">
            <div className="ep-settings__card-panel-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icons.FileText size={20} style={{ color: 'var(--color-primary-400)' }} />
                System Governance & Audit Trail
              </span>
              <span className="ep-settings__badge ep-settings__badge--available">
                {auditLogs.length} Events Logged
              </span>
            </div>

            <table className="ep-settings__table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Module</th>
                  <th>Action</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ fontWeight: 600 }}>{log.userName}</td>
                    <td>
                      <span className="ep-settings__badge ep-settings__badge--occupied">{log.userRole}</span>
                    </td>
                    <td>
                      <span className="ep-settings__badge ep-settings__badge--available">{log.module}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary-300)' }}>{log.action}</td>
                    <td style={{ fontSize: '0.85rem' }}>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 8. BACKUP & RECOVERY TAB */}
        {activeTab === 'backup' && (
          <div className="ep-settings__card-panel">
            <div className="ep-settings__card-panel-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icons.Database size={20} style={{ color: 'var(--color-primary-400)' }} />
                Disaster Recovery & System Backup
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--color-surface-700)', padding: '1.5rem', borderRadius: '0.75rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-main)' }}>
                  <Icons.Download size={20} style={{ color: '#34d399' }} />
                  Export System Configuration
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  Generate a full JSON backup file containing all classrooms, grading scales, security policies, and audit logs.
                </p>
                <button className="ep-settings__btn-primary" onClick={handleDownloadBackup}>
                  Export JSON Backup
                </button>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--color-surface-700)', padding: '1.5rem', borderRadius: '0.75rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-main)' }}>
                  <Icons.Upload size={20} style={{ color: '#60a5fa' }} />
                  Restore Configuration
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  Restore system configuration from a previously exported JSON backup file.
                </p>
                <button className="ep-settings__btn-secondary" onClick={() => setIsImportModalOpen(true)}>
                  Restore from JSON
                </button>
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1.5rem', borderRadius: '0.75rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171' }}>
                  <Icons.AlertTriangle size={20} />
                  Factory Reset
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  Reset all settings, classrooms, and parameters back to original system defaults.
                </p>
                <button className="ep-settings__btn-danger" onClick={() => setIsResetConfirmOpen(true)}>
                  Factory Reset System
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MAINTENANCE MODAL */}
      {isMaintModalOpen && (
        <div className="ep-settings__modal-backdrop" onClick={() => setIsMaintModalOpen(false)}>
          <div className="ep-settings__modal" onClick={(e) => e.stopPropagation()}>
            <div className="ep-settings__modal-header">
              <h3>Schedule Room Maintenance</h3>
              <button className="ep-settings__icon-btn" onClick={() => setIsMaintModalOpen(false)}>
                <Icons.X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveMaint}>
              <div className="ep-settings__form-group" style={{ marginBottom: '1rem' }}>
                <label>Maintenance Reason *</label>
                <input
                  type="text"
                  required
                  className="ep-settings__input"
                  placeholder="e.g. Projector replacement & HVAC inspection"
                  value={maintForm.reason}
                  onChange={(e) => setMaintForm({ ...maintForm, reason: e.target.value })}
                />
              </div>
              <div className="ep-settings__form-group" style={{ marginBottom: '1rem' }}>
                <label>Assigned Technician / Vendor</label>
                <input
                  type="text"
                  className="ep-settings__input"
                  value={maintForm.technician}
                  onChange={(e) => setMaintForm({ ...maintForm, technician: e.target.value })}
                />
              </div>
              <div className="ep-settings__form-group">
                <label>Expected Completion Date</label>
                <input
                  type="date"
                  className="ep-settings__input"
                  value={maintForm.expectedDate}
                  onChange={(e) => setMaintForm({ ...maintForm, expectedDate: e.target.value })}
                />
              </div>
              <div className="ep-settings__modal-footer">
                <button type="button" className="ep-settings__btn-secondary" onClick={() => setIsMaintModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="ep-settings__btn-primary">
                  Set Maintenance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRADE THRESHOLD MODAL */}
      {isGradeModalOpen && (
        <div className="ep-settings__modal-backdrop" onClick={() => setIsGradeModalOpen(false)}>
          <div className="ep-settings__modal" onClick={(e) => e.stopPropagation()}>
            <div className="ep-settings__modal-header">
              <h3>Add Letter Grade Threshold</h3>
              <button className="ep-settings__icon-btn" onClick={() => setIsGradeModalOpen(false)}>
                <Icons.X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveGrade}>
              <div className="ep-settings__form-grid">
                <div className="ep-settings__form-group">
                  <label>Letter Grade *</label>
                  <input
                    type="text"
                    required
                    className="ep-settings__input"
                    placeholder="e.g. A+ or Distinction"
                    value={gradeForm.grade}
                    onChange={(e) => setGradeForm({ ...gradeForm, grade: e.target.value })}
                  />
                </div>
                <div className="ep-settings__form-group">
                  <label>Min Percentage (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="ep-settings__input"
                    value={gradeForm.minPercentage}
                    onChange={(e) => setGradeForm({ ...gradeForm, minPercentage: Number(e.target.value) })}
                  />
                </div>
                <div className="ep-settings__form-group">
                  <label>Max Percentage (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="ep-settings__input"
                    value={gradeForm.maxPercentage}
                    onChange={(e) => setGradeForm({ ...gradeForm, maxPercentage: Number(e.target.value) })}
                  />
                </div>
                <div className="ep-settings__form-group">
                  <label>GPA Value</label>
                  <input
                    type="number"
                    step="0.1"
                    className="ep-settings__input"
                    value={gradeForm.gpaPoint}
                    onChange={(e) => setGradeForm({ ...gradeForm, gpaPoint: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="ep-settings__modal-footer">
                <button type="button" className="ep-settings__btn-secondary" onClick={() => setIsGradeModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="ep-settings__btn-primary">
                  Save Threshold
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACADEMIC TERM MODAL */}
      {isTermModalOpen && (
        <div className="ep-settings__modal-backdrop" onClick={() => setIsTermModalOpen(false)}>
          <div className="ep-settings__modal" onClick={(e) => e.stopPropagation()}>
            <div className="ep-settings__modal-header">
              <h3>Configure Academic Term</h3>
              <button className="ep-settings__icon-btn" onClick={() => setIsTermModalOpen(false)}>
                <Icons.X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveTerm}>
              <div className="ep-settings__form-group" style={{ marginBottom: '1rem' }}>
                <label>Term Name *</label>
                <input
                  type="text"
                  required
                  className="ep-settings__input"
                  placeholder="e.g. Fall Semester 2026"
                  value={termForm.name}
                  onChange={(e) => setTermForm({ ...termForm, name: e.target.value })}
                />
              </div>
              <div className="ep-settings__form-grid" style={{ marginBottom: '1rem' }}>
                <div className="ep-settings__form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    required
                    className="ep-settings__input"
                    value={termForm.startDate}
                    onChange={(e) => setTermForm({ ...termForm, startDate: e.target.value })}
                  />
                </div>
                <div className="ep-settings__form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    required
                    className="ep-settings__input"
                    value={termForm.endDate}
                    onChange={(e) => setTermForm({ ...termForm, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="ep-settings__modal-footer">
                <button type="button" className="ep-settings__btn-secondary" onClick={() => setIsTermModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="ep-settings__btn-primary">
                  Save Term
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BACKUP RESTORE MODAL */}
      {isImportModalOpen && (
        <div className="ep-settings__modal-backdrop" onClick={() => setIsImportModalOpen(false)}>
          <div className="ep-settings__modal" onClick={(e) => e.stopPropagation()}>
            <div className="ep-settings__modal-header">
              <h3>Restore System Backup JSON</h3>
              <button className="ep-settings__icon-btn" onClick={() => setIsImportModalOpen(false)}>
                <Icons.X size={20} />
              </button>
            </div>
            <form onSubmit={handleRestoreSubmit}>
              <div className="ep-settings__form-group">
                <label>Paste JSON Backup String *</label>
                <textarea
                  required
                  rows={10}
                  className="ep-settings__textarea"
                  placeholder="Paste contents of exported .json backup file here..."
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                />
              </div>
              <div className="ep-settings__modal-footer">
                <button type="button" className="ep-settings__btn-secondary" onClick={() => setIsImportModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="ep-settings__btn-primary">
                  Restore Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FACTORY RESET CONFIRMATION MODAL */}
      {isResetConfirmOpen && (
        <div className="ep-settings__modal-backdrop" onClick={() => setIsResetConfirmOpen(false)}>
          <div className="ep-settings__modal" onClick={(e) => e.stopPropagation()}>
            <div className="ep-settings__modal-header">
              <h3 style={{ color: '#f87171' }}>Confirm Factory Reset</h3>
              <button className="ep-settings__icon-btn" onClick={() => setIsResetConfirmOpen(false)}>
                <Icons.X size={20} />
              </button>
            </div>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Are you sure you want to perform a factory reset? All classroom modifications, grading thresholds, and custom security settings will be restored to initial defaults.
            </p>
            <div className="ep-settings__modal-footer">
              <button type="button" className="ep-settings__btn-secondary" onClick={() => setIsResetConfirmOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="ep-settings__btn-danger"
                onClick={() => {
                  resetToFactoryDefaults();
                  setIsResetConfirmOpen(false);
                }}
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT CLASSROOM MODAL */}
      {isRoomModalOpen && (
        <div className="ep-settings__modal-backdrop" onClick={() => setIsRoomModalOpen(false)}>
          <div className="ep-settings__modal" onClick={(e) => e.stopPropagation()}>
            <div className="ep-settings__modal-header">
              <h3>{editingRoom ? `Edit Classroom (Room ${editingRoom.roomNumber})` : 'Configure New Classroom'}</h3>
              <button className="ep-settings__icon-btn" onClick={() => setIsRoomModalOpen(false)}>
                <Icons.X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveRoom}>
              <div className="ep-settings__form-grid">
                <div className="ep-settings__form-group">
                  <label>Room Number / ID *</label>
                  <input
                    type="text"
                    required
                    className="ep-settings__input"
                    placeholder="e.g. 101 or LAB-2"
                    value={roomFormData.roomNumber}
                    onChange={(e) => setRoomFormData({ ...roomFormData, roomNumber: e.target.value })}
                  />
                </div>

                <div className="ep-settings__form-group">
                  <label>Display Name *</label>
                  <input
                    type="text"
                    required
                    className="ep-settings__input"
                    placeholder="e.g. Biology Lab 1"
                    value={roomFormData.name}
                    onChange={(e) => setRoomFormData({ ...roomFormData, name: e.target.value })}
                  />
                </div>

                <div className="ep-settings__form-group">
                  <label>Building / Block</label>
                  <input
                    type="text"
                    className="ep-settings__input"
                    value={roomFormData.building}
                    onChange={(e) => setRoomFormData({ ...roomFormData, building: e.target.value })}
                  />
                </div>

                <div className="ep-settings__form-group">
                  <label>Floor</label>
                  <input
                    type="number"
                    className="ep-settings__input"
                    value={roomFormData.floor}
                    onChange={(e) => setRoomFormData({ ...roomFormData, floor: Number(e.target.value) })}
                  />
                </div>

                <div className="ep-settings__form-group">
                  <label>Max Seating Capacity *</label>
                  <input
                    type="number"
                    required
                    className="ep-settings__input"
                    value={roomFormData.capacity}
                    onChange={(e) => setRoomFormData({ ...roomFormData, capacity: Number(e.target.value) })}
                  />
                </div>

                <div className="ep-settings__form-group">
                  <label>Room Category</label>
                  <select
                    className="ep-settings__select"
                    value={roomFormData.roomType}
                    onChange={(e) => setRoomFormData({ ...roomFormData, roomType: e.target.value as ClassroomType })}
                  >
                    <option value="classroom">Standard Classroom</option>
                    <option value="science-lab">Science Lab</option>
                    <option value="computer-lab">Computer Lab</option>
                    <option value="auditorium">Auditorium</option>
                    <option value="art-studio">Art Studio</option>
                    <option value="gymnasium">Gymnasium</option>
                    <option value="lecture-hall">Lecture Hall</option>
                  </select>
                </div>

                <div className="ep-settings__form-group">
                  <label>Operational Status</label>
                  <select
                    className="ep-settings__select"
                    value={roomFormData.status}
                    onChange={(e) => setRoomFormData({ ...roomFormData, status: e.target.value as RoomStatus })}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Under Maintenance</option>
                  </select>
                </div>

                <div className="ep-settings__form-group">
                  <label>Assigned Lead Teacher</label>
                  <input
                    type="text"
                    className="ep-settings__input"
                    placeholder="e.g. Prof. James Chen"
                    value={roomFormData.primaryTeacherName}
                    onChange={(e) => setRoomFormData({ ...roomFormData, primaryTeacherName: e.target.value })}
                  />
                </div>

                <div className="ep-settings__form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Installed Equipment (comma-separated)</label>
                  <input
                    type="text"
                    className="ep-settings__input"
                    placeholder="e.g. Interactive Smartboard, 4K Projector, Safety Shower"
                    value={roomFormData.equipmentStr}
                    onChange={(e) => setRoomFormData({ ...roomFormData, equipmentStr: e.target.value })}
                  />
                </div>
              </div>

              <div className="ep-settings__modal-footer">
                <button type="button" className="ep-settings__btn-secondary" onClick={() => setIsRoomModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="ep-settings__btn-primary">
                  {editingRoom ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
