'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  animate?: boolean;
  hover?: boolean;
}

export default function Card({
  children,
  className,
  delay = 0,
  animate = true,
  hover = true,
  ...rest
}: CardProps) {
  const base = cn('card', hover && 'hover:-translate-y-0.5', className);

  if (!animate) {
    return <div className={base} {...rest}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className={base}
      {...(rest as any)}
    >
      {children}
    </motion.div>
  );
}
