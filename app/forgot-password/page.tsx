'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Container from '@/components/Container';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Logo from '@/components/Logo';

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <main className="min-h-[calc(100vh-72px)] flex items-center justify-center py-12 px-4 relative">
      <div className="absolute inset-0 -z-10 dot-grid opacity-60 pointer-events-none" />

      <Container className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[400px]"
        >
          <div className="card p-8 md:p-10">
            <div className="flex flex-col items-center text-center mb-8">
              <Link href="/" className="mb-5 hover:opacity-80 transition-opacity">
                <Logo className="w-12 h-12" />
              </Link>
              <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight mb-1.5">
                Reset your password
              </h1>
              <p className="text-sm text-zinc-500">
                Enter your email and we&apos;ll send a reset link
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <Input
                    label="Email address"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail size={15} />}
                    required
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={loading}
                    className="w-full"
                  >
                    {!loading && 'Send reset link'}
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={28} className="text-emerald-500" />
                  </div>
                  <h3 className="font-bold text-zinc-900 mb-2">Check your inbox</h3>
                  <p className="text-sm text-zinc-500 mb-6">
                    We sent a reset link to <strong>{email}</strong>
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSent(false)}
                    className="mx-auto"
                  >
                    Try a different email
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-violet-600 transition-colors"
              >
                <ArrowLeft size={13} />
                Back to sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </Container>
    </main>
  );
}
