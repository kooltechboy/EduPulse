export type ClassroomType = 
  | 'classroom' 
  | 'science-lab' 
  | 'computer-lab' 
  | 'auditorium' 
  | 'art-studio' 
  | 'gymnasium' 
  | 'library-zone'
  | 'lecture-hall';

export type RoomStatus = 'available' | 'occupied' | 'maintenance';

export interface MaintenanceRecord {
  id: string;
  roomId: string;
  roomNumber: string;
  date: string;
  reason: string;
  technician: string;
  expectedCompletionDate?: string;
  status: 'active' | 'resolved';
}

export interface Classroom {
  id: string;
  roomNumber: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  roomType: ClassroomType;
  equipment: string[];
  status: RoomStatus;
  primaryTeacherName?: string;
  homeroomGrade?: string;
  maintenanceHistory?: MaintenanceRecord[];
  notes?: string;
}

export interface AcademicTerm {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
}

export interface AcademicConfig {
  activeAcademicYear: string;
  currentTermId: string;
  terms: AcademicTerm[];
}

export interface GradeThreshold {
  id: string;
  grade: string;
  minPercentage: number;
  maxPercentage: number;
  gpaPoint: number;
}

export interface GradingScaleConfig {
  thresholds: GradeThreshold[];
  passingPercentage: number;
  allowGradeCurving: boolean;
  enableWeightedCategories: boolean;
}

export interface SchoolProfileConfig {
  name: string;
  motto: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  principalName: string;
  currency: string;
  timezone: string;
  logoUrl?: string;
}

export interface NotificationSettingsConfig {
  emailAlerts: boolean;
  smsAlerts: boolean;
  parentPortalNotifications: boolean;
  automatedAttendanceAlerts: boolean;
  dailyDigest: boolean;
  lowGradeAlertThreshold: number;
}

export interface SecuritySettingsConfig {
  require2FA: boolean;
  sessionTimeoutMinutes: number;
  passwordMinLength: number;
  allowStudentSelfRegistration: boolean;
  enforceIpRestriction: boolean;
  ipWhitelist: string;
  requireSpecialChar: boolean;
  requireNumber: boolean;
}

export interface ServiceDiagnostic {
  status: 'connected' | 'error' | 'testing' | 'disconnected';
  latencyMs?: number;
  lastTestedAt?: string;
}

export interface IntegrationConfig {
  canvasSyncEnabled: boolean;
  googleClassroomSync: boolean;
  stripePaymentsEnabled: boolean;
  supabaseConnected: boolean;
  smsGatewayEnabled: boolean;
  canvasWebhookUrl?: string;
  googleClassroomDomain?: string;
  stripePublishableKey?: string;
  diagnostics?: Record<string, ServiceDiagnostic>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  module: 'Classrooms' | 'Academic' | 'Profile' | 'Notifications' | 'Security' | 'Integrations' | 'System';
  details: string;
}

export type RolePermissionKey = 
  | 'viewDashboard'
  | 'manageStudents'
  | 'manageClassrooms'
  | 'manageGrading'
  | 'manageFinance'
  | 'manageStaff'
  | 'manageSettings'
  | 'accessAuditLogs';

export type RolePermissionsMap = Record<string, Record<RolePermissionKey, boolean>>;
