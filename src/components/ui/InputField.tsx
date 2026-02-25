import type { InputHTMLAttributes, ReactNode } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
};

export const InputField = ({ label, icon, rightElement, className, ...props }: InputFieldProps) => {
  return (
    <label className="block w-full space-y-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
        {icon && <span className="text-slate-400">{icon}</span>}
        <input
          {...props}
          className={`w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none ${className || ''}`}
        />
        {rightElement && <span className="text-slate-400">{rightElement}</span>}
      </div>
    </label>
  );
};
