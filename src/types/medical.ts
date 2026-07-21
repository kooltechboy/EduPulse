export interface MedicalRecord {
  id: string;
  studentId: string;
  studentName: string;
  bloodType: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  emergencyContact: string;
  doctorName: string;
  doctorPhone: string;
  insuranceInfo: string;
  lastCheckup: string;
  notes?: string;
}

export type HealthIncidentType = 'injury' | 'illness' | 'allergic-reaction' | 'other';
export type HealthIncidentSeverity = 'minor' | 'moderate' | 'severe';

export interface HealthIncident {
  id: string;
  studentId: string;
  studentName: string;
  type: HealthIncidentType;
  description: string;
  severity: HealthIncidentSeverity;
  treatment: string;
  date: string;
  reportedBy: string;
  parentNotified: boolean;
  followUp?: string;
}

export interface ImmunizationRecord {
  id: string;
  studentId: string;
  vaccineName: string;
  dateAdministered: string;
  nextDueDate?: string;
  provider: string;
  notes?: string;
}
