/* ============================================================================
   EDUPULSE — Supabase Data Access & ORM Bridge Service
   ============================================================================ */

import { supabase, isSupabaseConfigured } from './supabaseClient';

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
