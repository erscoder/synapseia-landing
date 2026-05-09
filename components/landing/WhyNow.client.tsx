'use client';
import { useEffect, useRef } from 'react';
import { Reveal, G } from './Reveal.client';
import {
  animate,
  utils,
  useAnime,
  DURATION,
  EASE,
} from '@/lib/anime';

// "The problem" section sitting between Hero and HowItWorks. The
// previous slice imported a pasted-pptx screenshot (problem-stats.png)
// which read as a bolted-on slide. Replaced with a native 3-stat row
// driven by anime.js count-ups, plus an ALS callout in the same
// glassmorphic style as the rest of the landing.

type Stat = {
  // numeric target the count-up animation drives
  target: number;
  // formatter that paints `${current}-style string` — passed the
  // rounded interpolated value at every frame.
  format: (v: number) => string;
  // resting-state final string shown when reduced-motion is on,
  // or before the IntersectionObserver fires.
  finalText: string;
  label: string;
  detail: string;
  // Tailwind gradient classes painted on the big number — graduated
  // alarm palette so the user feels the row tighten as they read.
  gradientClass: string;
};

const STATS: Stat[] = [
  {
    target: 15,
    format: (v) => `${Math.round(v)}–15 yrs`,
    finalText: '10–15 yrs',
    label: 'TIME TO MARKET',
    detail: 'From hypothesis to approved drug.',
    gradientClass:
      'bg-gradient-to-b from-white via-amber-200 to-amber-400',
  },
  {
    target: 2.6,
    format: (v) => `$${v.toFixed(1)} B`,
    finalText: '$2.6 B',
    label: 'COST PER APPROVED DRUG',
    detail: 'Inflation-adjusted, 2024 industry average.',
    gradientClass:
      'bg-gradient-to-b from-white via-orange-200 to-orange-400',
  },
  {
    target: 90,
    format: (v) => `${Math.round(v)} %`,
    finalText: '90 %',
    label: 'FAILURE RATE',
    detail: 'Of compounds entering trials never ship.',
    gradientClass:
      'bg-gradient-to-b from-white via-rose-200 to-rose-400',
  },
];

export function WhyNow() {
  const sectionRef = useRef<HTMLElement>(null);
  // Each stat has its own `<span>` painted by the count-up effect; we
  // collect refs in a stable array so `useAnime` can drive them.
  const valueRefs = useRef<Array<HTMLSpanElement | null>>([]);

  // Paint the resting-state text on mount so SSR HTML is correct
  // (Lighthouse FCP) and reduced-motion users see the final string
  // even if the IntersectionObserver never fires.
  useEffect(() => {
    valueRefs.current.forEach((el, i) => {
      if (el) el.textContent = STATS[i]!.finalText;
    });
  }, []);

  useAnime<HTMLElement>(sectionRef, (self) => {
    const root = sectionRef.current;
    if (!root) return;
    const { reduceMotion } = self.matches;
    if (reduceMotion) {
      // Resting state already painted in the mount effect above.
      return;
    }

    // Drive count-up by mutating a plain JS object's `.v` field —
    // canonical anime.js v4 idiom. autoplay:false so we play manually
    // when the section enters the viewport (no from-state pitfall).
    const counters = STATS.map((s, i) => {
      const obj = { v: 0 };
      const anim = animate(obj, {
        v: s.target,
        duration: DURATION.long,
        delay: i * 200,
        ease: EASE.authoritative,
        autoplay: false,
        onUpdate: () => {
          const el = valueRefs.current[i];
          if (el) el.textContent = s.format(obj.v);
        },
        onComplete: () => {
          // Snap to the canonical resting string in case rounding
          // drift produced "9.9 %" instead of "10 %".
          const el = valueRefs.current[i];
          if (el) el.textContent = s.finalText;
        },
      });
      return { obj, anim };
    });

    // Reset to 0 just before the entrance plays — utils.set is
    // synchronous, so the user never sees the counters land at the
    // final value before counting up.
    let played = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !played) {
          played = true;
          counters.forEach(({ obj, anim }) => {
            obj.v = 0;
            anim.play();
          });
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(root);

    return () => {
      io.disconnect();
      counters.forEach(({ anim }) => anim.pause());
      utils.remove(counters.map(({ obj }) => obj));
    };
  });

  return (
    <section ref={sectionRef} id="why-now" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 font-mono mb-4">
              THE PROBLEM
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Drug discovery has collapsed under its own weight.
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Three numbers describe the industry today. None of them
              are improving on their own.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {STATS.map((s, i) => (
              <G key={s.label} className="p-6 text-center">
                <div
                  ref={(el) => {
                    valueRefs.current[i] = el;
                  }}
                  className={`text-5xl sm:text-6xl font-bold font-mono bg-clip-text text-transparent leading-none mb-3 ${s.gradientClass}`}
                >
                  {s.finalText}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-2">
                  {s.label}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {s.detail}
                </p>
              </G>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <G className="p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-300 font-mono uppercase tracking-widest mb-4">
              THE ALS EMBLEM
            </div>
            <p className="text-xl sm:text-2xl font-semibold text-white leading-snug mb-4">
              90 years of research. 40,000 papers. No human can hold
              the whole picture.
            </p>
            <p className="text-slate-400 leading-relaxed">
              The fix is not faster compute on one machine. It is
              compositional intelligence on a network of machines, each
              chewing through a slice of the literature, peer-reviewing
              each other, and consolidating findings into a shared
              knowledge graph.
            </p>
          </G>
        </Reveal>

        <Reveal delay={300}>
          <div className="text-center mt-10">
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById('engine')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="px-6 py-3 rounded-xl backdrop-blur-md bg-white/[0.04] border border-white/[0.08] text-slate-200 font-medium text-sm hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
            >
              Read how it works {'↓'}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
