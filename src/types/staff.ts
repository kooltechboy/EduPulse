export type Department = 'administration' | 'academics' | 'finance' | 'hr' | 'it' | 'facilities' | 'health' | 'counseling' | 'library' | 'transport' | 'cafeteria';

export type StaffStatus = 'active' | 'on-leave' | 'terminated';

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: Department;
  position: string;
  hireDate: string;
  qualifications: string[];
  certifications: string[];
  salary: number;
  status: StaffStatus;
  emergencyContact: string;
  photo?: string;
}

export type LeaveType = 'sick' | 'vacation' | 'personal' | 'maternity' | 'paternity' | 'bereavement';
export type LeaveStatus = 'pending' | 'approved' | 'denied';

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  submittedAt: string;
}

export interface Evaluation {
  id: string;
  staffId: string;
  evaluatorId: string;
  period: string;
  scores: Record<string, number>;
  comments: string;
  overallRating: number;
  date: string;
}

export type SubstituteAssignmentStatus = 'pending' | 'assigned' | 'completed' | 'cancelled';

export interface SubstituteAssignment {
  id: string;
  originalTeacherId: string;
  substituteId: string;
  courseId: string;
  date: string;
  status: SubstituteAssignmentStatus;
}
