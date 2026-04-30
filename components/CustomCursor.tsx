'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible,   setVisible]   = useState(false);
  const [hovering,  setHovering]  = useState(false);
  const [isMobile,  setIsMobile]  = useState(false);

  const mouse   = useRef({ x: -200, y: -200 });
  const ring    = useRef({ x: -200, y: -200 });
  const raf     = useRef<number | null>(null);
  const hoveringRef = useRef(false);

  useEffect(() => {
    const check = () =>
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer:coarse)').matches);
    check();
    window.addEventListener('resize', check);

    const move = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
      const t = e.target as HTMLElement;
      const isHov =
        t.tagName === 'BUTTON' || t.tagName === 'A' ||
        !!t.closest('button') || !!t.closest('a') || !!t.closest('[role="button"]');
      hoveringRef.current = isHov;
      setHovering(isHov);
    };
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.1);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.1);

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${mouse.current.x - 4}px, ${mouse.current.y - 4}px)`;
      }
      if (ringRef.current) {
        // Read hovering from ref to avoid restarting RAF on state change
        const s = hoveringRef.current ? 48 : 36;
        ringRef.current.style.transform =
          `translate(${ring.current.x - s / 2}px, ${ring.current.y - s / 2}px)`;
        ringRef.current.style.width  = `${s}px`;
        ringRef.current.style.height = `${s}px`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isMobile) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.2s' }}
    >
      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          borderRadius: '50%',
          border: hovering
            ? '2px solid rgba(155,135,245,0.6)'
            : '2px solid rgba(155,135,245,0.35)',
          background: hovering ? 'rgba(155,135,245,0.08)' : 'rgba(155,135,245,0.03)',
          transition: 'border-color 0.3s, background 0.3s, width 0.25s, height 0.25s',
          willChange: 'transform, width, height',
        }}
      />
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 8, height: 8, borderRadius: '50%',
          background: 'linear-gradient(135deg, #9B87F5, #8B92F8, #7DD3FC)',
          boxShadow: '0 0 12px rgba(155,135,245,0.6), 0 0 24px rgba(155,135,245,0.3)',
          opacity: hovering ? 0 : 1,
          transition: 'opacity 0.2s',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
