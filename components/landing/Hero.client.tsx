'use client';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DASHBOARD_URL } from '@/lib/landing-constants';
import {
  animate,
  splitText,
  stagger,
  useAnime,
  DURATION,
  EASE,
  STAGGER,
} from '@/lib/anime';

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  // S3 entrance: per-character reveal on the headline (split + stagger
  // from center) followed by a tagline fade. SSR ships the heading and
  // tagline at `opacity-0` so there's no hydration flash; the animation
  // brings them to opacity 1. `useAnime` handles the createScope
  // lifecycle, so `splitText`'s wrapper spans get reverted on unmount.
  // Reduced-motion: duration 0 — final state shown instantly, never hidden.
  useAnime<HTMLElement>(rootRef, (self) => {
    const { reduceMotion } = self.matches;
    const { chars } = splitText('h1[data-hero-title]', { chars: true, words: true });
    animate(chars, {
      y: reduceMotion ? 0 : [60, 0],
      opacity: [0, 1],
      rotate: reduceMotion ? 0 : { from: '-12deg' },
      delay: stagger(STAGGER.fast, { from: 'center' }),
      duration: reduceMotion ? 0 : DURATION.medium,
      ease: EASE.hero,
    });
    animate('p[data-hero-tagline]', {
      y: reduceMotion ? 0 : [16, 0],
      opacity: [0, 1],
      delay: 600,
      duration: reduceMotion ? 0 : DURATION.short,
      ease: EASE.authoritative,
    });
  });

  return (
    // HERO — no <Reveal> wrappers: above-the-fold content must render
    // at full opacity in SSR HTML so Lighthouse can detect FCP. The
    // `Reveal` component starts at opacity-0, which left the entire
    // first viewport invisible until IntersectionObserver fired post-
    // hydration; Chrome's paint heuristic missed FCP entirely (FCP
    // requires text/image, not the SpaceBackground canvas).
    <section ref={rootRef} className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-20">
      <div className="mb-8">
        <Image src="/synapseia-logo.png" alt="Synapseia Network" width={120} height={120} priority className="w-24 h-24 sm:w-28 sm:h-28 mx-auto drop-shadow-[0_0_40px_rgba(100,120,255,0.15)]" />
      </div>
      <h1 data-hero-title className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 leading-[1.05] opacity-0">
        <span className="bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Synapseia</span><br />
        <span className="bg-gradient-to-r from-slate-300 via-blue-200 to-slate-300 bg-clip-text text-transparent">Network</span>
      </h1>
      <p data-hero-tagline className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed opacity-0">
        A distributed P2P network of independent AI agents that run multiple
        research training tracks in parallel — analyzing literature,
        peer-reviewing each other&apos;s outputs, and consolidating findings
        into a shared knowledge graph that every node can query.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <a
          href={DASHBOARD_URL}
          className="group px-8 py-3.5 rounded-xl backdrop-blur-md bg-blue-500/15 border border-blue-500/30 text-blue-200 font-semibold text-sm hover:bg-blue-500/25 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
        >
          Open Dashboard <span className="ml-2 group-hover:ml-3 transition-all">{'→'}</span>
        </a>
        <button onClick={() => document.getElementById('engine')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3.5 rounded-xl backdrop-blur-md bg-white/[0.04] border border-white/[0.08] text-slate-200 font-medium text-sm hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300">
          How it works {'↓'}
        </button>
        <Link href="/docs" className="px-8 py-3.5 rounded-xl text-slate-400 hover:text-white font-medium text-sm transition-colors">
          Docs {'→'}
        </Link>
      </div>
      {/* Decorative scroll cue — `aria-hidden` so screen readers skip
          it. The bouncing arrow is purely cosmetic. */}
      <div aria-hidden="true" className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-600 motion-safe:animate-bounce">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
      </div>
    </section>
  );
}
