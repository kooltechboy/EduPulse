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
            label="Grade" 
            name="grade" 
            value={formData.grade} 
            onChange={handleChange}
            options={[
              { label: 'Grade 9', value: '9' },
              { label: 'Grade 10', value: '10' },
              { label: 'Grade 11', value: '11' },
              { label: 'Grade 12', value: '12' },
            ]}
          />
          <Select 
            label="Section" 
            name="section" 
            value={formData.section} 
            onChange={handleChange}
            options={[
              { label: 'Section A', value: 'A' },
              { label: 'Section B', value: 'B' },
              { label: 'Section C', value: 'C' },
            ]}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <Input label="Guardian Name" name="guardianName" value={formData.guardianName} onChange={handleChange} />
          <Input label="Guardian Phone" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <Select 
            label="Tier" 
            name="tier" 
            value={formData.tier} 
            onChange={handleChange}
            options={[
              { label: 'Standard', value: 'standard' },
              { label: 'Premium', value: 'premium' },
              { label: 'Scholarship', value: 'scholarship' },
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
