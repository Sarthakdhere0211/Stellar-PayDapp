import { motion, AnimatePresence } from 'framer-motion';

type ToastProps = {
  open: boolean;
  message: string;
  tone?: 'success' | 'error' | 'info';
};

const toneStyles: Record<NonNullable<ToastProps['tone']>, string> = {
  success: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30',
  error: 'bg-red-500/15 text-red-200 border-red-500/30',
  info: 'bg-blue-500/15 text-blue-200 border-blue-500/30',
};

export const Toast = ({ open, message, tone = 'info' }: ToastProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={`fixed bottom-6 right-6 z-50 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg ${toneStyles[tone]}`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
