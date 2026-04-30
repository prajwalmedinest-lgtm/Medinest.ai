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
      <section className="relative pt-20 pb-28 md:pt-28 md:pb-36">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              scale: [1, 1.08, 1], 
              x: [0, 20, 0], 
              y: [0, -15, 0],
              opacity: [0.3, 0.4, 0.3]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-40 -left-20 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-violet-300/30 to-lavender-200/20 blur-[120px]"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1], 
              x: [0, -20, 0], 
              y: [0, 20, 0],
              opacity: [0.25, 0.35, 0.25]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-sky-300/25 to-teal-200/15 blur-[100px]"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.06, 1], 
              x: [0, 15, 0], 
              y: [0, -10, 0],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
            className="absolute bottom-0 left-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-rose-300/20 to-peach-200/15 blur-[110px]"
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
              className="text-[3rem] sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-7"
            >
              <span className="text-zinc-900">Your health.</span>
              <br />
              <span className="gradient-text">One story.</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.16)}
              className="text-lg sm:text-xl md:text-2xl text-zinc-500 max-w-2xl leading-relaxed mb-12"
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
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
            className="mt-20 max-w-5xl mx-auto"
          >
            <div className="card p-2 shadow-xl glow">
              <div className="rounded-[calc(2rem-8px)] bg-gradient-to-br from-violet-50/80 via-white/90 to-sky-50/80 backdrop-blur-sm p-10 min-h-[280px] flex items-center justify-center">
                <div className="grid grid-cols-3 gap-5 w-full max-w-2xl">
                  {[
                    { icon: Activity, label: 'Health Score', value: '94/100', color: 'text-emerald-600', bg: 'bg-gradient-to-br from-emerald-50 to-mint-50' },
                    { icon: FileText, label: 'Records', value: '24 files', color: 'text-violet-600', bg: 'bg-gradient-to-br from-violet-50 to-lavender-50' },
                    { icon: Heart, label: 'Next Check-up', value: 'Oct 24', color: 'text-rose-500', bg: 'bg-gradient-to-br from-rose-50 to-peach-50' },
                  ].map(({ icon: Icon, label, value, color, bg }, idx) => (
                    <motion.div 
                      key={label} 
                      className="card p-5 text-center hover:scale-105 transition-transform duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                    >
                      <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-3 shadow-sm`}>
                        <Icon size={22} className={color} />
                      </div>
                      <p className="text-xs text-zinc-400 mb-1.5 font-medium">{label}</p>
                      <p className="font-bold text-zinc-800 text-base">{value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Features */}
      <section id="features" className="py-28 md:py-32 border-t border-violet-100/40">
        <Container>
          <div className="text-center mb-16">
            <span className="badge mb-5 inline-block">Features</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 mt-4 mb-5 tracking-tight">
              Everything your health needs.
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              From a single report to your entire family's health — MediNest handles it all.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, color, ring, title, desc, tag }, i) => (
              <Card key={title} delay={i * 0.08} className="p-7 group">
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl ${color} ring-4 ${ring} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={22} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50/80 px-2.5 py-1.5 rounded-full border border-zinc-100">
                    {tag}
                  </span>
                </div>
                <h3 className="font-bold text-zinc-900 mb-2.5 text-base">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-28 bg-gradient-to-br from-white/60 via-violet-50/30 to-sky-50/30 backdrop-blur-sm border-y border-violet-100/40">
        <Container>
          <div className="text-center mb-16">
            <span className="badge mb-5 inline-block">How it works</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 mt-4 tracking-tight">
              Up and running in minutes.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-7 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Create your account', desc: 'Sign up in seconds. No credit card required.' },
              { step: '02', title: 'Upload your records', desc: 'Drag and drop any medical document. Organised automatically.' },
              { step: '03', title: 'Understand your health', desc: 'Get your AI Health Story, trend charts, and care plan.' },
            ].map(({ step, title, desc }, i) => (
              <Card key={step} delay={i * 0.12} className="p-8 text-center group">
                <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-500 text-white font-black text-lg flex items-center justify-center mx-auto mb-5 shadow-[0_8px_24px_rgba(155,135,245,0.4)] group-hover:shadow-[0_12px_32px_rgba(155,135,245,0.5)] group-hover:scale-110 transition-all duration-300">
                  {step}
                </div>
                <h3 className="font-bold text-zinc-900 mb-3 text-base">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t border-violet-100/40 py-16 bg-gradient-to-b from-transparent to-violet-50/20">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            {/* Brand + contact */}
            <div className="max-w-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-black">M</span>
                </div>
                <span className="font-bold text-zinc-900 text-lg">
                  MediNest<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500">.ai</span>
                </span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                AI-powered healthcare record management for individuals and families.
              </p>

              {/* Contact */}
              <a
                href="mailto:prajwal.medinest@gmail.com"
                className="inline-flex items-center gap-2.5 text-sm text-zinc-600 hover:text-violet-600 transition-colors group mb-5"
              >
                <span className="w-9 h-9 rounded-xl border border-violet-100 bg-white flex items-center justify-center group-hover:border-violet-300 group-hover:bg-violet-50 transition-all shadow-sm">
                  <Mail size={16} />
                </span>
                prajwal.medinest@gmail.com
              </a>

              {/* Social */}
              <div className="flex gap-3 mt-3">
                <a
                  href="https://www.instagram.com/medinest.ai?igsh=Z3hpZHU0c2VkbW50"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-xl border border-violet-100 bg-white flex items-center justify-center text-zinc-400 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50 transition-all shadow-sm"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="https://www.linkedin.com/in/medinest-ai-38047b3a5?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-xl border border-violet-100 bg-white flex items-center justify-center text-zinc-400 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50 transition-all shadow-sm"
                >
                  <Linkedin size={16} />
                </a>
              </div>
            </div>

            {/* Nav links */}
            <div className="grid grid-cols-2 gap-10 text-sm">
              {[
                { heading: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'Dashboard', href: '/dashboard' }, { label: 'Sign up', href: '/signup' }] },
                { heading: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }] },
              ].map(({ heading, links }) => (
                <div key={heading}>
                  <p className="font-semibold text-zinc-800 mb-4">{heading}</p>
                  <ul className="space-y-2.5">
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

          <div className="mt-12 pt-8 border-t border-violet-100/40">
            <p className="text-xs text-zinc-400">
              © 2026 MediNest.ai — Not for medical diagnosis. All rights reserved.
            </p>
          </div>
        </Container>
      </footer>
    </main>
  );
}
