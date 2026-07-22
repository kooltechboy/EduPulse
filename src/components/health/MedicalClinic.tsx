import React, { useState } from 'react';
import { ShieldAlert, Activity, Syringe, Plus, HeartPulse, UserCheck, AlertTriangle, Printer } from 'lucide-react';
import './MedicalClinic.css';

declare const addToast: (options: { type: 'success' | 'error' | 'info' | 'warning', title: string, message: string }) => void;

interface HealthRecord {
  id: string;
  studentName: string;
  grade: string;
  condition: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  lastChecked: string;
  bloodType?: string;
  allergies?: string;
  medications?: string;
  emergencyContact?: string;
  doctor?: string;
  notes?: string;
  immunizations?: any[];
}

const initialRecords: HealthRecord[] = [
  { id: '1', studentName: 'John Doe', grade: 'Grade 10', condition: 'Severe Peanut Allergy (EpiPen Required)', type: 'Allergy', severity: 'high', lastChecked: '2026-10-01', immunizations: [] },
  { id: '2', studentName: 'Alice Smith', grade: 'Grade 9', condition: 'Asthma - Inhaler at Nurse Station', type: 'Chronic', severity: 'medium', lastChecked: '2026-09-15', immunizations: [] },
  { id: '3', studentName: 'Bob Brown', grade: 'Grade 11', condition: 'Annual Flu Vaccination Completed', type: 'Vaccine', severity: 'low', lastChecked: '2026-10-04', immunizations: [] },
  { id: '4', studentName: 'Emma Watson', grade: 'Grade 8', condition: 'Ankle Sprain during PE Class', type: 'Incident', severity: 'medium', lastChecked: '2026-10-12', immunizations: [] }
];

