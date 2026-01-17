export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT'
}

export enum StaffCategory {
  FACULTY = 'Faculty',
  PSYCHOLOGIST = 'Psychologist',
  ACCOUNTING = 'Accounting',
  HR = 'HR',
  CLERICAL = 'Clerical/Secretary',
  AUXILIARY = 'Auxiliary Staff'
}

export enum GradeLevel {
  NURSERY = 'Nursery',
  PRE_SCHOOL = 'Pre-School',
  KINDERGARTEN = 'Kindergarten',
  ELEMENTARY = 'Elementary',
  JUNIOR_HIGH = 'Junior High',
  SENIOR_HIGH = 'Senior High'
}

export enum StudentLifecycleStatus {
  ADMITTED = 'Admitted',
  ENROLLED = 'Enrolled',
  WITHDRAWN = 'Withdrawn',
  GRADUATED = 'Graduated',
  ALUMNI = 'Alumni'
}

export interface Invoice {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  dueDate: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  category: 'Tuition' | 'Lab' | 'Facility' | 'Extracurricular';
}

export interface SubstitutionRequest {
  id: string;
  absentStaffId: string;
  absentStaffName: string;
  date: string;
  period: string;
  subject: string;
  status: 'Pending' | 'Matched' | 'Internal-Cover' | 'External-Sub';
  matchedStaffId?: string;
  matchedStaffName?: string;
  aiConfidence?: number;
}

export interface ResourceBooking {
  id: string;
  resourceId: string;
  resourceName: string;
  type: 'Room' | 'Lab' | 'Vehicle' | 'Equipment';
  bookedById: string;
  bookedByName: string;
  startTime: string;
  endTime: string;
  purpose: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
  read: boolean;
  channel?: 'Native' | 'WhatsApp';
}

export interface Conversation {
  id: string;
  participants: { 
    id: string; 
    name: string; 
    role: UserRole; 
    avatar?: string;
    phoneNumber?: string; // For WhatsApp Bridge
  }[];
  lastMessage?: Message;
  messages: Message[];
  type: 'Direct' | 'Broadcast' | 'Institutional';
}

export interface AdmissionsCandidate {
  id: string;
  name: string;
  appliedGrade: GradeLevel;
  status: 'Inquiry' | 'Application' | 'Interview' | 'Offered' | 'Enrolled';
  dateApplied: string;
  parentName: string;
  sentimentScore?: number; // 1-100 predicted by AI
  notes: string;
}

export interface BehavioralIncident {
  id: string;
  studentId: string;
  studentName: string;
  type: 'Merit' | 'Demerit';
  points: number;
  category: string;
  description: string;
  date: string;
  reporter: string;
}

export interface MedicalRecord {
  id: string;
  studentId: string;
  studentName: string;
  allergies: string[];
  medications: string[];
  lastVisit: string;
  visitReason?: string;
  criticalInfo?: string;
  immunizationStatus: 'Complete' | 'Partial' | 'Pending';
}

export type AcademicDegree = 'PhD' | 'Master' | 'Bachelor' | 'Diploma' | 'Postgrad';

export enum AssignmentType {
  HOMEWORK = 'Homework',
  QUIZ = 'Quiz',
  EXAM = 'Exam',
  PROJECT = 'Project',
  DISCUSSION = 'Discussion'
}

export enum PlanningModality {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  TERM = 'Term/Semester'
}

export interface LearningMaterial {
  id: string;
  title: string;
  type: 'Video' | 'PDF' | 'Link' | 'Document' | 'Audio';
  url: string;
  description?: string;
  uploadDate: string;
}

export interface LessonPlan {
  id: string;
  modality: PlanningModality;
  title: string;
  objectives: string[];
  content: string;
  dateRange?: string; 
  associatedMaterials: string[];
  status: 'Draft' | 'Published' | 'Archived';
}

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  type: AssignmentType;
  dueDate: string;
  maxPoints: number;
  weight: number; 
  status: 'Active' | 'Upcoming' | 'Draft' | 'Archived';
  resources: string[];
}

export interface LiveSession {
  id: string;
  title: string;
  startTime: string;
  duration: number;
  status: 'Scheduled' | 'Live' | 'Ended';
  joinUrl: string;
  attendeesCount: number;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  plans: LessonPlan[];
  assignments: Assignment[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  teacherName: string;
  gradeLevel: GradeLevel;
  room: string;
  students: string[]; 
  modules: CourseModule[];
  liveSessions: LiveSession[];
  materials: LearningMaterial[];
  bannerColor: string;
  bannerUrl?: string;
}

export interface CurriculumModule { 
  id?: string; 
  weekRange: string; 
  title: string; 
  objectives: string[]; 
  summary: string; 
  standards: string[]; 
  pedagogicalLoad: number; 
  suggestedExercise: string; 
}

export interface Syllabus { 
  id: string; 
  subject: string; 
  gradeLevel: string; 
  standard: string; 
  introduction: string; 
  modules: CurriculumModule[]; 
}

export interface TeacherEvaluation { 
  id: string; 
  teacherName: string; 
  date: string; 
  scores: { planning: number; management: number; assessment: number; professionalism: number; }; 
  feedback: string; 
  status: string; 
  coordinatorId?: string;
}

export interface HRRequest { 
  id: string; 
  staffId: string; 
  staffName: string; 
  type: 'Leave' | 'Expense' | 'Training' | 'Grievance'; 
  description: string;
  status: 'PendingCoord' | 'ApprovedCoord' | 'RejectedCoord' | 'Finalized'; 
  submittedAt: string; 
}

export interface User { id: string; name: string; email: string; role: UserRole; avatar?: string; }

export interface StudentDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: string;
}

