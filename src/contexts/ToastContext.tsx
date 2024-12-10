import React, { createContext, useState, useCallback } from 'react';
import { Toast, ToastType } from '../types/toast';
import { v4 as uuidv4 } from 'uuid';

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType>({} as ToastContextType);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((
    message: string, 
    type: ToastType = 'info', 
    duration = 3000
  ) => {
    const id = uuidv4();
    const newToast: Toast = { id, message, type, duration };
    
    setToasts(currentToasts => [...currentToasts, newToast]);

    // Remover toast automaticamente após a duração
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(currentToasts => 
      currentToasts.filter(toast => toast.id !== id)
    );
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}
