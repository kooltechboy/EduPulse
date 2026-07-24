import { describe, it, expect, beforeEach } from 'vitest';
import { rbacPolicyEngine } from '../rbacPolicyEngine';

describe('rbacPolicyEngine', () => {
  beforeEach(() => {
    rbacPolicyEngine.clearViolationLogs();
  });

  it('should allow admin all capabilities', () => {
    expect(rbacPolicyEngine.can('admin', 'access_mission_control')).toBe(true);
    expect(rbacPolicyEngine.can('admin', 'manage_finance')).toBe(true);
    expect(rbacPolicyEngine.getViolationLogs().length).toBe(0);
  });

  it('should restrict student capabilities and log security violation', () => {
    expect(rbacPolicyEngine.can('student', 'manage_finance', 'FinanceView')).toBe(false);
    
    const logs = rbacPolicyEngine.getViolationLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].userRole).toBe('student');
    expect(logs[0].attemptedCapability).toBe('manage_finance');
    expect(logs[0].resourceContext).toBe('FinanceView');
  });

  it('should handle undefined role safely', () => {
    expect(rbacPolicyEngine.can(undefined, 'view_dashboard')).toBe(false);
  });
});
