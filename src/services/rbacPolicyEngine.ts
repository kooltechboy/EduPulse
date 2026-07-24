/* ============================================================================
   EDUPULSE — NASA Zero-Trust RBAC Policy & Security Audit Engine
   Enforces centralized capability authorization rules and records security
   telemetry for privilege escalation attempts.
   ============================================================================ */

import { UserRole } from '@/stores/authStore';

export type Capability =
  | 'view_dashboard'
  | 'manage_students'
  | 'manage_staff'
  | 'grade_assignments'
  | 'manage_finance'
  | 'manage_settings'
  | 'access_mission_control'
  | 'export_audit_logs';

const ROLE_CAPABILITY_MATRIX: Record<UserRole, Set<Capability>> = {
  admin: new Set<Capability>([
    'view_dashboard',
    'manage_students',
    'manage_staff',
    'grade_assignments',
    'manage_finance',
    'manage_settings',
    'access_mission_control',
    'export_audit_logs',
  ]),
  coordinator: new Set<Capability>([
    'view_dashboard',
    'manage_students',
    'manage_staff',
    'grade_assignments',
    'access_mission_control',
  ]),
  teacher: new Set<Capability>([
    'view_dashboard',
    'manage_students',
    'grade_assignments',
  ]),
  parent: new Set<Capability>([
    'view_dashboard',
  ]),
  student: new Set<Capability>([
    'view_dashboard',
  ]),
};

export interface SecurityViolationLog {
  id: string;
  timestamp: string;
  userRole: UserRole;
  attemptedCapability: Capability;
  resourceContext?: string;
  resolvedAction: 'denied_and_logged';
}

// ── Policy Engine Implementation ────────────────────────────────────────────

class RBACPolicyEngine {
  private violationLogs: SecurityViolationLog[] = [];

  public can(role: UserRole | undefined, capability: Capability, resourceContext?: string): boolean {
    if (!role) return false;

    const capabilities = ROLE_CAPABILITY_MATRIX[role];
    const isAllowed = capabilities ? capabilities.has(capability) : false;

    if (!isAllowed) {
      this.recordViolation(role, capability, resourceContext);
    }

    return isAllowed;
  }

  public getViolationLogs(): SecurityViolationLog[] {
    return [...this.violationLogs];
  }

  public clearViolationLogs(): void {
    this.violationLogs = [];
  }

  private recordViolation(userRole: UserRole, capability: Capability, resourceContext?: string): void {
    const violation: SecurityViolationLog = {
      id: `sec_viol_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      userRole,
      attemptedCapability: capability,
      resourceContext,
      resolvedAction: 'denied_and_logged',
    };
    this.violationLogs.push(violation);
    console.warn(`[RBAC Zero-Trust Violation]: Role '${userRole}' attempted unauthorized capability '${capability}' context: ${resourceContext || 'N/A'}`);
  }
}

export const rbacPolicyEngine = new RBACPolicyEngine();
