import type { ReactNode } from 'react';

type StatusBadgeProps = {
  children: ReactNode;
  tone?: 'success' | 'warning' | 'info';
};

const toneStyles: Record<NonNullable<StatusBadgeProps['tone']>, string> = {
  success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  warning: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  info: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
};

export const StatusBadge = ({ children, tone = 'info' }: StatusBadgeProps) => {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${toneStyles[tone]}`}>
      {children}
    </span>
  );
};
