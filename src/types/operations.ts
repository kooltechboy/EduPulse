// ============================================================================
// EDUVERSE OS — Operations Domain Types
// Covers: Finance, Behavior/PBIS, Counseling, Admissions, Gradebook
// ============================================================================

// ── Finance ──────────────────────────────────────────────────────────────────
// FinanceTransaction, Transaction, Invoice, InvoiceItem, etc. are defined in finance.ts
// and re-exported via src/types/index.ts


// ── Behavior / PBIS ──────────────────────────────────────────────────────────

export type ConductType = 'merit' | 'demerit';

export interface ConductRecord {
  id: string;
  date: string;
  student: string;
  studentId: string;
  type: ConductType;
  category: string;
  points: number;
  reportedBy: string;
  notes?: string;
}

export interface HousePoint {
  houseName: string;
  totalPoints: number;
  color: string;
}

// ── Counseling ────────────────────────────────────────────────────────────────

export type CounselingCaseType = 'academic' | 'behavioral' | 'emotional' | 'career';
export type CounselingCaseStatus = 'open' | 'in-progress' | 'closed';
export type CounselingPriority = 'low' | 'medium' | 'high';

export interface CounselingSession {
  id: string;
  caseId: string;
  sessionDate: string;
  durationMinutes: number;
  notes: string;
  createdAt: string;
}

export interface CounselingCase {
  id: string;
  studentId: string;
  studentName: string;
  counselorId: string;
  type: CounselingCaseType;
  status: CounselingCaseStatus;
  priority: CounselingPriority;
  openedAt: string;
  notes: string;
  sessions: CounselingSession[];
}

// ── Admissions ───────────────────────────────────────────────────────────────

export type AdmissionStage =
  | 'inquiry'
  | 'applied'
  | 'review'
  | 'accepted'
  | 'enrolled'
  | 'rejected';

export interface AdmissionApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  appliedGrade: string;
  stage: AdmissionStage;
  submittedAt: string;
  documents: string[];
  notes?: string;
  guardianName: string;
  guardianPhone: string;
}

// ── Gradebook ─────────────────────────────────────────────────────────────────

export interface GradebookEntry {
  id: string;
  tenantId: string;
  classId: string;
  studentId: string;
  assignmentName: string;
  score: number;
  maxScore: number;
  category: string;
  gradedAt: string;
}
