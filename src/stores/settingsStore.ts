import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  Classroom,
  AcademicConfig,
  GradingScaleConfig,
  SchoolProfileConfig,
  NotificationSettingsConfig,
  SecuritySettingsConfig,
  IntegrationConfig,
  AuditLogEntry,
  MaintenanceRecord,
  RolePermissionsMap,
  RolePermissionKey,
  GradeThreshold,
  AcademicTerm,
} from '@/types/settings';
import { storage } from '@/data/storageAdapter';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';

const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
  const uiStore = useUIStore.getState();
  if (uiStore.addToast) uiStore.addToast({ title, message, type });
};

const INITIAL_CLASSROOMS: Classroom[] = [
  {
    id: 'rm_101',
    roomNumber: '101',
    name: 'General Purpose Classroom A',
    building: 'Main Academic Block',
    floor: 1,
    capacity: 32,
    roomType: 'classroom',
    equipment: ['Interactive Smartboard', 'HD Projector', 'Ergonomic Desks', 'Audio Soundbar'],
    status: 'available',
    primaryTeacherName: 'Prof. James Chen',
    homeroomGrade: 'grade-9',
  },
  {
    id: 'rm_102',
    roomNumber: '102',
    name: 'Advanced Chemistry Lab',
    building: 'Science & Tech Wing',
    floor: 1,
    capacity: 24,
    roomType: 'science-lab',
    equipment: ['Fume Hoods', 'Digital Microscopes', 'Safety Shower', 'Bunsen Burners', 'Eyewash Station'],
    status: 'available',
    primaryTeacherName: 'Dr. Robert Vance',
    homeroomGrade: 'grade-11',
  },
  {
    id: 'rm_201',
    roomNumber: '201',
    name: 'Computer Science Lab A',
    building: 'Science & Tech Wing',
    floor: 2,
    capacity: 30,
    roomType: 'computer-lab',
    equipment: ['30 High-Spec PCs', 'Dual Monitors', 'Fiber Network Switch', 'Projection Rig'],
    status: 'available',
    primaryTeacherName: 'Ms. Sarah Jenkins',
    homeroomGrade: 'grade-10',
  },
  {
    id: 'rm_aud_01',
    roomNumber: 'AUD-01',
    name: 'Main Campus Auditorium',
    building: 'Arts & Events Center',
    floor: 1,
    capacity: 450,
    roomType: 'auditorium',
    equipment: ['Surround Sound System', 'Stage Lighting Array', 'Motorized Screen', 'Wireless Microphones'],
    status: 'available',
    primaryTeacherName: 'Mr. Marcus Brody',
  },
  {
    id: 'rm_art_1',
    roomNumber: 'ART-101',
    name: 'Visual Arts Studio',
    building: 'Arts & Events Center',
    floor: 2,
    capacity: 25,
    roomType: 'art-studio',
    equipment: ['Pottery Wheels', 'Easels', 'Drying Racks', 'Wash Basins', '3D Printer'],
    status: 'available',
    primaryTeacherName: 'Mrs. Clara Oswald',
    homeroomGrade: 'grade-8',
  },
  {
    id: 'rm_lect_3',
    roomNumber: 'LECT-301',
    name: 'University Lecture Hall 3',
    building: 'Higher Ed Block',
    floor: 3,
    capacity: 120,
    roomType: 'lecture-hall',
    equipment: ['Tiered Seating', 'Dual 4K Laser Projectors', 'Lecture Capture System', 'Podium Controls'],
    status: 'available',
    primaryTeacherName: 'Dr. Elena Rodriguez',
  },
  {
    id: 'rm_gym_1',
    roomNumber: 'GYM-MAIN',
    name: 'Indoor Athletics Gymnasium',
    building: 'Sports Complex',
    floor: 1,
    capacity: 300,
    roomType: 'gymnasium',
    equipment: ['Scoreboard', 'Basketball Hoops', 'Volleyball Nets', 'Bleachers', 'First Aid Station'],
    status: 'available',
    primaryTeacherName: 'Coach David Miller',
  },
  {
    id: 'rm_204',
    roomNumber: '204',
    name: 'Mathematics Seminar Room',
    building: 'Main Academic Block',
    floor: 2,
    capacity: 28,
    roomType: 'classroom',
    equipment: ['Dual Whiteboards', 'Graphing Calculator Dock', 'Document Camera'],
    status: 'maintenance',
    primaryTeacherName: 'Mr. Alan Turing',
    homeroomGrade: 'grade-12',
  },
];

