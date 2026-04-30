'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Container from '@/components/Container';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Logo from '@/components/Logo';
import { saveUser } from '@/lib/user-store';

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ chars', pass: password.length >= 8 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) },
    { label: 'Symbol', pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const bar = ['bg-zinc-200', 'bg-rose-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-500'];
  const lbl = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  if (!password) return null;
  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1 h-1">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`flex-1 rounded-full transition-all duration-300 ${i < score ? bar[score] : 'bg-zinc-100'}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {checks.map(({ label, pass }) => (
            <span key={label} className={`text-[10px] flex items-center gap-1 ${pass ? 'text-emerald-600' : 'text-zinc-400'}`}>
              <CheckCircle size={9} className={pass ? 'opacity-100' : 'opacity-30'} />
              {label}
            </span>
          ))}
        </div>
        <span className={`text-xs font-semibold ${score >= 3 ? 'text-emerald-600' : score >= 2 ? 'text-amber-500' : 'text-rose-500'}`}>
          {lbl[score]}
        </span>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [agreed, setAgreed]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!agreed) { setError('Please accept the terms to continue.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    // Save user to localStorage
    saveUser({ name: name.trim(), email: email.trim().toLowerCase(), createdAt: new Date().toISOString() });
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <main className="min-h-[calc(100vh-72px)] flex items-center justify-center py-12 px-4 relative">
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
              <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight mb-1.5">Create your account</h1>
              <p className="text-sm text-zinc-500">Start managing your health for free</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600 text-center">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full name" type="text" placeholder="Jane Doe"
                value={name} onChange={e => setName(e.target.value)}
                icon={<User size={15} />} required autoComplete="name" />

              <Input label="Email address" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                icon={<Mail size={15} />} required autoComplete="email" />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-700">Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"><Lock size={15} /></span>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required autoComplete="new-password"
                    className="w-full bg-white/90 border border-[#EDE9F8] rounded-xl pl-10 pr-10 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-all"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5 shrink-0">
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="sr-only" />
                  <div className={`w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center transition-all ${agreed ? 'bg-violet-600 border-violet-600' : 'border-zinc-300 group-hover:border-violet-400'}`}>
                    {agreed && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                </div>
                <span className="text-xs text-zinc-500 leading-relaxed">
                  I agree to the <Link href="#" className="text-violet-600 hover:underline">Terms</Link> and <Link href="#" className="text-violet-600 hover:underline">Privacy Policy</Link>
                </span>
              </label>

              <Button type="submit" variant="primary" size="md" loading={loading} className="w-full mt-1">
                {!loading && <>Create account <ArrowRight size={15} /></>}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#EDE9F8]" /></div>
              <div className="relative flex justify-center"><span className="px-3 bg-white text-xs text-zinc-400">or</span></div>
            </div>

            <Link href="/dashboard">
              <Button variant="outline" size="md" className="w-full">Continue as guest</Button>
            </Link>

            <p className="mt-6 text-center text-sm text-zinc-500">
              Already have an account?{' '}
              <Link href="/login" className="text-violet-600 font-semibold hover:text-violet-700 transition-colors">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </Container>
    </main>
  );
}
