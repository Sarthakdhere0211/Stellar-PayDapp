import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  fullWidth?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-white text-black hover:bg-slate-100',
  ghost: 'bg-white/5 text-white hover:bg-white/10',
  danger: 'bg-red-500/10 text-red-200 hover:bg-red-500/20 border border-red-500/30',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-2 rounded-lg',
  md: 'text-sm px-4 py-2.5 rounded-xl',
  lg: 'text-base px-5 py-3 rounded-xl',
};

export const PrimaryButton = ({
  loading,
  fullWidth,
  variant = 'primary',
  size = 'lg',
  className,
  children,
  ...props
}: PrimaryButtonProps) => {
  return (
    <button
      {...props}
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        className || '',
      ].join(' ')}
    >
      {loading ? <span className="text-sm">Loading...</span> : children}
    </button>
  );
};
