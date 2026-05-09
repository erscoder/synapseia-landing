'use client';
import { useRef } from 'react';
import { Reveal, G } from './Reveal.client';
import {
  animate,
  stagger,
  svg,
  onScroll,
  utils,
  useAnime,
  DURATION,
  EASE,
} from '@/lib/anime';

const TRACKS = [
  { tag: 'ALS',          title: 'Amyotrophic Lateral Sclerosis', body: 'Mechanism mapping, biomarker discovery, drug repurposing across the ALS literature. The flagship track.' },
  { tag: 'Cardiology',   title: 'Cardiovascular Medicine',       body: 'Heart-failure phenotyping, lipid-pathway analysis, post-MI care protocols sourced from PubMed + ClinicalTrials.gov.' },
  { tag: 'Oncology',     title: 'Cancer Research',                body: 'Tumour-microenvironment signalling, immunotherapy response markers, repurposing screens across oncogenic pathways.' },
  { tag: 'Neurology',    title: 'CNS Disorders',                  body: "Beyond ALS: Alzheimer's, Parkinson's, MS. Cross-track findings get auto-linked in the shared knowledge graph." },
  { tag: 'Rare disease', title: 'Orphan Indications',             body: 'Long-tail conditions where corpus is small but methodology rigour matters most. Smaller rounds, deeper analysis.' },
  { tag: 'Open',         title: 'Operator-proposed tracks',       body: 'Operators stake to propose new tracks; ratified rounds get their own corpus + leaderboard. The network grows by community demand.' },
] as const;

// Approximate card grid cell centres in a 3-col layout (viewBox 600×400).
// Six cells: row 0 [(100,100),(300,100),(500,100)], row 1 [(100,300),(300,300),(500,300)].
// Connector path traces 1→2→3→6→5→4 in a serpentine to feel like
// the network discovering domains in sequence.
const CONNECTORS = [
  'M100 100 C 200 60, 240 60, 300 100',
  'M300 100 C 400 60, 440 60, 500 100',
  'M500 100 C 580 180, 580 220, 500 300',
  'M500 300 C 400 340, 360 340, 300 300',
  'M300 300 C 200 340, 160 340, 100 300',
] as const;

// Signature gesture: SVG connectors line-draw between cards in
// sequence (network discovering domains), each card pulses as the
// trace reaches it, then 3 particles flow continuously along the
// path - paused offscreen via onScroll's IntersectionObserver.
export function TrainingTracks() {
  const rootRef = useRef<HTMLElement>(null);

  useAnime<HTMLElement>(rootRef, (self) => {
    const root = rootRef.current;
    if (!root) return;
    const { reduceMotion } = self.matches;
    if (reduceMotion) return;

    // Manual play via IntersectionObserver - `[from, to]` pulses must
    // not strand cards mid-transform if the trigger never fires.
    const drawables = svg.createDrawable('[data-track-connector] path');
    const drawAnim = animate(drawables, {
      draw: ['0 0', '0 1'],
      delay: stagger(180),
      duration: DURATION.medium,
      ease: 'inOutSine',
      autoplay: false,
    });
    const pulseAnim = animate('[data-track-card]', {
      scale: [1, 1.04, 1],
      delay: stagger(180, { start: 280 }),
      duration: 420,
      ease: EASE.authoritative,
      autoplay: false,
    });

    // Ambient flow: 3 small particles travel the first connector arc
    // continuously. `autoplay: onScroll` pauses them offscreen - and
    // because particles ship invisible (opacity-0 in markup) AND
    // their entrance is opacity-only at scroll-enter, the from-state
    // pitfall doesn't strand them.
    const flow = svg.createMotionPath('[data-track-flowpath]');
    animate('[data-track-particle]', {
      ...flow,
      duration: 4200,
      delay: stagger(1400),
      loop: true,
      ease: 'linear',
      opacity: [0, 0.9, 0],
      autoplay: onScroll({ target: root, sync: false }),
    });

    let played = false;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !played) {
        played = true;
        drawAnim.play();
        pulseAnim.play();
        io.disconnect();
      }
    }, { threshold: 0.2 });
    io.observe(root);

    return () => {
      io.disconnect();
      utils.remove('[data-track-connector] path');
    };
  });

  return (
    <section ref={rootRef} className="py-20 px-6 relative">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 font-mono mb-4">TRAINING TRACKS</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Multiple research domains in flight</h2>
            <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Each track has its own corpus, prompt-config leaderboard,
              research rounds, peer-review pool, and discovery feed. Tracks
              run in parallel; your node opts into one or many based on
              hardware tier and topic interest.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="relative">
            {/* SVG overlay sits behind the grid - pointer-events-none so
                hovers on the cards still land. Hidden on mobile (1-col
                stack would route the connectors awkwardly). */}
            <svg
              data-track-connector
              aria-hidden="true"
              viewBox="0 0 600 400"
              preserveAspectRatio="none"
              className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none -z-0"
            >
              <defs>
                <linearGradient id="track-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgb(59 130 246 / 0.0)" />
                  <stop offset="50%" stopColor="rgb(96 165 250 / 0.55)" />
                  <stop offset="100%" stopColor="rgb(59 130 246 / 0.0)" />
                </linearGradient>
              </defs>
              {CONNECTORS.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  data-track-flowpath={i === 0 ? '' : undefined}
                  fill="none"
                  stroke="url(#track-grad)"
                  strokeWidth={1.2}
                  strokeLinecap="round"
                />
              ))}
              {[0, 1, 2].map((i) => (
                <circle
                  key={i}
                  data-track-particle
                  r={2.4}
                  fill="rgb(147 197 253)"
                  opacity={0}
                />
              ))}
            </svg>

            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TRACKS.map(({ tag, title, body }) => (
                <G key={tag} className="p-5 hover:bg-white/[0.05] transition-colors">
                  <div data-track-card>
                    <div className="text-[10px] uppercase tracking-widest text-blue-300/80 font-mono mb-2">{tag}</div>
                    <div className="text-sm font-semibold text-white mb-2">{title}</div>
                    <p className="text-xs text-slate-400 leading-relaxed">{body}</p>
                  </div>
                </G>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="text-center text-slate-500 text-xs mt-8 max-w-2xl mx-auto leading-relaxed">
            Track membership is a per-round opt-in; your node picks which
            corpus to chew through next. No global ordering, no central
            scheduler.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
