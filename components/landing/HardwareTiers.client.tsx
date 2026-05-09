'use client';
import { useEffect, useRef } from 'react';
import { Reveal, G } from './Reveal.client';
import {
  animate,
  scrambleText,
  stagger,
  svg,
  utils,
  useAnime,
  DURATION,
  EASE,
} from '@/lib/anime';

const TIER_LABELS = ['TIER 0–1', 'TIER 2–3', 'TIER 4–5'] as const;

// Full 6-tier spectrum. Replaces the previous pasted-pptx slide
// (`/synapseia/hardware-tiers.png`). The simplified Laptop /
// Workstation / Datacenter cards remain below as the at-a-glance
// summary — their scanline + scrambleText motion is untouched.
const TIERS: Array<{
  tier: number;
  name: string;
  multiplier: number;
  hardware: string;
  capabilities: string;
  // Tailwind ring + accent classes so the spectrum reads as a
  // graduated palette across the 6 columns.
  accent: string;
  accentBorder: string;
  accentText: string;
}> = [
  {
    tier: 0,
    name: 'Inclusion',
    multiplier: 100,
    hardware: 'CPU laptops (Intel · AMD · Apple)',
    capabilities:
      'Validation, peer review, KG hosting (small shards), CPU inference.',
    accent: 'bg-cyan-500/[0.04]',
    accentBorder: 'border-cyan-400/15',
    accentText: 'text-cyan-300',
  },
  {
    tier: 1,
    name: 'Prosumer',
    multiplier: 110,
    hardware: 'Apple M3-M4 · RTX 3060-4070',
    capabilities:
      'Tier 0 + light GPU inference, hyperparameter search.',
    accent: 'bg-cyan-500/[0.06]',
    accentBorder: 'border-cyan-400/25',
    accentText: 'text-cyan-300',
  },
  {
    tier: 2,
    name: 'Prosumer+',
    multiplier: 125,
    hardware: 'M2/M3 Max · RTX 3080-3090',
    capabilities:
      'Tier 1 + CPU training (4 rounds/day), molecular docking pairs.',
    accent: 'bg-emerald-500/[0.04]',
    accentBorder: 'border-emerald-400/20',
    accentText: 'text-emerald-300',
  },
  {
    tier: 3,
    name: 'Pro',
    multiplier: 150,
    hardware: 'RTX 4080 · RTX 4090',
    capabilities:
      'Tier 2 + GPU inference (FCFS, 30-50 SYN/task).',
    accent: 'bg-emerald-500/[0.06]',
    accentBorder: 'border-emerald-400/30',
    accentText: 'text-emerald-300',
  },
  {
    tier: 4,
    name: 'Pro+',
    multiplier: 200,
    hardware: 'Workstation multi-GPU (2× RTX 4090)',
    capabilities:
      'Tier 3 + GPU training (DiLoCo, 6 rounds/day), heavy peer-review.',
    accent: 'bg-fuchsia-500/[0.04]',
    accentBorder: 'border-fuchsia-400/20',
    accentText: 'text-fuchsia-300',
  },
  {
    tier: 5,
    name: 'Industrial',
    multiplier: 300,
    hardware: 'Datacenter clusters (H100 · A100)',
    capabilities:
      'Tier 4 + Top-3 placement on the highest pools, multi-GPU DiLoCo.',
    accent: 'bg-fuchsia-500/[0.07]',
    accentBorder: 'border-fuchsia-400/35',
    accentText: 'text-fuchsia-300',
  },
];

