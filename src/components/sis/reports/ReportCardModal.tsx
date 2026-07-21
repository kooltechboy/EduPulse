import React from 'react';
import { X, Printer, GraduationCap, Award, Calendar, CheckCircle2, FileText, UserCheck } from 'lucide-react';
import './ReportCardModal.css';

interface StudentData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  section: string;
  gpa: string;
  attendance: number;
  photo?: string;
  guardianName?: string;
  guardianPhone?: string;
  enrollmentDate?: string;
}

interface CourseRecord {
  code: string;
  name: string;
  credits: number;
  score: number;
  letter: string;
  teacher: string;
  remarks: string;
}

interface ReportCardModalProps {
  student: StudentData;
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_COURSES: CourseRecord[] = [
  { code: 'MATH401', name: 'Advanced Mathematics', credits: 1.0, score: 94, letter: 'A', teacher: 'Dr. Robert Vance', remarks: 'Demonstrates exceptional problem-solving and analytical reasoning.' },
  { code: 'PHY301', name: 'Physics I (Lab)', credits: 1.0, score: 88, letter: 'B+', teacher: 'Prof. Sarah Jenkins', remarks: 'Active lab contributor; strong understanding of mechanics.' },
  { code: 'ENG202', name: 'World Literature & Composition', credits: 1.0, score: 92, letter: 'A-', teacher: 'Ms. Elena Rostova', remarks: 'Insightful essay analysis and articulate class participation.' },
  { code: 'HIS101', name: 'Global History & Governance', credits: 1.0, score: 90, letter: 'A-', teacher: 'Mr. David Miller', remarks: 'Consistently thorough research projects and historical synthesis.' },
  { code: 'CS305', name: 'Computer Science & AI Principles', credits: 1.0, score: 98, letter: 'A+', teacher: 'Dr. Alan Chen', remarks: 'Outstanding algorithmic design and software project execution.' },
];

export const ReportCardModal: React.FC<ReportCardModalProps> = ({ student, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const calculateGpa = (courses: CourseRecord[]) => {
    const totalCredits = courses.reduce((acc, c) => acc + c.credits, 0);
    if (totalCredits === 0) return '0.00';
    const gradePointsMap: Record<string, number> = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'F': 0.0
    };
    const totalPoints = courses.reduce((acc, c) => acc + (gradePointsMap[c.letter] || 0) * c.credits, 0);
    return (totalPoints / totalCredits).toFixed(2);
  };

  const termGpa = calculateGpa(DEFAULT_COURSES);

  return (
    <div className="ep-modal-overlay ep-report-card__overlay" onClick={onClose}>
      <div className="ep-report-card__modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Controls */}
        <div className="ep-report-card__actions no-print">
          <button className="ep-btn ep-btn--secondary" onClick={onClose}>
            <X size={16} /> Close
          </button>
          <button className="ep-btn ep-btn--primary" onClick={handlePrint}>
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>

        {/* Official Printable Report Card Document */}
        <div className="ep-report-card__doc printable-area">
          {/* Header */}
          <header className="ep-report-card__header">
            <div className="ep-report-card__brand">
              <div className="ep-report-card__logo">
                <GraduationCap size={32} />
              </div>
              <div>
                <h1 className="ep-report-card__school-name">EDUPULSE ACADEMY OF EXCELLENCE</h1>
                <p className="ep-report-card__school-sub">District 104 • Official Academic Progress & Telemetry Report</p>
                <p className="ep-report-card__school-meta">100 Innovation Parkway, Tech Campus • Tel: (555) 019-2834</p>
              </div>
            </div>
            <div className="ep-report-card__badge-box">
              <div className="ep-report-card__doc-title">OFFICIAL REPORT CARD</div>
              <div className="ep-report-card__term">Academic Year 2025–2026 • Term 2</div>
            </div>
          </header>

          <hr className="ep-report-card__divider" />

          {/* Student Info Grid */}
          <section className="ep-report-card__student-info">
            <div className="ep-report-card__info-row">
              <div className="ep-report-card__info-item">
                <span className="ep-report-card__info-label">Student Name:</span>
                <span className="ep-report-card__info-val">{student.firstName} {student.lastName}</span>
              </div>
              <div className="ep-report-card__info-item">
                <span className="ep-report-card__info-label">Student ID:</span>
                <span className="ep-report-card__info-val">{student.id.toUpperCase()}</span>
              </div>
              <div className="ep-report-card__info-item">
                <span className="ep-report-card__info-label">Grade Level:</span>
                <span className="ep-report-card__info-val">Grade {student.grade}-{student.section}</span>
              </div>
            </div>

            <div className="ep-report-card__info-row">
              <div className="ep-report-card__info-item">
                <span className="ep-report-card__info-label">Guardian:</span>
                <span className="ep-report-card__info-val">{student.guardianName || 'N/A'}</span>
              </div>
              <div className="ep-report-card__info-item">
                <span className="ep-report-card__info-label">Contact Phone:</span>
                <span className="ep-report-card__info-val">{student.guardianPhone || 'N/A'}</span>
              </div>
              <div className="ep-report-card__info-item">
                <span className="ep-report-card__info-label">Enrollment Date:</span>
                <span className="ep-report-card__info-val">{student.enrollmentDate || '2023-09-01'}</span>
              </div>
            </div>
          </section>

          {/* KPI Telemetry Banner */}
          <section className="ep-report-card__kpis">
            <div className="ep-report-card__kpi">
              <Award className="ep-report-card__kpi-icon" size={20} />
              <div>
                <div className="ep-report-card__kpi-num">{termGpa}</div>
                <div className="ep-report-card__kpi-text">Term GPA</div>
              </div>
            </div>
            <div className="ep-report-card__kpi">
              <GraduationCap className="ep-report-card__kpi-icon" size={20} />
              <div>
                <div className="ep-report-card__kpi-num">{student.gpa || termGpa}</div>
                <div className="ep-report-card__kpi-text">Cumulative GPA</div>
              </div>
            </div>
            <div className="ep-report-card__kpi">
              <UserCheck className="ep-report-card__kpi-icon" size={20} />
              <div>
                <div className="ep-report-card__kpi-num">{student.attendance || 96}%</div>
                <div className="ep-report-card__kpi-text">Attendance Rate</div>
              </div>
            </div>
            <div className="ep-report-card__kpi">
              <CheckCircle2 className="ep-report-card__kpi-icon" size={20} />
              <div>
                <div className="ep-report-card__kpi-num">Good Standing</div>
                <div className="ep-report-card__kpi-text">Academic Status</div>
              </div>
            </div>
          </section>

          {/* Academic Performance Table */}
          <section className="ep-report-card__courses">
            <h3 className="ep-report-card__section-title">Academic Course Performance & Remarks</h3>
            <table className="ep-report-card__table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Title</th>
                  <th style={{ textAlign: 'center' }}>Credits</th>
                  <th style={{ textAlign: 'center' }}>Score (%)</th>
                  <th style={{ textAlign: 'center' }}>Letter Grade</th>
                  <th>Instructor</th>
                  <th>Faculty Comments & Notes</th>
                </tr>
              </thead>
              <tbody>
                {DEFAULT_COURSES.map((course) => (
                  <tr key={course.code}>
                    <td className="ep-report-card__code">{course.code}</td>
                    <td className="ep-report-card__cname">{course.name}</td>
                    <td style={{ textAlign: 'center' }}>{course.credits.toFixed(1)}</td>
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>{course.score}%</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`ep-report-card__badge ep-report-card__badge--${course.letter.charAt(0).toLowerCase()}`}>
                        {course.letter}
                      </span>
                    </td>
                    <td>{course.teacher}</td>
                    <td className="ep-report-card__remarks">{course.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Attendance Summary */}
          <section className="ep-report-card__attendance-box">
            <h4 className="ep-report-card__sub-title"><Calendar size={16} /> Attendance Telemetry Breakout</h4>
            <div className="ep-report-card__att-grid">
              <div><strong>Days Scheduled:</strong> 90</div>
              <div><strong>Days Present:</strong> 86</div>
              <div><strong>Excused Absences:</strong> 3</div>
              <div><strong>Unexcused Absences:</strong> 1</div>
              <div><strong>Times Tardy:</strong> 0</div>
              <div><strong>Overall Ratio:</strong> {student.attendance || 96}%</div>
            </div>
          </section>

          {/* Official Signatures */}
          <footer className="ep-report-card__footer">
            <div className="ep-report-card__sig-block">
              <div className="ep-report-card__sig-line">Dr. Eleanor Vance</div>
              <div className="ep-report-card__sig-role">Academic Dean & Principal</div>
            </div>
            <div className="ep-report-card__seal">
              <FileText size={24} />
              <span>OFFICIAL SEAL OF THE REGISTRAR</span>
            </div>
            <div className="ep-report-card__sig-block">
              <div className="ep-report-card__sig-line">Marcus Sterling</div>
              <div className="ep-report-card__sig-role">Chief Administrative Officer</div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ReportCardModal;
