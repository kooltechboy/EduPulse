/* ============================================================================
   EDUPULSE — Supabase Data Access & ORM Bridge Service
   ============================================================================ */

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { 
  Student, AttendanceRecord, GradebookEntry, 
  FinanceTransaction, Invoice, MedicalRecord 
} from '@/types';

export interface DataQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  ascending?: boolean;
}

export const supabaseDataService = {
  async fetchTable<T>(tableName: string, options: DataQueryOptions = {}): Promise<{ data: T[] | null; error: Error | null }> {
    if (!isSupabaseConfigured) {
      return { data: [], error: null };
    }

    try {
      let query = supabase.from(tableName).select('*');

      if (options.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending ?? true });
      }
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: data as T[], error: null };
    } catch (err: any) {
      console.error(`Error fetching table ${tableName}:`, err);
      return { data: null, error: err };
    }
  },

  async insertRecord<T>(tableName: string, record: Partial<T>): Promise<{ data: T | null; error: Error | null }> {
    if (!isSupabaseConfigured) {
      return { data: record as T, error: null };
    }

    try {
      const { data, error } = await supabase.from(tableName).insert(record as any).select().single();
      if (error) throw error;
      return { data: data as T, error: null };
    } catch (err: any) {
      console.error(`Error inserting into ${tableName}:`, err);
      return { data: null, error: err };
    }
  },

  async updateRecord<T>(tableName: string, id: string, updates: Partial<T>): Promise<{ data: T | null; error: Error | null }> {
    if (!isSupabaseConfigured) {
      return { data: { id, ...updates } as unknown as T, error: null };
    }

    try {
      const { data, error } = await supabase.from(tableName).update(updates as any).eq('id', id).select().single();
      if (error) throw error;
      return { data: data as T, error: null };
    } catch (err: any) {
      console.error(`Error updating ${tableName} record ${id}:`, err);
      return { data: null, error: err };
    }
  },

  async deleteRecord(tableName: string, id: string): Promise<{ success: boolean; error: Error | null }> {
    if (!isSupabaseConfigured) {
      return { success: true, error: null };
    }

    try {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
      return { success: true, error: null };
    } catch (err: any) {
      console.error(`Error deleting ${tableName} record ${id}:`, err);
      return { success: false, error: err };
    }
  },

  subscribeToTable(tableName: string, onUpdate: (payload: any) => void) {
    if (!isSupabaseConfigured) return () => {};

    const channel = supabase
      .channel(`public:${tableName}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        (payload) => onUpdate(payload)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};

// ============================================================================
// Domain Specific Functions
// ============================================================================

// Students
export async function fetchStudents(tenantId: string): Promise<Student[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase.from('students').select('*').eq('tenant_id', tenantId);
    if (error) throw error;
    return data as Student[];
  } catch (err: any) {
    console.error('Error fetching students:', err);
    return [];
  }
}

export async function upsertStudent(student: Partial<Student> & { tenant_id: string }): Promise<Student | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('students').upsert(student).select().single();
    if (error) throw error;
    return data as Student;
  } catch (err: any) {
    console.error('Error upserting student:', err);
    return null;
  }
}

export async function deleteStudent(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) throw error;
  } catch (err: any) {
    console.error(`Error deleting student ${id}:`, err);
  }
}

// Attendance
export async function fetchAttendance(classId: string, date: string): Promise<AttendanceRecord[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase.from('attendance').select('*').eq('class_id', classId).eq('date', date);
    if (error) throw error;
    return data as AttendanceRecord[];
  } catch (err: any) {
    console.error('Error fetching attendance:', err);
    return [];
  }
}

export async function upsertAttendanceRecord(record: Partial<AttendanceRecord> & { tenant_id: string }): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('attendance').upsert(record);
    if (error) throw error;
  } catch (err: any) {
    console.error('Error upserting attendance:', err);
  }
}

// Gradebook
export async function fetchGradebook(classId: string): Promise<GradebookEntry[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase.from('gradebook').select('*').eq('class_id', classId);
    if (error) throw error;
    return data as GradebookEntry[];
  } catch (err: any) {
    console.error('Error fetching gradebook:', err);
    return [];
  }
}

export async function upsertGrade(entry: Partial<GradebookEntry> & { tenant_id: string }): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('gradebook').upsert(entry);
    if (error) throw error;
  } catch (err: any) {
    console.error('Error upserting grade:', err);
  }
}

// Finance
export async function fetchTransactions(tenantId: string): Promise<FinanceTransaction[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase.from('finance_transactions').select('*').eq('tenant_id', tenantId);
    if (error) throw error;
    return data as FinanceTransaction[];
  } catch (err: any) {
    console.error('Error fetching transactions:', err);
    return [];
  }
}

export async function upsertTransaction(tx: any): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('finance_transactions').upsert(tx);
    if (error) throw error;
  } catch (err: any) {
    console.error('Error upserting transaction:', err);
  }
}

export async function fetchInvoices(tenantId: string): Promise<Invoice[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase.from('invoices').select('*').eq('tenant_id', tenantId);
    if (error) throw error;
    return data as Invoice[];
  } catch (err: any) {
    console.error('Error fetching invoices:', err);
    return [];
  }
}

export async function upsertInvoice(invoice: any): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('invoices').upsert(invoice);
    if (error) throw error;
  } catch (err: any) {
    console.error('Error upserting invoice:', err);
  }
}

// Medical (strict)
export async function fetchMedicalRecord(studentId: string): Promise<MedicalRecord | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('medical_records').select('*').eq('student_id', studentId).single();
    if (error) throw error;
    return data as MedicalRecord;
  } catch (err: any) {
    console.error('Error fetching medical record:', err);
    return null;
  }
}

export async function upsertMedicalRecord(record: any): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('medical_records').upsert(record);
    if (error) throw error;
  } catch (err: any) {
    console.error('Error upserting medical record:', err);
  }
}

// Fleet
export async function fetchFleetVehicles(tenantId: string): Promise<any[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase.from('fleet_vehicles').select('*').eq('tenant_id', tenantId);
    if (error) throw error;
    return data as any[];
  } catch (err: any) {
    console.error('Error fetching fleet vehicles:', err);
    return [];
  }
}

export async function updateVehicleLocation(vehicleId: string, lat: number, lng: number): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('fleet_vehicles').update({ location_lat: lat, location_lng: lng }).eq('id', vehicleId);
    if (error) throw error;
  } catch (err: any) {
    console.error('Error updating vehicle location:', err);
  }
}

// Security
export async function fetchSecurityAlerts(tenantId: string): Promise<any[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase.from('security_alerts').select('*').eq('tenant_id', tenantId);
    if (error) throw error;
    return data as any[];
  } catch (err: any) {
    console.error('Error fetching security alerts:', err);
    return [];
  }
}

export async function insertSecurityAlert(alert: any): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('security_alerts').insert(alert);
    if (error) throw error;
  } catch (err: any) {
    console.error('Error inserting security alert:', err);
  }
}

// Realtime subscriptions
export function subscribeToAttendance(callback: (payload: any) => void): () => void {
  if (!isSupabaseConfigured) return () => {};
  const channel = supabase.channel('public:attendance')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, callback)
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

export function subscribeToSecurityAlerts(callback: (payload: any) => void): () => void {
  if (!isSupabaseConfigured) return () => {};
  const channel = supabase.channel('public:security_alerts')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'security_alerts' }, callback)
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

export function subscribeToFleet(callback: (payload: any) => void): () => void {
  if (!isSupabaseConfigured) return () => {};
  const channel = supabase.channel('public:fleet_vehicles')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'fleet_vehicles' }, callback)
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}
