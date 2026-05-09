'use client';

import { useMemo, useRef } from 'react';
import { animate, onScroll, stagger, useAnime } from '@/lib/anime';

// Deterministic seed based on index - keeps SSR and CSR markup identical
// (no `Math.random()` flash / hydration mismatch). The modulo arithmetic
// produces a pseudo-spread across the SVG viewBox without needing a real
// PRNG. Stars sit at opacity 0.2 by default so the page renders something
// before the twinkle loop kicks in (and so reduced-motion users still see
// the constellation, just static).
const STAR_COUNT = 30;

type Star = {
  cx: number;
  cy: number;
  r: number;
};

export function Footer() {
  const rootRef = useRef<HTMLElement>(null);

  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: STAR_COUNT }, (_, i) => ({
        // viewBox is 1000 x 150 - spread x across full width, y across height.
        cx: ((i * 37) % 100) * 10,
        cy: ((i * 53) % 100) * 1.5,
        r: 0.6 + (i % 3) * 0.2,
      })),
    [],
  );

  useAnime(rootRef, (self) => {
    const { reduceMotion } = self.matches;
    if (reduceMotion) return;
    if (!rootRef.current) return;
    animate('.footer-star', {
      opacity: [0.2, 1],
      scale: [1, 1.3, 1],
      loop: true,
      alternate: true,
      duration: 3000,
      delay: stagger(80, { from: 'random' }),
      ease: 'inOutSine',
      // Pause the loop while the footer is offscreen - spares 30
      // animators from ticking continuously while the user is on
      // the hero / engine / network bands.
      autoplay: onScroll({ target: rootRef.current, sync: false }),
    });
  });

  return (
    <footer
      ref={rootRef}
      className="relative py-8 px-6 text-center border-t border-white/[0.04] overflow-hidden"
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 w-full h-full pointer-events-none"
        viewBox="0 0 1000 150"
        preserveAspectRatio="none"
      >
        {stars.map((s, i) => (
          <circle
            key={i}
            className="footer-star"
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="rgb(148 163 184)"
            style={{ opacity: 0.2 }}
          />
        ))}
      </svg>
      <p className="relative text-slate-600 text-sm">
        Synapseia Network {'©'} 2026 · Decentralized AI Research
      </p>
    </footer>
  );
}
