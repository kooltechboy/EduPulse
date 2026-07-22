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
} from '@/types/settings';
import { storage } from '@/data/storageAdapter';
import { useUIStore } from '@/stores/uiStore';

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
    { grade: 'A+', minPercentage: 97, maxPercentage: 100, gpaPoint: 4.0 },
    { grade: 'A', minPercentage: 93, maxPercentage: 96.9, gpaPoint: 4.0 },
    { grade: 'A-', minPercentage: 90, maxPercentage: 92.9, gpaPoint: 3.7 },
    { grade: 'B+', minPercentage: 87, maxPercentage: 89.9, gpaPoint: 3.3 },
    { grade: 'B', minPercentage: 83, maxPercentage: 86.9, gpaPoint: 3.0 },
    { grade: 'B-', minPercentage: 80, maxPercentage: 82.9, gpaPoint: 2.7 },
    { grade: 'C+', minPercentage: 77, maxPercentage: 79.9, gpaPoint: 2.3 },
    { grade: 'C', minPercentage: 73, maxPercentage: 76.9, gpaPoint: 2.0 },
    { grade: 'C-', minPercentage: 70, maxPercentage: 72.9, gpaPoint: 1.7 },
    { grade: 'D', minPercentage: 60, maxPercentage: 69.9, gpaPoint: 1.0 },
    { grade: 'F', minPercentage: 0, maxPercentage: 59.9, gpaPoint: 0.0 },
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
};

const INITIAL_INTEGRATION_CONFIG: IntegrationConfig = {
  canvasSyncEnabled: true,
  googleClassroomSync: true,
  stripePaymentsEnabled: true,
  supabaseConnected: true,
  smsGatewayEnabled: true,
};

interface SettingsState {
  classrooms: Classroom[];
  schoolProfile: SchoolProfileConfig;
  academicConfig: AcademicConfig;
  gradingScale: GradingScaleConfig;
  notifications: NotificationSettingsConfig;
  security: SecuritySettingsConfig;
  integrations: IntegrationConfig;
  isLoaded: boolean;

  loadData: () => void;

  // Classroom Actions
  addClassroom: (room: Omit<Classroom, 'id'>) => void;
  updateClassroom: (id: string, updates: Partial<Classroom>) => void;
  deleteClassroom: (id: string) => void;

  // Config Update Actions
  updateSchoolProfile: (updates: Partial<SchoolProfileConfig>) => void;
  updateAcademicConfig: (updates: Partial<AcademicConfig>) => void;
  updateGradingScale: (updates: Partial<GradingScaleConfig>) => void;
  updateNotificationSettings: (updates: Partial<NotificationSettingsConfig>) => void;
  updateSecuritySettings: (updates: Partial<SecuritySettingsConfig>) => void;
  updateIntegrationSettings: (updates: Partial<IntegrationConfig>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  subscribeWithSelector((set) => ({
    classrooms: INITIAL_CLASSROOMS,
    schoolProfile: INITIAL_SCHOOL_PROFILE,
    academicConfig: INITIAL_ACADEMIC_CONFIG,
    gradingScale: INITIAL_GRADING_CONFIG,
    notifications: INITIAL_NOTIFICATION_CONFIG,
    security: INITIAL_SECURITY_CONFIG,
    integrations: INITIAL_INTEGRATION_CONFIG,
    isLoaded: false,

    loadData: () => {
      const classrooms = storage.get<Classroom[]>('classrooms', INITIAL_CLASSROOMS);
      const schoolProfile = storage.get<SchoolProfileConfig>('schoolProfile', INITIAL_SCHOOL_PROFILE);
      const academicConfig = storage.get<AcademicConfig>('academicConfig', INITIAL_ACADEMIC_CONFIG);
      const gradingScale = storage.get<GradingScaleConfig>('gradingScale', INITIAL_GRADING_CONFIG);
      const notifications = storage.get<NotificationSettingsConfig>('notifications', INITIAL_NOTIFICATION_CONFIG);
      const security = storage.get<SecuritySettingsConfig>('security', INITIAL_SECURITY_CONFIG);
      const integrations = storage.get<IntegrationConfig>('integrations', INITIAL_INTEGRATION_CONFIG);

      set({
        classrooms,
        schoolProfile,
        academicConfig,
        gradingScale,
        notifications,
        security,
        integrations,
        isLoaded: true,
      });
    },

    addClassroom: (roomData) => {
      const newRoom: Classroom = {
        ...roomData,
        id: `rm_${Date.now()}`,
      };
      set((state) => ({ classrooms: [...state.classrooms, newRoom] }));
      showToast('Classroom Created', `Classroom ${newRoom.roomNumber} (${newRoom.name}) has been configured.`);
    },

    updateClassroom: (id, updates) => {
      set((state) => ({
        classrooms: state.classrooms.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      }));
      showToast('Classroom Updated', 'Classroom details have been updated successfully.');
    },

    deleteClassroom: (id) => {
      set((state) => ({
        classrooms: state.classrooms.filter((c) => c.id !== id),
      }));
      showToast('Classroom Removed', 'Classroom configuration deleted.', 'info');
    },

    updateSchoolProfile: (updates) => {
      set((state) => ({ schoolProfile: { ...state.schoolProfile, ...updates } }));
      showToast('Profile Updated', 'School profile settings saved.');
    },

    updateAcademicConfig: (updates) => {
      set((state) => ({ academicConfig: { ...state.academicConfig, ...updates } }));
      showToast('Academic Config Saved', 'Academic year & terms configuration updated.');
    },

    updateGradingScale: (updates) => {
      set((state) => ({ gradingScale: { ...state.gradingScale, ...updates } }));
      showToast('Grading Scale Updated', 'Grading thresholds and GPA settings saved.');
    },

    updateNotificationSettings: (updates) => {
      set((state) => ({ notifications: { ...state.notifications, ...updates } }));
      showToast('Notification Settings Saved', 'Communication preferences updated.');
    },

    updateSecuritySettings: (updates) => {
      set((state) => ({ security: { ...state.security, ...updates } }));
      showToast('Security Settings Saved', 'Security and authentication policies updated.');
    },

    updateIntegrationSettings: (updates) => {
      set((state) => ({ integrations: { ...state.integrations, ...updates } }));
      showToast('Integrations Saved', 'External integration settings updated.');
    },
  }))
);

// Subscribe to state changes for persistence
useSettingsStore.subscribe(
  (state) => ({
    classrooms: state.classrooms,
    schoolProfile: state.schoolProfile,
    academicConfig: state.academicConfig,
    gradingScale: state.gradingScale,
    notifications: state.notifications,
    security: state.security,
    integrations: state.integrations,
  }),
  (data) => {
    storage.set('classrooms', data.classrooms);
    storage.set('schoolProfile', data.schoolProfile);
    storage.set('academicConfig', data.academicConfig);
    storage.set('gradingScale', data.gradingScale);
    storage.set('notifications', data.notifications);
    storage.set('security', data.security);
    storage.set('integrations', data.integrations);
  }
);
