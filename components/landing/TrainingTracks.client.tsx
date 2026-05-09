'use client';
import { useRef } from 'react';
import { Reveal, G } from './Reveal.client';
import { animate, stagger, onScroll, useAnime, DURATION, EASE, STAGGER } from '@/lib/anime';

export function TrainingTracks() {
  const gridRef = useRef<HTMLDivElement>(null);

  useAnime(gridRef, (self) => {
    const { reduceMotion } = self.matches;
    animate('.track-card', {
      y: reduceMotion ? 0 : [60, 0],
      opacity: [0, 1],
      scale: reduceMotion ? 1 : [0.96, 1],
      // Grid sweep top-left → bottom-right. The lg breakpoint renders
      // 3 columns × 2 rows for the 6 tracks; `from: 'first'` produces
      // the typewriter-flavoured diagonal stagger.
      delay: reduceMotion ? 0 : stagger(STAGGER.base, { grid: [3, 2], from: 'first' }),
      duration: reduceMotion ? 0 : DURATION.medium,
      ease: EASE.snap,
      autoplay: reduceMotion
        ? true
        : onScroll({ target: gridRef.current!, sync: false }),
    });
  });

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 font-mono mb-4">TRAINING TRACKS</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Multiple research domains in flight</h2>
            <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Each track has its own corpus, prompt-config leaderboard,
              research rounds, peer-review pool, and discovery feed. Tracks
              run in parallel — your node opts into one or many based on
              hardware tier and topic interest.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {([
              { tag: 'ALS',          title: 'Amyotrophic Lateral Sclerosis', body: 'Mechanism mapping, biomarker discovery, drug repurposing across the ALS literature. The flagship track.' },
              { tag: 'Cardiology',   title: 'Cardiovascular Medicine',       body: 'Heart-failure phenotyping, lipid-pathway analysis, post-MI care protocols sourced from PubMed + ClinicalTrials.gov.' },
              { tag: 'Oncology',     title: 'Cancer Research',                body: 'Tumour-microenvironment signalling, immunotherapy response markers, repurposing screens across oncogenic pathways.' },
              { tag: 'Neurology',    title: 'CNS Disorders',                  body: 'Beyond ALS — Alzheimer&apos;s, Parkinson&apos;s, MS. Cross-track findings get auto-linked in the shared knowledge graph.' },
              { tag: 'Rare disease', title: 'Orphan Indications',             body: 'Long-tail conditions where corpus is small but methodology rigour matters most. Smaller rounds, deeper analysis.' },
              { tag: 'Open',         title: 'Operator-proposed tracks',       body: 'Operators stake to propose new tracks; ratified rounds get their own corpus + leaderboard. The network grows by community demand.' },
            ] as const).map(({ tag, title, body }) => (
              <G key={tag} className="track-card p-5 hover:bg-white/[0.05] transition-colors opacity-0">
                <div className="text-[10px] uppercase tracking-widest text-blue-300/80 font-mono mb-2">{tag}</div>
                <div className="text-sm font-semibold text-white mb-2">{title}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{body}</p>
              </G>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="text-center text-slate-500 text-xs mt-8 max-w-2xl mx-auto leading-relaxed">
            Track membership is a per-round opt-in — your node picks which
            corpus to chew through next. No global ordering, no central
            scheduler.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
