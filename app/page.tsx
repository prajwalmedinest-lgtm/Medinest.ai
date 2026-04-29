'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight, Upload, CalendarCheck, BookOpen,
  TrendingUp, Users, Shield, Sparkles, Mail,
  Linkedin, Instagram, Activity, FileText, Heart,
} from 'lucide-react';
import Link from 'next/link';
import Container from '@/components/Container';
import Button from '@/components/Button';
import Card from '@/components/Card';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const, delay },
});

const features = [
  {
    icon: Upload,
    color: 'bg-violet-50 text-violet-600',
    ring: 'ring-violet-100',
    title: 'Frictionless Upload',
    desc: 'Drag and drop reports, prescriptions, and scans. Organised and categorised instantly.',
    tag: 'Upload',
  },
  {
    icon: CalendarCheck,
    color: 'bg-indigo-50 text-indigo-600',
    ring: 'ring-indigo-100',
    title: 'Care Plan Constructor',
    desc: 'Auto-generated treatment timelines, medication reminders, and follow-up scheduling.',
    tag: 'Planning',
  },
  {
    icon: BookOpen,
    color: 'bg-sky-50 text-sky-600',
    ring: 'ring-sky-100',
    title: 'AI Health Story',
    desc: 'Transform complex medical records into a clear, human-readable narrative.',
    tag: 'Insights',
  },
  {
    icon: TrendingUp,
    color: 'bg-emerald-50 text-emerald-600',
    ring: 'ring-emerald-100',
    title: 'Health Trend Analysis',
    desc: 'Track blood sugar, cholesterol, BP, and more across time with interactive charts.',
    tag: 'Analytics',
  },
  {
    icon: Users,
    color: 'bg-rose-50 text-rose-600',
    ring: 'ring-rose-100',
    title: 'Family Health Hub',
    desc: 'Manage health records for your entire family with shared care plans and reminders.',
    tag: 'Family',
  },
  {
    icon: Shield,
    color: 'bg-amber-50 text-amber-600',
    ring: 'ring-amber-100',
    title: 'Private & Secure',
    desc: 'Your data stays yours. Zero third-party sharing, full data portability.',
    tag: 'Security',
  },
];

