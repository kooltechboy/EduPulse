import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '@/components/ui';

interface StudentFormProps {
  student?: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({ student, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    grade: '9',
    section: 'A',
    tier: 'standard',
    status: 'active',
    guardianName: '',
    guardianPhone: ''
  });

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        email: student.email || '',
        grade: student.grade || '9',
        section: student.section || 'A',
        tier: student.tier || 'standard',
        status: student.status || 'active',
        guardianName: student.guardianName || '',
        guardianPhone: student.guardianPhone || ''
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        grade: '9',
        section: 'A',
        tier: 'standard',
        status: 'active',
        guardianName: '',
        guardianPhone: ''
      });
    }
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...student, ...formData, gpa: student?.gpa || '0.0', attendance: student?.attendance || 100 });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={student ? "Edit Student" : "Add Student"}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
          <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
        <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <Select 
            label="Grade Level / Year" 
            name="grade" 
            value={formData.grade} 
            onChange={handleChange}
            options={[
              { label: 'Pre-K', value: 'pre-k' },
              { label: 'Kindergarten', value: 'kindergarten' },
              { label: 'Grade 1 (Primary)', value: 'grade-1' },
              { label: 'Grade 2 (Primary)', value: 'grade-2' },
              { label: 'Grade 3 (Primary)', value: 'grade-3' },
              { label: 'Grade 4 (Primary)', value: 'grade-4' },
              { label: 'Grade 5 (Primary)', value: 'grade-5' },
              { label: 'Grade 6 (Primary)', value: 'grade-6' },
              { label: 'Grade 7 (Junior High)', value: 'grade-7' },
              { label: 'Grade 8 (Junior High)', value: 'grade-8' },
              { label: 'Grade 9 (Junior High)', value: 'grade-9' },
              { label: 'Grade 10 (Senior High)', value: '10' },
              { label: 'Grade 11 (Senior High)', value: '11' },
              { label: 'Grade 12 (Senior High)', value: '12' },
              { label: 'College - Freshman (Yr 1)', value: 'undergraduate-yr1' },
              { label: 'College - Sophomore (Yr 2)', value: 'undergraduate-yr2' },
              { label: 'College - Junior (Yr 3)', value: 'undergraduate-yr3' },
              { label: 'College - Senior (Yr 4)', value: 'undergraduate-yr4' },
              { label: 'Postgraduate / Masters', value: 'postgraduate' },
            ]}
          />
          <Select 
            label="Section / Room" 
            name="section" 
            value={formData.section} 
            onChange={handleChange}
            options={[
              { label: 'Section A (Room 101)', value: 'A' },
              { label: 'Section B (Room 102)', value: 'B' },
              { label: 'Section C (Room 103)', value: 'C' },
              { label: 'Section D (Lab 1)', value: 'D' },
            ]}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <Input label="Guardian Name" name="guardianName" value={formData.guardianName} onChange={handleChange} />
          <Input label="Guardian Phone" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <Select 
            label="Educational Tier" 
            name="tier" 
            value={formData.tier} 
            onChange={handleChange}
            options={[
              { label: 'Early Childhood (Pre-K & Kindergarten)', value: 'early-childhood' },
              { label: 'Primary School (Grades 1 - 6)', value: 'elementary' },
              { label: 'Junior High School (Grades 7 - 9)', value: 'middle-school' },
              { label: 'Senior High School (Grades 10 - 12)', value: 'high-school' },
              { label: 'College & University (Higher Ed)', value: 'higher-education' },
            ]}
          />
          <Select 
            label="Status" 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">Save Student</Button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentForm;
