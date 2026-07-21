import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'primary';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  variant = 'primary',
}) => {
  const footer = (
    <div className="ep-confirm-dialog__actions" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>
      <Button variant={variant} onClick={() => { onConfirm(); onClose(); }}>
        {confirmLabel}
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} size="default">
      <p className="ep-confirm-dialog__message">{message}</p>
    </Modal>
  );
};
