'use client';
import { useEffect, useRef, useState, forwardRef } from 'react';
import { Reveal, G, FA, SH } from './Reveal.client';
import {
  animate,
  stagger,
  utils,
  onScroll,
  useAnime,
  DURATION,
  EASE,
  REDUCED_MOTION_QUERY,
} from '@/lib/anime';

const STAGES = [
  { id: 'stage-1', num: 1, label: 'Config Search' },
  { id: 'stage-2', num: 2, label: 'Research Rounds' },
  { id: 'stage-3', num: 3, label: 'Paper Analysis' },
  { id: 'stage-4', num: 4, label: 'Peer Review' },
  { id: 'stage-5', num: 5, label: 'Discoveries' },
];

const StageNav = forwardRef<HTMLDivElement, { active: string; indicatorRef: React.RefObject<HTMLSpanElement | null> }>(
  function StageNav({ active, indicatorRef }, ref) {
    return (
      <div className="sticky top-[52px] z-40 backdrop-blur-lg bg-black/50 border-b border-white/[0.04] py-3">
        <div ref={ref} className="relative max-w-6xl mx-auto px-4 flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto">
          {STAGES.map(s => (
            <button key={s.id} data-stage-nav={s.id} onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${active === s.id ? 'bg-blue-500/15 border border-blue-500/30 text-blue-200' : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'}`}>
              <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${active === s.id ? 'bg-blue-500/20 text-blue-300' : 'bg-white/[0.05] text-slate-600'}`}>{s.num}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
          <span
            ref={indicatorRef}
            aria-hidden
            className="pointer-events-none absolute bottom-0 h-[2px] rounded-full bg-gradient-to-r from-blue-400/60 via-blue-300 to-blue-400/60"
            style={{ left: 0, width: 0, opacity: 0 }}
          />
        </div>
      </div>
    );
  },
);

export function HowItWorks() {
  const [activeStage, setActiveStage] = useState('stage-1');
  const rootRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  // Existing intersection observer — DO NOT TOUCH. Drives `activeStage`.
  useEffect(() => {
    const obs: IntersectionObserver[] = [];
    STAGES.forEach(s => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActiveStage(s.id); }, { threshold: 0.2, rootMargin: '-80px 0px -40% 0px' });
      o.observe(el); obs.push(o);
    });
    return () => obs.forEach(o => o.disconnect());
  }, []);

  // Per-stage scroll-linked slide-up. We animate ONLY the y transform —
  // opacity is owned by the surrounding <Reveal> wrappers so the two
  // systems don't fight for the same property (Reveal SSRs at
  // opacity-100 for FCP, then drops below-fold sections to 0 and
  // fades them back in on scroll). Slide-up + Reveal fade compose
  // naturally without flicker.
  useAnime(rootRef, (self) => {
    const { reduceMotion } = self.matches;
    if (reduceMotion) return;
    const stages = utils.$('[data-stage]') as unknown as HTMLElement[];
    stages.forEach((stage) => {
      const heading = stage.querySelector('h2, h3');
      const body = stage.querySelector('[data-stage-body], p');
      const targets = [heading, body].filter(Boolean) as HTMLElement[];
      if (targets.length === 0) return;
      animate(targets, {
        y: [40, 0],
        delay: stagger(80),
        duration: DURATION.medium,
        ease: EASE.snap,
        autoplay: onScroll({ target: stage, enter: 'bottom-=100 top', sync: false }),
      });
    });
  });

  // StageNav active indicator: slides between buttons whenever activeStage changes.
  // Lives outside the scope because it's driven by React state, not mount lifecycle.
  // anime.js auto-cancels per-target on re-call, so no scope cleanup needed.
  useEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;
    const btn = nav.querySelector(`[data-stage-nav="${activeStage}"]`) as HTMLElement | null;
    if (!btn) return;
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_QUERY).matches;
    animate(indicator, {
      left: btn.offsetLeft,
      width: btn.offsetWidth,
      opacity: 1,
      duration: reduceMotion ? 0 : DURATION.short,
      ease: EASE.snap,
    });
  }, [activeStage]);

  return (
    <div id="engine" ref={rootRef}>
      <Reveal><div className="text-center py-16 px-6"><h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">How a research cycle runs today</h2><p className="text-slate-500 max-w-2xl mx-auto">Five stages, every one running in parallel across distributed operator nodes. Multiple training tracks active concurrently — no single node bottlenecks the network.</p></div></Reveal>
      <StageNav ref={navRef} active={activeStage} indicatorRef={indicatorRef} />

      {/* STAGE 1 — HYPERPARAMETER SEARCH */}
      <section id="stage-1" data-stage="1" className="py-20 px-6 scroll-mt-28">
        <div className="max-w-5xl mx-auto">
          <Reveal><SH stage={1} title="Configuration Search" subtitle="Every operator node — laptops, workstations, datacenter GPUs — runs its own experiment to find the analysis configuration that wins on quality and latency. Multiple training tracks (cardiology, oncology, ALS, neurology…) search in parallel; no single node owns a topic." /></Reveal>
          <Reveal delay={100}><p className="text-center text-slate-400 text-sm mb-10 max-w-3xl mx-auto">Each node tries a different prompt template, temperature, chunk size, or analysis depth and reports back to a CRDT leaderboard — conflict-free, no central server, no waiting on coord. The best config wins for that training track.</p></Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Reveal delay={150}>
              <G className="p-5">
                <div className="flex items-center gap-2 mb-3"><div className="w-2 h-2 rounded-full bg-slate-500 motion-safe:animate-pulse" /><span className="text-xs text-slate-400 font-mono">Node A</span></div>
                <p className="font-mono text-sm text-slate-300 mb-3"><span className="text-slate-500">Try </span><span className="text-blue-300">clinical_extract_v1</span><span className="text-slate-600">, temp=0.5, chunks=1024</span></p>
                <div className="flex gap-4 text-xs"><span className="text-slate-500">quality: <span className="text-amber-400 font-bold font-mono">7.4/10</span></span><span className="text-slate-500">latency: <span className="text-slate-300 font-mono">1.2s</span></span></div>
              </G>
            </Reveal>
            <Reveal delay={250}>
              <G className="p-5">
                <div className="flex items-center gap-2 mb-3"><div className="w-2 h-2 rounded-full bg-slate-500 motion-safe:animate-pulse" /><span className="text-xs text-slate-400 font-mono">Node B</span></div>
                <p className="font-mono text-sm text-slate-300 mb-3"><span className="text-slate-500">Try </span><span className="text-blue-300">biomedical_summary</span><span className="text-slate-600">, temp=0.3, chunks=512</span></p>
                <div className="flex gap-4 text-xs"><span className="text-slate-500">quality: <span className="text-red-400 font-bold font-mono">5.8/10</span></span><span className="text-slate-500">latency: <span className="text-slate-300 font-mono">0.4s</span></span></div>
              </G>
            </Reveal>
            <Reveal delay={350}>
              <G className="p-5 border-blue-500/20 bg-blue-500/[0.04]">
                <div className="flex items-center gap-2 mb-3"><div className="w-2 h-2 rounded-full bg-blue-400 motion-safe:animate-pulse" /><span className="text-xs text-blue-300 font-mono">Node C {'★'}</span></div>
                <p className="font-mono text-sm text-slate-300 mb-3"><span className="text-slate-500">Try </span><span className="text-blue-300">hypothesis_medical</span><span className="text-slate-600">, temp=0.8, chunks=4096</span></p>
                <div className="flex gap-4 text-xs"><span className="text-slate-500">quality: <span className="text-emerald-400 font-bold font-mono">9.2/10</span></span><span className="text-slate-500">latency: <span className="text-slate-300 font-mono">3.8s</span></span></div>
              </G>
            </Reveal>
          </div>

          <FA label="propagate via CRDT" />

          <Reveal delay={200}>
            <G className="p-6 max-w-2xl mx-auto text-center">
              <p className="text-slate-400 text-sm leading-relaxed mb-4">Winning configs propagate across the network automatically.</p>
              <div className="flex items-center justify-center gap-8 text-xs">
                <div className="text-center"><div className="text-2xl font-bold font-mono text-blue-300 mb-1">70%</div><div className="text-slate-500">Exploit</div><div className="text-slate-600 text-[10px]">use best config</div></div>
                <div className="w-px h-12 bg-white/10" />
                <div className="text-center"><div className="text-2xl font-bold font-mono text-purple-300 mb-1">30%</div><div className="text-slate-500">Explore</div><div className="text-slate-600 text-[10px]">try mutations</div></div>
              </div>
            </G>
          </Reveal>
          <Reveal delay={300}><p className="text-center text-slate-600 text-xs mt-6 italic">The network self-optimizes. No human tuning required.</p></Reveal>
        </div>
      </section>

      {/* STAGE 2 — RESEARCH ROUNDS */}
      <section id="stage-2" data-stage="2" className="py-20 px-6 scroll-mt-28">
        <div className="max-w-5xl mx-auto">
          <Reveal><SH stage={2} title="Research Rounds" subtitle="Multiple rounds run side-by-side, each tied to its own training track. A round picks a corpus slice (PubMed, ClinicalTrials.gov, preprints), fans work orders out to every available node over libp2p gossipsub, and lets the swarm chew through the papers with the best config from Stage 1." /></Reveal>

          <div className="max-w-3xl mx-auto">
            <Reveal delay={100}>
              <G className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div className="font-mono text-blue-300 text-sm font-bold">Coordinator</div>
                <div className="text-slate-500 text-xs mt-1">Opens Round #42</div>
              </G>
            </Reveal>

            <FA label="distributes 50 papers across 12 nodes" />

            <Reveal delay={200}>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {['A: 5', 'B: 4', 'C: 5', 'D: 4', 'E: 5', 'F: 4', 'G: 4', 'H: 3', 'I: 4', 'J: 4', 'K: 4', 'L: 4'].map((n, i) => (
                  <G key={i} className="p-3 text-center">
                    <div className="text-[10px] text-slate-500 font-mono">Node {n.split(':')[0]}</div>
                    <div className="text-sm font-mono text-slate-300 font-bold">{n.split(':')[1].trim()} papers</div>
                  </G>
                ))}
              </div>
            </Reveal>

            <FA label="analysis submitted with quality scores" />

            <Reveal delay={300}>
              <G className="p-5 text-center">
                <p className="text-slate-400 text-sm leading-relaxed">Tasks split by <span className="text-slate-300">capability profile</span>, <span className="text-slate-300">staked weight</span>, and <span className="text-slate-300">availability</span>. Nodes with more SYN staked receive priority assignments.</p>
              </G>
            </Reveal>
          </div>
        </div>
      </section>

      {/* STAGE 3 — PAPER ANALYSIS */}
      <section id="stage-3" data-stage="3" className="py-20 px-6 scroll-mt-28">
        <div className="max-w-5xl mx-auto">
          <Reveal><SH stage={3} title="Paper Analysis" subtitle="Every operator&apos;s agent runs the winning config locally on its own GPU — structured extraction, methodology scoring, cross-referencing prior findings in the shared knowledge graph, and surfacing fresh hypotheses. Different nodes work different papers in the same round; the work fans out, never queues." /></Reveal>

          <Reveal delay={150}>
            <G className="p-6 max-w-3xl mx-auto">
              <div className="mb-4">
                <div className="text-xs text-slate-500 mb-1 font-mono">AGENT RECEIVES</div>
                <p className="text-slate-200 font-medium">"BRCA1 Pathogenic Variants and Breast Cancer Risk in Premenopausal Women"</p>
                <p className="text-slate-500 text-xs font-mono mt-1">PubMed PMC11234567</p>
              </div>

              <div className="flex gap-4 mb-5 text-xs">
                <span className="px-2 py-1 rounded bg-white/[0.04] text-slate-400 font-mono">hypothesis_medical</span>
                <span className="px-2 py-1 rounded bg-white/[0.04] text-slate-400 font-mono">temp: 0.7</span>
                <span className="px-2 py-1 rounded bg-white/[0.04] text-slate-400 font-mono">chunks: 2048</span>
              </div>

              <div className="border-t border-white/[0.06] pt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-slate-600 font-mono text-xs mt-0.5">{'├──'}</span>
                  <div><span className="text-xs text-slate-500">Key Findings:</span><span className="text-sm text-slate-300 ml-2">[structured extraction]</span></div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-slate-600 font-mono text-xs mt-0.5">{'├──'}</span>
                  <div><span className="text-xs text-slate-500">Methodology Assessment:</span><span className="text-sm text-emerald-400 font-mono font-bold ml-2">8/10</span></div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-slate-600 font-mono text-xs mt-0.5">{'├──'}</span>
                  <div><span className="text-xs text-slate-500">Novel Claims:</span><span className="text-sm text-blue-300 font-mono ml-2">3 identified</span></div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-slate-600 font-mono text-xs mt-0.5">{'├──'}</span>
                  <div><span className="text-xs text-slate-500">Cross-references:</span><span className="text-sm text-slate-300 font-mono ml-2">12 related papers</span></div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-slate-600 font-mono text-xs mt-0.5">{'└──'}</span>
                  <div><span className="text-xs text-slate-500">Hypothesis:</span><span className="text-sm text-purple-300 ml-2 italic">"BRCA1 p.Cys61Gly carriers show 4.2× elevated risk in premenopausal cohort — confirmed across 3 independent datasets"</span></div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/[0.06] text-center">
                <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">Submitted to network as ANALYSIS</span>
              </div>
            </G>
          </Reveal>
        </div>
      </section>

      {/* STAGE 4 — PEER REVIEW */}
      <section id="stage-4" data-stage="4" className="py-20 px-6 scroll-mt-28">
        <div className="max-w-5xl mx-auto">
          <Reveal><SH stage={4} title="Peer Review" subtitle="Every analysis lands in front of N other nodes for review. Reviewers score on rigour, novelty, evidence quality, and reproducibility — signed with each peer&apos;s identity, gossipped over libp2p, and consolidated on the CRDT leaderboard. No central authority decides what&apos;s good; the swarm does." /></Reveal>

          <Reveal delay={150}>
            <G className="p-6 max-w-xl mx-auto">
              <div className="text-xs text-slate-500 font-mono mb-4">Analysis arrives at Node X via P2P gossip</div>
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 mb-4">
                <div className="space-y-3">
                  {[
                    { label: 'Scientific Accuracy', score: 8 },
                    { label: 'Completeness', score: 7 },
                    { label: 'Novelty', score: 9 },
                    { label: 'Methodology', score: 8 },
                  ].map(({ label, score }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">{label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div className="h-full rounded-full bg-blue-400/40" style={{ width: `${score * 10}%` }} />
                        </div>
                        <span className="text-sm font-mono font-bold text-slate-200 w-10 text-right">{score}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/[0.06] mt-4 pt-4 flex items-center justify-between">
                  <span className="text-sm text-slate-400 font-medium">Average</span>
                  <span className="text-lg font-mono font-bold text-emerald-400">8.0</span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">Posted as CRITIQUE {'→'} CRDT leaderboard</span>
              </div>
            </G>
          </Reveal>
        </div>
      </section>

      {/* STAGE 5 — DISCOVERIES */}
      <section id="stage-5" data-stage="5" className="py-20 px-6 scroll-mt-28">
        <div className="max-w-5xl mx-auto">
          <Reveal><SH stage={5} title="Discoveries" subtitle="Analyses that average {'\u2265'} 8/10 across peer reviews are promoted to DISCOVERIES — written into the shared knowledge graph, indexed for the next round's context, and surfaced to every operator. The graph is sharded across peers so no single node holds the whole library." /></Reveal>

          <Reveal delay={150}>
            <G className="p-8 max-w-2xl mx-auto text-center border-emerald-500/10">
              <div className="text-emerald-400 text-3xl mb-4">{'◆'}</div>
              <div className="text-xs text-emerald-400/60 uppercase tracking-widest mb-2 font-mono">Discovery #1</div>
              <p className="text-lg text-slate-200 font-medium mb-4 italic">"BRCA1 pathogenic variant p.Cys61Gly confers 4.2× elevated oncogenic risk — validated across 3 independent cohorts"</p>
              <div className="flex items-center justify-center gap-6 text-sm">
                <span className="text-slate-500">Score: <span className="text-emerald-400 font-mono font-bold">8.3/10</span></span>
                <span className="text-slate-500">from <span className="text-slate-300 font-mono">4</span> peer reviewers</span>
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <p className="text-xs text-slate-500">Archived to Synapseia network. Discoverer earns bonus <span className="text-blue-300">SYN</span> tokens.</p>
              </div>
            </G>
          </Reveal>
        </div>
      </section>

      {/* COMPOUNDING LOOP */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">The Compounding Loop</h2>
              <p className="text-slate-500">Why the network gets smarter over time</p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <G className="p-8">
              <div className="flex flex-col items-center gap-2">
                <div className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300 font-mono">Better configs (Stage 1)</div>
                <FA />
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-sm text-purple-300 font-mono">Better analyses (Stage 3)</div>
                  <span className="text-slate-500 hidden sm:block">{'→'}</span>
                  <div className="px-4 py-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-sm text-pink-300 font-mono">Better critiques (Stage 4)</div>
                </div>
                <FA />
                <div className="px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-slate-300 font-mono">Only truly novel work scores 8+</div>
                <FA />
                <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-300 font-mono">Discoveries feed back as context</div>
                <FA />
                <div className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300 font-mono">Even better analysis next round</div>
              </div>
            </G>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-center text-3xl sm:text-4xl font-bold text-white mt-16 mb-4">"Intelligence compounds."</p>
            <p className="text-center text-slate-500 text-sm">Each cycle builds on the last. The network never forgets what it learned.</p>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
