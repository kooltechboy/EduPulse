import React, { useState } from 'react';
import { Modal, Avatar, Badge } from '@/components/ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Mail, Phone, Award, BookOpen, CheckCircle, ShieldCheck, Printer, Edit, UserCheck, HeartPulse } from 'lucide-react';
import './StudentProfile.css';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  section: string;
  gpa: string;
  attendance: number;
  status: string;
  tier: string;
  photo: string;
  guardianName: string;
  guardianPhone: string;
  enrollmentDate: string;
}

interface StudentProfileProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

const gpaData = [
  { term: 'Fall 2024', gpa: 3.2, classAvg: 3.0 },
  { term: 'Spring 2025', gpa: 3.4, classAvg: 3.1 },
  { term: 'Fall 2025', gpa: 3.6, classAvg: 3.2 },
  { term: 'Spring 2026', gpa: 3.8, classAvg: 3.3 },
];

const ENROLLED_COURSES = [
  { code: 'MATH401', name: 'Advanced Mathematics AP', teacher: 'Dr. Smith', grade: 'A', score: 95, status: 'On Track' },
  { code: 'PHY301', name: 'Physics I Honors', teacher: 'Prof. Johnson', grade: 'A-', score: 91, status: 'On Track' },
  { code: 'ENG401', name: 'English Literature AP', teacher: 'Ms. Wilson', grade: 'B+', score: 88, status: 'Needs Review' },
  { code: 'HIS201', name: 'World History', teacher: 'Mr. Davis', grade: 'A', score: 94, status: 'On Track' }
];

const TUITION_LEDGER = [
  { inv: 'INV-2026-001', item: 'Fall Semester Tuition Fee', amount: '$4,500', status: 'Paid', date: '2026-09-01' },
  { inv: 'INV-2026-042', item: 'STEM Lab & Technology Fee', amount: '$350', status: 'Paid', date: '2026-09-05' },
  { inv: 'INV-2026-089', item: 'Athletics & Bus Transport Pass', amount: '$200', status: 'Paid', date: '2026-09-10' }
];

