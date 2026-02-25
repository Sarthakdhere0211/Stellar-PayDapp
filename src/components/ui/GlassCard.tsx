import type { ReactNode } from 'react';

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export const GlassCard = ({ children, className }: GlassCardProps) => {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] p-6 ${className || ''}`}>
      {children}
    </div>
  );
};
