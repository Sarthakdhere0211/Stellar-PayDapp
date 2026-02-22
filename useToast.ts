/**
 * Toast Hook
 * Manage toast notifications
 */

import { useState, useCallback } from 'react';
import type { ToastProps } from '../components/ui/Toast';

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id, onClose: removeToast }]);
    return id;
  }, [removeToast]);

  const success = useCallback((message: string, description?: string) => {
    return addToast({ type: 'success', message, description });
  }, [addToast]);

  const error = useCallback((message: string, description?: string) => {
    return addToast({ type: 'error', message, description });
  }, [addToast]);

  const info = useCallback((message: string, description?: string) => {
    return addToast({ type: 'info', message, description });
  }, [addToast]);

  const warning = useCallback((message: string, description?: string) => {
    return addToast({ type: 'warning', message, description });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };
};
