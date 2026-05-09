'use client';
import { useRef } from 'react';
import { Reveal, G } from './Reveal.client';
import { animate, stagger, onScroll, useAnime, DURATION, EASE, STAGGER } from '@/lib/anime';

export function HardwareTiers() {
  const gridRef = useRef<HTMLDivElement>(null);

  useAnime(gridRef, (self) => {
    const { reduceMotion } = self.matches;
    // Card sweep across the row, left → right. Cards ship with
    // `opacity-0` so the entrance owns the visible state and there
    // is no flicker between hydration and the scroll trigger.
    // Selector targets a class — `G` does not forward data-* attrs,
    // so we tag via className instead of a data attribute.
    animate('.tier-card', {
      y: reduceMotion ? 0 : [40, 0],
      opacity: [0, 1],
      scale: reduceMotion ? 1 : [0.96, 1],
      delay: reduceMotion ? 0 : stagger(STAGGER.slow),
      duration: reduceMotion ? 0 : DURATION.medium,
      ease: EASE.spring,
      autoplay: reduceMotion
        ? true
        : onScroll({ target: gridRef.current!, sync: false }),
    });
    // Tier specs in this section are descriptive prose ("4 rounds /
    // day", "30-50 SYN", "Top-3 placement") embedded inside bullet
    // lists rather than standalone numeric stats. Count-up is
    // skipped — splitting prose mid-sentence would obscure the copy
    // and there are no GB / VRAM / earn-rate spans to animate.
  });

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 font-mono mb-4">HARDWARE</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Run a node on what you have</h2>
            <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
              The desktop app picks the work types your machine can
              handle. Start with a laptop, add a GPU later — your
              operator identity stays the same and your stake
              follows you up the tiers.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <G className="tier-card p-6 opacity-0">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-2">Tier 0–1</div>
              <div className="text-base font-semibold text-white mb-2">Laptop</div>
              <ul className="text-xs text-slate-400 leading-relaxed space-y-1.5 list-disc pl-4 marker:text-slate-600">
                <li>Research analysis</li>
                <li>CPU inference (tokenize / embed / classify)</li>
                <li>Peer review</li>
                <li>Knowledge-graph hosting (small shards)</li>
              </ul>
            </G>
            <G className="tier-card p-6 opacity-0">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-2">Tier 2–3</div>
              <div className="text-base font-semibold text-white mb-2">Workstation + consumer GPU</div>
              <ul className="text-xs text-slate-400 leading-relaxed space-y-1.5 list-disc pl-4 marker:text-slate-600">
                <li>Everything in Tier 0-1</li>
                <li>CPU training (4 rounds / day)</li>
                <li>GPU inference (FCFS 30-50 SYN per task)</li>
                <li>Molecular docking pairs</li>
              </ul>
            </G>
            <G className="tier-card p-6 opacity-0">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-2">Tier 4–5</div>
              <div className="text-base font-semibold text-white mb-2">Datacenter / multi-GPU</div>
              <ul className="text-xs text-slate-400 leading-relaxed space-y-1.5 list-disc pl-4 marker:text-slate-600">
                <li>Everything in Tier 2-3</li>
                <li>GPU training (DiLoCo, 6 rounds / day)</li>
                <li>Heaviest peer-review workloads</li>
                <li>Top-3 placement on the highest pools</li>
              </ul>
            </G>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="text-center text-slate-500 text-xs mt-8 max-w-2xl mx-auto leading-relaxed">
            Tier is determined by hardware capability AND staked SYN
            — see{' '}
            <a href="/docs#staking" className="text-blue-300 underline underline-offset-2 hover:text-blue-200">
              Staking and tiers
            </a>{' '}
            for the full multiplier table.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
