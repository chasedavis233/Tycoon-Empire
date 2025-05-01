import React from 'react';
import { useToast, Toast as ToastType, ToastVariant } from '../../hooks/useToast';
import { X, CheckCircle, AlertTriangle, Info, Bell } from 'lucide-react';

const Toast: React.FC<{ toast: ToastType; onDismiss: () => void }> = ({ 
  toast, 
  onDismiss 
}) => {
  const getToastStyles = (variant: ToastVariant = 'default') => {
    switch (variant) {
      case 'success':
        return {
          bg: 'bg-green-500',
          icon: <CheckCircle className="h-5 w-5 text-white" />
        };
      case 'error':
        return {
          bg: 'bg-red-500',
          icon: <AlertTriangle className="h-5 w-5 text-white" />
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500',
          icon: <AlertTriangle className="h-5 w-5 text-white" />
        };
      case 'event':
        return {
          bg: 'bg-purple-500',
          icon: <Bell className="h-5 w-5 text-white" />
        };
      default:
        return {
          bg: 'bg-blue-500',
          icon: <Info className="h-5 w-5 text-white" />
        };
    }
  };

  const styles = getToastStyles(toast.variant);

  return (
    <div 
      className={`${styles.bg} text-white p-4 rounded-lg shadow-lg flex items-start w-full max-w-sm animate-slide-in`}
      role="alert"
    >
      <div className="mr-3 pt-0.5">
        {styles.icon}
      </div>
      <div className="flex-1">
        <h3 className="font-bold">{toast.title}</h3>
        {toast.description && (
          <p className="text-sm mt-1">{toast.description}</p>
        )}
      </div>
      <button 
        onClick={onDismiss}
        className="ml-3 text-white hover:text-gray-200 transition-colors"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export const Toaster: React.FC = () => {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          toast={toast} 
          onDismiss={() => dismissToast(toast.id)} 
        />
      ))}
    </div>
  );
};