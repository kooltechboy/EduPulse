import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useSettingsStore } from '@/stores/settingsStore';
import { Classroom, ClassroomType, RoomStatus } from '@/types/settings';
import './SettingsHub.css';

export default function SettingsHub() {
  const {
    classrooms,
    schoolProfile,
    academicConfig,
    gradingScale,
    notifications,
    security,
    integrations,
    loadData,
    addClassroom,
    updateClassroom,
    deleteClassroom,
    updateSchoolProfile,
    updateAcademicConfig,
    updateGradingScale,
    updateNotificationSettings,
    updateSecuritySettings,
    updateIntegrationSettings,
  } = useSettingsStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<'classrooms' | 'academic' | 'profile' | 'notifications' | 'security' | 'integrations'>('classrooms');

  // Classroom Filters & Modal State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Classroom | null>(null);

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
  const labCount = classrooms.filter((r) => r.roomType.includes('lab')).length;

  return (
    <div className="ep-settings">
      {/* Header */}
      <div className="ep-settings__header">
        <div className="ep-settings__title-group">
          <h1>
            <Icons.SlidersHorizontal size={28} style={{ color: 'var(--color-primary-400, #818cf8)' }} />
            System Settings & Configurations
          </h1>
          <p>Configure classrooms, facilities, academic calendars, institution details, security policies, and integrations.</p>
        </div>
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
          Security & Access
        </button>

        <button
          className={`ep-settings__tab-btn ${activeTab === 'integrations' ? 'ep-settings__tab-btn--active' : ''}`}
          onClick={() => setActiveTab('integrations')}
        >
          <Icons.Layers size={18} />
          Integrations
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
                <div className="ep-settings__stat-icon" style={{ color: '#60a5fa', background: 'rgba(96, 165, 250, 0.15)' }}>
                  <Icons.FlaskConical size={24} />
                </div>
                <div className="ep-settings__stat-info">
                  <h4>Specialized Labs</h4>
                  <span>{labCount}</span>
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
                      <span className="ep-settings__detail-label">Assigned Teacher</span>
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

              {filteredClassrooms.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  <Icons.SearchX size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p>No classrooms found matching your current filter criteria.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. ACADEMIC & GRADING TAB */}
        {activeTab === 'academic' && (
          <div>
            <div className="ep-settings__card-panel">
              <h3 className="ep-settings__card-panel-title">
                <Icons.Calendar size={20} style={{ color: 'var(--color-primary-400)' }} />
                Academic Terms & Calendar Configuration
              </h3>
              <div className="ep-settings__form-grid">
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
            </div>

            <div className="ep-settings__card-panel">
              <h3 className="ep-settings__card-panel-title">
                <Icons.Award size={20} style={{ color: 'var(--color-primary-400)' }} />
                Grading Scale & GPA Weights
              </h3>

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

              <div className="ep-settings__toggle-row">
                <div className="ep-settings__toggle-info">
                  <h4>Enable Weighted Assignment Categories</h4>
                  <p>Calculate overall grades based on category weights (e.g. Tests 40%, Homework 20%).</p>
                </div>
                <label className="ep-settings__switch">
                  <input
                    type="checkbox"
                    checked={gradingScale.enableWeightedCategories}
                    onChange={(e) => updateGradingScale({ enableWeightedCategories: e.target.checked })}
                  />
                  <span className="ep-settings__slider"></span>
                </label>
              </div>

              <h4 style={{ margin: '1.5rem 0 0.5rem 0', color: 'var(--color-text-main)' }}>Letter Grade Conversion Matrix</h4>
              <table className="ep-settings__table">
                <thead>
                  <tr>
                    <th>Letter Grade</th>
                    <th>Min Score (%)</th>
                    <th>Max Score (%)</th>
                    <th>GPA Value</th>
                  </tr>
                </thead>
                <tbody>
                  {gradingScale.thresholds.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700, color: 'var(--color-primary-300)' }}>{row.grade}</td>
                      <td>{row.minPercentage}%</td>
                      <td>{row.maxPercentage}%</td>
                      <td>{row.gpaPoint.toFixed(1)}</td>
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
            <h3 className="ep-settings__card-panel-title">
              <Icons.School size={20} style={{ color: 'var(--color-primary-400)' }} />
              Institution Identity & Contact Information
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
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
                  <label>Institutional Registration Code</label>
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

                <div className="ep-settings__form-group">
                  <label>Operational Currency</label>
                  <input
                    type="text"
                    className="ep-settings__input"
                    value={schoolProfile.currency}
                    onChange={(e) => updateSchoolProfile({ currency: e.target.value })}
                  />
                </div>

                <div className="ep-settings__form-group">
                  <label>Timezone</label>
                  <input
                    type="text"
                    className="ep-settings__input"
                    value={schoolProfile.timezone}
                    onChange={(e) => updateSchoolProfile({ timezone: e.target.value })}
                  />
                </div>
              </div>
            </form>
          </div>
        )}

        {/* 4. NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="ep-settings__card-panel">
            <h3 className="ep-settings__card-panel-title">
              <Icons.Bell size={20} style={{ color: 'var(--color-primary-400)' }} />
              Communication & Notification Preferences
            </h3>

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
                <h4>Parent Portal Notifications</h4>
                <p>Push instant updates to parents regarding student progress and attendance.</p>
              </div>
              <label className="ep-settings__switch">
                <input
                  type="checkbox"
                  checked={notifications.parentPortalNotifications}
                  onChange={(e) => updateNotificationSettings({ parentPortalNotifications: e.target.checked })}
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

        {/* 5. SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="ep-settings__card-panel">
            <h3 className="ep-settings__card-panel-title">
              <Icons.ShieldCheck size={20} style={{ color: 'var(--color-primary-400)' }} />
              Security Policies & Access Control
            </h3>

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

            <div className="ep-settings__toggle-row">
              <div className="ep-settings__toggle-info">
                <h4>Allow Student Self-Registration</h4>
                <p>Permit students to register online accounts using institutional email domains.</p>
              </div>
              <label className="ep-settings__switch">
                <input
                  type="checkbox"
                  checked={security.allowStudentSelfRegistration}
                  onChange={(e) => updateSecuritySettings({ allowStudentSelfRegistration: e.target.checked })}
                />
                <span className="ep-settings__slider"></span>
              </label>
            </div>

            <div className="ep-settings__form-grid" style={{ marginTop: '1.5rem' }}>
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
            </div>
          </div>
        )}

        {/* 6. INTEGRATIONS TAB */}
        {activeTab === 'integrations' && (
          <div className="ep-settings__card-panel">
            <h3 className="ep-settings__card-panel-title">
              <Icons.Layers size={20} style={{ color: 'var(--color-primary-400)' }} />
              External Platform Integrations
            </h3>

            <div className="ep-settings__toggle-row">
              <div className="ep-settings__toggle-info">
                <h4>Canvas LMS Synchronization</h4>
                <p>Sync course structures, enrollments, and assignment grades with Canvas LMS.</p>
              </div>
              <label className="ep-settings__switch">
                <input
                  type="checkbox"
                  checked={integrations.canvasSyncEnabled}
                  onChange={(e) => updateIntegrationSettings({ canvasSyncEnabled: e.target.checked })}
                />
                <span className="ep-settings__slider"></span>
              </label>
            </div>

            <div className="ep-settings__toggle-row">
              <div className="ep-settings__toggle-info">
                <h4>Google Classroom Integration</h4>
                <p>Connect teacher coursework with Google Classroom sync.</p>
              </div>
              <label className="ep-settings__switch">
                <input
                  type="checkbox"
                  checked={integrations.googleClassroomSync}
                  onChange={(e) => updateIntegrationSettings({ googleClassroomSync: e.target.checked })}
                />
                <span className="ep-settings__slider"></span>
              </label>
            </div>

            <div className="ep-settings__toggle-row">
              <div className="ep-settings__toggle-info">
                <h4>Stripe Payment Gateway</h4>
                <p>Process tuition fees, cafeteria payments, and library fines securely.</p>
              </div>
              <label className="ep-settings__switch">
                <input
                  type="checkbox"
                  checked={integrations.stripePaymentsEnabled}
                  onChange={(e) => updateIntegrationSettings({ stripePaymentsEnabled: e.target.checked })}
                />
                <span className="ep-settings__slider"></span>
              </label>
            </div>
          </div>
        )}
      </div>

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
