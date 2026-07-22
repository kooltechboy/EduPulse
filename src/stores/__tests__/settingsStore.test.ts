import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from '../settingsStore';
import { storage } from '@/data/storageAdapter';

describe('settingsStore', () => {
  beforeEach(() => {
    storage.clear();
    useSettingsStore.getState().loadData();
  });

  it('should initialize with default school profile and classrooms', () => {
    const state = useSettingsStore.getState();
    expect(state.schoolProfile.name).toBe('EduPulse International Academy');
    expect(state.classrooms.length).toBeGreaterThan(0);
  });

  it('should add a new classroom and append audit log', () => {
    const initialCount = useSettingsStore.getState().classrooms.length;
    useSettingsStore.getState().addClassroom({
      roomNumber: '999',
      name: 'Innovation & Robotics Lab',
      building: 'Tech Wing',
      floor: 3,
      capacity: 25,
      roomType: 'computer-lab',
      equipment: ['3D Printers', 'Robotics Kits'],
      status: 'available',
    });

    const state = useSettingsStore.getState();
    expect(state.classrooms.length).toBe(initialCount + 1);
    expect(state.classrooms.some((r) => r.roomNumber === '999')).toBe(true);
    expect(state.auditLogs.length).toBeGreaterThan(0);
  });

  it('should toggle role permission accurately', () => {
    const initialPermission = useSettingsStore.getState().rolePermissions.teacher?.manageClassrooms;
    useSettingsStore.getState().toggleRolePermission('teacher', 'manageClassrooms');

    const updatedPermission = useSettingsStore.getState().rolePermissions.teacher?.manageClassrooms;
    expect(updatedPermission).toBe(!initialPermission);
  });

  it('should export and import system backup JSON', () => {
    const backupStr = useSettingsStore.getState().exportSystemBackup();
    expect(typeof backupStr).toBe('string');
    expect(backupStr).toContain('schoolProfile');

    const success = useSettingsStore.getState().importSystemBackup(backupStr);
    expect(success).toBe(true);
  });

  it('should update school profile configuration', () => {
    useSettingsStore.getState().updateSchoolProfile({
      name: 'NASA Academy of Excellence',
    });
    expect(useSettingsStore.getState().schoolProfile.name).toBe('NASA Academy of Excellence');
  });

  it('should reset to factory defaults cleanly', () => {
    useSettingsStore.getState().updateSchoolProfile({ name: 'Temporary Name' });
    expect(useSettingsStore.getState().schoolProfile.name).toBe('Temporary Name');

    useSettingsStore.getState().resetToFactoryDefaults();
    expect(useSettingsStore.getState().schoolProfile.name).toBe('EduPulse International Academy');
  });
});
