'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type Size    = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'
> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-[0_4px_18px_rgba(124,58,237,0.35)] hover:shadow-[0_6px_24px_rgba(124,58,237,0.45)] border border-transparent',
  secondary:
    'bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-100',
  ghost:
    'bg-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 border border-transparent',
  outline:
    'bg-white/80 backdrop-blur-sm border border-[#EDE9F8] hover:border-violet-300 hover:bg-white text-zinc-700',
  danger:
    'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100',
};

const sizeStyles: Record<Size, string> = {
  xs: 'px-3 py-1.5 text-xs gap-1.5',
  sm: 'px-4 py-2 text-sm gap-2',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-base gap-2.5',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.015 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.975 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-xl',
        'transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
}
