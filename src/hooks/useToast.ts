import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext';
import { ToastType } from '../types/toast';

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }

  const success = (message: string, duration?: number) => 
    context.addToast(message, 'success', duration);

  const error = (message: string, duration?: number) => 
    context.addToast(message, 'error', duration);

  const warning = (message: string, duration?: number) => 
    context.addToast(message, 'warning', duration);

  const info = (message: string, duration?: number) => 
    context.addToast(message, 'info', duration);

  return {
    ...context,
    success,
    error,
    warning,
    info,
  };
}
