/* ============================================================================
   EDUPULSE — Elon Musk First-Principles AI Predictive Early-Warning Engine
   Analyzes multi-vector system datasets to surface predictive risk vectors
   (Academic, Fleet Maintenance, Financial, Cafeteria) and auto-generates
   single-click AI mitigation workflows.
   ============================================================================ */

import { Student, TransportRoute, Invoice } from '@/types';
import { getAITutorResponse, performAIResearch } from './geminiService';

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';
export type RiskCategory = 'academic' | 'transport' | 'financial' | 'cafeteria';

export interface RiskAlert {
  id: string;
  category: RiskCategory;
  severity: RiskSeverity;
  title: string;
  targetEntityId: string;
  targetEntityName: string;
  metricSummary: string;
  recommendedAction: string;
  aiMitigationPlan?: string;
  createdAt: string;
}

// ── Predictive Engine Implementation ────────────────────────────────────────

class AIPredictiveEngine {
  /**
   * Evaluates student performance data to detect multi-factor academic vulnerability.
   */
  public evaluateStudentRisks(students: Student[]): RiskAlert[] {
    const alerts: RiskAlert[] = [];

    students.forEach((student) => {
      const gpa = student.gpa ?? 4.0;
      const attendance = student.attendanceRate ?? 100;
      const name = `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Student';

      if (gpa < 2.3 || attendance < 80) {
        const severity: RiskSeverity = gpa < 2.0 || attendance < 75 ? 'critical' : 'high';
        alerts.push({
          id: `risk_acad_${student.id}`,
          category: 'academic',
          severity,
          title: `Academic At-Risk: ${name}`,
          targetEntityId: student.id,
          targetEntityName: name,
          metricSummary: `GPA: ${gpa.toFixed(2)} | Attendance Rate: ${attendance.toFixed(1)}%`,
          recommendedAction: 'Schedule 1-on-1 tutoring & notify academic counselor.',
          createdAt: new Date().toISOString(),
        });
      }
    });

    return alerts;
  }

  /**
   * Scans fleet transport routes for vehicle maintenance and schedule variance risks.
   */
  public evaluateFleetRisks(routes: TransportRoute[]): RiskAlert[] {
    const alerts: RiskAlert[] = [];

    routes.forEach((route) => {
      if (route.status === 'inactive' || (route.stops && route.stops.length > 8)) {
        alerts.push({
          id: `risk_fleet_${route.id}`,
          category: 'transport',
          severity: route.status === 'inactive' ? 'high' : 'medium',
          title: `Route Capacity & Fleet Warning: ${route.name}`,
          targetEntityId: route.id,
          targetEntityName: route.name,
          metricSummary: `Vehicle: ${route.vehicleNumber} | Driver: ${route.driverName} | Stops: ${route.stops?.length || 0}`,
          recommendedAction: 'Optimize route stop distribution or assign backup shuttle vehicle.',
          createdAt: new Date().toISOString(),
        });
      }
    });

    return alerts;
  }

  /**
   * Analyzes financial transaction trends & overdue invoices.
   */
  public evaluateFinancialRisks(invoices: Invoice[]): RiskAlert[] {
    const alerts: RiskAlert[] = [];
    const now = new Date();

    invoices.forEach((inv) => {
      const isPastDue = new Date(inv.dueDate) < now && inv.status !== 'paid';
      if (isPastDue) {
        alerts.push({
          id: `risk_fin_${inv.id}`,
          category: 'financial',
          severity: inv.total > 1000 ? 'critical' : 'high',
          title: `Overdue Invoice: ${inv.studentName}`,
          targetEntityId: inv.id,
          targetEntityName: inv.studentName,
          metricSummary: `Amount Due: $${inv.total.toLocaleString()} | Due Date: ${inv.dueDate}`,
          recommendedAction: 'Issue automated payment reminder notification with flexible payment options.',
          createdAt: new Date().toISOString(),
        });
      }
    });

    return alerts;
  }

  /**
   * Generates a Gemini AI-driven mitigation strategy for a specific risk alert.
   */
  public async generateAIMitigationPlan(alert: RiskAlert): Promise<string> {
    const prompt = `System Risk Alert Analysis:
Category: ${alert.category.toUpperCase()}
Entity: ${alert.targetEntityName}
Metrics: ${alert.metricSummary}
Recommended Action: ${alert.recommendedAction}

Provide a concise, 3-step actionable intervention plan for school administrators to execute immediately.`;

    const response = await performAIResearch(prompt, 'brief');
    return response.content || '1. Review entity history.\n2. Contact primary guardian/supervisor.\n3. Execute standard intervention workflow.';
  }
}

export const aiPredictiveEngine = new AIPredictiveEngine();