const INITIAL_MAINTENANCE: MaintenanceRecord[] = [
  {
    id: 'maint_001',
    roomId: 'rm_204',
    roomNumber: '204',
    date: '2026-07-20',
    reason: 'HVAC Air Conditioning Compressor Replacement',
    technician: 'Apex Facilities Services',
    expectedCompletionDate: '2026-07-25',
    status: 'active',
  },
];

const INITIAL_SCHOOL_PROFILE: SchoolProfileConfig = {
  name: 'EduPulse International Academy',
  motto: 'Empowering Excellence, Innovation & Community',
  code: 'EPA-88301',
  email: 'contact@edupulse.edu',
  phone: '+1 (555) 234-5678',
  address: '742 Evergreen Terrace, Springfield, OR 97477',
  website: 'https://edupulse-academy.edu',
  principalName: 'Dr. Sarah Mitchell',
  currency: 'USD ($)',
  timezone: 'America/New_York (EST)',
};

const INITIAL_ACADEMIC_CONFIG: AcademicConfig = {
  activeAcademicYear: '2025-2026',
  currentTermId: 'term_fall_2025',
  terms: [
    { id: 'term_fall_2025', name: 'Fall Semester 2025', startDate: '2025-08-25', endDate: '2025-12-19', status: 'active' },
    { id: 'term_spring_2026', name: 'Spring Semester 2026', startDate: '2026-01-12', endDate: '2026-05-22', status: 'upcoming' },
    { id: 'term_summer_2026', name: 'Summer Session 2026', startDate: '2026-06-08', endDate: '2026-07-31', status: 'upcoming' },
  ],
};

const INITIAL_GRADING_CONFIG: GradingScaleConfig = {
  thresholds: [
    { id: 'gt_1', grade: 'A+', minPercentage: 97, maxPercentage: 100, gpaPoint: 4.0 },
    { id: 'gt_2', grade: 'A', minPercentage: 93, maxPercentage: 96.9, gpaPoint: 4.0 },
    { id: 'gt_3', grade: 'A-', minPercentage: 90, maxPercentage: 92.9, gpaPoint: 3.7 },
    { id: 'gt_4', grade: 'B+', minPercentage: 87, maxPercentage: 89.9, gpaPoint: 3.3 },
    { id: 'gt_5', grade: 'B', minPercentage: 83, maxPercentage: 86.9, gpaPoint: 3.0 },
    { id: 'gt_6', grade: 'B-', minPercentage: 80, maxPercentage: 82.9, gpaPoint: 2.7 },
    { id: 'gt_7', grade: 'C+', minPercentage: 77, maxPercentage: 79.9, gpaPoint: 2.3 },
    { id: 'gt_8', grade: 'C', minPercentage: 73, maxPercentage: 76.9, gpaPoint: 2.0 },
    { id: 'gt_9', grade: 'C-', minPercentage: 70, maxPercentage: 72.9, gpaPoint: 1.7 },
    { id: 'gt_10', grade: 'D', minPercentage: 60, maxPercentage: 69.9, gpaPoint: 1.0 },
    { id: 'gt_11', grade: 'F', minPercentage: 0, maxPercentage: 59.9, gpaPoint: 0.0 },
  ],
  passingPercentage: 60,
  allowGradeCurving: true,
  enableWeightedCategories: true,
};

const INITIAL_NOTIFICATION_CONFIG: NotificationSettingsConfig = {
  emailAlerts: true,
  smsAlerts: true,
  parentPortalNotifications: true,
  automatedAttendanceAlerts: true,
  dailyDigest: false,
  lowGradeAlertThreshold: 70,
};

const INITIAL_SECURITY_CONFIG: SecuritySettingsConfig = {
  require2FA: false,
  sessionTimeoutMinutes: 60,
  passwordMinLength: 8,
  allowStudentSelfRegistration: false,
  enforceIpRestriction: false,
  ipWhitelist: '192.168.1.0/24, 10.0.0.0/16',
  requireSpecialChar: true,
  requireNumber: true,
};

