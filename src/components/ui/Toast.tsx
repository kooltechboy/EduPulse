import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { useUIStore, type Toast } from '@/stores/uiStore';

export const ToastProvider: React.FC = () => {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="ep-toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>,
    document.body
  );
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />,
  };

  const classNames = ['ep-toast', `ep-toast--${toast.type}`].join(' ');

  return (
    <div className={classNames} role="alert">
      <div className="ep-toast__icon">{icons[toast.type]}</div>
      <div className="ep-toast__content">
        {toast.title && <div className="ep-toast__title">{toast.title}</div>}
        {toast.message && <div className="ep-toast__message">{toast.message}</div>}
      </div>
      <button className="ep-toast__close" onClick={onClose} aria-label="Close toast">
        <X size={16} />
      </button>
    </div>
  );
};

export const useToast = () => {
  const addToast = useUIStore((s) => s.addToast);

  return {
    success: (message: string, title?: string) => addToast({ type: 'success', message, title }),
    error: (message: string, title?: string) => addToast({ type: 'error', message, title }),
    warning: (message: string, title?: string) => addToast({ type: 'warning', message, title }),
    info: (message: string, title?: string) => addToast({ type: 'info', message, title }),
  };
};
