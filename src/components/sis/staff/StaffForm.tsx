import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '@/components/ui';

interface StaffFormProps {
  staff?: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const StaffForm: React.FC<StaffFormProps> = ({ staff, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Administration',
    position: '',
    status: 'active'
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        firstName: staff.firstName || '',
        lastName: staff.lastName || '',
        email: staff.email || '',
        phone: staff.phone || '',
        department: staff.department || 'Administration',
        position: staff.position || '',
        status: staff.status || 'active'
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: 'Administration',
        position: '',
        status: 'active'
      });
    }
  }, [staff]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...staff, ...formData, hireDate: staff?.hireDate || new Date().toISOString().split('T')[0] });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={staff ? "Edit Staff" : "Add Staff"}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
          <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <Select 
            label="Department" 
            name="department" 
            value={formData.department} 
            onChange={handleChange}
            options={[
              { label: 'Administration', value: 'Administration' },
              { label: 'Support', value: 'Support' },
              { label: 'IT', value: 'IT' },
              { label: 'Maintenance', value: 'Maintenance' },
            ]}
          />
          <Input label="Position" name="position" value={formData.position} onChange={handleChange} required />
        </div>

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

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">Save Staff</Button>
        </div>
      </form>
    </Modal>
  );
};

export default StaffForm;
