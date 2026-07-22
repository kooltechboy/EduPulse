import { describe, it, expect, beforeEach } from 'vitest';
import { useAcademicStore } from '../academicStore';
import { storage } from '@/data/storageAdapter';

describe('academicStore', () => {
  beforeEach(() => {
    storage.clear();
    useAcademicStore.getState().loadData();
  });

  it('should load initial demo students and courses', () => {
    const state = useAcademicStore.getState();
    expect(state.isLoaded).toBe(true);
  });

  it('should add a student and update grade list filtering', () => {
    useAcademicStore.getState().addStudent({
      id: 'stu_test_999',
      firstName: 'Elon',
      lastName: 'Musk',
      dateOfBirth: '2008-06-28',
      gradeLevel: 'grade-12',
      tier: 'high-school',
      section: 'A',
      guardianName: 'Errol Musk',
      guardianPhone: '555-0199',
      guardianEmail: 'errol@musk.com',
      address: 'Boca Chica, TX',
      enrollmentDate: '2026-01-01',
      status: 'active',
      gpa: 4.0,
      attendanceRate: 99.5,
      documents: [],
    });

    const grade12Students = useAcademicStore.getState().getStudentsByGrade('grade-12');
    expect(grade12Students.some((s) => s.id === 'stu_test_999')).toBe(true);
  });

  it('should mark attendance records correctly', () => {
    const record = {
      id: 'att_001',
      studentId: 'stu_test_999',
      courseId: 'crs_101',
      date: '2026-07-22',
      status: 'present' as const,
      markedBy: 'Prof. Chen',
    };

    useAcademicStore.getState().markAttendance(record);
    const dayRecords = useAcademicStore.getState().getAttendanceByDate('2026-07-22');
    expect(dayRecords.some((r) => r.studentId === 'stu_test_999')).toBe(true);
  });

  it('should update assignment submission grades', () => {
    const submissionId = 'sub_test_01';
    useAcademicStore.getState().addSubmission({
      id: submissionId,
      assignmentId: 'asg_101',
      studentId: 'stu_test_999',
      studentName: 'Elon Musk',
      submittedAt: '2026-07-22T00:00:00Z',
      status: 'pending',
      attachments: [],
    });

    useAcademicStore.getState().gradeSubmission(submissionId, 98, 'Excellent first principles reasoning');
    const updated = useAcademicStore.getState().submissions.find((s) => s.id === submissionId);
    expect(updated?.grade).toBe(98);
    expect(updated?.status).toBe('graded');
    expect(updated?.feedback).toBe('Excellent first principles reasoning');
  });
});
