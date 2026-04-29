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
        className={`mx-3 mt-3 rounded-2xl transition-all duration-300 ${
          scrolled
            ? 'glass shadow-[0_4px_24px_rgba(124,58,237,0.1)]'
            : 'bg-white/60 backdrop-blur-xl border border-white/70'
        }`}
      >
        <Container className="h-[60px] flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Logo className="w-8 h-8" />
            <span className="font-bold text-[17px] tracking-tight text-zinc-900 group-hover:text-violet-700 transition-colors">
              MediNest
              <span className="text-violet-500 font-black">.ai</span>
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