export type FinancialStatus = 'Settled' | 'Partial' | 'Overdue' | 'Pending' | 'Void';

export interface Student { 
  id: string; 
  name: string; 
  gradeLevel: GradeLevel; 
  grade: string; 
  gpa: number; 
  status: string;
  lifecycleStatus: StudentLifecycleStatus;
  gender?: string;
  dob?: string;
  email?: string;
  attendance?: number;
  lastPaymentStatus?: FinancialStatus;
  balanceOwed?: number;
  enrollmentDate?: string;
  graduationDate?: string;
  fatherName?: string;
  motherName?: string;
  parentPhone?: string; // WhatsApp Integration
  documents?: StudentDocument[];
  situationalNotes?: string;
}

export type TransactionType = 'Credit' | 'Debit';
export type PaymentMethod = 'Bank Transfer' | 'Cash' | 'Credit Card' | 'Internal Transfer' | 'Digital Wallet';

export interface FinancialTransaction {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  accountCode: string;
  amount: number;
  description: string;
  entityName: string;
  status: FinancialStatus;
  method: PaymentMethod;
}

export interface StaffScheduleEntry {
  day: string;
  time: string;
  subject?: string;
  task?: string;
  room: string;
  class?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  category: StaffCategory;
  department?: string;
  subjects?: string[];
  gradeLevels?: GradeLevel[];
  assignedClasses?: string[];
  assignedZone?: string;
  licenseNumber?: string;
  status: string;
  load: number;
  languages?: string[];
  startDate?: string;
  academicDegree?: AcademicDegree;
  certifications?: string[];
  schedule?: StaffScheduleEntry[];
}

export interface WellnessCase {
  id: string;
  studentName: string;
  studentId: string;
  origin: 'Incident' | 'Self-Referral' | 'Teacher-Referral' | 'Parent-Referral';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Intake' | 'Active' | 'Monitoring' | 'Closed';
  assignedCounselor: string;
  lastUpdate: string;
  category: 'Behavioral' | 'Emotional' | 'Academic' | 'Social';
  notesCount: number;
}

export interface AwarenessCampaign {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  objective: string;
  targetAudience: string[];
  status: 'Planning' | 'Live' | 'Completed';
  reachIndex: number;
}

export interface CounselingDocument {
  id: string;
  title: string;
  type: 'Plan' | 'Report' | 'Observation' | 'Letter' | 'record';
  category: 'Intervention' | 'Academic' | 'Behavioral' | 'Legal';
  author: string;
  createdAt: string;
  status: 'Draft' | 'Finalized' | 'Confidential';
  content: string;
  studentId?: string;
  studentName?: string;
  tags: string[];
  accessLog?: { user: string; date: string; action: string }[];
}

export interface CampusAsset {
  id: string;
  name: string;
  category: string;
  status: 'Functional' | 'Maintenance' | 'Broken';
  location: string;
  value: number;
  lastAudit: string;
  healthIndex: number; // 0-100
  nextMaintenance?: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: 'Available' | 'Borrowed';
  currentHolder?: string;
  dueDate?: string;
}

export interface TransportRoute {
  id: string;
  name: string;
  driver: string;
  driverPhone: string;
  busPlate: string;
  capacity: number;
  occupancy: number;
  stops: string[];
  status: 'On-Route' | 'Idle' | 'Maintenance';
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  type: 'Academic' | 'Sports' | 'Arts' | 'Community';
  scope: 'Global' | 'Tier-Specific';
  targetLevels?: GradeLevel[];
  description: string;
}

export interface CanteenMenu {
  id: string;
  day: string;
  items: {
    name: string;
    calories: number;
    allergens: string[];
    type: 'Veg' | 'Non-Veg';
  }[];
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  type: string;
  status: 'Open' | 'Closed' | 'Draft';
  applicantsCount: number;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  jobId: string;
  jobTitle: string;
  stage: string;
  appliedDate: string;
  score: number;
}

export interface ScheduleEntry {
  id: string;
  day: string;
  time: string;
  subject: string;
  room: string;
  teacher: string;
  teacherId: string;
  grade: string;
  gradeLevel: GradeLevel;
  color: string;
}