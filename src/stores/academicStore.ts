import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Student, Course, Assignment, Submission, AttendanceRecord, LessonPlan, AdmissionApplication } from '@/types';
import { storage } from '@/data/storageAdapter';
import { useUIStore } from '@/stores/uiStore';

const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
  const uiStore = useUIStore.getState();
  if (uiStore.addToast) uiStore.addToast({ title, message, type });
};

interface AcademicState {
  students: Student[];
  courses: Course[];
  assignments: Assignment[];
  submissions: Submission[];
  attendanceRecords: AttendanceRecord[];
  lessonPlans: LessonPlan[];
  admissions: AdmissionApplication[];
  isLoaded: boolean;
  loadData: () => void;
  addStudent: (student: Student) => void;
  addAdmission: (admission: any) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  removeStudent: (id: string) => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  removeCourse: (id: string) => void;
  getStudentsByGrade: (grade: string) => Student[];
  getCoursesByTeacher: (teacherId: string) => Course[];
  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  removeAssignment: (id: string) => void;
  addSubmission: (submission: Submission) => void;
  gradeSubmission: (id: string, grade: number, feedback?: string) => void;
  markAttendance: (record: AttendanceRecord) => void;
  bulkMarkAttendance: (records: AttendanceRecord[]) => void;
  getAttendanceByDate: (date: string) => AttendanceRecord[];
  addLessonPlan: (plan: LessonPlan) => void;
  updateLessonPlan: (id: string, updates: Partial<LessonPlan>) => void;
  addApplication: (app: AdmissionApplication) => void;
  updateApplicationStage: (id: string, stage: AdmissionApplication['stage']) => void;
  approveApplication: (id: string) => void;
  rejectApplication: (id: string) => void;
}

export const useAcademicStore = create<AcademicState>()(
  subscribeWithSelector((set, get) => ({
    students: [],
    courses: [],
    assignments: [],
    submissions: [],
    attendanceRecords: [],
    lessonPlans: [],
    admissions: [],
    isLoaded: false,
    loadData: () => {
      const students = storage.get<Student[]>('students', []);
      const courses = storage.get<Course[]>('courses', []);
      const assignments = storage.get<Assignment[]>('assignments', []);
      const submissions = storage.get<Submission[]>('submissions', []);
      const attendanceRecords = storage.get<AttendanceRecord[]>('attendanceRecords', []);
      const lessonPlans = storage.get<LessonPlan[]>('lessonPlans', []);
      const admissions = storage.get<AdmissionApplication[]>('admissions', []);
      set({ students, courses, assignments, submissions, attendanceRecords, lessonPlans, admissions, isLoaded: true });
    },
    addStudent: (student) => {
      set((state) => ({ students: [...state.students, student] }));
      showToast('Success', 'Student added successfully');
    },
    addAdmission: (admission) => set((state) => {
      const newStudent = { id: Date.now().toString(), ...admission, joinedAt: new Date().toISOString(), gpa: 0, attendance: 100 };
      return { students: [...state.students, newStudent] };
    }),
    updateStudent: (id, updates) => {
      set((state) => ({
        students: state.students.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      }));
      showToast('Success', 'Student updated successfully');
    },
    removeStudent: (id) => {
      set((state) => ({ students: state.students.filter((s) => s.id !== id) }));
      showToast('Success', 'Student removed successfully');
    },
    addCourse: (course) => {
      set((state) => ({ courses: [...state.courses, course] }));
      showToast('Success', 'Course added successfully');
    },
    updateCourse: (id, updates) => {
      set((state) => ({
        courses: state.courses.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      }));
      showToast('Success', 'Course updated successfully');
    },
    removeCourse: (id) => {
      set((state) => ({ courses: state.courses.filter((c) => c.id !== id) }));
      showToast('Success', 'Course removed successfully');
    },
    getStudentsByGrade: (grade) => get().students.filter((s) => s.gradeLevel === grade),
    getCoursesByTeacher: (teacherId) => get().courses.filter((c) => c.teacherId === teacherId),
    addAssignment: (assignment) => {
      set((state) => ({ assignments: [...state.assignments, assignment] }));
      showToast('Success', 'Assignment added successfully');
    },
    updateAssignment: (id, updates) => {
      set((state) => ({ assignments: state.assignments.map(a => a.id === id ? { ...a, ...updates } : a) }));
      showToast('Success', 'Assignment updated successfully');
    },
    removeAssignment: (id) => {
      set((state) => ({ assignments: state.assignments.filter(a => a.id !== id) }));
      showToast('Success', 'Assignment removed successfully');
    },
    addSubmission: (submission) => {
      set((state) => ({ submissions: [...state.submissions, submission] }));
      showToast('Success', 'Submission added successfully');
    },
    gradeSubmission: (id, grade, feedback) => {
      set((state) => ({
        submissions: state.submissions.map((s) =>
          s.id === id
            ? { ...s, grade, feedback, status: 'graded', gradedAt: new Date().toISOString() }
            : s
        ),
      }));
      showToast('Success', 'Submission graded successfully');
    },
    markAttendance: (record) => {
      set((state) => ({ attendanceRecords: [...state.attendanceRecords, record] }));
      showToast('Success', 'Attendance marked');
    },
    bulkMarkAttendance: (records) => {
      set((state) => ({ attendanceRecords: [...state.attendanceRecords, ...records] }));
      showToast('Success', 'Bulk attendance marked');
    },
    getAttendanceByDate: (date) => get().attendanceRecords.filter(r => r.date === date),
    addLessonPlan: (plan) => {
      set((state) => ({ lessonPlans: [...state.lessonPlans, plan] }));
      showToast('Success', 'Lesson plan added');
    },
    updateLessonPlan: (id, updates) => {
      set((state) => ({ lessonPlans: state.lessonPlans.map(p => p.id === id ? { ...p, ...updates } : p) }));
      showToast('Success', 'Lesson plan updated');
    },
    addApplication: (app) => {
      set((state) => ({ admissions: [...state.admissions, app] }));
      showToast('Success', 'Application submitted');
    },
    updateApplicationStage: (id, stage) => {
      set((state) => ({ admissions: state.admissions.map(a => a.id === id ? { ...a, stage } : a) }));
      showToast('Success', `Application moved to ${stage}`);
    },
    approveApplication: (id) => {
      set((state) => ({ admissions: state.admissions.map(a => a.id === id ? { ...a, stage: 'accepted' } : a) }));
      showToast('Success', 'Application approved');
    },
    rejectApplication: (id) => {
      set((state) => ({ admissions: state.admissions.map(a => a.id === id ? { ...a, stage: 'rejected' } : a) }));
      showToast('Success', 'Application rejected');
    },
  }))
);

useAcademicStore.subscribe(
  (state) => ({ 
    students: state.students, 
    courses: state.courses,
    assignments: state.assignments,
    submissions: state.submissions,
    attendanceRecords: state.attendanceRecords,
    lessonPlans: state.lessonPlans,
    admissions: state.admissions,
  }),
  (data) => {
    storage.set('students', data.students);
    storage.set('courses', data.courses);
    storage.set('assignments', data.assignments);
    storage.set('submissions', data.submissions);
    storage.set('attendanceRecords', data.attendanceRecords);
    storage.set('lessonPlans', data.lessonPlans);
    storage.set('admissions', data.admissions);
  }
);
