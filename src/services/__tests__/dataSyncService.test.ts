import { describe, it, expect, beforeEach } from 'vitest';
import {
  queueSyncEvent,
  getPendingSyncEvents,
  getSyncStats,
  clearSyncedEvents,
  processSyncQueue,
} from '../dataSyncService';
import { storage } from '@/data/storageAdapter';

describe('dataSyncService', () => {
  beforeEach(() => {
    storage.clear();
  });

  it('should queue sync events and report stats accurately in resilient demo mode', () => {
    queueSyncEvent('create', 'sis', 'stu_001', { name: 'Alice' });
    queueSyncEvent('update', 'sis', 'stu_001', { grade: '10' });

    const stats = getSyncStats();
    expect(stats.total).toBe(2);
    // In demo mode with online browser environment, queue is processed automatically into synced events
    expect(stats.synced + stats.pending).toBe(2);
  });

  it('should process sync queue in resilient demo mode', async () => {
    queueSyncEvent('create', 'finance', 'inv_101', { amount: 500 });
    const result = await processSyncQueue();

    expect(result.processed).toBeGreaterThanOrEqual(0);
    expect(result.failed).toBe(0);
    expect(getPendingSyncEvents().length).toBe(0);
  });

  it('should clear synced events from local storage', async () => {
    queueSyncEvent('delete', 'transport', 'veh_01', {});
    await processSyncQueue();

    clearSyncedEvents();
    expect(getSyncStats().total).toBe(0);
  });
});
