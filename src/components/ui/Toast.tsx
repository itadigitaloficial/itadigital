import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react';
import { Toast as ToastType } from '../../types/toast';

const toastIcons = {
  success: <CheckCircle2 className="text-green-500" />,
  error: <XCircle className="text-red-500" />,
  warning: <AlertTriangle className="text-yellow-500" />,
  info: <Info className="text-blue-500" />
};

const toastColors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
};

interface ToastProps extends ToastType {
  onClose: () => void;
}

export function Toast({ id, message, type, onClose }: ToastProps) {
  return (
    <div 
      className={`
        flex items-center p-4 rounded-lg shadow-lg 
        ${toastColors[type]} 
        animate-slide-in-right
        relative overflow-hidden
        mb-4 max-w-md mx-auto
      `}
    >
      <div className="flex-shrink-0 mr-4">
        {toastIcons[type]}
      </div>
      
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      
      <button 
        onClick={onClose} 
        className="ml-4 hover:bg-opacity-10 rounded-full p-1"
      >
        <X size={20} />
      </button>

      {/* Barra de progresso */}
      <div 
        className={`
          absolute bottom-0 left-0 h-1 
          ${toastColors[type]} 
          animate-toast-progress
        `}
      />
    </div>
  );
}