export const StudentProfile: React.FC<StudentProfileProps> = ({ student, isOpen, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'finance' | 'documents' | 'history'>('overview');

  const fullName = `${student.firstName} ${student.lastName}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Student Command Profile" size="xl">
      <div className="ep-student-profile" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* 1. NASA-Grade Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Avatar src={student.photo} name={fullName} size="lg" style={{ border: '3px solid var(--color-primary-400)', width: 72, height: 72 }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>{fullName}</h2>
                <Badge variant={student.status === 'active' ? 'success' : 'warning'}>{student.status.toUpperCase()}</Badge>
                <span className="ep-badge ep-badge--primary" style={{ textTransform: 'uppercase' }}>{student.tier} Tier</span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
                Student ID: <strong style={{ color: 'var(--color-text-primary)' }}>{student.id.toUpperCase()}</strong> • Enrolled Grade {student.grade}-{student.section}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {onEdit && (
              <button className="ep-btn ep-btn--secondary ep-btn--sm" onClick={onEdit}>
                <Edit size={14} style={{ marginRight: 4 }} /> Edit Record
              </button>
            )}
            <button className="ep-btn ep-btn--secondary ep-btn--sm">
              <Printer size={14} style={{ marginRight: 4 }} /> Print Student ID
            </button>
            <button className="ep-btn ep-btn--primary ep-btn--sm">
              <Download size={14} style={{ marginRight: 4 }} /> Export PDF Transcript
            </button>
          </div>
        </div>

        {/* 2. Navigation Tabs */}
        <div className="ep-tabs" style={{ padding: '2px' }}>
          <button className={`ep-tab ${activeTab === 'overview' ? 'ep-tab--active' : ''}`} onClick={() => setActiveTab('overview')}>
            Overview & Telemetry
          </button>
          <button className={`ep-tab ${activeTab === 'performance' ? 'ep-tab--active' : ''}`} onClick={() => setActiveTab('performance')}>
            Academic Analytics
          </button>
          <button className={`ep-tab ${activeTab === 'finance' ? 'ep-tab--active' : ''}`} onClick={() => setActiveTab('finance')}>
            Tuition & Finance
          </button>
          <button className={`ep-tab ${activeTab === 'documents' ? 'ep-tab--active' : ''}`} onClick={() => setActiveTab('documents')}>
            ID Pass & Records
          </button>
          <button className={`ep-tab ${activeTab === 'history' ? 'ep-tab--active' : ''}`} onClick={() => setActiveTab('history')}>
            Audit Timeline Log
          </button>
        </div>

        {/* 3. Tab Content Panes */}
        <div className="ep-profile-tab-content">
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Telemetry KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div className="ep-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-primary)' }}>{student.gpa}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Cumulative GPA</div>
                  </div>
                </div>

                <div className="ep-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-primary)' }}>{student.attendance}%</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Attendance Rate</div>
                  </div>
                </div>

                <div className="ep-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-primary)' }}>24 / 30</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Credits Earned</div>
                  </div>
                </div>

                <div className="ep-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-primary)' }}>100/100</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Conduct Standing</div>
                  </div>
                </div>
              </div>

              {/* Enrolled Courses & Guardian Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px' }}>
                <div className="ep-card" style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', color: 'var(--color-text-primary)' }}>Current Course Enrolment</h3>
                  <table className="ep-table">
                    <thead>
                      <tr>
                        <th>Course Code</th>
                        <th>Subject Title</th>
                        <th>Instructor</th>
                        <th>Grade</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ENROLLED_COURSES.map(c => (
                        <tr key={c.code}>
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-primary-400)' }}>{c.code}</td>
                          <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{c.name}</td>
                          <td>{c.teacher}</td>
                          <td style={{ fontWeight: 700 }}>{c.grade} ({c.score}%)</td>
                          <td>
                            <span className={`ep-badge ${c.status === 'On Track' ? 'ep-badge--success' : 'ep-badge--warning'}`}>
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="ep-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>Guardian & Emergency Contact</h3>
                  
                  <div style={{ background: 'var(--color-surface-100)', padding: '14px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Primary Guardian</div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-text-primary)', margin: '2px 0 8px 0' }}>{student.guardianName}</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="ep-btn ep-btn--secondary ep-btn--sm" style={{ flex: 1 }}>
                        <Phone size={12} style={{ marginRight: 4 }} /> {student.guardianPhone}
                      </button>
                      <button className="ep-btn ep-btn--secondary ep-btn--sm">
                        <Mail size={12} />
                      </button>
                    </div>
                  </div>

                  <div style={{ background: 'var(--color-surface-100)', padding: '14px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Medical & Health Alert</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <HeartPulse size={16} color="var(--color-success-400)" />
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>No known severe allergies</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="ep-card" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0' }}>Semester GPA Growth Progression</h3>
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={gpaData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                      <XAxis dataKey="term" stroke="var(--color-text-tertiary)" fontSize={12} />
                      <YAxis domain={[2.5, 4.0]} stroke="var(--color-text-tertiary)" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-50)', borderColor: 'var(--color-border)', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="gpa" stroke="#3b82f6" strokeWidth={3} name="Student GPA" />
                      <Line type="monotone" dataKey="classAvg" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" name="Class Average" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="ep-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0' }}>Tuition & Fee Payment History</h3>
              <table className="ep-table">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Fee Description</th>
                    <th>Date Issued</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {TUITION_LEDGER.map(item => (
                    <tr key={item.inv}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-primary-400)' }}>{item.inv}</td>
                      <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.item}</td>
                      <td>{item.date}</td>
                      <td style={{ fontWeight: 700 }}>{item.amount}</td>
                      <td><span className="ep-badge ep-badge--success"><CheckCircle size={12} style={{ marginRight: 4 }} /> {item.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'documents' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Digital Student ID Badge Card */}
              <div className="ep-card" style={{ padding: '24px', background: 'linear-gradient(135deg, var(--color-surface-50) 0%, rgba(59, 130, 246, 0.1) 100%)', border: '1px solid var(--color-primary-400)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                  <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--color-primary-400)' }}>EDUPULSE DIGITAL PASS</div>
                  <Badge variant="success">VALID 2025-2026</Badge>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <Avatar src={student.photo} name={fullName} size="lg" style={{ width: 64, height: 64, border: '2px solid var(--color-primary-400)' }} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{fullName}</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: 'var(--color-text-tertiary)' }}>Grade {student.grade}-{student.section}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-primary-400)' }}>ID: {student.id.toUpperCase()}</p>
                  </div>
                </div>
              </div>

              <div className="ep-card" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0' }}>Official Documents & Records</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--color-surface-100)', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>Official Academic Transcript PDF</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Verified • Oct 2025</div>
                    </div>
                    <button className="ep-btn ep-btn--secondary ep-btn--sm"><Download size={14} /></button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--color-surface-100)', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>Medical & Immunization Form</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Verified • Sep 2025</div>
                    </div>
                    <button className="ep-btn ep-btn--secondary ep-btn--sm"><Download size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="ep-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0' }}>Student Audit & Timeline History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', minWidth: '90px', fontFamily: 'var(--font-mono)' }}>2026-10-15</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Quarter 1 Gradebook Update</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>GPA updated to {student.gpa} with 96% attendance record.</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', minWidth: '90px', fontFamily: 'var(--font-mono)' }}>2023-09-01</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Initial Institutional Enrollment</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Enrolled in Grade {student.grade}-{student.section} under {student.tier} tier.</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default StudentProfile;