// Native 6-tier spectrum. Sweep entrance + multiplier count-up.
function TierSpectrum() {
  const ref = useRef<HTMLDivElement>(null);
  const multRefs = useRef<Array<HTMLSpanElement | null>>([]);

  // SSR-safe resting state: paint the final multiplier strings on
  // mount so reduced-motion users and pre-trigger frames are correct.
  useEffect(() => {
    multRefs.current.forEach((el, i) => {
      if (el) el.textContent = `${TIERS[i]!.multiplier}%`;
    });
  }, []);

  useAnime<HTMLDivElement>(ref, (self) => {
    const root = ref.current;
    if (!root) return;
    const { reduceMotion } = self.matches;
    if (reduceMotion) return;

    // Column sweep — left → right.
    const colAnim = animate('[data-tier-col]', {
      y: [16, 0],
      opacity: [0, 1],
      delay: stagger(80),
      duration: DURATION.medium,
      ease: EASE.snap,
      autoplay: false,
    });

    // Multiplier count-up per tier — graduated 100 → 300.
    const counterAnims = TIERS.map((t, i) => {
      const obj = { v: 100 };
      return {
        obj,
        anim: animate(obj, {
          v: t.multiplier,
          duration: 900,
          delay: 300 + i * 100,
          ease: 'outExpo',
          autoplay: false,
          onUpdate: () => {
            const el = multRefs.current[i];
            if (el) el.textContent = `${Math.round(obj.v)}%`;
          },
          onComplete: () => {
            const el = multRefs.current[i];
            if (el) el.textContent = `${t.multiplier}%`;
          },
        }),
      };
    });

    let played = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !played) {
          played = true;
          colAnim.play();
          counterAnims.forEach(({ obj, anim }) => {
            obj.v = 100;
            anim.play();
          });
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(root);

    return () => {
      io.disconnect();
      colAnim.pause();
      counterAnims.forEach(({ anim }) => anim.pause());
      utils.remove(counterAnims.map(({ obj }) => obj));
    };
  });

  return (
    <div ref={ref}>
      <G className="p-4 sm:p-6 mb-6 overflow-hidden">
        {/* lg:6-col grid · md:scrollable · sm:stacked */}
        <div className="overflow-x-auto md:overflow-x-auto lg:overflow-visible">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 min-w-full lg:min-w-0">
            {TIERS.map((t, i) => (
              <div
                key={t.tier}
                data-tier-col
                className={`rounded-xl border ${t.accentBorder} ${t.accent} p-4 flex flex-col gap-3`}
              >
                <div className="flex items-baseline justify-between">
                  <span
                    className={`text-[10px] uppercase tracking-widest font-mono ${t.accentText}`}
                  >
                    Tier {t.tier}
                  </span>
                  <span
                    ref={(el) => {
                      multRefs.current[i] = el;
                    }}
                    className={`text-sm font-mono font-bold ${t.accentText}`}
                  >
                    {t.multiplier}%
                  </span>
                </div>
                <div className="text-sm font-semibold text-white leading-tight">
                  {t.name}
                </div>
                <div className="text-[11px] text-slate-400 font-mono leading-snug border-t border-white/[0.04] pt-2">
                  {t.hardware}
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">
                  {t.capabilities}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-center text-[11px] text-slate-500 mt-4 font-mono uppercase tracking-widest">
          Multiplier · staked SYN · Hardware capability
        </p>
      </G>
    </div>
  );
}

// Existing simplified 3-card row + scanline kept as the
// at-a-glance summary. Animation untouched per orchestrator brief.
export function HardwareTiers() {
  const rootRef = useRef<HTMLElement>(null);

  useAnime<HTMLElement>(rootRef, (self) => {
    const root = rootRef.current;
    if (!root) return;
    const { reduceMotion } = self.matches;
    if (reduceMotion) return;

    const drawables = svg.createDrawable('[data-tier-scanline] line');
    const scanAnim = animate(drawables, {
      draw: ['0 0', '0 1'],
      duration: 700,
      ease: 'inOutQuart',
      autoplay: false,
    });

    // Card scale-pop sequenced to scanline progress (~33% per card).
    const popAnim = animate('[data-tier-card]', {
      scale: [0.97, 1],
      duration: 320,
      ease: EASE.authoritative,
      delay: (_el: unknown, i?: number) => 200 + (i ?? 0) * 220,
      autoplay: false,
    });

    // Scramble label per card, fired in sync with the pop.
    const scrambleAnims = TIER_LABELS.map((_label, i) => animate(
      `[data-tier-label="${i}"]`,
      {
        innerHTML: scrambleText({ chars: 'uppercase' }),
        duration: 420,
        delay: 240 + i * 220,
        ease: 'linear',
        autoplay: false,
      },
    ));

    let played = false;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !played) {
        played = true;
        scanAnim.play();
        popAnim.play();
        scrambleAnims.forEach((a) => a.play());
        io.disconnect();
      }
    }, { threshold: 0.25 });
    io.observe(root);

    return () => {
      io.disconnect();
      utils.remove('[data-tier-scanline] line');
    };
  });

  return (
    <section ref={rootRef} className="py-20 px-6">
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

        <Reveal delay={50}>
          <TierSpectrum />
          <p className="text-center text-xs text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            The full multiplier table — staked SYN raises tier on top of
            hardware capability.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="relative">
            {/* Scanline overlay: 1px stroke sweeping the row. Hidden on
                mobile (single column wouldn't communicate the sweep). */}
            <svg
              data-tier-scanline
              aria-hidden="true"
              viewBox="0 0 600 4"
              preserveAspectRatio="none"
              className="hidden sm:block absolute -top-2 left-0 w-full h-1 pointer-events-none"
            >
              <line x1="0" y1="2" x2="600" y2="2" stroke="rgb(96 165 250 / 0.7)" strokeWidth={2} />
            </svg>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { idx: 0, name: 'Laptop',                       items: ['Research analysis', 'CPU inference (tokenize / embed / classify)', 'Peer review', 'Knowledge-graph hosting (small shards)'] },
                { idx: 1, name: 'Workstation + consumer GPU',   items: ['Everything in Tier 0-1', 'CPU training (4 rounds / day)', 'GPU inference (FCFS 30-50 SYN per task)', 'Molecular docking pairs'] },
                { idx: 2, name: 'Datacenter / multi-GPU',       items: ['Everything in Tier 2-3', 'GPU training (DiLoCo, 6 rounds / day)', 'Heaviest peer-review workloads', 'Top-3 placement on the highest pools'] },
              ].map(({ idx, name, items }) => (
                <G key={idx} className="p-6">
                  <div data-tier-card>
                    <div data-tier-label={idx} className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-2">{TIER_LABELS[idx]}</div>
                    <div className="text-base font-semibold text-white mb-2">{name}</div>
                    <ul className="text-xs text-slate-400 leading-relaxed space-y-1.5 list-disc pl-4 marker:text-slate-600">
                      {items.map((it) => <li key={it}>{it}</li>)}
                    </ul>
                  </div>
                </G>
              ))}
            </div>
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
