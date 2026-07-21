import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '@/components/ui';

interface TeacherFormProps {
  teacher?: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const TeacherForm: React.FC<TeacherFormProps> = ({ teacher, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: 'Science',
    subjects: '',
    qualification: 'M.Sc. Education',
    status: 'active'
  });

  useEffect(() => {
    if (teacher) {
      setFormData({
        firstName: teacher.firstName || '',
        lastName: teacher.lastName || '',
        email: teacher.email || '',
        department: teacher.department || 'Science',
        subjects: teacher.subjects || '',
        qualification: teacher.qualification || 'M.Sc. Education',
        status: teacher.status || 'active'
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        department: 'Science',
        subjects: '',
        qualification: 'M.Sc. Education',
        status: 'active'
      });
    }
  }, [teacher]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...teacher,
      ...formData,
      classesCount: teacher?.classesCount || 3,
      photo: teacher?.photo || `https://i.pravatar.cc/150?u=tch${Date.now()}`,
      hireDate: teacher?.hireDate || new Date().toISOString().split('T')[0]
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={teacher ? "Edit Faculty Teacher" : "Add Faculty Teacher"}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
          <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
        <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <Select 
            label="Department" 
            name="department" 
            value={formData.department} 
            onChange={handleChange}
            options={[
              { label: 'Science', value: 'Science' },
              { label: 'Mathematics', value: 'Mathematics' },
              { label: 'English', value: 'English' },
              { label: 'History', value: 'History' },
              { label: 'Arts', value: 'Arts' },
            ]}
          />
          <Input label="Subjects (comma separated)" name="subjects" value={formData.subjects} onChange={handleChange} required placeholder="e.g. Physics, Algebra" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <Input label="Qualification / Degree" name="qualification" value={formData.qualification} onChange={handleChange} required />
          <Select 
            label="Status" 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            options={[
              { label: 'Active', value: 'active' },
              { label: 'On Leave', value: 'on leave' },
            ]}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">Save Faculty Record</Button>
        </div>
      </form>
    </Modal>
  );
};

export default TeacherForm;
