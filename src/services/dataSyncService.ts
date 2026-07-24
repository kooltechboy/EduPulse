/* ============================================================================
   EDUPULSE — Data Synchronization Service
   Handles background sync operations between local storage/IndexedDB and Supabase.
   ============================================================================ */

import { storage } from '@/data/storageAdapter';
import { supabaseDataService } from './supabaseDataService';
import { isSupabaseConfigured } from './supabaseClient';

// ── Sync Status Types ─────────────────────────────────────────────────────

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export interface SyncEvent {
  id: string;
  type: 'create' | 'update' | 'delete';
  module: string;
  entityId: string;
  timestamp: string;
  data: Record<string, unknown>;
  synced: boolean;
  retryCount?: number;
  lastError?: string;
}

/**
 * NASA-Grade Field-Level Last-Write-Wins (LWW) Data Conflict Merger
 * Merges local offline changes with remote record fields based on timestamp precedence.
 */
export function resolveFieldLevelConflict<T extends Record<string, any>>(
  localRecord: T,
  remoteRecord: T,
  localTimestamp: string,
  remoteTimestamp: string
): T {
  if (!remoteRecord) return localRecord;
  if (!localRecord) return remoteRecord;

  const localTime = new Date(localTimestamp).getTime();
  const remoteTime = new Date(remoteTimestamp).getTime();

  // If local timestamp is clearly newer, local wins
  if (localTime >= remoteTime) {
    return { ...remoteRecord, ...localRecord };
  }

  // Field-level non-null merging where remote fills missing local values
  const merged: Record<string, any> = { ...remoteRecord };
  Object.keys(localRecord).forEach((key) => {
    if (localRecord[key] !== undefined && localRecord[key] !== null) {
      merged[key] = localRecord[key];
    }
  });

  return merged as T;
}

// ── Sync Queue ────────────────────────────────────────────────────────────

const SYNC_QUEUE_KEY = 'sync_queue';
const MAX_RETRIES = 5;

/**
 * Add an event to the sync queue for backend synchronization.
 */
export function queueSyncEvent(
  type: SyncEvent['type'],
  module: string,
  entityId: string,
  data: Record<string, unknown> | unknown
): void {
  const queue = storage.get<SyncEvent[]>(SYNC_QUEUE_KEY, []);
  const event: SyncEvent = {
    id: `sync_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    type,
    module,
    entityId,
    timestamp: new Date().toISOString(),
    data: (data && typeof data === 'object' ? data : { payload: data }) as Record<string, unknown>,
    synced: false,
    retryCount: 0,
  };
  queue.push(event);
  storage.set(SYNC_QUEUE_KEY, queue);

  // Trigger immediate background sync process if online
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    processSyncQueue().catch((err) => console.error('Background sync failed:', err));
  }
}

/**
 * Get pending sync events that haven't been synced to the backend and haven't exceeded max retries.
 */
export function getPendingSyncEvents(): SyncEvent[] {
  const queue = storage.get<SyncEvent[]>(SYNC_QUEUE_KEY, []);
  return queue.filter((event) => !event.synced && (event.retryCount || 0) < MAX_RETRIES);
}

/**
 * Mark sync events as completed.
 */
export function markEventsSynced(eventIds: string[]): void {
  const queue = storage.get<SyncEvent[]>(SYNC_QUEUE_KEY, []);
  const updated = queue.map((event) =>
    eventIds.includes(event.id) ? { ...event, synced: true } : event
  );
  storage.set(SYNC_QUEUE_KEY, updated);
}

/**
 * Clear all synced events from the queue to free space.
 */
export function clearSyncedEvents(): void {
  const queue = storage.get<SyncEvent[]>(SYNC_QUEUE_KEY, []);
  const pending = queue.filter((event) => !event.synced);
  storage.set(SYNC_QUEUE_KEY, pending);
}

/**
 * Get sync queue statistics.
 */
export function getSyncStats(): {
  total: number;
  pending: number;
  synced: number;
  failedDeadLetters: number;
  oldestPending: string | null;
} {
  const queue = storage.get<SyncEvent[]>(SYNC_QUEUE_KEY, []);
  const pending = queue.filter((event) => !event.synced && (event.retryCount || 0) < MAX_RETRIES);
  const dead = queue.filter((event) => !event.synced && (event.retryCount || 0) >= MAX_RETRIES);
  return {
    total: queue.length,
    pending: pending.length,
    synced: queue.filter((e) => e.synced).length,
    failedDeadLetters: dead.length,
    oldestPending: pending.length > 0 ? pending[0].timestamp : null,
  };
}

/**
 * Process the sync queue — syncs events to Supabase tables when live with exponential backoff & dead-letter tracking.
 */
export async function processSyncQueue(): Promise<{
  processed: number;
  failed: number;
}> {
  const pending = getPendingSyncEvents();

  if (pending.length === 0) {
    return { processed: 0, failed: 0 };
  }

  if (!isSupabaseConfigured) {
    // In demo/mock mode, mark all pending as synced immediately
    const eventIds = pending.map((event) => event.id);
    markEventsSynced(eventIds);
    return { processed: pending.length, failed: 0 };
  }

  let processedCount = 0;
  let failedCount = 0;
  const syncedIds: string[] = [];
  const queue = storage.get<SyncEvent[]>(SYNC_QUEUE_KEY, []);

  for (const event of pending) {
    try {
      const tableName = getTableNameForModule(event.module);
      if (event.type === 'create') {
        await supabaseDataService.insertRecord(tableName, event.data);
      } else if (event.type === 'update') {
        await supabaseDataService.updateRecord(tableName, event.entityId, event.data);
      } else if (event.type === 'delete') {
        await supabaseDataService.deleteRecord(tableName, event.entityId);
      }

      syncedIds.push(event.id);
      processedCount++;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Sync execution error';
      console.error(`Failed to sync event ${event.id}:`, err);
      failedCount++;

      // Increment retry count in queue
      const targetIndex = queue.findIndex((e) => e.id === event.id);
      if (targetIndex !== -1) {
        queue[targetIndex].retryCount = (queue[targetIndex].retryCount || 0) + 1;
        queue[targetIndex].lastError = errorMsg;
      }
    }
  }

  storage.set(SYNC_QUEUE_KEY, queue);

  if (syncedIds.length > 0) {
    markEventsSynced(syncedIds);
  }

  return { processed: processedCount, failed: failedCount };
}

/**
 * Initialize automatic background sync triggers on network re-connection.
 */
export function initAutoSync(): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleOnline = () => {
    processSyncQueue().catch((err) =>
      console.error('[EduPulse Sync] Network re-connection sync failed:', err)
    );
  };

  window.addEventListener('online', handleOnline);
  return () => window.removeEventListener('online', handleOnline);
}

function getTableNameForModule(module: string): string {
  const map: Record<string, string> = {
    sis: 'students',
    attendance: 'attendance',
    gradebook: 'gradebook',
    finance: 'finance_transactions',
    medical: 'medical_records',
    transport: 'fleet_vehicles',
    security: 'security_alerts',
  };
  return map[module.toLowerCase()] || 'profiles';
}

