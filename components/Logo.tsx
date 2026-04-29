import React from 'react';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-9 h-9', className)}
      aria-label="MediNest logo"
    >
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C3AED" />
          <stop offset="0.55" stopColor="#6366F1" />
          <stop offset="1" stopColor="#0EA5E9" />
        </linearGradient>
        <linearGradient id="lg2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A78BFA" stopOpacity="0.4" />
          <stop offset="1" stopColor="#818CF8" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {/* Background circle */}
      <circle cx="20" cy="20" r="19" fill="url(#lg2)" />
      {/* Outer arc */}
      <path
        d="M33 20C33 27.18 27.18 33 20 33C12.82 33 7 27.18 7 20C7 14.1 10.7 9.1 16 7.2"
        stroke="url(#lg1)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Inner arc */}
      <path
        d="M13 20C13 23.87 16.13 27 20 27C23.87 27 27 23.87 27 20"
        stroke="url(#lg1)"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.55"
      />
      {/* Medical cross */}
      <path
        d="M20 14V22M16.5 18H23.5"
        stroke="url(#lg1)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