const INITIAL_INTEGRATION_CONFIG: IntegrationConfig = {
  canvasSyncEnabled: true,
  googleClassroomSync: true,
  stripePaymentsEnabled: true,
  supabaseConnected: true,
  smsGatewayEnabled: true,
  canvasWebhookUrl: 'https://api.edupulse.edu/v1/hooks/canvas',
  googleClassroomDomain: 'edupulse.edu',
  stripePublishableKey: 'pk_test_edupulse_demo_key_9021',
  diagnostics: {
    canvas: { status: 'connected', latencyMs: 34, lastTestedAt: '2026-07-21T22:30:00Z' },
    google: { status: 'connected', latencyMs: 18, lastTestedAt: '2026-07-21T22:30:00Z' },
    stripe: { status: 'connected', latencyMs: 45, lastTestedAt: '2026-07-21T22:30:00Z' },
    supabase: { status: 'connected', latencyMs: 12, lastTestedAt: '2026-07-21T22:30:00Z' },
    sms: { status: 'connected', latencyMs: 52, lastTestedAt: '2026-07-21T22:30:00Z' },
  },
};

const INITIAL_ROLE_PERMISSIONS: RolePermissionsMap = {
  admin: {
    viewDashboard: true,
    manageStudents: true,
    manageClassrooms: true,
    manageGrading: true,
    manageFinance: true,
    manageStaff: true,
    manageSettings: true,
    accessAuditLogs: true,
  },
  coordinator: {
    viewDashboard: true,
    manageStudents: true,
    manageClassrooms: true,
    manageGrading: true,
    manageFinance: false,
    manageStaff: true,
    manageSettings: false,
    accessAuditLogs: true,
  },
  teacher: {
    viewDashboard: true,
    manageStudents: true,
    manageClassrooms: false,
    manageGrading: true,
    manageFinance: false,
    manageStaff: false,
    manageSettings: false,
    accessAuditLogs: false,
  },
  parent: {
    viewDashboard: true,
    manageStudents: false,
    manageClassrooms: false,
    manageGrading: false,
    manageFinance: false,
    manageStaff: false,
    manageSettings: false,
    accessAuditLogs: false,
  },
  student: {
    viewDashboard: true,
    manageStudents: false,
    manageClassrooms: false,
    manageGrading: false,
    manageFinance: false,
    manageStaff: false,
    manageSettings: false,
    accessAuditLogs: false,
  },
};

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log_001',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    userName: 'Dr. Sarah Mitchell',
    userRole: 'admin',
    action: 'System Initialized',
    module: 'System',
    details: 'System configuration initialized with NASA-grade governance baseline.',
  },
  {
    id: 'log_002',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    userName: 'Dr. Sarah Mitchell',
    userRole: 'admin',
    action: 'Maintenance Scheduled',
    module: 'Classrooms',
    details: 'Scheduled HVAC maintenance for Room 204.',
  },
];

interface SettingsState {
  classrooms: Classroom[];
  maintenanceRecords: MaintenanceRecord[];
  schoolProfile: SchoolProfileConfig;
  academicConfig: AcademicConfig;
  gradingScale: GradingScaleConfig;
  notifications: NotificationSettingsConfig;
  security: SecuritySettingsConfig;
  integrations: IntegrationConfig;
  rolePermissions: RolePermissionsMap;
  auditLogs: AuditLogEntry[];
  isLoaded: boolean;

  loadData: () => void;
  logAuditAction: (action: string, module: AuditLogEntry['module'], details: string) => void;

  // Classroom Actions
  addClassroom: (room: Omit<Classroom, 'id'>) => void;
  updateClassroom: (id: string, updates: Partial<Classroom>) => void;
  deleteClassroom: (id: string) => void;
  addMaintenanceRecord: (roomId: string, reason: string, technician: string, expectedDate?: string) => void;
  resolveMaintenanceRecord: (maintId: string) => void;
  bulkImportClassrooms: (newRooms: Classroom[]) => void;

  // Academic Actions
  addGradeThreshold: (threshold: Omit<GradeThreshold, 'id'>) => void;
  updateGradeThreshold: (id: string, updates: Partial<GradeThreshold>) => void;
  removeGradeThreshold: (id: string) => void;
  addAcademicTerm: (term: Omit<AcademicTerm, 'id'>) => void;
  updateAcademicTerm: (id: string, updates: Partial<AcademicTerm>) => void;
  deleteAcademicTerm: (id: string) => void;

