'use client';


import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload, CalendarCheck, BookOpen, TrendingUp, Users,
  UploadCloud, CheckCircle2, AlertCircle, FileText,
  CalendarClock, Plus, ChevronDown, Pill, X, Check,
  Mic, Square, Trash2, Trophy, Flame, Zap, Target,
  Heart, Activity, Star, ChevronRight, BarChart2,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid,
} from 'recharts';
import Container from '@/components/Container';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Link from 'next/link';
import { getUser, clearUser, getFirstName, getInitials } from '@/lib/user-store';

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
type Tab = 'upload' | 'plan' | 'story' | 'trends' | 'family';

interface PlanItem  { id: string; time: string; title: string; desc: string; done: boolean; }
interface TrendRow  { month: string; glucose: number; bp: number; weight: number; }
interface Challenge {
  id: string; title: string; icon: string; goal: number; unit: string;
  participants: Record<string, number>; // memberId -> current value
  color: string; bgColor: string;
}
interface MemberData {
  id: string; name: string; initials: string; color: string; bgColor: string;
  uploads: string[]; plan: PlanItem[]; medications: string[];
  alerts: string[]; trends: TrendRow[];
}

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────────────────── */
const MEMBER_COLORS = [
  { color: 'text-violet-700', bgColor: 'bg-violet-100' },
  { color: 'text-rose-700',   bgColor: 'bg-rose-100'   },
  { color: 'text-sky-700',    bgColor: 'bg-sky-100'    },
  { color: 'text-emerald-700',bgColor: 'bg-emerald-100'},
  { color: 'text-amber-700',  bgColor: 'bg-amber-100'  },
  { color: 'text-indigo-700', bgColor: 'bg-indigo-100' },
];

const CHALLENGE_ICONS: Record<string, React.ElementType> = {
  flame: Flame, trophy: Trophy, zap: Zap, target: Target,
  heart: Heart, activity: Activity, star: Star,
};

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

function parseTranscript(text: string): PlanItem[] {
  if (!text.trim()) return [];
  const sentences = text
    .replace(/\b(and|then|also|next|after that)\b/gi, '.')
    .split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 4);
  const now = new Date();
  return sentences.map((s, i) => {
    const d = new Date(now); d.setDate(d.getDate() + i);
    const t = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { id: uid(), time: t, title: s.charAt(0).toUpperCase() + s.slice(1), desc: 'From voice recording', done: false };
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
   SMALL COMPONENTS
───────────────────────────────────────────────────────────────────────────── */
function EmptyState({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center mb-4">
        <Icon size={24} className="text-zinc-300" />
      </div>
      <p className="font-semibold text-zinc-500 text-sm mb-1">{title}</p>
      <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">{desc}</p>
    </div>
  );
}

function Section({ title, dot, children, defaultOpen = true }: {
  title: string; dot: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-50/50 transition-colors">
        <span className="flex items-center gap-2.5 font-semibold text-zinc-800 text-sm">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dot }} />
          {title}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={15} className="text-zinc-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="c" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}>
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Animated progress ring */
function ProgressRing({ pct, size = 56, stroke = 5, color = '#7c3aed' }: {
  pct: number; size?: number; stroke?: number; color?: string;
}) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f0eeff" strokeWidth={stroke} />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }} />
    </svg>
  );
}

/* Animated counter */
function AnimCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0; const end = value; if (end === 0) { setDisplay(0); return; }
    const step = Math.ceil(end / 30);
    const t = setInterval(() => { start = Math.min(start + step, end); setDisplay(start); if (start >= end) clearInterval(t); }, 30);
    return () => clearInterval(t);
  }, [value]);
  return <>{display}</>;
}

/* Mic hook */
function useMic() {
  const [recording, setRecording] = useState(false);
  const [secs, setSecs]           = useState(0);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim]     = useState('');
  const recRef  = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return false;
    const r = new SR(); r.continuous = true; r.interimResults = true; r.lang = 'en-US';
    let fin = '';
    r.onresult = (e: any) => {
      let tmp = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) fin += e.results[i][0].transcript + ' ';
        else tmp += e.results[i][0].transcript;
      }
      setTranscript(fin); setInterim(tmp);
    };
    r.onerror = () => stop();
    recRef.current = r; r.start(); setRecording(true); setSecs(0);
    timerRef.current = setInterval(() => setSecs(s => s + 1), 1000);
    return true;
  };
  const stop = () => {
    recRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(false); setInterim('');
  };
  const reset = () => { stop(); setTranscript(''); setSecs(0); };
  useEffect(() => () => { recRef.current?.stop(); if (timerRef.current) clearInterval(timerRef.current); }, []);
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  return { recording, secs, transcript, interim, start, stop, reset, fmt };
}

