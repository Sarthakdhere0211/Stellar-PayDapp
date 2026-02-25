import { useCallback, useState } from 'react';

export const useToast = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState<'success' | 'error' | 'info'>('info');

  const showToast = useCallback((nextMessage: string, nextTone: 'success' | 'error' | 'info' = 'info') => {
    setMessage(nextMessage);
    setTone(nextTone);
    setOpen(true);
    setTimeout(() => setOpen(false), 2500);
  }, []);

  return { open, message, tone, showToast };
};
