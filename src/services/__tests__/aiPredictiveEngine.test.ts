import { describe, it, expect } from 'vitest';
import { aiPredictiveEngine } from '../aiPredictiveEngine';

describe('aiPredictiveEngine', () => {
  it('should flag academic at-risk students accurately', () => {
    const mockStudents = [
      {
        id: 'stu_01',
        firstName: 'John',
        lastName: 'Doe',
        gpa: 1.8,
        attendanceRate: 72,
      } as any,
      {
        id: 'stu_02',
        firstName: 'Jane',
        lastName: 'Smith',
        gpa: 3.9,
        attendanceRate: 98,
      } as any,
    ];

    const alerts = aiPredictiveEngine.evaluateStudentRisks(mockStudents);
    expect(alerts.length).toBe(1);
    expect(alerts[0].targetEntityId).toBe('stu_01');
    expect(alerts[0].severity).toBe('critical');
  });

  it('should evaluate transport fleet risks', () => {
    const mockRoutes = [
      {
        id: 'rt_01',
        routeName: 'Route Alpha',
        status: 'inactive',
        stops: [],
      } as any,
    ];

    const alerts = aiPredictiveEngine.evaluateFleetRisks(mockRoutes);
    expect(alerts.length).toBe(1);
    expect(alerts[0].category).toBe('transport');
  });

  it('should evaluate financial overdue invoice risks', () => {
    const pastDate = new Date(Date.now() - 86400000 * 5).toISOString();
    const mockInvoices = [
      {
        id: 'inv_01',
        studentName: 'Bob Brown',
        total: 1250,
        dueDate: pastDate,
        status: 'sent',
      } as any,
    ];

    const alerts = aiPredictiveEngine.evaluateFinancialRisks(mockInvoices);
    expect(alerts.length).toBe(1);
    expect(alerts[0].severity).toBe('critical');
  });
});
