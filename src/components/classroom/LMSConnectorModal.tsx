import React, { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle, ExternalLink, ShieldCheck, Download, UploadCloud } from 'lucide-react';
import { fetchExternalCourses, importLMSCourse, exportGradesToLMS, ExternalCourse } from '@/services/lmsIntegrationService';
import { useUIStore } from '@/stores/uiStore';
import './LMSConnectorModal.css';

interface LMSConnectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LMSConnectorModal: React.FC<LMSConnectorModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useUIStore();
  const [activePlatform, setActivePlatform] = useState<'all' | 'google_classroom' | 'canvas' | 'moodle'>('all');
  const [courses, setCourses] = useState<ExternalCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCourses();
    }
  }, [isOpen, activePlatform]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await fetchExternalCourses(activePlatform === 'all' ? undefined : activePlatform);
      setCourses(data);
    } catch (e) {
      addToast({ type: 'error', title: 'Connection Error', message: 'Failed to fetch external LMS courses.' });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (courseId: string) => {
    setSyncingId(courseId);
    try {
      const res = await importLMSCourse(courseId);
      if (res.success) {
        addToast({ type: 'success', title: 'LTI 1.3 Sync Complete', message: res.message });
        loadCourses();
      } else {
        addToast({ type: 'error', title: 'Sync Failed', message: res.message });
      }
    } catch (e) {
      addToast({ type: 'error', title: 'Error', message: 'LMS Sync failed.' });
    } finally {
      setSyncingId(null);
    }
  };

  const handleExportGrades = async (platform: 'google_classroom' | 'canvas' | 'moodle', code: string) => {
    try {
      const res = await exportGradesToLMS(platform, code);
      addToast({ type: 'success', title: 'Grades Exported', message: res.message });
    } catch (e) {
      addToast({ type: 'error', title: 'Export Error', message: 'Failed to push grades to LMS.' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ep-modal-overlay ep-lms__overlay" onClick={onClose}>
      <div className="ep-lms__modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <header className="ep-lms__header">
          <div className="ep-lms__title-group">
            <div className="ep-lms__badge">LTI 1.3 Certified</div>
            <h2>External LMS Connectors</h2>
            <p>Sync rosters, courses, and gradebooks with Google Classroom, Canvas, and Moodle</p>
          </div>
          <button className="ep-header__icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        {/* Platform Tabs */}
        <div className="ep-lms__tabs">
          <button 
            className={`ep-lms__tab ${activePlatform === 'all' ? 'ep-lms__tab--active' : ''}`}
            onClick={() => setActivePlatform('all')}
          >
            All Connectors
          </button>
          <button 
            className={`ep-lms__tab ${activePlatform === 'google_classroom' ? 'ep-lms__tab--active' : ''}`}
            onClick={() => setActivePlatform('google_classroom')}
          >
            Google Classroom
          </button>
          <button 
            className={`ep-lms__tab ${activePlatform === 'canvas' ? 'ep-lms__tab--active' : ''}`}
            onClick={() => setActivePlatform('canvas')}
          >
            Canvas LTI
          </button>
          <button 
            className={`ep-lms__tab ${activePlatform === 'moodle' ? 'ep-lms__tab--active' : ''}`}
            onClick={() => setActivePlatform('moodle')}
          >
            Moodle LMS
          </button>
        </div>

        {/* Content */}
        <div className="ep-lms__body">
          {loading ? (
            <div className="ep-lms__loading">
              <RefreshCw size={24} className="ep-spin" />
              <span>Establishing LTI 1.3 Deep Link Handshake...</span>
            </div>
          ) : (
            <div className="ep-lms__course-list">
              {courses.map(c => (
                <div key={c.id} className="ep-lms__course-card">
                  <div className="ep-lms__course-info">
                    <span className={`ep-lms__platform-tag ep-lms__platform-tag--${c.platform}`}>
                      {c.platform.replace('_', ' ').toUpperCase()}
                    </span>
                    <h4>{c.title}</h4>
                    <div className="ep-lms__course-meta">
                      <span>Code: <strong>{c.courseCode}</strong></span>
                      <span>Enrolled Students: <strong>{c.studentCount}</strong></span>
                      {c.lastSynced && <span>Last Synced: <strong>{c.lastSynced}</strong></span>}
                    </div>
                  </div>
                  
                  <div className="ep-lms__course-actions">
                    {c.status === 'connected' ? (
                      <>
                        <button 
                          className="ep-btn ep-btn--secondary"
                          onClick={() => handleExportGrades(c.platform, c.courseCode)}
                        >
                          <UploadCloud size={14} style={{ marginRight: 4 }} /> Export Grades
                        </button>
                        <span className="ep-lms__connected-badge">
                          <CheckCircle size={14} /> Connected
                        </span>
                      </>
                    ) : (
                      <button 
                        className="ep-btn ep-btn--primary"
                        onClick={() => handleImport(c.id)}
                        disabled={syncingId === c.id}
                      >
                        {syncingId === c.id ? (
                          <>
                            <RefreshCw size={14} className="ep-spin" style={{ marginRight: 4 }} /> Importing...
                          </>
                        ) : (
                          <>
                            <Download size={14} style={{ marginRight: 4 }} /> Import Course
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="ep-lms__footer">
          <div className="ep-lms__security-note">
            <ShieldCheck size={16} style={{ color: 'var(--color-success-500)', marginRight: 6 }} />
            <span>OAuth 2.0 Security Token Exchange Active & Protected</span>
          </div>
          <button className="ep-btn ep-btn--secondary" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};