export default function LandingPage() {
  return (
    <main className="overflow-hidden">

      {/* Hero */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.06, 1], x: [0, 16, 0], y: [0, -12, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-40 -left-20 w-[600px] h-[600px] rounded-full bg-violet-200/25 blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1, 1.08, 1], x: [0, -18, 0], y: [0, 16, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-sky-200/20 blur-[90px]"
          />
        </div>

        <Container>
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div {...fadeUp(0)}>
              <span className="badge mb-6 inline-flex items-center gap-1.5">
                <Sparkles size={10} />
                AI-Powered Healthcare Platform
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.08)}
              className="text-[2.75rem] sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.06] mb-6"
            >
              <span className="text-zinc-900">Your health.</span>
              <br />
              <span className="gradient-text">One story.</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.16)}
              className="text-lg sm:text-xl text-zinc-500 max-w-2xl leading-relaxed mb-10"
            >
              MediNest.ai transforms scattered medical records into a unified,
              intelligent health story — organised, understood, and always ready
              for your next doctor visit.
            </motion.p>

            <motion.div
              {...fadeUp(0.24)}
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
            >
              <Link href="/signup">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Get started free <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View dashboard
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Preview card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.35 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="card p-1.5 shadow-xl">
              <div className="rounded-[calc(1.75rem-6px)] bg-gradient-to-br from-violet-50 via-white to-sky-50 p-8 min-h-[240px] flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 w-full max-w-xl">
                  {[
                    { icon: Activity, label: 'Health Score', value: '94/100', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { icon: FileText, label: 'Records', value: '24 files', color: 'text-violet-600', bg: 'bg-violet-50' },
                    { icon: Heart, label: 'Next Check-up', value: 'Oct 24', color: 'text-rose-600', bg: 'bg-rose-50' },
                  ].map(({ icon: Icon, label, value, color, bg }) => (
                    <div key={label} className="card p-4 text-center">
                      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mx-auto mb-3`}>
                        <Icon size={20} className={color} />
                      </div>
                      <p className="text-xs text-zinc-400 mb-1">{label}</p>
                      <p className="font-bold text-zinc-800 text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Features */}
      <section id="features" className="py-24 md:py-28 border-t border-[#EDE9F8]/60">
        <Container>
          <div className="text-center mb-14">
            <span className="badge mb-4 inline-block">Features</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 mt-3 mb-4 tracking-tight">
              Everything your health needs.
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto text-sm">
              From a single report to your entire family's health — MediNest handles it all.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, color, ring, title, desc, tag }, i) => (
              <Card key={title} delay={i * 0.06} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl ${color} ring-4 ${ring} flex items-center justify-center`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                </div>
                <h3 className="font-bold text-zinc-900 mb-2 text-sm">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white/50 backdrop-blur-sm border-y border-[#EDE9F8]/60">
        <Container>
          <div className="text-center mb-14">
            <span className="badge mb-4 inline-block">How it works</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 mt-3 tracking-tight">
              Up and running in minutes.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { step: '01', title: 'Create your account', desc: 'Sign up in seconds. No credit card required.' },
              { step: '02', title: 'Upload your records', desc: 'Drag and drop any medical document. Organised automatically.' },
              { step: '03', title: 'Understand your health', desc: 'Get your AI Health Story, trend charts, and care plan.' },
            ].map(({ step, title, desc }, i) => (
              <Card key={step} delay={i * 0.1} className="p-7 text-center">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 text-white font-black text-base flex items-center justify-center mx-auto mb-4 shadow-[0_4px_16px_rgba(124,58,237,0.3)]">
                  {step}
                </div>
                <h3 className="font-bold text-zinc-900 mb-2 text-sm">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#EDE9F8]/60 py-14">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-start gap-10">
            {/* Brand + contact */}
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center">
                  <span className="text-white text-xs font-black">M</span>
                </div>
                <span className="font-bold text-zinc-900">
                  MediNest<span className="text-violet-500">.ai</span>
                </span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed mb-5">
                AI-powered healthcare record management for individuals and families.
              </p>

              {/* Contact */}
              <a
                href="mailto:prajwal.medinest@gmail.com"
                className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-violet-600 transition-colors group mb-4"
              >
                <span className="w-8 h-8 rounded-lg border border-[#EDE9F8] bg-white flex items-center justify-center group-hover:border-violet-200 group-hover:bg-violet-50 transition-all">
                  <Mail size={14} />
                </span>
                prajwal.medinest@gmail.com
              </a>

              {/* Social */}
              <div className="flex gap-2 mt-2">
                <a
                  href="https://www.instagram.com/medinest.ai?igsh=Z3hpZHU0c2VkbW50"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-lg border border-[#EDE9F8] bg-white flex items-center justify-center text-zinc-400 hover:text-violet-600 hover:border-violet-200 hover:bg-violet-50 transition-all"
                >
                  <Instagram size={14} />
                </a>
                <a
                  href="https://www.linkedin.com/in/medinest-ai-38047b3a5?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-lg border border-[#EDE9F8] bg-white flex items-center justify-center text-zinc-400 hover:text-violet-600 hover:border-violet-200 hover:bg-violet-50 transition-all"
                >
                  <Linkedin size={14} />
                </a>
              </div>
            </div>

            {/* Nav links */}
            <div className="grid grid-cols-2 gap-8 text-sm">
              {[
                { heading: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'Dashboard', href: '/dashboard' }, { label: 'Sign up', href: '/signup' }] },
                { heading: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }] },
              ].map(({ heading, links }) => (
                <div key={heading}>
                  <p className="font-semibold text-zinc-800 mb-3">{heading}</p>
                  <ul className="space-y-2">
                    {links.map(({ label, href }) => (
                      <li key={label}>
                        <Link href={href} className="text-zinc-500 hover:text-violet-600 transition-colors">
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-[#EDE9F8]/60">
            <p className="text-xs text-zinc-400">
              © 2026 MediNest.ai — Not for medical diagnosis. All rights reserved.
            </p>
          </div>
        </Container>
      </footer>
    </main>
  );
}
