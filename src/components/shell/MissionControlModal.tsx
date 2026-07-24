/* ============================================================================
   EDUPULSE — NASA Mission Control & Telemetry Dashboard Modal
   ============================================================================ */

import React, { useEffect, useState } from 'react';
import { X, Activity, Cpu, Wifi, Database, ShieldAlert, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { telemetryService, TelemetryMetrics } from '@/services/telemetryService';
import { aiPredictiveEngine, RiskAlert } from '@/services/aiPredictiveEngine';
import { useAcademicStore } from '@/stores/academicStore';
import { useOperationsStore } from '@/stores/operationsStore';
import './MissionControlModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MissionControlModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [metrics, setMetrics] = useState<TelemetryMetrics>(telemetryService.getMetrics());
  const [risks, setRisks] = useState<RiskAlert[]>([]);
  const [generatingAiId, setGeneratingAiId] = useState<string | null>(null);

  const students = useAcademicStore((s) => s.students);
  const routes = useOperationsStore((s) => s.routes);
  const invoices = useOperationsStore((s) => s.invoices);

  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = telemetryService.subscribe((newMetrics) => {
      setMetrics(newMetrics);
    });

    // Run Predictive Scan
    const acadRisks = aiPredictiveEngine.evaluateStudentRisks(students);
    const fleetRisks = aiPredictiveEngine.evaluateFleetRisks(routes);
    const finRisks = aiPredictiveEngine.evaluateFinancialRisks(invoices);
    setRisks([...acadRisks, ...fleetRisks, ...finRisks]);

    return () => unsubscribe();
  }, [isOpen, students, routes, invoices]);

  if (!isOpen) return null;

  const handleGenerateMitigation = async (risk: RiskAlert) => {
    setGeneratingAiId(risk.id);
    const plan = await aiPredictiveEngine.generateAIMitigationPlan(risk);
    setRisks((prev) =>
      prev.map((r) => (r.id === risk.id ? { ...r, aiMitigationPlan: plan } : r))
    );
    setGeneratingAiId(null);
  };

  return (
    <div className="ep-mission-control__overlay" onClick={onClose}>
      <div className="ep-mission-control__dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ep-mission-control__header">
          <div className="ep-mission-control__title-group">
            <Activity size={24} style={{ color: '#3b82f6' }} />
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
                EduPulse Mission Control & Telemetry
              </h2>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                System Uptime: {metrics.uptimeSeconds}s | Real-time Telemetry Active
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className={`ep-mission-control__badge ep-mission-control__badge--${metrics.status}`}>
              STATUS: {metrics.status.toUpperCase()}
            </span>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="ep-mission-control__body">
          {/* Telemetry Metrics Grid */}
          <div className="ep-mission-control__grid">
            <div className="ep-mission-control__card">
              <span className="ep-mission-control__card-label">
                <Cpu size={14} style={{ display: 'inline', marginRight: 4 }} /> JS Heap Memory
              </span>
              <span className="ep-mission-control__card-value">
                {metrics.memoryHeapMb} <span style={{ fontSize: 13, color: '#94a3b8' }}>/ {metrics.memoryLimitMb} MB</span>
              </span>
            </div>

            <div className="ep-mission-control__card">
              <span className="ep-mission-control__card-label">
                <Wifi size={14} style={{ display: 'inline', marginRight: 4 }} /> RTT Latency
              </span>
              <span className="ep-mission-control__card-value">
                {metrics.networkLatencyMs} <span style={{ fontSize: 13, color: '#94a3b8' }}>ms</span>
              </span>
            </div>

            <div className="ep-mission-control__card">
              <span className="ep-mission-control__card-label">
                <Database size={14} style={{ display: 'inline', marginRight: 4 }} /> Offline Queue
              </span>
              <span className="ep-mission-control__card-value">
                {metrics.syncQueueDepth} <span style={{ fontSize: 13, color: '#94a3b8' }}>items</span>
              </span>
            </div>

            <div className="ep-mission-control__card">
              <span className="ep-mission-control__card-label">
                <ShieldAlert size={14} style={{ display: 'inline', marginRight: 4 }} /> Active Errors
              </span>
              <span className="ep-mission-control__card-value">
                {metrics.activeErrorCount}
              </span>
            </div>
          </div>

          {/* AI Early Warning & Risk Analysis */}
          <div className="ep-mission-control__section">
            <div className="ep-mission-control__section-title">
              <Sparkles size={16} style={{ color: '#a78bfa' }} />
              Autonomous AI Predictive Risk Analysis ({risks.length} Vectors Detected)
            </div>

            {risks.length === 0 ? (
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
                No active critical risk signals detected across Academic, Fleet, or Financial domains.
              </p>
            ) : (
              risks.map((risk) => (
                <div key={risk.id} className="ep-mission-control__risk-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#f8fafc' }}>
                      {risk.title}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: risk.severity === 'critical' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                        color: risk.severity === 'critical' ? '#f87171' : '#fbbf24',
                      }}
                    >
                      {risk.severity.toUpperCase()}
                    </span>
                  </div>

                  <span style={{ fontSize: 12, color: '#94a3b8' }}>
                    {risk.metricSummary}
                  </span>

                  {risk.aiMitigationPlan ? (
                    <div style={{ background: 'rgba(139,92,246,0.15)', padding: 10, borderRadius: 8, marginTop: 4, fontSize: 12, color: '#ddd6fe' }}>
                      <strong>AI Mitigation Plan:</strong>
                      <pre style={{ margin: '4px 0 0 0', fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
                        {risk.aiMitigationPlan}
                      </pre>
                    </div>
                  ) : (
                    <button
                      className="ep-mission-control__btn"
                      style={{ alignSelf: 'flex-start', marginTop: 4, padding: '4px 10px', fontSize: 12 }}
                      onClick={() => handleGenerateMitigation(risk)}
                      disabled={generatingAiId === risk.id}
                    >
                      {generatingAiId === risk.id ? 'Analyzing...' : 'Generate AI Mitigation Plan'}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Telemetry Fault Injection Testing */}
          <div className="ep-mission-control__section">
            <div className="ep-mission-control__section-title">
              <Zap size={16} style={{ color: '#f59e0b' }} />
              Self-Healing Stress Test & Fault Injection
            </div>
            <div className="ep-mission-control__btn-group">
              <button
                className="ep-mission-control__btn"
                onClick={() => telemetryService.injectFault('high-latency')}
              >
                Inject Latency (+450ms)
              </button>
              <button
                className="ep-mission-control__btn"
                onClick={() => telemetryService.injectFault('network-drop')}
              >
                Inject Network Drop
              </button>
              <button
                className="ep-mission-control__btn"
                onClick={() => telemetryService.injectFault('queue-backlog')}
              >
                Inject Queue Backlog
              </button>
              <button
                className="ep-mission-control__btn"
                style={{ background: 'rgba(34, 197, 94, 0.2)', borderColor: 'rgba(34, 197, 94, 0.4)', color: '#4ade80' }}
                onClick={() => telemetryService.clearErrors()}
              >
                Clear Faults & Restore Nominal Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
