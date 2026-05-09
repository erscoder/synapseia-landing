'use client';
import { useRef } from 'react';
import { Reveal, G } from './Reveal.client';
import {
  animate,
  onScroll,
  useAnime,
  DURATION,
  EASE,
} from '@/lib/anime';

// Static target for the count-up: matches the literal `71,918 SYN/day`
// shown in the staking callout. Kept here so the count-up target stays
// in sync with the rendered formatted string. If the daily staking pool
// changes, update both this constant and the `71,918` in the JSX.
const STAKING_POOL_TARGET = 71918;

// Spanish-EN locale-agnostic thousands formatter ("71,918"). Matches
// the existing static copy so the final frame reads identically to the
// SSR HTML.
const formatThousands = (n: number) => Math.round(n).toLocaleString('en-US');

export function EarnBand() {
  const rootRef = useRef<HTMLElement>(null);

  // S10 - anime.js v4 motion for the earn / rewards section.
  // Inventory:
  //   - heading + supporting copy + 6 income-stream cards + tier table
  //     + staking callout (already wrapped in <Reveal> for on-view
  //     opacity+translate; we leave that intact)
  //   - one numeric estimate: the staking pool size (71,918 SYN/day)
  //   - NO interactive control (slider/toggle/dropdown), so the spring
  //     on-input branch from the spec is not wired - only the
  //     on-view count-up runs here.
  // Reduced motion: textContent is set to the final formatted target
  // immediately and the count animation is skipped.
  useAnime<HTMLElement>(rootRef, (self) => {
    const { reduceMotion } = self.matches;
    const target = rootRef.current?.querySelector<HTMLElement>(
      '[data-earn-value]',
    );
    if (!target) return;

    if (reduceMotion) {
      target.textContent = formatThousands(STAKING_POOL_TARGET);
      return;
    }

    // If the EarnBand is ALREADY in view at mount (user deep-linked
    // here, or the section sits above the fold on a tall window),
    // skip the count-up entirely and keep the SSR'd "71,918"
    // visible. Otherwise, an `animate()` with `autoplay: onScroll`
    // would fire immediately on mount, snap the textContent to "0",
    // then count back up - visible as a flicker. For users above
    // the section, reset textContent to "0" so the count-up has a
    // clean baseline; the count-up triggers only when they scroll
    // to it.
    const rect = target.getBoundingClientRect();
    const inViewAtMount =
      rect.top < window.innerHeight && rect.bottom > 0;
    if (inViewAtMount) {
      target.textContent = formatThousands(STAKING_POOL_TARGET);
      return;
    }

    target.textContent = formatThousands(0);
    const counter = { v: 0 };
    animate(counter, {
      v: STAKING_POOL_TARGET,
      duration: DURATION.long,
      ease: EASE.snap,
      onUpdate: () => {
        target.textContent = formatThousands(counter.v);
      },
      autoplay: onScroll({ target, enter: 'bottom-=80 top' }),
    });
  });

  return (
    <section ref={rootRef} className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-mono mb-4">EARN SYN TOKENS</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">How nodes earn money</h2>
            <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Pick the work types your hardware supports. Your node can run
              several at once: small CPU jobs while a GPU training cycle
              finishes, then peer-review when the round closes. Stake more
              SYN to climb tiers and amplify every payout.
            </p>
          </div>
        </Reveal>

        {/* Income streams - figures pulled directly from
            coordinator/src/application/rewards/RewardsConfigService.ts
            (DEFAULT_CONFIGS). Sync this grid when those defaults
            change. */}
        <Reveal delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {([
              {
                icon: '🧠',
                label: 'Research analysis',
                reward: '33,900 SYN',
                sub: 'daily pool · 1 round / day',
                desc: 'Read papers, score methodology, propose hypotheses (drug repurposing, biomarkers, mechanisms). Top-3 split 60/25/15; an extra 10% goes to peer reviewers.',
                hw: 'Any node',
              },
              {
                icon: '🚀',
                label: 'GPU training (DiLoCo)',
                reward: '21,000 SYN',
                sub: 'daily pool · 6 rounds / day',
                desc: 'Distributed fine-tuning over the network. Each round splits 2,100 / 875 / 525 between top-3 contributors. Needs a GPU and decent uplink.',
                hw: 'GPU required',
              },
              {
                icon: '🔬',
                label: 'CPU training',
                reward: '12,000 SYN',
                sub: 'daily pool · 4 rounds / day',
                desc: 'Fine-tune biomedical micro-transformers on the literature corpus. Each 6-hour round splits 1,800 / 750 / 450 top-3.',
                hw: 'CPU + Python',
              },
              {
                icon: '⚡',
                label: 'CPU inference',
                reward: '2–15 SYN',
                sub: 'per task · FCFS',
                desc: 'Reactive jobs the research analysis spins up: tokenize (2 SYN), embed (10), classify (15). Works on any modern laptop.',
                hw: 'Any node',
              },
              {
                icon: '🎯',
                label: 'GPU inference',
                reward: '30–50 SYN',
                sub: 'per task · FCFS',
                desc: 'Heavy generation, summarisation, large-model embeddings the research round demands. First-come-first-served: fast nodes win.',
                hw: 'GPU required',
              },
              {
                icon: '🧬',
                label: 'Molecular docking',
                reward: '1,000 SYN',
                sub: 'per agreed pair · 60 / 40 split',
                desc: 'Two nodes independently score the same ligand-target pair. If they agree, both get paid (600 / 400). Drug-discovery cross-verification.',
                hw: 'GPU recommended',
              },
            ] as const).map(({ icon, label, reward, sub, desc, hw }) => (
              <G key={label} className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="text-2xl">{icon}</div>
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">
                    {hw}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{label}</div>
                  <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">{reward}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{sub}</div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed flex-1">{desc}</p>
              </G>
            ))}
          </div>
        </Reveal>

        <Reveal delay={150}>
          <p className="text-center text-xs text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Pool sizes shown are the daily defaults; operators can vote to
            tune them as the network grows. Tier multiplier (below) applies
            on top of every payout.
          </p>
        </Reveal>

        {/* Tier table */}
        <Reveal delay={150}>
          <G className="p-6 mb-8">
            <div className="text-sm font-semibold text-white mb-1">Stake more SYN &rarr; Higher Tier &rarr; Bigger multiplier</div>
            <p className="text-xs text-slate-500 mb-5">Tier multiplier scales your share of every round pool (Research, Training, GPU, Inference). Presence points are a secondary signal that breaks ties at the bottom of the leaderboard. Quality and stake do the heavy lifting.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-white/[0.06]">
                    <th className="text-left pb-3 pr-4">Tier</th>
                    <th className="text-left pb-3 pr-4">Stake Required</th>
                    <th className="text-left pb-3 pr-4">Multiplier</th>
                    <th className="text-left pb-3">Effective Pool Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {([
                    { tier: 'T0', stake: '0 SYN',       mult: '1.0×', earn: 'baseline',     color: 'text-slate-400' },
                    { tier: 'T1', stake: '500 SYN',     mult: '1.2×', earn: '+20% vs T0',   color: 'text-blue-400' },
                    { tier: 'T2', stake: '2,000 SYN',   mult: '1.5×', earn: '+50% vs T0',   color: 'text-purple-400' },
                    { tier: 'T3', stake: '8,000 SYN',   mult: '2.0×', earn: '2× T0',         color: 'text-amber-400' },
                    { tier: 'T4', stake: '25,000 SYN',  mult: '2.5×', earn: '2.5× T0',       color: 'text-orange-400' },
                    { tier: 'T5', stake: '75,000 SYN',  mult: '3.0×', earn: '3× T0',         color: 'text-emerald-400' },
                  ] as const).map(({ tier, stake, mult, earn, color }) => (
                    <tr key={tier} className="hover:bg-white/[0.02] transition-colors">
                      <td className={'py-3 pr-4 font-bold font-mono ' + color}>{tier}</td>
                      <td className="py-3 pr-4 text-slate-400 font-mono">{stake}</td>
                      <td className={'py-3 pr-4 font-bold font-mono ' + color}>{mult}</td>
                      <td className={'py-3 font-mono ' + color}>{earn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[11px] text-slate-600 mt-4 leading-relaxed">
                Source of truth: <code className="text-slate-500">domain/constants.ts</code> →
                <code className="text-slate-500 ml-1">STIER_THRESHOLDS_SYN</code> +
                <code className="text-slate-500 ml-1">TIER_MULTIPLIERS</code>.
              </p>
            </div>
          </G>
        </Reveal>

        {/* Staking APY callout */}
        <Reveal delay={200}>
          <G className="p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="text-4xl">🏦</div>
            <div className="flex-1">
              <div className="text-base font-semibold text-white mb-1">Staking also earns passive APY</div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Beyond the work multiplier, staked SYN earns from the{' '}
                <span className="text-emerald-400 font-mono font-semibold">
                  <span data-earn-value>71,918</span> SYN/day
                </span>{' '}
                reward pool distributed proportionally to all stakers.
                The more SYN locked, the more you earn, even when your node is offline.
              </p>
            </div>
            <span className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
              Coming soon
            </span>
          </G>
        </Reveal>
      </div>
    </section>
  );
}
