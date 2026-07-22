export type GradeLevel = 
  | 'pre-k' 
  | 'kindergarten' 
  | 'grade-1' | 'grade-2' | 'grade-3' | 'grade-4' | 'grade-5' | 'grade-6' 
  | 'grade-7' | 'grade-8' | 'grade-9' 
  | 'grade-10' | 'grade-11' | 'grade-12' 
  | 'undergraduate-yr1' | 'undergraduate-yr2' | 'undergraduate-yr3' | 'undergraduate-yr4' 
  | 'postgraduate';

export type Tier = 'early-childhood' | 'elementary' | 'middle-school' | 'high-school' | 'higher-education';

export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gradeLevel: GradeLevel;
  tier: Tier;
  section: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  address: string;
  enrollmentDate: string;
  status: StudentStatus;
  gpa: number;
  attendanceRate: number;
  medicalNotes?: string;
  photo?: string;
  documents: StudentDocument[];
}

export type CourseStatus = 'active' | 'archived';

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  tier: Tier;
  gradeLevel: GradeLevel;
  teacherId: string;
  teacherName: string;
  schedule: string;
  students: string[];
  syllabus?: string;
  maxCapacity: number;
  room: string;
  status: CourseStatus;
}

export type AssignmentType = 'quiz' | 'homework' | 'test' | 'project' | 'essay';

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: AssignmentType;
  dueDate: string;
  totalPoints: number;
  weight: number;
  submissions: Submission[];
  createdAt: string;
}

export type SubmissionStatus = 'pending' | 'graded' | 'late' | 'missing';

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  status: SubmissionStatus;
  attachments: string[];
}

export interface Grade {
  studentId: string;
  courseId: string;
  assignmentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade: string;
  feedback?: string;
  gradedAt: string;
  gradedBy: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
  markedBy: string;
}

export interface LessonPlan {
  id: string;
  courseId: string;
  title: string;
  objectives: string[];
  content: string;
  resources: string[];
  duration: number;
  date: string;
  activities: string;
}

export interface StudentDocument {
  id: string;
  studentId: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  size: number;
}
