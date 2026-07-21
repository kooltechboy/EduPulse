import React, { useState, useEffect, useRef } from 'react';
import { Plus, Download, Save, ChevronDown, ChevronUp, Award, BookOpen, Users, TrendingUp, Sparkles, Upload, FileCheck, Layers, FileText } from 'lucide-react';
import { getPerformanceInsights, isAIAvailable } from '@/services/geminiService';
import { ReportCardModal } from '@/components/sis/reports/ReportCardModal';
import './Gradebook.css';

interface Assignment {
  id: string;
  name: string;
  weight: number;
  standard?: string;
}

interface StudentGrade {
  studentId: string;
  studentName: string;
  grades: Record<string, number | null>;
  sbgMastery?: Record<string, number>; // 1 = Emerging, 2 = Developing, 3 = Meets, 4 = Exceeds
  aiComments?: string;
}

export const Gradebook: React.FC = () => {
  const [course, setCourse] = useState('MATH401');
  const [gradingMode, setGradingMode] = useState<'traditional' | 'sbg'>('traditional');
  
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 'a1', name: 'Quiz 1', weight: 20, standard: 'Math.A1: Linear Equations' },
    { id: 'a2', name: 'Midterm Exam', weight: 40, standard: 'Math.A2: Quadratic Analysis' },
    { id: 'a3', name: 'Lab Project 1', weight: 20, standard: 'Math.A3: Applied Modeling' },
    { id: 'a4', name: 'Homework 1', weight: 20, standard: 'Math.A4: Proof Synthesis' },
  ]);

  const [studentGrades, setStudentGrades] = useState<StudentGrade[]>([
    { studentId: 's1', studentName: 'Alice Johnson', grades: { a1: 85, a2: 92, a3: 90, a4: 100 }, sbgMastery: { a1: 3, a2: 4, a3: 4, a4: 4 }, aiComments: 'Exhibits strong algebraic mastery and creative problem solving.' },
    { studentId: 's2', studentName: 'Bob Smith', grades: { a1: 75, a2: 80, a3: 85, a4: 90 }, sbgMastery: { a1: 2, a2: 3, a3: 3, a4: 3 }, aiComments: 'Consistent progress across core standards. Recommend targeted proofs review.' },
    { studentId: 's3', studentName: 'Charlie Davis', grades: { a1: 95, a2: 88, a3: 92, a4: null }, sbgMastery: { a1: 4, a2: 3, a3: 4, a4: 1 }, aiComments: 'High technical comprehension; missing homework assignment needs submission.' },
    { studentId: 's4', studentName: 'Diana Prince', grades: { a1: 100, a2: 98, a3: 96, a4: 100 }, sbgMastery: { a1: 4, a2: 4, a3: 4, a4: 4 }, aiComments: 'Top academic performer with flawless concept mastery across all competencies.' },
    { studentId: 's5', studentName: 'Edward Norton', grades: { a1: 60, a2: 70, a3: 75, a4: 85 }, sbgMastery: { a1: 2, a2: 2, a3: 2, a4: 3 }, aiComments: 'Steady growth observed. Requires additional support on quadratic formulations.' },
  ]);

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [generatingAiId, setGeneratingAiId] = useState<string | null>(null);
  const [reportCardStudent, setReportCardStudent] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`gradebook_${course}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.assignments) setAssignments(data.assignments);
        if (data.studentGrades) setStudentGrades(data.studentGrades);
      } catch (e) {
        console.error('Failed to parse gradebook cache', e);
      }
    }
  }, [course]);

  const handleSave = () => {
    localStorage.setItem(`gradebook_${course}`, JSON.stringify({ assignments, studentGrades }));
    alert('Gradebook saved successfully to local telemetry store!');
  };

  const handleAddAssignment = () => {
    const name = prompt('Enter assignment title:');
    if (!name) return;
    const weightStr = prompt('Enter weight percentage (%):', '10');
    const weight = parseInt(weightStr || '10', 10);
    const standard = prompt('Enter learning standard identifier (e.g., Math.A5):', 'Math.A5') || 'Math.A5';
    
    const newId = `a${Date.now()}`;
    setAssignments([...assignments, { id: newId, name, weight, standard }]);
  };

  const updateGrade = (studentId: string, assignmentId: string, value: string) => {
    let numValue: number | null = parseInt(value, 10);
    if (isNaN(numValue)) numValue = null;
    if (numValue !== null && (numValue < 0 || numValue > 100)) return;

    setStudentGrades(prev => prev.map(student => {
      if (student.studentId === studentId) {
        return { ...student, grades: { ...student.grades, [assignmentId]: numValue } };
      }
      return student;
    }));
  };

  const updateSbgMastery = (studentId: string, assignmentId: string, level: number) => {
    setStudentGrades(prev => prev.map(student => {
      if (student.studentId === studentId) {
        const updated = { ...(student.sbgMastery || {}), [assignmentId]: level };
        return { ...student, sbgMastery: updated };
      }
      return student;
    }));
  };

  const calculateWeightedAverage = (grades: Record<string, number | null>) => {
    let totalWeight = 0;
    let earned = 0;
    
    assignments.forEach(a => {
      const g = grades[a.id];
      if (g !== null && g !== undefined) {
        totalWeight += a.weight;
        earned += (g * a.weight) / 100;
      }
    });

    if (totalWeight === 0) return 0;
    return Math.round((earned / totalWeight) * 100);
  };

  const calculateSbgMasteryAverage = (masteryMap?: Record<string, number>) => {
    if (!masteryMap) return 1.0;
    const values = Object.values(masteryMap);
    if (values.length === 0) return 1.0;
    const sum = values.reduce((acc, v) => acc + v, 0);
    return (sum / values.length).toFixed(1);
  };

  const handleGenerateAiComments = async (student: StudentGrade) => {
    setGeneratingAiId(student.studentId);
    try {
      const avg = calculateWeightedAverage(student.grades);
      const res = await getPerformanceInsights({
        studentCount: 1,
        averageGpa: avg / 25,
        attendanceRate: 95,
        subjectAverages: student.grades as Record<string, number>,
      });

      if (res.success && res.content) {
        const shortComment = res.content.split('\n')[0].substring(0, 140) || 'Demonstrates solid academic engagement and subject comprehension.';
        setStudentGrades(prev => prev.map(s => s.studentId === student.studentId ? { ...s, aiComments: shortComment } : s));
      } else {
        const fallback = `${student.studentName} maintains a ${avg}% weighted average. Good engagement across assignments.`;
        setStudentGrades(prev => prev.map(s => s.studentId === student.studentId ? { ...s, aiComments: fallback } : s));
      }
    } catch (e) {
      console.error('AI generation error', e);
    } finally {
      setGeneratingAiId(null);
    }
  };

  const exportCSV = () => {
    let csv = `Student ID,Student Name,${assignments.map(a => `"${a.name} (${a.weight}%)"`).join(',')},Final Score (%),AI Remarks\n`;
    studentGrades.forEach(s => {
      const avg = calculateWeightedAverage(s.grades);
      const row = [`"${s.studentId}"`, `"${s.studentName}"`, ...assignments.map(a => s.grades[a.id] ?? ''), avg, `"${s.aiComments || ''}"`].join(',');
      csv += row + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Gradebook_${course}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length <= 1) return;

      const newStudents: StudentGrade[] = [];
      lines.slice(1).forEach((line, idx) => {
        const parts = line.split(',').map(p => p.replace(/^"|"$/g, ''));
        if (parts.length >= 2) {
          const studentId = parts[0] || `s-${idx + 10}`;
          const studentName = parts[1] || `Imported Student ${idx + 1}`;
          const grades: Record<string, number | null> = {};
          assignments.forEach((a, aIdx) => {
            const val = parseInt(parts[2 + aIdx], 10);
            grades[a.id] = isNaN(val) ? null : val;
          });
          newStudents.push({ studentId, studentName, grades, aiComments: 'Imported via CSV score sheet.' });
        }
      });

      if (newStudents.length > 0) {
        setStudentGrades(newStudents);
        alert(`Successfully imported ${newStudents.length} student grade records!`);
      }
    };
    reader.readAsText(file);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = [...studentGrades].sort((a, b) => {
    if (!sortConfig) return 0;
    let valA, valB;
    
    if (sortConfig.key === 'name') {
      valA = a.studentName;
      valB = b.studentName;
    } else if (sortConfig.key === 'average') {
      valA = calculateWeightedAverage(a.grades);
      valB = calculateWeightedAverage(b.grades);
    } else {
      valA = a.grades[sortConfig.key] ?? -1;
      valB = b.grades[sortConfig.key] ?? -1;
    }

    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const classAvg = Math.round(
    studentGrades.reduce((sum, s) => sum + calculateWeightedAverage(s.grades), 0) / (studentGrades.length || 1)
  );

  return (
    <div className="ep-gradebook">
      {/* 1. Header */}
      <header className="ep-gradebook__header">
        <div>
          <h1 className="ep-gradebook__title">Class Gradebook & Standards Mastery Engine</h1>
          <p className="ep-gradebook__subtitle">Unified assessment matrix supporting Traditional Weighted Scoring & Standards-Based Rubrics (SBG)</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="ep-tabs" style={{ padding: '2px' }}>
            <button 
              className={`ep-tab ${gradingMode === 'traditional' ? 'ep-tab--active' : ''}`}
              onClick={() => setGradingMode('traditional')}
            >
              Weighted %
            </button>
            <button 
              className={`ep-tab ${gradingMode === 'sbg' ? 'ep-tab--active' : ''}`}
              onClick={() => setGradingMode('sbg')}
            >
              <Layers size={14} style={{ marginRight: 4 }} /> Standards Rubric (SBG)
            </button>
          </div>

          <select className="ep-input" value={course} onChange={(e) => setCourse(e.target.value)} style={{ width: '210px' }}>
            <option value="MATH401">Advanced Mathematics (MATH401)</option>
            <option value="PHY301">Physics I (PHY301)</option>
            <option value="ENG202">World Literature (ENG202)</option>
          </select>
          
          <button className="ep-btn ep-btn--secondary" onClick={handleAddAssignment}>
            <Plus size={16} /> Column
          </button>

          <button className="ep-btn ep-btn--secondary" onClick={exportCSV} title="Export Gradebook CSV">
            <Download size={16} /> Export
          </button>

          <input type="file" ref={fileInputRef} accept=".csv" style={{ display: 'none' }} onChange={handleCsvImport} />
          <button className="ep-btn ep-btn--secondary" onClick={() => fileInputRef.current?.click()} title="Import CSV score sheet">
            <Upload size={16} /> Import
          </button>

          <button className="ep-btn ep-btn--primary" onClick={handleSave}>
            <Save size={16} /> Save Matrix
          </button>
        </div>
      </header>

      {/* 2. KPI Telemetry Grid */}
      <section className="ep-gradebook__kpi-grid">
        <div className="ep-gradebook__kpi-card">
          <div className="ep-gradebook__kpi-icon ep-gradebook__kpi-icon--blue">
            <Award size={22} />
          </div>
          <div>
            <div className="ep-gradebook__kpi-val">{classAvg}%</div>
            <div className="ep-gradebook__kpi-lbl">Class Average ({gradingMode.toUpperCase()})</div>
          </div>
        </div>

        <div className="ep-gradebook__kpi-card">
          <div className="ep-gradebook__kpi-icon ep-gradebook__kpi-icon--purple">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="ep-gradebook__kpi-val">{assignments.length}</div>
            <div className="ep-gradebook__kpi-lbl">Learning Standards Graded</div>
          </div>
        </div>

        <div className="ep-gradebook__kpi-card">
          <div className="ep-gradebook__kpi-icon ep-gradebook__kpi-icon--green">
            <Users size={22} />
          </div>
          <div>
            <div className="ep-gradebook__kpi-val">{studentGrades.length}</div>
            <div className="ep-gradebook__kpi-lbl">Enrolled Students</div>
          </div>
        </div>

        <div className="ep-gradebook__kpi-card">
          <div className="ep-gradebook__kpi-icon ep-gradebook__kpi-icon--amber">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="ep-gradebook__kpi-val">{isAIAvailable() ? 'Active' : 'Ready'}</div>
            <div className="ep-gradebook__kpi-lbl">Gemini AI Auto-Commenter</div>
          </div>
        </div>
      </section>

      {/* 3. Main Gradebook Table */}
      <div className="ep-table-wrapper">
        <table className="ep-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                Student Roster {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </th>
              {assignments.map(a => (
                <th key={a.id} onClick={() => handleSort(a.id)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <div>{a.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-primary-400)', fontWeight: 500 }}>
                    {gradingMode === 'traditional' ? `${a.weight}% Weight` : a.standard}
                  </div>
                </th>
              ))}
              <th onClick={() => handleSort('average')} style={{ cursor: 'pointer', textAlign: 'center' }}>
                {gradingMode === 'traditional' ? 'Final Score' : 'Mastery Level'}
              </th>
              <th>Faculty AI Remarks</th>
              <th style={{ textAlign: 'center' }}>Report Card</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map(student => {
              const avg = calculateWeightedAverage(student.grades);
              const sbgAvg = calculateSbgMasteryAverage(student.sbgMastery);

              return (
                <tr key={student.studentId}>
                  <td style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{student.studentName}</td>
                  
                  {assignments.map(a => (
                    <td key={a.id} style={{ textAlign: 'center', padding: '6px' }}>
                      {gradingMode === 'traditional' ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={student.grades[a.id] ?? ''}
                          onChange={(e) => updateGrade(student.studentId, a.id, e.target.value)}
                          className="grade-input"
                          style={{ background: 'var(--color-surface-100)', border: '1px solid var(--color-border)', borderRadius: '6px', width: '64px', margin: '0 auto' }}
                        />
                      ) : (
                        <select
                          value={student.sbgMastery?.[a.id] || 3}
                          onChange={(e) => updateSbgMastery(student.studentId, a.id, parseInt(e.target.value, 10))}
                          className="ep-input"
                          style={{ padding: '4px 6px', fontSize: '12px', width: '80px', margin: '0 auto' }}
                        >
                          <option value={4}>4 - Exceeds</option>
                          <option value={3}>3 - Meets</option>
                          <option value={2}>2 - Developing</option>
                          <option value={1}>1 - Emerging</option>
                        </select>
                      )}
                    </td>
                  ))}

                  {/* Summary Metric Column */}
                  <td style={{ textAlign: 'center', fontWeight: 800, fontSize: '15px' }}>
                    {gradingMode === 'traditional' ? (
                      <span style={{ color: avg >= 85 ? 'var(--color-success-400)' : avg >= 70 ? 'var(--color-warning-400)' : 'var(--color-danger-400)' }}>
                        {avg}%
                      </span>
                    ) : (
                      <span style={{ color: Number(sbgAvg) >= 3.5 ? 'var(--color-success-400)' : Number(sbgAvg) >= 2.5 ? 'var(--color-primary-400)' : 'var(--color-warning-400)' }}>
                        L{sbgAvg} / 4.0
                      </span>
                    )}
                  </td>

                  {/* AI Remark Generator Column */}
                  <td style={{ maxWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', flex: 1, fontStyle: 'italic' }}>
                        {student.aiComments || 'No remark generated yet.'}
                      </span>
                      <button
                        className="ep-btn ep-btn--ghost"
                        style={{ padding: '4px 8px' }}
                        onClick={() => handleGenerateAiComments(student)}
                        disabled={generatingAiId === student.studentId}
                        title="Generate AI Report Card Comment"
                      >
                        <Sparkles size={14} style={{ color: 'var(--color-primary-400)' }} />
                      </button>
                    </div>
                  </td>

                  {/* Printable Report Card Trigger */}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="ep-btn ep-btn--secondary"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                      onClick={() => setReportCardStudent({
                        id: student.studentId,
                        firstName: student.studentName.split(' ')[0],
                        lastName: student.studentName.split(' ')[1] || '',
                        email: `${student.studentName.toLowerCase().replace(' ', '.')}@edupulse.edu`,
                        grade: '10',
                        section: 'A',
                        gpa: (avg / 25).toFixed(2),
                        attendance: 96,
                        guardianName: 'Parent Guardian',
                        guardianPhone: '(555) 019-8234'
                      })}
                    >
                      <FileText size={12} style={{ marginRight: 4 }} /> Report Card
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Official Report Card Modal */}
      {reportCardStudent && (
        <ReportCardModal
          student={reportCardStudent}
          isOpen={!!reportCardStudent}
          onClose={() => setReportCardStudent(null)}
        />
      )}
    </div>
  );
};

export default Gradebook;
