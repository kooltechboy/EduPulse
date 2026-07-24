import { describe, it, expect, beforeEach } from 'vitest';
import { telemetryService } from '../telemetryService';

describe('telemetryService', () => {
  beforeEach(() => {
    telemetryService.clearErrors();
  });

  it('should return initial nominal metrics', () => {
    const metrics = telemetryService.getMetrics();
    expect(metrics.status).toBe('nominal');
    expect(metrics.memoryHeapMb).toBeGreaterThan(0);
    expect(metrics.networkLatencyMs).toBeGreaterThan(0);
  });

  it('should react to fault injection', () => {
    telemetryService.injectFault('high-latency');
    let metrics = telemetryService.getMetrics();
    expect(metrics.status).toBe('degraded');
    expect(metrics.networkLatencyMs).toBeGreaterThan(400);

    telemetryService.injectFault('network-drop');
    metrics = telemetryService.getMetrics();
    expect(metrics.status).toBe('critical');
  });

  it('should notify subscribers on metric change', () => {
    let receivedStatus = '';
    const unsub = telemetryService.subscribe((m) => {
      receivedStatus = m.status;
    });

    telemetryService.injectFault('network-drop');
    expect(receivedStatus).toBe('critical');
    unsub();
  });

  it('should clear faults and restore nominal status', () => {
    telemetryService.recordError('Simulated crash');
    telemetryService.clearErrors();
    expect(telemetryService.getMetrics().status).toBe('nominal');
    expect(telemetryService.getMetrics().activeErrorCount).toBe(0);
  });
});
