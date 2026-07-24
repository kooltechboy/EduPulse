import { describe, it, expect, vi } from 'vitest';
import { exportToCSV, exportToJSON, triggerPrintView } from '../exportService';

describe('exportService', () => {
  it('should export CSV without throwing', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    exportToCSV([], 'test.csv');
    expect(consoleSpy).toHaveBeenCalledWith('No data to export');
    consoleSpy.mockRestore();
  });

  it('should export JSON without throwing', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    exportToJSON(null, 'test.json');
    expect(consoleSpy).toHaveBeenCalledWith('No data to export');
    consoleSpy.mockRestore();
  });

  it('should safely log warning when print target element is missing', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    triggerPrintView('non_existent_element_id');
    expect(consoleSpy).toHaveBeenCalledWith('[EduPulse Export] Element with ID non_existent_element_id not found');
    consoleSpy.mockRestore();
  });
});
