import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Student, Course } from '@/types';
import { storage } from '@/data/storageAdapter';

interface AcademicState {
  students: Student[];
  courses: Course[];
  isLoaded: boolean;
  loadData: () => void;
  addStudent: (student: Student) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  removeStudent: (id: string) => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  removeCourse: (id: string) => void;
  getStudentsByGrade: (grade: string) => Student[];
  getCoursesByTeacher: (teacherId: string) => Course[];
}

export const useAcademicStore = create<AcademicState>()(
  subscribeWithSelector((set, get) => ({
    students: [],
    courses: [],
    isLoaded: false,
    loadData: () => {
      const students = storage.get<Student[]>('students', []);
      const courses = storage.get<Course[]>('courses', []);
      set({ students, courses, isLoaded: true });
    },
    addStudent: (student) => set((state) => ({ students: [...state.students, student] })),
    updateStudent: (id, updates) => set((state) => ({
      students: state.students.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),
    removeStudent: (id) => set((state) => ({ students: state.students.filter((s) => s.id !== id) })),
    addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
    updateCourse: (id, updates) => set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
    removeCourse: (id) => set((state) => ({ courses: state.courses.filter((c) => c.id !== id) })),
    getStudentsByGrade: (grade) => get().students.filter((s) => s.gradeLevel === grade),
    getCoursesByTeacher: (teacherId) => get().courses.filter((c) => c.teacherId === teacherId),
  }))
);

useAcademicStore.subscribe(
  (state) => ({ students: state.students, courses: state.courses }),
  (data) => {
    storage.set('students', data.students);
    storage.set('courses', data.courses);
  }
);
