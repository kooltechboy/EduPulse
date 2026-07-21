import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'default' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'default',
  children,
  footer,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEsc);

      // Focus trap
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const classNames = ['ep-modal', `ep-modal--${size}`].filter(Boolean).join(' ');

  return createPortal(
    <div className="ep-overlay" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={classNames} ref={modalRef} role="document">
        <div className="ep-modal__header">
          <h2 id="modal-title" className="ep-modal__title">{title}</h2>
          <Button variant="ghost" size="sm" icon={<X size={20} />} onClick={onClose} aria-label="Close modal" />
        </div>
        <div className="ep-modal__content">
          {children}
        </div>
        {footer && (
          <div className="ep-modal__footer">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
