'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import Container from './Container';
import Logo from './Logo';
import Button from './Button';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full"
    >
      <div
        className={`mx-4 mt-4 rounded-3xl transition-all duration-500 ${
          scrolled
            ? 'glass shadow-[0_8px_32px_rgba(155,135,245,0.15)]'
            : 'bg-white/50 backdrop-blur-2xl border border-white/60 shadow-sm'
        }`}
      >
        <Container className="h-[68px] flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Logo className="w-9 h-9" />
            <span className="font-bold text-[18px] tracking-tight text-zinc-900 group-hover:text-violet-600 transition-colors duration-300">
              MediNest
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500 font-black">.ai</span>
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm">Get started</Button>
            </Link>
          </div>
        </Container>
      </div>
    </motion.header>
  );
}