export const MedicalClinic: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'records' | 'incidents' | 'immunizations'>('records');
  const [medicalRecords, setMedicalRecords] = useState<HealthRecord[]>(initialRecords);
  const [incidents, setIncidents] = useState<any[]>([]);

  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showLogIncident, setShowLogIncident] = useState(false);
  const [showAddImmunization, setShowAddImmunization] = useState<string | null>(null);

  const [recordForm, setRecordForm] = useState<Partial<HealthRecord>>({ grade: 'Grade 1', type: 'Chronic', severity: 'low' });
  const [incidentForm, setIncidentForm] = useState({ studentName: '', type: 'Injury', description: '', severity: 'Minor', treatment: '', parentNotified: false, followUp: false, date: new Date().toISOString().split('T')[0] });
  const [immunizationForm, setImmunizationForm] = useState({ vaccineName: '', dateGiven: '', nextDueDate: '', administeredBy: '' });

  const safeAddToast = (opts: any) => {
    if (typeof addToast === 'function') addToast(opts);
    else if (typeof window !== 'undefined' && (window as any).addToast) (window as any).addToast(opts);
  };

  const handleAddRecord = () => {
    if (!recordForm.studentName) return;
    setMedicalRecords([...medicalRecords, { ...recordForm, id: Math.random().toString(), immunizations: [] } as HealthRecord]);
    setShowAddRecord(false);
    setRecordForm({ grade: 'Grade 1', type: 'Chronic', severity: 'low' });
    safeAddToast({ type: 'success', title: 'Record Added', message: 'Health record added.' });
  };

  const handleLogIncident = () => {
    if (!incidentForm.studentName) return;
    setIncidents([...incidents, { ...incidentForm, id: Math.random().toString() }]);
    setShowLogIncident(false);
    setIncidentForm({ studentName: '', type: 'Injury', description: '', severity: 'Minor', treatment: '', parentNotified: false, followUp: false, date: new Date().toISOString().split('T')[0] });
    safeAddToast({ type: 'success', title: 'Incident Logged', message: 'Health incident logged.' });
  };

  const handleAddImmunization = (studentId: string) => {
    setMedicalRecords(medicalRecords.map(r => r.id === studentId ? { ...r, immunizations: [...(r.immunizations||[]), immunizationForm] } : r));
    setShowAddImmunization(null);
    setImmunizationForm({ vaccineName: '', dateGiven: '', nextDueDate: '', administeredBy: '' });
    safeAddToast({ type: 'success', title: 'Immunization Added', message: 'Immunization record updated.' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="ep-medical-clinic">
      <header className="ep-medical-clinic__header">
        <div>
          <h1 className="ep-medical-clinic__title">Campus Medical Clinic & Student Health</h1>
          <p className="ep-medical-clinic__subtitle">Track allergy warnings, chronic illness protocols, clinic visits, and immunization logs</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="ep-tabs" style={{ padding: '2px' }}>
            <button className={`ep-tab ${activeTab === 'records' ? 'ep-tab--active' : ''}`} onClick={() => setActiveTab('records')}>
              <Activity size={14} style={{ marginRight: 4 }} /> Health Records
            </button>
            <button className={`ep-tab ${activeTab === 'incidents' ? 'ep-tab--active' : ''}`} onClick={() => setActiveTab('incidents')}>
              <ShieldAlert size={14} style={{ marginRight: 4 }} /> Clinic Incidents
            </button>
            <button className={`ep-tab ${activeTab === 'immunizations' ? 'ep-tab--active' : ''}`} onClick={() => setActiveTab('immunizations')}>
              <Syringe size={14} style={{ marginRight: 4 }} /> Immunizations
            </button>
          </div>
          {activeTab === 'records' && (
            <button className="ep-btn ep-btn--primary" onClick={() => setShowAddRecord(true)}><Plus size={16} /> + Add Record</button>
          )}
          {activeTab === 'incidents' && (
            <button className="ep-btn ep-btn--primary" onClick={() => setShowLogIncident(true)}><Plus size={16} /> + Log Incident</button>
          )}
        </div>
      </header>

      <section className="ep-medical-clinic__kpi-grid">
        <div className="ep-medical-clinic__kpi-card">
          <div className="ep-medical-clinic__kpi-icon ep-medical-clinic__kpi-icon--blue"><HeartPulse size={22} /></div>
          <div><div className="ep-medical-clinic__kpi-val">1,247</div><div className="ep-medical-clinic__kpi-lbl">Student Medical Profiles</div></div>
        </div>
        <div className="ep-medical-clinic__kpi-card">
          <div className="ep-medical-clinic__kpi-icon ep-medical-clinic__kpi-icon--rose"><AlertTriangle size={22} /></div>
          <div><div className="ep-medical-clinic__kpi-val">18</div><div className="ep-medical-clinic__kpi-lbl">High-Severity Allergy Flags</div></div>
        </div>
        <div className="ep-medical-clinic__kpi-card">
          <div className="ep-medical-clinic__kpi-icon ep-medical-clinic__kpi-icon--amber"><Activity size={22} /></div>
          <div><div className="ep-medical-clinic__kpi-val">5</div><div className="ep-medical-clinic__kpi-lbl">Clinic Visits Today</div></div>
        </div>
        <div className="ep-medical-clinic__kpi-card">
          <div className="ep-medical-clinic__kpi-icon ep-medical-clinic__kpi-icon--green"><UserCheck size={22} /></div>
          <div><div className="ep-medical-clinic__kpi-val">99.1%</div><div className="ep-medical-clinic__kpi-lbl">Immunization Compliance</div></div>
        </div>
      </section>

      <div className="ep-table-wrapper">
        <table className="ep-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Grade Level</th>
              <th>Medical Condition / Record</th>
              <th>Record Type</th>
              <th>Severity Flag</th>
              <th>Last Checked</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {activeTab === 'records' && medicalRecords.map(rec => (
              <tr key={rec.id}>
                <td style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{rec.studentName}</td>
                <td>{rec.grade}</td>
                <td style={{ fontWeight: 600 }}>{rec.condition || rec.notes}</td>
                <td><span className="ep-badge ep-badge--neutral">{rec.type}</span></td>
                <td><span className={`ep-badge ${rec.severity === 'high' ? 'ep-badge--danger' : rec.severity === 'medium' ? 'ep-badge--warning' : 'ep-badge--success'}`}>{rec.severity} priority</span></td>
                <td>{rec.lastChecked}</td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="ep-btn ep-btn--secondary ep-btn--sm" onClick={() => setShowAddImmunization(rec.id)}><Syringe size={14} /> Add Immunization</button>
                    <button className="ep-btn ep-btn--secondary ep-btn--sm" onClick={handlePrint}><Printer size={14} /> Print Card</button>
                  </div>
                </td>
              </tr>
            ))}
            {activeTab === 'incidents' && incidents.map(inc => (
              <tr key={inc.id}>
                <td style={{ fontWeight: 700 }}>{inc.studentName}</td>
                <td>-</td>
                <td style={{ fontWeight: 600 }}>{inc.description}</td>
                <td><span className="ep-badge ep-badge--neutral">{inc.type}</span></td>
                <td><span className={`ep-badge ${inc.severity === 'Severe' ? 'ep-badge--danger' : inc.severity === 'Moderate' ? 'ep-badge--warning' : 'ep-badge--success'}`}>{inc.severity}</span></td>
                <td>{inc.date}</td>
                <td>-</td>
              </tr>
            ))}
            {activeTab === 'immunizations' && medicalRecords.filter(r => r.immunizations && r.immunizations.length > 0).map(rec => (
              <tr key={rec.id}>
                <td style={{ fontWeight: 700 }}>{rec.studentName}</td>
                <td>{rec.grade}</td>
                <td style={{ fontWeight: 600 }}>{rec.immunizations?.map(i => i.vaccineName).join(', ')}</td>
                <td><span className="ep-badge ep-badge--neutral">Vaccine</span></td>
                <td><span className="ep-badge ep-badge--success">low priority</span></td>
                <td>{rec.immunizations?.[0]?.dateGiven}</td>
                <td>
                  <button className="ep-btn ep-btn--secondary ep-btn--sm" onClick={() => setShowAddImmunization(rec.id)}><Syringe size={14} /> Add Immunization</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddRecord && (
        <div className="ep-medical__modal-overlay">
          <div className="ep-medical__modal">
            <h3 className="ep-medical__modal-title">Add Health Record</h3>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label">Student Name</label><input className="ep-medical__form-input" onChange={e => setRecordForm({...recordForm, studentName: e.target.value})} /></div>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label">Grade</label>
              <select className="ep-medical__form-input" onChange={e => setRecordForm({...recordForm, grade: e.target.value})}>
                {['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label">Blood Type</label>
              <select className="ep-medical__form-input" onChange={e => setRecordForm({...recordForm, bloodType: e.target.value})}>
                <option value="">Select...</option>{['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bt => <option key={bt}>{bt}</option>)}
              </select>
            </div>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label">Allergies</label><input className="ep-medical__form-input" onChange={e => setRecordForm({...recordForm, allergies: e.target.value})} /></div>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label">Current Medications</label><textarea className="ep-medical__form-input" onChange={e => setRecordForm({...recordForm, medications: e.target.value})}></textarea></div>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label">Known Conditions</label><textarea className="ep-medical__form-input" onChange={e => setRecordForm({...recordForm, condition: e.target.value})}></textarea></div>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label">Emergency Contact Name & Phone</label><input className="ep-medical__form-input" onChange={e => setRecordForm({...recordForm, emergencyContact: e.target.value})} /></div>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label">Doctor Name & Phone</label><input className="ep-medical__form-input" onChange={e => setRecordForm({...recordForm, doctor: e.target.value})} /></div>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label">Last Checkup</label><input type="date" className="ep-medical__form-input" onChange={e => setRecordForm({...recordForm, lastChecked: e.target.value})} /></div>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label">Notes</label><textarea className="ep-medical__form-input" onChange={e => setRecordForm({...recordForm, notes: e.target.value})}></textarea></div>
            <div className="ep-medical__modal-footer">
              <button className="ep-btn ep-btn--secondary" onClick={() => setShowAddRecord(false)}>Cancel</button>
              <button className="ep-btn ep-btn--primary" onClick={handleAddRecord}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {showLogIncident && (
        <div className="ep-medical__modal-overlay">
          <div className="ep-medical__modal">
            <h3 className="ep-medical__modal-title">Log Health Incident</h3>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label">Student Name</label><input className="ep-medical__form-input" onChange={e => setIncidentForm({...incidentForm, studentName: e.target.value})} /></div>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label">Incident Type</label>
              <select className="ep-medical__form-input" onChange={e => setIncidentForm({...incidentForm, type: e.target.value})}>
                {['Injury','Illness','Allergy','Other'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label">Description</label><textarea className="ep-medical__form-input" onChange={e => setIncidentForm({...incidentForm, description: e.target.value})}></textarea></div>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label">Severity</label>
              <select className="ep-medical__form-input" onChange={e => setIncidentForm({...incidentForm, severity: e.target.value})}>
                {['Minor','Moderate','Severe'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label">Treatment Given</label><textarea className="ep-medical__form-input" onChange={e => setIncidentForm({...incidentForm, treatment: e.target.value})}></textarea></div>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label"><input type="checkbox" onChange={e => setIncidentForm({...incidentForm, parentNotified: e.target.checked})} /> Parent Notified</label></div>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label"><input type="checkbox" onChange={e => setIncidentForm({...incidentForm, followUp: e.target.checked})} /> Follow-up Required</label></div>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label">Date</label><input type="date" className="ep-medical__form-input" value={incidentForm.date} onChange={e => setIncidentForm({...incidentForm, date: e.target.value})} /></div>
            <div className="ep-medical__modal-footer">
              <button className="ep-btn ep-btn--secondary" onClick={() => setShowLogIncident(false)}>Cancel</button>
              <button className="ep-btn ep-btn--primary" onClick={handleLogIncident}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {showAddImmunization && (
        <div className="ep-medical__modal-overlay">
          <div className="ep-medical__modal">
            <h3 className="ep-medical__modal-title">Add Immunization</h3>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label">Vaccine Name</label><input className="ep-medical__form-input" onChange={e => setImmunizationForm({...immunizationForm, vaccineName: e.target.value})} /></div>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label">Date Given</label><input type="date" className="ep-medical__form-input" onChange={e => setImmunizationForm({...immunizationForm, dateGiven: e.target.value})} /></div>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label">Next Due Date</label><input type="date" className="ep-medical__form-input" onChange={e => setImmunizationForm({...immunizationForm, nextDueDate: e.target.value})} /></div>
            <div className="ep-medical__form-group"><label className="ep-medical__form-label">Administered By</label><input className="ep-medical__form-input" onChange={e => setImmunizationForm({...immunizationForm, administeredBy: e.target.value})} /></div>
            <div className="ep-medical__modal-footer">
              <button className="ep-btn ep-btn--secondary" onClick={() => setShowAddImmunization(null)}>Cancel</button>
              <button className="ep-btn ep-btn--primary" onClick={() => handleAddImmunization(showAddImmunization)}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalClinic;