/* AddPlanItem */
function AddPlanItem({ onAdd }: { onAdd: (item: PlanItem) => void }) {
  const [title, setTitle] = useState(''); const [time, setTime] = useState('');
  const add = () => { if (!title.trim()) return; onAdd({ id: uid(), time: time || 'Upcoming', title: title.trim(), desc: 'Added manually', done: false }); setTitle(''); setTime(''); };
  return (
    <div className="flex gap-2 flex-wrap">
      <input value={time} onChange={e => setTime(e.target.value)} placeholder="When"
        className="w-28 bg-white border border-[#EDE9F8] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-all" />
      <input value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}
        placeholder="Add a care plan item..."
        className="flex-1 min-w-[140px] bg-white border border-[#EDE9F8] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-all" />
      <Button variant="secondary" size="xs" onClick={add}><Plus size={13} /> Add</Button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MEMBER FEATURE PANEL — full features for each family member
───────────────────────────────────────────────────────────────────────────── */
function MemberPanel({
  member, onUpdate, challenges, onUpdateChallenge,
}: {
  member: MemberData;
  onUpdate: (updated: MemberData) => void;
  challenges: Challenge[];
  onUpdateChallenge: (id: string, memberId: string, value: number) => void;
}) {
  const [subTab, setSubTab] = useState<'plan' | 'story' | 'trends' | 'challenges'>('plan');
  const [isDrag, setIsDrag] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showMic, setShowMic] = useState(false);
  const [micError, setMicError] = useState('');
  const [newAlert, setNewAlert] = useState('');
  const [newMed, setNewMed] = useState('');
  const [trendForm, setTrendForm] = useState({ month: '', glucose: '', bp: '', weight: '' });
  const fileRef = useRef<HTMLInputElement>(null);
  const mic = useMic();

  const validateFile = (f: File) => {
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(f.type)) return 'Only PDF, JPG, PNG.';
    if (f.size > 50 * 1024 * 1024) return 'Max 50 MB.';
    return null;
  };
  const processFiles = (files: FileList | null) => {
    if (!files) return;
    const valid: string[] = [], errors: string[] = [];
    Array.from(files).forEach(f => { const e = validateFile(f); e ? errors.push(`${f.name}: ${e}`) : valid.push(f.name); });
    setUploadError(errors.join(' | '));
    if (valid.length) onUpdate({ ...member, uploads: [...member.uploads, ...valid] });
  };

  const handleStartMic = () => {
    setMicError('');
    if (!mic.start()) setMicError('Voice recording not supported. Try Chrome or Edge.');
  };
  const handleBuild = () => {
    mic.stop();
    if (!mic.transcript.trim()) { setMicError('No speech detected.'); return; }
    const items = parseTranscript(mic.transcript);
    onUpdate({ ...member, plan: [...member.plan, ...items] });
    setShowMic(false); mic.reset();
  };

  const subTabs = [
    { id: 'plan' as const, label: 'Care Plan', icon: CalendarCheck },
    { id: 'story' as const, label: 'Health Story', icon: BookOpen },
    { id: 'trends' as const, label: 'Trends', icon: TrendingUp },
    { id: 'challenges' as const, label: 'Challenges', icon: Trophy },
  ];

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <Card animate={false}
        onDragOver={e => e.preventDefault()}
        onDragEnter={e => { e.preventDefault(); setIsDrag(true); }}
        onDragLeave={e => { e.preventDefault(); setIsDrag(false); }}
        onDrop={e => { e.preventDefault(); setIsDrag(false); processFiles(e.dataTransfer.files); }}
        className={`p-6 flex flex-col items-center justify-center text-center border-2 border-dashed cursor-pointer transition-all ${
          isDrag ? 'border-violet-400 bg-violet-50/50 scale-[1.01]' : 'border-[#EDE9F8] hover:border-violet-300 hover:bg-violet-50/20'
        }`}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all ${isDrag ? 'bg-violet-600' : 'bg-violet-50'}`}>
          <UploadCloud size={22} className={isDrag ? 'text-white' : 'text-violet-500'} />
        </div>
        <p className="font-semibold text-zinc-700 text-sm mb-1">{isDrag ? 'Drop files here' : `Upload records for ${member.name}`}</p>
        <p className="text-xs text-zinc-400 mb-3">PDF, JPG, PNG · max 50 MB</p>
        {uploadError && <p className="text-xs text-rose-500 mb-2">{uploadError}</p>}
        <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={e => processFiles(e.target.files)} />
        <Button variant="secondary" size="xs" onClick={() => fileRef.current?.click()}>Browse files</Button>
      </Card>

      {member.uploads.length > 0 && (
        <Card animate={false} className="p-4">
          <p className="text-xs font-semibold text-zinc-500 mb-2">{member.uploads.length} file{member.uploads.length > 1 ? 's' : ''} uploaded</p>
          <div className="space-y-1.5">
            {member.uploads.map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span className="text-xs text-zinc-700 truncate flex-1">{f}</span>
                <button onClick={() => onUpdate({ ...member, uploads: member.uploads.filter((_, j) => j !== i) })} className="text-zinc-300 hover:text-rose-400 transition-colors"><X size={12} /></button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Sub-tab nav */}
      <div className="flex gap-1 bg-zinc-50 rounded-2xl p-1">
        {subTabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setSubTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === id ? 'bg-white text-violet-700 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
            }`}>
            <Icon size={13} /><span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={subTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>

          {/* Care Plan */}
          {subTab === 'plan' && (
            <Card animate={false} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-zinc-800 text-sm">Care Plan</p>
                <Button variant="secondary" size="xs" onClick={() => { setShowMic(v => !v); setMicError(''); mic.reset(); }}>
                  <Mic size={12} /> {showMic ? 'Hide' : 'Record'}
                </Button>
              </div>

              <AnimatePresence>
                {showMic && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden mb-4">
                    <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-4">
                      <p className="text-xs text-zinc-500 mb-3">Speak the care plan for {member.name}…</p>
                      {micError && <p className="text-xs text-rose-500 mb-2">{micError}</p>}
                      {(mic.transcript || mic.interim) && (
                        <div className="bg-white/80 border border-violet-100 rounded-xl px-3 py-2 mb-3 min-h-[44px]">
                          <p className="text-xs text-zinc-700">{mic.transcript}<span className="text-zinc-400 italic">{mic.interim}</span></p>
                        </div>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        {!mic.recording
                          ? <Button variant="primary" size="xs" onClick={handleStartMic}><Mic size={12} /> Start</Button>
                          : <button onClick={mic.stop} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 text-white rounded-xl text-xs font-semibold hover:bg-rose-600 transition-colors"><Square size={11} fill="white" /> Stop</button>
                        }
                        {mic.recording && (
                          <span className="flex items-center gap-1 text-xs text-rose-500 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />{mic.fmt(mic.secs)}
                          </span>
                        )}
                        {mic.transcript && !mic.recording && (
                          <Button variant="primary" size="xs" onClick={handleBuild}><Check size={12} /> Build timeline</Button>
                        )}
                        {(mic.transcript || mic.recording) && (
                          <button onClick={mic.reset} className="text-zinc-400 hover:text-zinc-600 p-1"><Trash2 size={12} /></button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {member.plan.length > 0 ? (
                <div className="space-y-2 relative before:absolute before:left-[15px] before:top-0 before:h-full before:w-px before:bg-gradient-to-b before:from-violet-200 before:to-transparent">
                  {member.plan.map((item, i) => (
                    <div key={item.id} className="relative flex items-start gap-3 pl-9">
                      <button onClick={() => onUpdate({ ...member, plan: member.plan.map((x, j) => j === i ? { ...x, done: !x.done } : x) })}
                        className={`absolute left-0 top-0.5 w-[30px] h-[30px] rounded-full flex items-center justify-center border-2 border-white shrink-0 z-10 transition-all ${
                          item.done ? 'bg-gradient-to-br from-violet-600 to-indigo-500 shadow-[0_0_8px_rgba(124,58,237,0.3)]' : 'bg-white shadow-sm hover:bg-violet-50'
                        }`}>
                        {item.done ? <Check size={12} className="text-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-violet-200" />}
                      </button>
                      <div className={`flex-1 p-3 rounded-xl border transition-all ${item.done ? 'opacity-50 border-[#EDE9F8]' : 'bg-white/40 border-[#EDE9F8]/50'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`text-[9px] font-bold uppercase tracking-wider mb-0.5 ${item.done ? 'text-violet-600' : 'text-zinc-400'}`}>{item.time}</p>
                            <p className={`font-semibold text-xs ${item.done ? 'line-through text-zinc-400' : 'text-zinc-800'}`}>{item.title}</p>
                          </div>
                          <button onClick={() => onUpdate({ ...member, plan: member.plan.filter((_, j) => j !== i) })} className="text-zinc-300 hover:text-rose-400 transition-colors shrink-0"><X size={11} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={CalendarCheck} title="No care plan" desc="Record or manually add care plan items." />
              )}

              <div className="mt-3 pt-3 border-t border-[#EDE9F8]/60">
                <AddPlanItem onAdd={item => onUpdate({ ...member, plan: [...member.plan, item] })} />
              </div>
            </Card>
          )}

          {/* Health Story */}
          {subTab === 'story' && (
            <div className="space-y-3">
              <Card animate={false} className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <p className="font-semibold text-zinc-800 text-sm">Summary for {member.name}</p>
                </div>
                {member.uploads.length === 0 && member.medications.length === 0 && member.alerts.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">Upload records or add medications and alerts to generate a health story.</p>
                ) : (
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {member.uploads.length > 0 && `${member.name} has ${member.uploads.length} medical record${member.uploads.length > 1 ? 's' : ''} uploaded. `}
                    {member.medications.length > 0 && `Currently on: ${member.medications.join(', ')}. `}
                    {member.alerts.length > 0 && `Alerts: ${member.alerts.join('; ')}. `}
                    {member.plan.length > 0 && `Care plan: ${member.plan.filter(x => x.done).length}/${member.plan.length} items completed.`}
                  </p>
                )}
              </Card>

              <Section title="Key Alerts" dot="#f87171" defaultOpen>
                <div className="space-y-2 pt-1">
                  {member.alerts.map((a, i) => (
                    <div key={i} className="flex items-center justify-between bg-rose-50 border border-rose-100 px-3 py-2.5 rounded-xl">
                      <div className="flex items-center gap-2 text-xs text-rose-700"><AlertCircle size={12} />{a}</div>
                      <button onClick={() => onUpdate({ ...member, alerts: member.alerts.filter((_, j) => j !== i) })} className="text-rose-300 hover:text-rose-500"><X size={11} /></button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-1">
                    <input value={newAlert} onChange={e => setNewAlert(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && newAlert.trim()) { onUpdate({ ...member, alerts: [...member.alerts, newAlert.trim()] }); setNewAlert(''); } }}
                      placeholder="Add alert…" className="flex-1 bg-white border border-[#EDE9F8] rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-all" />
                    <Button variant="secondary" size="xs" onClick={() => { if (newAlert.trim()) { onUpdate({ ...member, alerts: [...member.alerts, newAlert.trim()] }); setNewAlert(''); } }}><Plus size={11} /></Button>
                  </div>
                  {member.alerts.length === 0 && <p className="text-[10px] text-zinc-400">No alerts yet.</p>}
                </div>
              </Section>

              <Section title="Medications" dot="#60a5fa" defaultOpen>
                <div className="space-y-2 pt-1">
                  {member.medications.map((m, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/70 border border-[#EDE9F8] px-3 py-2.5 rounded-xl">
                      <div className="flex items-center gap-2"><Pill size={12} className="text-sky-500" /><p className="text-xs font-semibold text-zinc-800">{m}</p></div>
                      <button onClick={() => onUpdate({ ...member, medications: member.medications.filter((_, j) => j !== i) })} className="text-zinc-300 hover:text-rose-400"><X size={11} /></button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-1">
                    <input value={newMed} onChange={e => setNewMed(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && newMed.trim()) { onUpdate({ ...member, medications: [...member.medications, newMed.trim()] }); setNewMed(''); } }}
                      placeholder="Add medication…" className="flex-1 bg-white border border-[#EDE9F8] rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-all" />
                    <Button variant="secondary" size="xs" onClick={() => { if (newMed.trim()) { onUpdate({ ...member, medications: [...member.medications, newMed.trim()] }); setNewMed(''); } }}><Plus size={11} /></Button>
                  </div>
                  {member.medications.length === 0 && <p className="text-[10px] text-zinc-400">No medications yet.</p>}
                </div>
              </Section>
            </div>
          )}

          {/* Trends */}
          {subTab === 'trends' && (
            <div className="space-y-3">
              <Card animate={false} className="p-4">
                <p className="font-semibold text-zinc-800 text-sm mb-3">Add a reading for {member.name}</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[{ k: 'month', p: 'Month (e.g. Jan)' }, { k: 'glucose', p: 'Glucose (mg/dL)' }, { k: 'bp', p: 'BP (systolic)' }, { k: 'weight', p: 'Weight (kg)' }].map(({ k, p }) => (
                    <input key={k} placeholder={p} value={(trendForm as any)[k]} onChange={e => setTrendForm(f => ({ ...f, [k]: e.target.value }))}
                      className="bg-white border border-[#EDE9F8] rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-all" />
                  ))}
                </div>
                <Button variant="primary" size="xs" onClick={() => {
                  if (!trendForm.month) return;
                  onUpdate({ ...member, trends: [...member.trends, { month: trendForm.month, glucose: Number(trendForm.glucose) || 0, bp: Number(trendForm.bp) || 0, weight: Number(trendForm.weight) || 0 }] });
                  setTrendForm({ month: '', glucose: '', bp: '', weight: '' });
                }}><Plus size={12} /> Add reading</Button>
              </Card>
              {member.trends.length > 0 ? (
                <Card animate={false} className="p-4">
                  <p className="font-semibold text-zinc-800 text-xs mb-3">Blood Markers</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={member.trends} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`g1-${member.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} /><stop offset="95%" stopColor="#a78bfa" stopOpacity={0} /></linearGradient>
                        <linearGradient id={`g2-${member.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} /><stop offset="95%" stopColor="#38bdf8" stopOpacity={0} /></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0eeff" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #EDE9F8', fontSize: 11 }} />
                      <Area type="monotone" dataKey="glucose" stroke="#a78bfa" strokeWidth={2} fill={`url(#g1-${member.id})`} />
                      <Area type="monotone" dataKey="bp" stroke="#38bdf8" strokeWidth={2} fill={`url(#g2-${member.id})`} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              ) : (
                <Card animate={false} className="p-4"><EmptyState icon={TrendingUp} title="No readings yet" desc="Add readings above to see trends." /></Card>
              )}
            </div>
          )}

          {/* Challenges */}
          {subTab === 'challenges' && (
            <div className="space-y-3">
              {challenges.length === 0 ? (
                <Card animate={false} className="p-4">
                  <EmptyState icon={Trophy} title="No challenges yet" desc="Create a family challenge from the main Family Hub view." />
                </Card>
              ) : (
                challenges.map(ch => {
                  const current = ch.participants[member.id] ?? 0;
                  const pct = Math.min(100, Math.round((current / ch.goal) * 100));
                  const IconComp = CHALLENGE_ICONS[ch.icon] ?? Trophy;
                  return (
                    <Card key={ch.id} animate={false} className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          <ProgressRing pct={pct} size={52} stroke={4} color="#7c3aed" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <IconComp size={16} className={ch.color} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-zinc-800 text-sm">{ch.title}</p>
                          <p className="text-xs text-zinc-400">{current} / {ch.goal} {ch.unit}</p>
                          <div className="h-1.5 bg-zinc-100 rounded-full mt-2 overflow-hidden">
                            <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400"
                              initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }} />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <button onClick={() => onUpdateChallenge(ch.id, member.id, Math.min(ch.goal, current + 1))}
                            className="w-7 h-7 rounded-lg bg-violet-50 hover:bg-violet-100 flex items-center justify-center text-violet-600 transition-colors font-bold text-sm">+</button>
                          <button onClick={() => onUpdateChallenge(ch.id, member.id, Math.max(0, current - 1))}
                            className="w-7 h-7 rounded-lg bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center text-zinc-400 transition-colors font-bold text-sm">−</button>
                        </div>
                      </div>
                      {pct >= 100 && (
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                          className="mt-3 flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl">
                          <Trophy size={13} className="text-emerald-500" />
                          <p className="text-xs font-semibold text-emerald-700">Goal reached! 🎉</p>
                        </motion.div>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const [user, setUser]           = useState<{ name: string; email: string } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('upload');

  // "You" data
  const [isDrag, setIsDrag]           = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState('');
  const [planItems, setPlanItems]     = useState<PlanItem[]>([]);
  const [showMic, setShowMic]         = useState(false);
  const [micError, setMicError]       = useState('');
  const [alerts, setAlerts]           = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [newAlert, setNewAlert]       = useState('');
  const [newMed, setNewMed]           = useState('');
  const [trendRows, setTrendRows]     = useState<TrendRow[]>([]);
  const [trendForm, setTrendForm]     = useState({ month: '', glucose: '', bp: '', weight: '' });
  const fileRef = useRef<HTMLInputElement>(null);
  const mic = useMic();

  // Family
  const [members, setMembers]         = useState<MemberData[]>([]);
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null); // null = "You"
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [challenges, setChallenges]   = useState<Challenge[]>([]);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [challengeForm, setChallengeForm] = useState({ title: '', icon: 'flame', goal: '', unit: 'steps', color: 'text-orange-500', bgColor: 'bg-orange-50' });

  useEffect(() => {
    const u = getUser();
    setUser(u ? { name: u.name, email: u.email } : null);
  }, []);

  const displayName = user ? getFirstName(user.name) : 'Guest';
  const initials    = user ? getInitials(user.name) : 'G';
  const selfId      = 'self';

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'upload', label: 'Upload',       icon: Upload       },
    { id: 'plan',   label: 'Care Plan',    icon: CalendarCheck},
    { id: 'story',  label: 'Health Story', icon: BookOpen     },
    { id: 'trends', label: 'Trends',       icon: TrendingUp   },
    { id: 'family', label: 'Family Hub',   icon: Users        },
  ];

  const validateFile = (f: File) => {
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(f.type)) return 'Only PDF, JPG, PNG.';
    if (f.size > 50 * 1024 * 1024) return 'Max 50 MB.';
    return null;
  };
  const processFiles = (files: FileList | null) => {
    if (!files) return;
    const valid: string[] = [], errors: string[] = [];
    Array.from(files).forEach(f => { const e = validateFile(f); e ? errors.push(`${f.name}: ${e}`) : valid.push(f.name); });
    setUploadError(errors.join(' | '));
    if (valid.length) setUploadedFiles(p => [...p, ...valid]);
  };

  const handleStartMic = () => {
    setMicError('');
    if (!mic.start()) setMicError('Voice recording not supported. Try Chrome or Edge.');
  };
  const handleBuild = () => {
    mic.stop();
    if (!mic.transcript.trim()) { setMicError('No speech detected.'); return; }
    setPlanItems(p => [...p, ...parseTranscript(mic.transcript)]);
    setShowMic(false); mic.reset();
  };

  const addMember = () => {
    if (!newMemberName.trim()) return;
    const n = newMemberName.trim();
    const idx = members.length;
    const c = MEMBER_COLORS[idx % MEMBER_COLORS.length];
    const newM: MemberData = { id: uid(), name: n, initials: getInitials(n), color: c.color, bgColor: c.bgColor, uploads: [], plan: [], medications: [], alerts: [], trends: [] };
    setMembers(p => [...p, newM]);
    setActiveMemberId(newM.id);
    setNewMemberName(''); setShowAddMember(false);
  };

  const updateMember = (updated: MemberData) => setMembers(p => p.map(m => m.id === updated.id ? updated : m));

  const createChallenge = () => {
    if (!challengeForm.title.trim() || !challengeForm.goal) return;
    const participants: Record<string, number> = { [selfId]: 0 };
    members.forEach(m => { participants[m.id] = 0; });
    setChallenges(p => [...p, { id: uid(), title: challengeForm.title.trim(), icon: challengeForm.icon, goal: Number(challengeForm.goal), unit: challengeForm.unit, participants, color: challengeForm.color, bgColor: challengeForm.bgColor }]);
    setChallengeForm({ title: '', icon: 'flame', goal: '', unit: 'steps', color: 'text-orange-500', bgColor: 'bg-orange-50' });
    setShowCreateChallenge(false);
  };

  const updateChallenge = (id: string, memberId: string, value: number) => {
    setChallenges(p => p.map(c => c.id === id ? { ...c, participants: { ...c.participants, [memberId]: value } } : c));
  };

  const activeMember = members.find(m => m.id === activeMemberId) ?? null;

  return (
    <main className="min-h-[calc(100vh-80px)] py-8">
      <Container>
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">{initials}</div>
            <div>
              <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Hello, <span className="gradient-text">{displayName}</span></h1>
              {user?.email && <p className="text-xs text-zinc-400 mt-0.5">{user.email}</p>}
            </div>
          </div>
          <Link href="/login" onClick={() => clearUser()}>
            <Button variant="outline" size="sm">Sign out</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Records', value: uploadedFiles.length, unit: ' files', color: 'text-violet-600', bg: 'bg-violet-50', icon: FileText },
            { label: 'Care plan', value: planItems.length, unit: ' items', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: CalendarCheck },
            { label: 'Medications', value: medications.length, unit: ' added', color: 'text-sky-600', bg: 'bg-sky-50', icon: Pill },
            { label: 'Family', value: members.length, unit: ' members', color: 'text-rose-600', bg: 'bg-rose-50', icon: Users },
          ].map(({ label, value, unit, color, bg, icon: Icon }) => (
            <Card key={label} animate={false} className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}><Icon size={17} className={color} /></div>
              <div>
                <p className="text-xs text-zinc-400">{label}</p>
                <p className="font-bold text-zinc-800 text-sm">
                  <AnimCounter value={value} /><span className="font-normal text-zinc-400 text-xs">{unit}</span>
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-52 shrink-0">
            <Card animate={false} className="p-2 flex flex-col gap-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                    activeTab === id ? 'bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-[0_4px_12px_rgba(124,58,237,0.3)]' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800'
                  }`}>
                  <Icon size={16} />{label}
                </button>
              ))}
            </Card>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

                {/* UPLOAD */}
                {activeTab === 'upload' && (
                  <div className="space-y-4">
                    <Card animate={false}
                      onDragOver={e => e.preventDefault()} onDragEnter={e => { e.preventDefault(); setIsDrag(true); }}
                      onDragLeave={e => { e.preventDefault(); setIsDrag(false); }}
                      onDrop={e => { e.preventDefault(); setIsDrag(false); processFiles(e.dataTransfer.files); }}
                      className={`p-10 flex flex-col items-center justify-center text-center border-2 border-dashed cursor-pointer transition-all min-h-[280px] ${isDrag ? 'border-violet-400 bg-violet-50/50 scale-[1.01]' : 'border-[#EDE9F8] hover:border-violet-300 hover:bg-violet-50/30'}`}>
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all ${isDrag ? 'bg-violet-600 shadow-[0_0_24px_rgba(124,58,237,0.4)]' : 'bg-violet-50'}`}>
                        <UploadCloud size={32} className={isDrag ? 'text-white' : 'text-violet-500'} />
                      </div>
                      <h3 className="font-bold text-zinc-800 mb-2">{isDrag ? 'Drop files here' : 'Upload your medical records'}</h3>
                      <p className="text-sm text-zinc-500 max-w-xs mb-6">{isDrag ? 'Release to upload securely.' : 'Drag & drop reports, prescriptions, or scans. PDF, JPG, PNG · max 50 MB.'}</p>
                      {uploadError && <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-100 px-4 py-2.5 rounded-xl text-sm mb-4"><AlertCircle size={14} />{uploadError}</div>}
                      <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={e => processFiles(e.target.files)} />
                      <Button variant="primary" size="sm" onClick={() => fileRef.current?.click()}>Browse files</Button>
                    </Card>
                    {uploadedFiles.length > 0 ? (
                      <Card animate={false} className="p-5">
                        <h4 className="text-sm font-semibold text-zinc-700 mb-3">Your files ({uploadedFiles.length})</h4>
                        <div className="space-y-2">
                          {uploadedFiles.map((name, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                              className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-xl">
                              <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                              <span className="text-sm text-zinc-700 truncate flex-1">{name}</span>
                              <button onClick={() => setUploadedFiles(p => p.filter((_, j) => j !== i))} className="text-zinc-400 hover:text-rose-500 transition-colors"><X size={13} /></button>
                            </motion.div>
                          ))}
                        </div>
                      </Card>
                    ) : (
                      <Card animate={false} className="p-5"><EmptyState icon={FileText} title="No files yet" desc="Upload your first medical document above." /></Card>
                    )}
                  </div>
                )}

                {/* CARE PLAN */}
                {activeTab === 'plan' && (
                  <Card animate={false} className="p-6">
                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#EDE9F8]/60">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center"><CalendarCheck size={20} className="text-indigo-600" /></div>
                        <div><h2 className="font-bold text-zinc-900">Care Plan Constructor</h2><p className="text-xs text-zinc-400">Speak your plan — we build the timeline</p></div>
                      </div>
                      <Button variant="secondary" size="xs" onClick={() => { setShowMic(v => !v); setMicError(''); mic.reset(); }}>
                        <Mic size={13} /> {showMic ? 'Hide mic' : 'Record plan'}
                      </Button>
                    </div>
                    <AnimatePresence>
                      {showMic && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden mb-5">
                          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-5">
                            <p className="text-sm font-semibold text-zinc-700 mb-1">Voice Care Plan</p>
                            <p className="text-xs text-zinc-500 mb-4">Speak naturally — e.g. <em>"Take Metformin in the morning, then check blood pressure, and visit Dr. Sharma next week."</em></p>
                            {micError && <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-100 px-3 py-2 rounded-xl text-xs mb-3"><AlertCircle size={13} />{micError}</div>}
                            {(mic.transcript || mic.interim) && (
                              <div className="bg-white/80 border border-violet-100 rounded-xl px-4 py-3 mb-4 min-h-[60px]">
                                <p className="text-sm text-zinc-700 leading-relaxed">{mic.transcript}<span className="text-zinc-400 italic">{mic.interim}</span></p>
                              </div>
                            )}
                            <div className="flex items-center gap-3 flex-wrap">
                              {!mic.recording
                                ? <Button variant="primary" size="sm" onClick={handleStartMic}><Mic size={14} /> Start recording</Button>
                                : <button onClick={mic.stop} className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-semibold hover:bg-rose-600 transition-colors"><Square size={13} fill="white" /> Stop</button>
                              }
                              {mic.recording && <span className="flex items-center gap-1.5 text-sm text-rose-500 font-semibold"><span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />{mic.fmt(mic.secs)}</span>}
                              {mic.transcript && !mic.recording && <Button variant="primary" size="sm" onClick={handleBuild}><Check size={14} /> Build timeline</Button>}
                              {(mic.transcript || mic.recording) && <button onClick={mic.reset} className="text-zinc-400 hover:text-zinc-600 p-1.5"><Trash2 size={14} /></button>}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {planItems.length > 0 ? (
                      <div className="space-y-3 relative before:absolute before:left-[19px] before:top-0 before:h-full before:w-px before:bg-gradient-to-b before:from-violet-200 before:to-transparent">
                        {planItems.map((item, i) => (
                          <motion.div key={item.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="relative flex items-start gap-4 pl-10">
                            <button onClick={() => setPlanItems(p => p.map((x, j) => j === i ? { ...x, done: !x.done } : x))}
                              className={`absolute left-0 top-1 w-[38px] h-[38px] rounded-full flex items-center justify-center border-2 border-white shrink-0 z-10 transition-all ${item.done ? 'bg-gradient-to-br from-violet-600 to-indigo-500 shadow-[0_0_10px_rgba(124,58,237,0.3)]' : 'bg-white shadow-sm hover:bg-violet-50'}`}>
                              {item.done ? <Check size={14} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-violet-200" />}
                            </button>
                            <div className={`flex-1 p-4 rounded-2xl border transition-all ${item.done ? 'bg-white/80 border-[#EDE9F8] opacity-60' : 'bg-white/40 border-[#EDE9F8]/50'}`}>
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${item.done ? 'text-violet-600' : 'text-zinc-400'}`}>{item.time}</p>
                                  <p className={`font-semibold text-sm ${item.done ? 'line-through text-zinc-400' : 'text-zinc-800'}`}>{item.title}</p>
                                  <p className="text-xs text-zinc-400 mt-0.5">{item.desc}</p>
                                </div>
                                <button onClick={() => setPlanItems(p => p.filter((_, j) => j !== i))} className="text-zinc-300 hover:text-rose-400 transition-colors shrink-0 mt-0.5"><X size={13} /></button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState icon={CalendarCheck} title="No care plan yet" desc="Click 'Record plan' and speak your schedule — we'll turn it into a timeline." />
                    )}
                    {planItems.length > 0 && <div className="mt-4 pt-4 border-t border-[#EDE9F8]/60"><AddPlanItem onAdd={item => setPlanItems(p => [...p, item])} /></div>}
                  </Card>
                )}

                {/* HEALTH STORY */}
                {activeTab === 'story' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center"><BookOpen size={20} className="text-sky-600" /></div>
                      <div><h2 className="font-bold text-zinc-900">AI Health Story</h2><p className="text-xs text-zinc-400">Your personal medical narrative</p></div>
                    </div>
                    <Card animate={false} className="p-5">
                      <div className="flex items-center gap-2 mb-3"><span className="w-2 h-2 rounded-full bg-indigo-400" /><h3 className="font-semibold text-zinc-800 text-sm">Your Summary</h3></div>
                      {uploadedFiles.length === 0 && medications.length === 0 && alerts.length === 0 ? (
                        <p className="text-sm text-zinc-400 italic">Upload records, add medications, or add alerts — your health story will appear here.</p>
                      ) : (
                        <p className="text-sm text-zinc-600 leading-relaxed">
                          {`Hello ${displayName}. `}
                          {uploadedFiles.length > 0 && `You have ${uploadedFiles.length} medical record${uploadedFiles.length > 1 ? 's' : ''} uploaded. `}
                          {medications.length > 0 && `Currently on: ${medications.join(', ')}. `}
                          {alerts.length > 0 && `Alerts: ${alerts.join('; ')}. `}
                          {planItems.length > 0 && `Care plan: ${planItems.filter(x => x.done).length}/${planItems.length} completed.`}
                        </p>
                      )}
                    </Card>
                    <Section title="Key Alerts" dot="#f87171" defaultOpen>
                      <div className="space-y-2 pt-1">
                        {alerts.map((a, i) => (
                          <div key={i} className="flex items-center justify-between bg-rose-50 border border-rose-100 px-4 py-3 rounded-xl">
                            <div className="flex items-center gap-2 text-sm text-rose-700"><AlertCircle size={14} className="shrink-0" />{a}</div>
                            <button onClick={() => setAlerts(p => p.filter((_, j) => j !== i))} className="text-rose-300 hover:text-rose-500"><X size={13} /></button>
                          </div>
                        ))}
                        <div className="flex gap-2 mt-2">
                          <input value={newAlert} onChange={e => setNewAlert(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && newAlert.trim()) { setAlerts(p => [...p, newAlert.trim()]); setNewAlert(''); } }} placeholder="Add an alert…" className="flex-1 bg-white border border-[#EDE9F8] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-all" />
                          <Button variant="secondary" size="xs" onClick={() => { if (newAlert.trim()) { setAlerts(p => [...p, newAlert.trim()]); setNewAlert(''); } }}><Plus size={13} /> Add</Button>
                        </div>
                        {alerts.length === 0 && <p className="text-xs text-zinc-400 mt-1">No alerts yet.</p>}
                      </div>
                    </Section>
                    <Section title="Active Medications" dot="#60a5fa" defaultOpen>
                      <div className="space-y-2 pt-1">
                        {medications.map((m, i) => (
                          <div key={i} className="flex items-center justify-between bg-white/70 border border-[#EDE9F8] px-4 py-3 rounded-xl">
                            <div className="flex items-center gap-2"><Pill size={14} className="text-sky-500 shrink-0" /><p className="text-sm font-semibold text-zinc-800">{m}</p></div>
                            <button onClick={() => setMedications(p => p.filter((_, j) => j !== i))} className="text-zinc-300 hover:text-rose-400"><X size={13} /></button>
                          </div>
                        ))}
                        <div className="flex gap-2 mt-2">
                          <input value={newMed} onChange={e => setNewMed(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && newMed.trim()) { setMedications(p => [...p, newMed.trim()]); setNewMed(''); } }} placeholder="Add medication…" className="flex-1 bg-white border border-[#EDE9F8] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-all" />
                          <Button variant="secondary" size="xs" onClick={() => { if (newMed.trim()) { setMedications(p => [...p, newMed.trim()]); setNewMed(''); } }}><Plus size={13} /> Add</Button>
                        </div>
                        {medications.length === 0 && <p className="text-xs text-zinc-400 mt-1">No medications yet.</p>}
                      </div>
                    </Section>
                  </div>
                )}

                {/* TRENDS */}
                {activeTab === 'trends' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><TrendingUp size={20} className="text-emerald-600" /></div>
                      <div><h2 className="font-bold text-zinc-900">Health Trend Analysis</h2><p className="text-xs text-zinc-400">Enter your readings to visualise trends</p></div>
                    </div>
                    <Card animate={false} className="p-5">
                      <h3 className="font-semibold text-zinc-800 text-sm mb-4">Add a reading</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                        {[{ k: 'month', p: 'Month (e.g. Jan)' }, { k: 'glucose', p: 'Glucose (mg/dL)' }, { k: 'bp', p: 'BP (systolic)' }, { k: 'weight', p: 'Weight (kg)' }].map(({ k, p }) => (
                          <input key={k} placeholder={p} value={(trendForm as any)[k]} onChange={e => setTrendForm(f => ({ ...f, [k]: e.target.value }))}
                            className="bg-white border border-[#EDE9F8] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-all" />
                        ))}
                      </div>
                      <Button variant="primary" size="sm" onClick={() => { if (!trendForm.month) return; setTrendRows(p => [...p, { month: trendForm.month, glucose: Number(trendForm.glucose) || 0, bp: Number(trendForm.bp) || 0, weight: Number(trendForm.weight) || 0 }]); setTrendForm({ month: '', glucose: '', bp: '', weight: '' }); }}><Plus size={14} /> Add reading</Button>
                    </Card>
                    {trendRows.length > 0 ? (
                      <>
                        <Card animate={false} className="p-5">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-zinc-800 text-sm">Blood Markers</h3>
                            <div className="flex items-center gap-3 text-xs text-zinc-400">
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />Glucose</span>
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />BP</span>
                            </div>
                          </div>
                          <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={trendRows} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                              <defs>
                                <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} /><stop offset="95%" stopColor="#a78bfa" stopOpacity={0} /></linearGradient>
                                <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} /><stop offset="95%" stopColor="#38bdf8" stopOpacity={0} /></linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0eeff" />
                              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #EDE9F8', fontSize: 12 }} />
                              <Area type="monotone" dataKey="glucose" stroke="#a78bfa" strokeWidth={2} fill="url(#gG)" />
                              <Area type="monotone" dataKey="bp" stroke="#38bdf8" strokeWidth={2} fill="url(#gB)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </Card>
                        <Card animate={false} className="p-5">
                          <h3 className="font-semibold text-zinc-800 text-sm mb-4">Weight (kg)</h3>
                          <ResponsiveContainer width="100%" height={160}>
                            <BarChart data={trendRows} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0eeff" />
                              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #EDE9F8', fontSize: 12 }} />
                              <Bar dataKey="weight" fill="#a78bfa" radius={[6, 6, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </Card>
                      </>
                    ) : (
                      <Card animate={false} className="p-5"><EmptyState icon={TrendingUp} title="No readings yet" desc="Add your first health reading above." /></Card>
                    )}
                  </div>
                )}

                {/* FAMILY HUB */}
                {activeTab === 'family' && (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center"><Users size={20} className="text-rose-600" /></div>
                        <div><h2 className="font-bold text-zinc-900">Family Health Hub</h2><p className="text-xs text-zinc-400">Everyone's health, one place</p></div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="secondary" size="xs" onClick={() => { setShowCreateChallenge(v => !v); }}>
                          <Trophy size={12} /> Challenge
                        </Button>
                        <Button variant="primary" size="xs" onClick={() => setShowAddMember(v => !v)}>
                          <Plus size={12} /> Add member
                        </Button>
                      </div>
                    </div>

                    {/* Add member form */}
                    <AnimatePresence>
                      {showAddMember && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <Card animate={false} className="p-4 flex gap-3">
                            <input value={newMemberName} onChange={e => setNewMemberName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addMember()}
                              placeholder="Family member's name (e.g. Mom, Dad, Sarah)"
                              className="flex-1 bg-white border border-[#EDE9F8] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-all" autoFocus />
                            <Button variant="primary" size="sm" onClick={addMember}>Add</Button>
                            <button onClick={() => setShowAddMember(false)} className="text-zinc-400 hover:text-zinc-600 p-1"><X size={15} /></button>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Create challenge form */}
                    <AnimatePresence>
                      {showCreateChallenge && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <Card animate={false} className="p-5">
                            <p className="font-semibold text-zinc-800 text-sm mb-4">Create a family challenge</p>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <input value={challengeForm.title} onChange={e => setChallengeForm(f => ({ ...f, title: e.target.value }))} placeholder="Challenge name (e.g. 10K Steps)"
                                className="col-span-2 bg-white border border-[#EDE9F8] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-all" />
                              <input value={challengeForm.goal} onChange={e => setChallengeForm(f => ({ ...f, goal: e.target.value }))} placeholder="Goal (e.g. 10000)"
                                className="bg-white border border-[#EDE9F8] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-all" />
                              <input value={challengeForm.unit} onChange={e => setChallengeForm(f => ({ ...f, unit: e.target.value }))} placeholder="Unit (e.g. steps, glasses)"
                                className="bg-white border border-[#EDE9F8] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-all" />
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                              <p className="text-xs text-zinc-500">Icon:</p>
                              {[
                                { k: 'flame', icon: Flame, c: 'text-orange-500', bg: 'bg-orange-50' },
                                { k: 'trophy', icon: Trophy, c: 'text-amber-500', bg: 'bg-amber-50' },
                                { k: 'zap', icon: Zap, c: 'text-yellow-500', bg: 'bg-yellow-50' },
                                { k: 'target', icon: Target, c: 'text-rose-500', bg: 'bg-rose-50' },
                                { k: 'heart', icon: Heart, c: 'text-pink-500', bg: 'bg-pink-50' },
                                { k: 'activity', icon: Activity, c: 'text-emerald-500', bg: 'bg-emerald-50' },
                                { k: 'star', icon: Star, c: 'text-violet-500', bg: 'bg-violet-50' },
                              ].map(({ k, icon: Icon, c, bg }) => (
                                <button key={k} onClick={() => setChallengeForm(f => ({ ...f, icon: k, color: c, bgColor: bg }))}
                                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${challengeForm.icon === k ? `${bg} ring-2 ring-violet-400 scale-110` : 'bg-zinc-50 hover:bg-zinc-100'}`}>
                                  <Icon size={15} className={challengeForm.icon === k ? c : 'text-zinc-400'} />
                                </button>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="primary" size="sm" onClick={createChallenge}><Trophy size={13} /> Create challenge</Button>
                              <button onClick={() => setShowCreateChallenge(false)} className="text-zinc-400 hover:text-zinc-600 p-1.5"><X size={14} /></button>
                            </div>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Shared challenges leaderboard */}
                    {challenges.length > 0 && (
                      <Card animate={false} className="p-5">
                        <p className="font-semibold text-zinc-800 text-sm mb-4 flex items-center gap-2"><Trophy size={15} className="text-amber-500" /> Family Challenges</p>
                        <div className="space-y-4">
                          {challenges.map(ch => {
                            const IconComp = CHALLENGE_ICONS[ch.icon] ?? Trophy;
                            // Build leaderboard: self + all members
                            const allParticipants = [
                              { id: selfId, name: displayName, initials, color: 'text-violet-700', bgColor: 'bg-violet-100', value: ch.participants[selfId] ?? 0 },
                              ...members.map(m => ({ id: m.id, name: m.name, initials: m.initials, color: m.color, bgColor: m.bgColor, value: ch.participants[m.id] ?? 0 })),
                            ].sort((a, b) => b.value - a.value);

                            return (
                              <div key={ch.id} className="bg-gradient-to-br from-zinc-50 to-white border border-[#EDE9F8] rounded-2xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-xl ${ch.bgColor} flex items-center justify-center`}><IconComp size={15} className={ch.color} /></div>
                                    <div>
                                      <p className="font-semibold text-zinc-800 text-sm">{ch.title}</p>
                                      <p className="text-[10px] text-zinc-400">Goal: {ch.goal} {ch.unit}</p>
                                    </div>
                                  </div>
                                  <button onClick={() => setChallenges(p => p.filter(c => c.id !== ch.id))} className="text-zinc-300 hover:text-rose-400 transition-colors"><X size={13} /></button>
                                </div>
                                <div className="space-y-2">
                                  {allParticipants.map((p, rank) => {
                                    const pct = Math.min(100, Math.round((p.value / ch.goal) * 100));
                                    return (
                                      <div key={p.id} className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold text-zinc-400 w-4 shrink-0">#{rank + 1}</span>
                                        <div className={`w-6 h-6 rounded-full ${p.bgColor} flex items-center justify-center text-[9px] font-bold ${p.color} shrink-0`}>{p.initials}</div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center justify-between mb-1">
                                            <p className="text-xs font-semibold text-zinc-700 truncate">{p.name}</p>
                                            <p className="text-[10px] text-zinc-400 shrink-0 ml-2">{p.value}/{ch.goal}</p>
                                          </div>
                                          <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                            <motion.div className={`h-full rounded-full ${rank === 0 ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 'bg-gradient-to-r from-violet-400 to-indigo-400'}`}
                                              initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1], delay: rank * 0.1 }} />
                                          </div>
                                        </div>
                                        {/* Self update buttons */}
                                        {p.id === selfId && (
                                          <div className="flex gap-1 shrink-0">
                                            <button onClick={() => updateChallenge(ch.id, selfId, Math.min(ch.goal, p.value + 1))} className="w-6 h-6 rounded-lg bg-violet-50 hover:bg-violet-100 flex items-center justify-center text-violet-600 text-xs font-bold transition-colors">+</button>
                                            <button onClick={() => updateChallenge(ch.id, selfId, Math.max(0, p.value - 1))} className="w-6 h-6 rounded-lg bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs font-bold transition-colors">−</button>
                                          </div>
                                        )}
                                        {pct >= 100 && <span className="text-sm shrink-0">🏆</span>}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </Card>
                    )}

                    {/* Profile switcher */}
                    {members.length > 0 ? (
                      <>
                        <Card animate={false} className="p-4">
                          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Select a profile to manage</p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <button onClick={() => setActiveMemberId(null)} className="flex flex-col items-center gap-1.5 group">
                              <div className={`w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm ring-2 ring-offset-2 transition-all ${activeMemberId === null ? 'ring-violet-400 scale-110 shadow-[0_0_16px_rgba(124,58,237,0.4)]' : 'ring-transparent opacity-70 hover:opacity-100'}`}>
                                {initials}
                              </div>
                              <span className={`text-[10px] font-semibold ${activeMemberId === null ? 'text-violet-600' : 'text-zinc-400'}`}>You</span>
                            </button>
                            {members.map(m => (
                              <button key={m.id} onClick={() => setActiveMemberId(m.id)} className="flex flex-col items-center gap-1.5 group relative">
                                <div className={`w-14 h-14 rounded-full ${m.bgColor} flex items-center justify-center font-bold text-sm ring-2 ring-offset-2 transition-all ${activeMemberId === m.id ? `ring-violet-400 scale-110 shadow-[0_0_16px_rgba(124,58,237,0.3)]` : 'ring-transparent opacity-70 hover:opacity-100'} ${m.color}`}>
                                  {m.initials}
                                </div>
                                <span className={`text-[10px] font-semibold ${activeMemberId === m.id ? 'text-violet-600' : 'text-zinc-400'}`}>{m.name}</span>
                                {/* Sync indicator */}
                                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" title="Synced" />
                              </button>
                            ))}
                          </div>
                        </Card>

                        {/* Active member panel */}
                        <AnimatePresence mode="wait">
                          {activeMemberId === null ? (
                            <motion.div key="self" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                              <Card animate={false} className="p-5">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">{initials}</div>
                                  <div><p className="font-semibold text-zinc-800">{displayName} (You)</p><p className="text-xs text-zinc-400">Your health overview</p></div>
                                </div>
                                <div className="grid grid-cols-3 gap-3 text-center">
                                  {[{ l: 'Records', v: uploadedFiles.length }, { l: 'Care plan', v: planItems.length }, { l: 'Medications', v: medications.length }].map(({ l, v }) => (
                                    <div key={l} className="bg-zinc-50 rounded-xl p-3">
                                      <p className="text-xs text-zinc-400 mb-1">{l}</p>
                                      <p className="font-bold text-zinc-800 text-lg"><AnimCounter value={v} /></p>
                                    </div>
                                  ))}
                                </div>
                                <p className="text-xs text-zinc-400 mt-3 text-center">Switch to the other tabs to manage your own health data.</p>
                              </Card>
                            </motion.div>
                          ) : activeMember ? (
                            <motion.div key={activeMemberId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                              <Card animate={false} className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full ${activeMember.bgColor} ${activeMember.color} flex items-center justify-center font-bold text-sm`}>{activeMember.initials}</div>
                                    <div>
                                      <p className="font-semibold text-zinc-800">{activeMember.name}</p>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <p className="text-[10px] text-emerald-600 font-semibold">Synced</p>
                                      </div>
                                    </div>
                                  </div>
                                  <button onClick={() => { setMembers(p => p.filter(m => m.id !== activeMemberId)); setActiveMemberId(null); }} className="text-zinc-300 hover:text-rose-400 transition-colors p-1"><Trash2 size={14} /></button>
                                </div>
                                <MemberPanel member={activeMember} onUpdate={updateMember} challenges={challenges} onUpdateChallenge={updateChallenge} />
                              </Card>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Card animate={false} className="p-5">
                        <EmptyState icon={Users} title="No family members yet" desc="Click 'Add member' to add your family and manage everyone's health together." />
                      </Card>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </main>
  );
}


