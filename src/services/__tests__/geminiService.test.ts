import { describe, it, expect } from 'vitest';
import {
  getAITutorResponse,
  performAIResearch,
  getPerformanceInsights,
  generateLessonPlan,
  isAIAvailable,
} from '../geminiService';

describe('geminiService', () => {
  it('should confirm AI service availability', () => {
    expect(isAIAvailable()).toBe(true);
  });

  it('should return resilient demo response for AI Tutor queries when API key is unconfigured', async () => {
    const res = await getAITutorResponse('What is photosynthesis?', 'Biology', '9th Grade');
    expect(res.success).toBe(true);
    expect(res.content).toContain('EduPulse AI Demo Response');
    expect(res.content).toContain('synthesized intelligence analysis');
  });

  it('should return structured response for AI Research requests', async () => {
    const res = await performAIResearch('Quantum Computing', 'brief');
    expect(res.success).toBe(true);
    expect(res.content.length).toBeGreaterThan(20);
  });

  it('should analyze student performance data', async () => {
    const res = await getPerformanceInsights({
      studentCount: 120,
      averageGpa: 3.65,
      attendanceRate: 96.4,
    });
    expect(res.success).toBe(true);
    expect(res.content).toBeDefined();
  });

  it('should generate lesson plan content', async () => {
    const res = await generateLessonPlan('Physics', 'Newton Laws', '11th Grade', '45 min');
    expect(res.success).toBe(true);
    expect(res.content).toContain('EduPulse AI Demo Response');
  });
});