  // Security & Permissions Actions
  toggleRolePermission: (role: string, key: RolePermissionKey) => void;

  // Connection Diagnostic Actions
  testIntegrationConnection: (serviceId: string) => Promise<void>;

  // Config Update Actions
  updateSchoolProfile: (updates: Partial<SchoolProfileConfig>) => void;
  updateAcademicConfig: (updates: Partial<AcademicConfig>) => void;
  updateGradingScale: (updates: Partial<GradingScaleConfig>) => void;
  updateNotificationSettings: (updates: Partial<NotificationSettingsConfig>) => void;
  updateSecuritySettings: (updates: Partial<SecuritySettingsConfig>) => void;
  updateIntegrationSettings: (updates: Partial<IntegrationConfig>) => void;

  // Backup & System Reset Actions
  exportSystemBackup: () => string;
  importSystemBackup: (jsonStr: string) => boolean;
  resetToFactoryDefaults: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  subscribeWithSelector((set, get) => ({
    classrooms: INITIAL_CLASSROOMS,
    maintenanceRecords: INITIAL_MAINTENANCE,
    schoolProfile: INITIAL_SCHOOL_PROFILE,
    academicConfig: INITIAL_ACADEMIC_CONFIG,
    gradingScale: INITIAL_GRADING_CONFIG,
    notifications: INITIAL_NOTIFICATION_CONFIG,
    security: INITIAL_SECURITY_CONFIG,
    integrations: INITIAL_INTEGRATION_CONFIG,
    rolePermissions: INITIAL_ROLE_PERMISSIONS,
    auditLogs: INITIAL_AUDIT_LOGS,
    isLoaded: false,

    loadData: () => {
      const classrooms = storage.get<Classroom[]>('classrooms', INITIAL_CLASSROOMS);
      const maintenanceRecords = storage.get<MaintenanceRecord[]>('maintenanceRecords', INITIAL_MAINTENANCE);
      const schoolProfile = storage.get<SchoolProfileConfig>('schoolProfile', INITIAL_SCHOOL_PROFILE);
      const academicConfig = storage.get<AcademicConfig>('academicConfig', INITIAL_ACADEMIC_CONFIG);
      const gradingScale = storage.get<GradingScaleConfig>('gradingScale', INITIAL_GRADING_CONFIG);
      const notifications = storage.get<NotificationSettingsConfig>('notifications', INITIAL_NOTIFICATION_CONFIG);
      const security = storage.get<SecuritySettingsConfig>('security', INITIAL_SECURITY_CONFIG);
      const integrations = storage.get<IntegrationConfig>('integrations', INITIAL_INTEGRATION_CONFIG);
      const rolePermissions = storage.get<RolePermissionsMap>('rolePermissions', INITIAL_ROLE_PERMISSIONS);
      const auditLogs = storage.get<AuditLogEntry[]>('auditLogs', INITIAL_AUDIT_LOGS);

      set({
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
        isLoaded: true,
      });
    },

    logAuditAction: (action, module, details) => {
      const currentUser = useAuthStore.getState().user;
      const newEntry: AuditLogEntry = {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toISOString(),
        userName: currentUser?.name || 'System Admin',
        userRole: currentUser?.role || 'admin',
        action,
        module,
        details,
      };
      set((state) => ({ auditLogs: [newEntry, ...state.auditLogs] }));
    },

    addClassroom: (roomData) => {
      const newRoom: Classroom = {
        ...roomData,
        id: `rm_${Date.now()}`,
      };
      set((state) => ({ classrooms: [...state.classrooms, newRoom] }));
      get().logAuditAction('Add Classroom', 'Classrooms', `Created classroom Room ${newRoom.roomNumber} (${newRoom.name}).`);
      showToast('Classroom Created', `Classroom ${newRoom.roomNumber} (${newRoom.name}) has been configured.`);
    },

    updateClassroom: (id, updates) => {
      const room = get().classrooms.find((c) => c.id === id);
      set((state) => ({
        classrooms: state.classrooms.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      }));
      get().logAuditAction('Update Classroom', 'Classrooms', `Updated details for Room ${room?.roomNumber || id}.`);
      showToast('Classroom Updated', 'Classroom details updated successfully.');
    },

    deleteClassroom: (id) => {
      const room = get().classrooms.find((c) => c.id === id);
      set((state) => ({
        classrooms: state.classrooms.filter((c) => c.id !== id),
      }));
      get().logAuditAction('Delete Classroom', 'Classrooms', `Deleted classroom Room ${room?.roomNumber || id}.`);
      showToast('Classroom Removed', 'Classroom configuration deleted.', 'info');
    },

    addMaintenanceRecord: (roomId, reason, technician, expectedDate) => {
      const room = get().classrooms.find((r) => r.id === roomId);
      if (!room) return;

      const record: MaintenanceRecord = {
        id: `maint_${Date.now()}`,
        roomId,
        roomNumber: room.roomNumber,
        date: new Date().toISOString().split('T')[0],
        reason,
        technician,
        expectedCompletionDate: expectedDate,
        status: 'active',
      };

      set((state) => ({
        maintenanceRecords: [record, ...state.maintenanceRecords],
        classrooms: state.classrooms.map((c) => (c.id === roomId ? { ...c, status: 'maintenance' } : c)),
      }));

      get().logAuditAction('Maintenance Logged', 'Classrooms', `Room ${room.roomNumber} placed under maintenance (${reason}).`);
      showToast('Maintenance Recorded', `Room ${room.roomNumber} status set to Maintenance.`);
    },

    resolveMaintenanceRecord: (maintId) => {
      const record = get().maintenanceRecords.find((m) => m.id === maintId);
      if (!record) return;

      set((state) => ({
        maintenanceRecords: state.maintenanceRecords.map((m) => (m.id === maintId ? { ...m, status: 'resolved' } : m)),
        classrooms: state.classrooms.map((c) => (c.id === record.roomId ? { ...c, status: 'available' } : c)),
      }));

      get().logAuditAction('Maintenance Resolved', 'Classrooms', `Maintenance resolved for Room ${record.roomNumber}.`);
      showToast('Maintenance Resolved', `Room ${record.roomNumber} marked as Available.`);
    },

    bulkImportClassrooms: (newRooms) => {
      set((state) => ({ classrooms: [...state.classrooms, ...newRooms] }));
      get().logAuditAction('Bulk Import Classrooms', 'Classrooms', `Imported ${newRooms.length} classroom configurations.`);
      showToast('Bulk Import Successful', `${newRooms.length} classrooms added.`);
    },

    addGradeThreshold: (threshold) => {
      const newThreshold: GradeThreshold = {
        ...threshold,
        id: `gt_${Date.now()}`,
      };
      set((state) => ({
        gradingScale: {
          ...state.gradingScale,
          thresholds: [...state.gradingScale.thresholds, newThreshold].sort((a, b) => b.minPercentage - a.minPercentage),
        },
      }));
      get().logAuditAction('Add Grade Threshold', 'Academic', `Added grade threshold ${threshold.grade}.`);
      showToast('Threshold Added', `Grade ${threshold.grade} matrix threshold added.`);
    },

    updateGradeThreshold: (id, updates) => {
      set((state) => ({
        gradingScale: {
          ...state.gradingScale,
          thresholds: state.gradingScale.thresholds
            .map((gt) => (gt.id === id ? { ...gt, ...updates } : gt))
            .sort((a, b) => b.minPercentage - a.minPercentage),
        },
      }));
      get().logAuditAction('Update Grade Scale', 'Academic', `Updated grade threshold parameters.`);
      showToast('Grade Matrix Saved', 'Threshold changes updated.');
    },

    removeGradeThreshold: (id) => {
      set((state) => ({
        gradingScale: {
          ...state.gradingScale,
          thresholds: state.gradingScale.thresholds.filter((gt) => gt.id !== id),
        },
      }));
      get().logAuditAction('Remove Grade Threshold', 'Academic', `Removed grade threshold ID ${id}.`);
      showToast('Threshold Removed', 'Grade threshold deleted.', 'info');
    },

    addAcademicTerm: (term) => {
      const newTerm: AcademicTerm = {
        ...term,
        id: `term_${Date.now()}`,
      };
      set((state) => ({
        academicConfig: {
          ...state.academicConfig,
          terms: [...state.academicConfig.terms, newTerm],
        },
      }));
      get().logAuditAction('Add Academic Term', 'Academic', `Configured academic term ${term.name}.`);
      showToast('Term Created', `Academic term ${term.name} added.`);
    },

    updateAcademicTerm: (id, updates) => {
      set((state) => ({
        academicConfig: {
          ...state.academicConfig,
          terms: state.academicConfig.terms.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        },
      }));
      get().logAuditAction('Update Term', 'Academic', `Updated academic term details.`);
      showToast('Term Updated', 'Academic calendar term updated.');
    },

    deleteAcademicTerm: (id) => {
      set((state) => ({
        academicConfig: {
          ...state.academicConfig,
          terms: state.academicConfig.terms.filter((t) => t.id !== id),
        },
      }));
      get().logAuditAction('Delete Term', 'Academic', `Deleted academic term.`);
      showToast('Term Deleted', 'Academic calendar term removed.', 'info');
    },

    toggleRolePermission: (role, key) => {
      set((state) => {
        const currentRolePerms = state.rolePermissions[role] || { ...INITIAL_ROLE_PERMISSIONS.admin };
        const updatedRolePerms = { ...currentRolePerms, [key]: !currentRolePerms[key] };
        return {
          rolePermissions: {
            ...state.rolePermissions,
            [role]: updatedRolePerms,
          },
        };
      });
      get().logAuditAction('Permission Toggled', 'Security', `Toggled permission ${key} for role ${role}.`);
      showToast('Permissions Updated', `Updated permissions for ${role} role.`);
    },

    testIntegrationConnection: async (serviceId) => {
      // Set to testing
      set((state) => ({
        integrations: {
          ...state.integrations,
          diagnostics: {
            ...state.integrations.diagnostics,
            [serviceId]: { status: 'testing' },
          },
        },
      }));

      // Simulate network ping latency
      await new Promise((res) => setTimeout(res, 800));
      const simulatedLatency = Math.floor(Math.random() * 35) + 12;

      set((state) => ({
        integrations: {
          ...state.integrations,
          diagnostics: {
            ...state.integrations.diagnostics,
            [serviceId]: {
              status: 'connected',
              latencyMs: simulatedLatency,
              lastTestedAt: new Date().toISOString(),
            },
          },
        },
      }));

      get().logAuditAction('Integration Ping', 'Integrations', `Tested connection for ${serviceId} (${simulatedLatency}ms).`);
      showToast('Connection Operational', `${serviceId.toUpperCase()} ping successful (${simulatedLatency}ms latency).`);
    },

    updateSchoolProfile: (updates) => {
      set((state) => ({ schoolProfile: { ...state.schoolProfile, ...updates } }));
      get().logAuditAction('Update Profile', 'Profile', 'Updated school profile details.');
      showToast('Profile Updated', 'School profile settings saved.');
    },

    updateAcademicConfig: (updates) => {
      set((state) => ({ academicConfig: { ...state.academicConfig, ...updates } }));
      get().logAuditAction('Update Academic Config', 'Academic', 'Updated academic year configuration.');
      showToast('Academic Config Saved', 'Academic year & terms configuration updated.');
    },

    updateGradingScale: (updates) => {
      set((state) => ({ gradingScale: { ...state.gradingScale, ...updates } }));
      get().logAuditAction('Update Grading Scale', 'Academic', 'Updated grading policies.');
      showToast('Grading Scale Updated', 'Grading thresholds and GPA settings saved.');
    },

    updateNotificationSettings: (updates) => {
      set((state) => ({ notifications: { ...state.notifications, ...updates } }));
      get().logAuditAction('Update Notifications', 'Notifications', 'Updated notification preferences.');
      showToast('Notification Settings Saved', 'Communication preferences updated.');
    },

    updateSecuritySettings: (updates) => {
      set((state) => ({ security: { ...state.security, ...updates } }));
      get().logAuditAction('Update Security', 'Security', 'Updated security policies.');
      showToast('Security Settings Saved', 'Security and authentication policies updated.');
    },

    updateIntegrationSettings: (updates) => {
      set((state) => ({ integrations: { ...state.integrations, ...updates } }));
      get().logAuditAction('Update Integrations', 'Integrations', 'Updated integration parameters.');
      showToast('Integrations Saved', 'External integration settings updated.');
    },

    exportSystemBackup: () => {
      const backupData = {
        version: '2.0.0-NASA',
        timestamp: new Date().toISOString(),
        classrooms: get().classrooms,
        maintenanceRecords: get().maintenanceRecords,
        schoolProfile: get().schoolProfile,
        academicConfig: get().academicConfig,
        gradingScale: get().gradingScale,
        notifications: get().notifications,
        security: get().security,
        integrations: get().integrations,
        rolePermissions: get().rolePermissions,
        auditLogs: get().auditLogs,
      };
      get().logAuditAction('System Backup Exported', 'System', 'Exported full JSON configuration backup.');
      return JSON.stringify(backupData, null, 2);
    },

    importSystemBackup: (jsonStr) => {
      try {
        const parsed = JSON.parse(jsonStr);
        if (!parsed.classrooms || !parsed.schoolProfile) {
          throw new Error('Invalid backup structure');
        }

        set({
          classrooms: parsed.classrooms || INITIAL_CLASSROOMS,
          maintenanceRecords: parsed.maintenanceRecords || INITIAL_MAINTENANCE,
          schoolProfile: parsed.schoolProfile || INITIAL_SCHOOL_PROFILE,
          academicConfig: parsed.academicConfig || INITIAL_ACADEMIC_CONFIG,
          gradingScale: parsed.gradingScale || INITIAL_GRADING_CONFIG,
          notifications: parsed.notifications || INITIAL_NOTIFICATION_CONFIG,
          security: parsed.security || INITIAL_SECURITY_CONFIG,
          integrations: parsed.integrations || INITIAL_INTEGRATION_CONFIG,
          rolePermissions: parsed.rolePermissions || INITIAL_ROLE_PERMISSIONS,
          auditLogs: parsed.auditLogs || INITIAL_AUDIT_LOGS,
        });

        get().logAuditAction('System Backup Restored', 'System', 'Restored system configuration from backup file.');
        showToast('Backup Restored', 'System configuration has been successfully restored.');
        return true;
      } catch (err: any) {
        showToast('Restore Failed', 'Invalid backup file format.', 'error');
        return false;
      }
    },

    resetToFactoryDefaults: () => {
      set({
        classrooms: INITIAL_CLASSROOMS,
        maintenanceRecords: INITIAL_MAINTENANCE,
        schoolProfile: INITIAL_SCHOOL_PROFILE,
        academicConfig: INITIAL_ACADEMIC_CONFIG,
        gradingScale: INITIAL_GRADING_CONFIG,
        notifications: INITIAL_NOTIFICATION_CONFIG,
        security: INITIAL_SECURITY_CONFIG,
        integrations: INITIAL_INTEGRATION_CONFIG,
        rolePermissions: INITIAL_ROLE_PERMISSIONS,
        auditLogs: [
          {
            id: `log_${Date.now()}`,
            timestamp: new Date().toISOString(),
            userName: 'System Admin',
            userRole: 'admin',
            action: 'Factory Reset',
            module: 'System',
            details: 'Reset system configuration to factory defaults.',
          },
        ],
      });
      showToast('Factory Reset', 'System configuration reset to original defaults.', 'info');
    },
  }))
);

// Subscribe to state changes for persistence
useSettingsStore.subscribe(
  (state) => ({
    classrooms: state.classrooms,
    maintenanceRecords: state.maintenanceRecords,
    schoolProfile: state.schoolProfile,
    academicConfig: state.academicConfig,
    gradingScale: state.gradingScale,
    notifications: state.notifications,
    security: state.security,
    integrations: state.integrations,
    rolePermissions: state.rolePermissions,
    auditLogs: state.auditLogs,
  }),
  (data) => {
    storage.set('classrooms', data.classrooms);
    storage.set('maintenanceRecords', data.maintenanceRecords);
    storage.set('schoolProfile', data.schoolProfile);
    storage.set('academicConfig', data.academicConfig);
    storage.set('gradingScale', data.gradingScale);
    storage.set('notifications', data.notifications);
    storage.set('security', data.security);
    storage.set('integrations', data.integrations);
    storage.set('rolePermissions', data.rolePermissions);
    storage.set('auditLogs', data.auditLogs);
  }
);
