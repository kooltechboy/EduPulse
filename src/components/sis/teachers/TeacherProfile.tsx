import React, { useState } from 'react';
import { Modal, Avatar, Badge } from '@/components/ui';
import { BookOpen, Users, Award, ShieldCheck, Edit, Download, Star } from 'lucide-react';
import './TeacherProfile.css';

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  subjects: string;
  classesCount: number;
  qualification: string;
  status: string;
  photo: string;
  hireDate: string;
}

interface TeacherProfileProps {
  teacher: Teacher;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

const TEACHER_CLASSES = [
  { code: 'PHYS-101', name: 'General Physics I', grade: '10-A', room: 'Lab 104', students: 28, schedule: 'Mon, Wed, Fri 09:00 AM' },
  { code: 'PHYS-202', name: 'AP Physics C: Mechanics', grade: '12-B', room: 'Lab 106', students: 24, schedule: 'Tue, Thu 10:30 AM' },
  { code: 'ALG-301', name: 'Honors Algebra II', grade: '11-A', room: 'Room 204', students: 30, schedule: 'Mon, Wed 01:00 PM' }
];

export const TeacherProfile: React.FC<TeacherProfileProps> = ({ teacher, isOpen, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'load' | 'performance' | 'certifications'>('overview');

  const fullName = `${teacher.firstName} ${teacher.lastName}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Faculty Command Profile" size="xl">
      <div className="ep-teacher-profile" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* 1. NASA-Grade Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
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
            <Avatar src={teacher.photo} name={fullName} size="lg" style={{ border: '3px solid var(--color-purple-400)', width: 72, height: 72 }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>{fullName}</h2>
                <Badge variant={teacher.status === 'active' ? 'success' : 'warning'}>{teacher.status.toUpperCase()}</Badge>
                <span className="ep-badge ep-badge--primary">{teacher.department} Dept Head</span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
                Faculty ID: <strong style={{ color: 'var(--color-text-primary)' }}>{teacher.id.toUpperCase()}</strong> • Hired {teacher.hireDate} • {teacher.qualification}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {onEdit && (
              <button className="ep-btn ep-btn--secondary ep-btn--sm" onClick={onEdit}>
                <Edit size={14} style={{ marginRight: 4 }} /> Edit Faculty Record
              </button>
            )}
            <button className="ep-btn ep-btn--primary ep-btn--sm">
              <Download size={14} style={{ marginRight: 4 }} /> Export Faculty Profile
            </button>
          </div>
        </div>

        {/* 2. Navigation Tabs */}
        <div className="ep-tabs" style={{ padding: '2px' }}>
          <button className={`ep-tab ${activeTab === 'overview' ? 'ep-tab--active' : ''}`} onClick={() => setActiveTab('overview')}>
            Overview & Telemetry
          </button>
          <button className={`ep-tab ${activeTab === 'load' ? 'ep-tab--active' : ''}`} onClick={() => setActiveTab('load')}>
            Teaching Load Matrix
          </button>
          <button className={`ep-tab ${activeTab === 'performance' ? 'ep-tab--active' : ''}`} onClick={() => setActiveTab('performance')}>
            Student Pass Rates
          </button>
          <button className={`ep-tab ${activeTab === 'certifications' ? 'ep-tab--active' : ''}`} onClick={() => setActiveTab('certifications')}>
            Certifications & License
          </button>
        </div>

        {/* 3. Tab Content */}
        <div className="ep-profile-tab-content">
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Telemetry Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div className="ep-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-primary)' }}>{teacher.classesCount || 3}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Active Class Sections</div>
                  </div>
                </div>

                <div className="ep-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-primary)' }}>82</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Total Students Taught</div>
                  </div>
                </div>

                <div className="ep-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Star size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-primary)' }}>4.9 / 5.0</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Peer Evaluation Rating</div>
                  </div>
                </div>

                <div className="ep-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-primary)' }}>94.2%</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Student Pass Rate</div>
                  </div>
                </div>
              </div>

              {/* Faculty Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px' }}>
                <div className="ep-card" style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', color: 'var(--color-text-primary)' }}>Assigned Teaching Roster</h3>
                  <table className="ep-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Class Name</th>
                        <th>Grade</th>
                        <th>Students</th>
                        <th>Schedule</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TEACHER_CLASSES.map(cls => (
                        <tr key={cls.code}>
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-primary-400)' }}>{cls.code}</td>
                          <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{cls.name}</td>
                          <td>{cls.grade}</td>
                          <td style={{ fontWeight: 700 }}>{cls.students}</td>
                          <td style={{ fontSize: '12px' }}>{cls.schedule}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="ep-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>Faculty Contact & Office Hours</h3>
                  <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div><strong style={{ color: 'var(--color-text-tertiary)' }}>Email:</strong> {teacher.email}</div>
                    <div><strong style={{ color: 'var(--color-text-tertiary)' }}>Office:</strong> Science Block 204</div>
                    <div><strong style={{ color: 'var(--color-text-tertiary)' }}>Office Hours:</strong> Mon/Wed 02:00 PM - 04:00 PM</div>
                    <div><strong style={{ color: 'var(--color-text-tertiary)' }}>Subjects Taught:</strong> {teacher.subjects}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'load' && (
            <div className="ep-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0' }}>Class Load & Roster Matrix</h3>
              <table className="ep-table">
                <thead>
                  <tr>
                    <th>Section Code</th>
                    <th>Subject Name</th>
                    <th>Classroom</th>
                    <th>Student Count</th>
                    <th>Weekly Schedule</th>
                  </tr>
                </thead>
                <tbody>
                  {TEACHER_CLASSES.map(c => (
                    <tr key={c.code}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-primary-400)' }}>{c.code}</td>
                      <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{c.name}</td>
                      <td>{c.room}</td>
                      <td style={{ fontWeight: 700 }}>{c.students} Students</td>
                      <td>{c.schedule}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="ep-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0' }}>Student Academic Metrics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div style={{ background: 'var(--color-surface-100)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-success-400)' }}>94.2%</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>Average Class Pass Rate</div>
                </div>
                <div style={{ background: 'var(--color-surface-100)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary-400)' }}>3.52</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>Average Student GPA</div>
                </div>
                <div style={{ background: 'var(--color-surface-100)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-warning-400)' }}>96.8%</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>On-time Attendance Rate</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'certifications' && (
            <div className="ep-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0' }}>Verified Credentials & Licensing</h3>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', background: 'var(--color-surface-100)', borderRadius: '8px' }}>
                <ShieldCheck size={24} color="var(--color-success-400)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{teacher.qualification} Certification</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Verified State Teaching Credential • Active through 2029</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TeacherProfile;
