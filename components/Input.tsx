'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  hint,
  icon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-zinc-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full bg-white/90 border rounded-xl px-4 py-3 text-sm text-zinc-900',
            'placeholder:text-zinc-400',
            'outline-none transition-all duration-200',
            'focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400',
            'border-[#EDE9F8]',
            icon && 'pl-10',
            error
              ? 'border-rose-400 focus:ring-rose-400/20 focus:border-rose-400'
              : '',
            className,
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-rose-500 flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 4.5zm0 7a.875.875 0 110-1.75.875.875 0 010 1.75z" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-zinc-400">{hint}</p>
      )}
    </div>
  );
}
