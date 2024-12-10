import React from 'react';
import { useToast } from '../../hooks/useToast';
import { Toast } from './Toast';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div 
      className="fixed top-4 right-4 z-[9999] pointer-events-none"
      aria-live="polite"
    >
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
