'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Container from '@/components/Container';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Logo from '@/components/Logo';
import { getUser, saveUser } from '@/lib/user-store';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    // If user previously signed up, their data is in localStorage already.
    // If not (returning via login form), save email so dashboard can use it.
    const existing = getUser();
    if (!existing) {
      // Guest login — derive name from email prefix
      const namePart = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      saveUser({ name: namePart, email: email.trim().toLowerCase(), createdAt: new Date().toISOString() });
    }
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4">
      <div className="absolute inset-0 -z-10 dot-grid opacity-60 pointer-events-none" />
      <Container className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-[420px]"
        >
          <div className="card p-8 md:p-10">
            <div className="flex flex-col items-center text-center mb-8">
              <Link href="/" className="mb-5 hover:opacity-80 transition-opacity">
                <Logo className="w-12 h-12" />
              </Link>
              <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight mb-1.5">Welcome back</h1>
              <p className="text-sm text-zinc-500">Sign in to your MediNest account</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600 text-center">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Email address" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                icon={<Mail size={15} />} required autoComplete="email" />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-zinc-700">Password</label>
                  <Link href="/forgot-password" className="text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"><Lock size={15} /></span>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required autoComplete="current-password"
                    className="w-full bg-white/90 border border-[#EDE9F8] rounded-xl pl-10 pr-10 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-all"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="primary" size="md" loading={loading} className="w-full mt-2">
                {!loading && <>Sign in <ArrowRight size={15} /></>}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#EDE9F8]" /></div>
              <div className="relative flex justify-center"><span className="px-3 bg-white text-xs text-zinc-400">or continue as</span></div>
            </div>

            <Link href="/dashboard">
              <Button variant="outline" size="md" className="w-full">Continue as guest</Button>
            </Link>

            <p className="mt-6 text-center text-sm text-zinc-500">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-violet-600 font-semibold hover:text-violet-700 transition-colors">Create one free</Link>
            </p>
          </div>
        </motion.div>
      </Container>
    </main>
  );
}
