'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { Reveal, G } from './Reveal.client';
import {
  animate,
  utils,
  onScroll,
  useAnime,
  stagger,
  DURATION,
  EASE,
  STAGGER,
} from '@/lib/anime';

export function Cta() {
  // Scope root for anime.js. Drives the on-view fade-up of heading +
  // CTAs and a spring-scale on hover of the primary CTA.
  const root = useRef<HTMLDivElement>(null);

  useAnime<HTMLDivElement>(root, (self) => {
    const { reduceMotion } = self.matches;

    // On-view reveal of heading + paragraphs + CTA buttons. Outer
    // <Reveal> already CSS-fades the wrapping card, this layer adds
    // a subtle staggered slide for the children inside. Opacity is
    // owned by the parent <Reveal>; we animate only the y transform
    // so children never stick invisible if onScroll does not fire.
    const targets = utils.$('[data-cta-reveal]') as unknown as HTMLElement[];
    animate(targets, {
      y: reduceMotion ? 0 : [12, 0],
      delay: reduceMotion ? 0 : stagger(STAGGER.base),
      duration: reduceMotion ? 0 : DURATION.short,
      ease: EASE.snap,
      autoplay: onScroll({ target: root.current!, enter: 'bottom-=80 top' }),
    });

    if (reduceMotion) return;

    // Spring scale on hover of the primary CTA.
    const primary = utils.$('[data-cta-primary]') as unknown as HTMLElement[];
    const cleanups: Array<() => void> = [];

    primary.forEach((btn) => {
      const onEnter = () => {
        animate(btn, { scale: 1.04, duration: 250, ease: EASE.spring });
      };
      const onLeave = () => {
        animate(btn, { scale: 1, duration: 250, ease: EASE.spring });
      };
      btn.addEventListener('pointerenter', onEnter);
      btn.addEventListener('pointerleave', onLeave);
      cleanups.push(() => {
        btn.removeEventListener('pointerenter', onEnter);
        btn.removeEventListener('pointerleave', onLeave);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  });

  return (
    <section ref={root} className="py-28 px-6 text-center">
      <div className="max-w-2xl mx-auto">
        <Reveal>
          <G className="p-12 rounded-3xl">
            <h2 data-cta-reveal className="text-4xl font-bold text-white mb-4">Built in public</h2>
            <p data-cta-reveal className="text-slate-400 mb-6 leading-relaxed">
              Synapseia is a working peer-to-peer research network. Multiple
              training tracks run in parallel today across distributed
              operator GPUs, and every cycle is logged to the public knowledge
              graph. The node code, the protocol specs, and the Solana
              contracts are public: readable, auditable, runnable.
            </p>
            <p data-cta-reveal className="text-slate-500 mb-10 leading-relaxed text-sm">
              Source-available under the Functional Source License (FSL-1.1)
              and auto-converts to Apache-2.0 in 2028. You can read the code,
              run a node, and audit the protocol; commits to the official
              repo are restricted to the Synapseia team so binary attestation
              has a trustworthy origin.
            </p>
            <div data-cta-reveal className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/docs"
                data-cta-primary
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl backdrop-blur-md bg-blue-500/15 border border-blue-500/30 text-blue-200 font-semibold hover:bg-blue-500/25 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 text-base"
              >
                Read the docs
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <a
                href="https://github.com/erscoder/synapseia-landing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl backdrop-blur-md bg-white/[0.04] border border-white/[0.08] text-slate-200 font-semibold hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 text-base"
              >
                GitHub
              </a>
            </div>
          </G>
        </Reveal>
      </div>
    </section>
  );
}
