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
    'bg-gradient-to-br from-[#9B87F5] via-[#8B92F8] to-[#7DD3FC] text-white shadow-[0_8px_24px_rgba(155,135,245,0.35)] hover:shadow-[0_12px_32px_rgba(155,135,245,0.45)] border border-white/20',
  secondary:
    'bg-gradient-to-br from-violet-50 to-lavender-50 text-violet-700 hover:from-violet-100 hover:to-lavender-100 border border-violet-200/50 shadow-sm',
  ghost:
    'bg-transparent text-zinc-600 hover:text-zinc-900 hover:bg-white/60 border border-transparent backdrop-blur-sm',
  outline:
    'bg-white/70 backdrop-blur-md border border-violet-200/40 hover:border-violet-300/60 hover:bg-white/90 text-zinc-700 shadow-sm hover:shadow-md',
  danger:
    'bg-gradient-to-br from-rose-50 to-rose-100 text-rose-600 hover:from-rose-100 hover:to-rose-200 border border-rose-200/50 shadow-sm',
};

const sizeStyles: Record<Size, string> = {
  xs: 'px-3.5 py-2 text-xs gap-1.5',
  sm: 'px-5 py-2.5 text-sm gap-2',
  md: 'px-6 py-3 text-sm gap-2',
  lg: 'px-8 py-4 text-base gap-2.5',
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
        'inline-flex items-center justify-center font-semibold rounded-2xl',
        'transition-all duration-300 ease-out',
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
