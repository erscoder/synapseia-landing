'use client';
import { useEffect, useState, useRef } from 'react';

// SSR-safe Reveal: starts at opacity-100 so the rendered HTML always
// contains visible content (required for Lighthouse FCP detection).
// Post-mount, the effect checks viewport position: above-the-fold stays
// visible; below-the-fold drops to opacity-0 and fades back in via
// IntersectionObserver as the user scrolls. The brief flash on
// below-fold elements is acceptable because they are off-screen at
// first paint anyway.
export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) return;
    setV(false);
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setV(true); },
      { threshold: 0.1 },
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);
  return { ref, v };
}

export function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, v } = useReveal();
  return <div ref={ref} className={`transition-all duration-700 ease-out ${v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

export function G({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`backdrop-blur-md bg-white/[0.03] border border-white/[0.06] rounded-2xl ${className}`}>{children}</div>;
}

export function FA({ label }: { label?: string }) {
  return <div className="flex flex-col items-center gap-1 py-3"><div className="w-px h-6 bg-gradient-to-b from-white/10 to-transparent" /><span className="text-slate-500 text-lg leading-none">{'↓'}</span>{label && <span className="text-[10px] text-slate-600 uppercase tracking-widest">{label}</span>}</div>;
}

export function SH({ stage, title, subtitle }: { stage: number; title: string; subtitle: string }) {
  // h3 (not h2) because every stage panel is a subsection of the
  // HowItWorks h2 "How a research cycle runs today". Keeps the home
  // outline at h1 -> h2 (one per landing block) -> h3 (subsections).
  return <div className="text-center mb-12"><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 font-mono mb-4">STAGE {stage}</div><h3 className="text-3xl sm:text-4xl font-bold text-white mb-3">{title}</h3><p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">{subtitle}</p></div>;
}
