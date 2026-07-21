import React, { useState } from 'react';
import { Modal, Avatar, Badge } from '@/components/ui';
import { Briefcase, CheckCircle, Clock, ShieldCheck, Edit, Download } from 'lucide-react';
import './StaffProfile.css';

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: string;
  photo: string;
  hireDate: string;
}

interface StaffProfileProps {
  staff: StaffMember;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

export const StaffProfile: React.FC<StaffProfileProps> = ({ staff, isOpen, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'workload' | 'employment'>('overview');

  const fullName = `${staff.firstName} ${staff.lastName}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Staff Command Profile" size="xl">
      <div className="ep-staff-profile" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* 1. NASA-Grade Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
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
            <Avatar src={staff.photo} name={fullName} size="lg" style={{ border: '3px solid var(--color-green-400)', width: 72, height: 72 }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>{fullName}</h2>
                <Badge variant={staff.status === 'active' ? 'success' : 'warning'}>{staff.status.toUpperCase()}</Badge>
                <span className="ep-badge ep-badge--primary">{staff.department}</span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
                Staff ID: <strong style={{ color: 'var(--color-text-primary)' }}>{staff.id.toUpperCase()}</strong> • {staff.position} • Hired {staff.hireDate}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {onEdit && (
              <button className="ep-btn ep-btn--secondary ep-btn--sm" onClick={onEdit}>
                <Edit size={14} style={{ marginRight: 4 }} /> Edit Staff Record
              </button>
            )}
            <button className="ep-btn ep-btn--primary ep-btn--sm">
              <Download size={14} style={{ marginRight: 4 }} /> Export HR Dossier
            </button>
          </div>
        </div>

        {/* 2. Navigation Tabs */}
        <div className="ep-tabs" style={{ padding: '2px' }}>
          <button className={`ep-tab ${activeTab === 'overview' ? 'ep-tab--active' : ''}`} onClick={() => setActiveTab('overview')}>
            Overview & Telemetry
          </button>
          <button className={`ep-tab ${activeTab === 'workload' ? 'ep-tab--active' : ''}`} onClick={() => setActiveTab('workload')}>
            Assigned Workload
          </button>
          <button className={`ep-tab ${activeTab === 'employment' ? 'ep-tab--active' : ''}`} onClick={() => setActiveTab('employment')}>
            Employment History
          </button>
        </div>

        {/* 3. Tab Content */}
        <div className="ep-profile-tab-content">
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Telemetry Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div className="ep-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-primary)' }}>12</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Active Tickets / Tasks</div>
                  </div>
                </div>

                <div className="ep-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-primary)' }}>98.4%</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Task Completion Rate</div>
                  </div>
                </div>

                <div className="ep-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-primary)' }}>15 Days</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Accrued PTO Balance</div>
                  </div>
                </div>

                <div className="ep-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-primary)' }}>100%</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Safety Compliance</div>
                  </div>
                </div>
              </div>

              {/* Details & Contact Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px' }}>
                <div className="ep-card" style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', color: 'var(--color-text-primary)' }}>Shift Schedule & Role Responsibilities</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--color-surface-100)', borderRadius: '8px' }}>
                      <span style={{ fontWeight: 600 }}>Standard Working Shift:</span>
                      <span>Monday - Friday (08:00 AM - 04:30 PM)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--color-surface-100)', borderRadius: '8px' }}>
                      <span style={{ fontWeight: 600 }}>Primary Campus Location:</span>
                      <span>Central Administration Block B</span>
                    </div>
                  </div>
                </div>

                <div className="ep-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>Direct Contact</h3>
                  <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div><strong style={{ color: 'var(--color-text-tertiary)' }}>Email:</strong> {staff.email}</div>
                    <div><strong style={{ color: 'var(--color-text-tertiary)' }}>Phone:</strong> {staff.phone}</div>
                    <div><strong style={{ color: 'var(--color-text-tertiary)' }}>Department:</strong> {staff.department}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workload' && (
            <div className="ep-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0' }}>Assigned Campus Work Tickets</h3>
              <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>All 12 operational tickets are currently in good standing.</p>
            </div>
          )}

          {activeTab === 'employment' && (
            <div className="ep-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0' }}>Employment History Dossier</h3>
              <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Hired on {staff.hireDate} as {staff.position} under {staff.department} division.</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default StaffProfile;
