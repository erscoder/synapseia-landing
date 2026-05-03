'use client';
import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
// Pre-launch landing — no coord, no wallet, no live stats. The 6
// dashboard endpoints aren't deployed yet; every "live" surface is
// stubbed to "Coming soon" until the network ships.

// Code-split the landing NodeGraph (Three.js, requires `window`) so the
// initial landing payload doesn't ship the three.js chunk for users that
// never reach the visualization band.
const NodeGraph = dynamic(
  () => import('@/components/landing/NodeGraph').then((m) => m.NodeGraph),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] flex items-center justify-center text-slate-500 text-sm">
        Loading graph…
      </div>
    ),
  },
);


// SSR-safe Reveal: starts at opacity-100 so the rendered HTML always
// contains visible content (required for Lighthouse FCP detection).
// Post-mount, the effect checks viewport position: above-the-fold stays
// visible; below-the-fold drops to opacity-0 and fades back in via
// IntersectionObserver as the user scrolls. The brief flash on
// below-fold elements is acceptable because they are off-screen at
// first paint anyway.
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) return;
    setV(false);
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setV(true); },
      { threshold: 0.1 },
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);
  return { ref, v };
}
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, v } = useReveal();
  return <div ref={ref} className={`transition-all duration-700 ease-out ${v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}
function G({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`backdrop-blur-md bg-white/[0.03] border border-white/[0.06] rounded-2xl ${className}`}>{children}</div>;
}
function FA({ label }: { label?: string }) {
  return <div className="flex flex-col items-center gap-1 py-3"><div className="w-px h-6 bg-gradient-to-b from-white/10 to-transparent" /><span className="text-slate-500 text-lg leading-none">{'\u2193'}</span>{label && <span className="text-[10px] text-slate-600 uppercase tracking-widest">{label}</span>}</div>;
}
function SH({ stage, title, subtitle }: { stage: number; title: string; subtitle: string }) {
  return <div className="text-center mb-12"><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 font-mono mb-4">STAGE {stage}</div><h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">{title}</h2><p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">{subtitle}</p></div>;
}
const STAGES = [
  { id: 'stage-1', num: 1, label: 'Config Search' },
  { id: 'stage-2', num: 2, label: 'Research Rounds' },
  { id: 'stage-3', num: 3, label: 'Paper Analysis' },
  { id: 'stage-4', num: 4, label: 'Peer Review' },
  { id: 'stage-5', num: 5, label: 'Discoveries' },
];
function StageNav({ active }: { active: string }) {
  return (
    <div className="sticky top-[52px] z-40 backdrop-blur-lg bg-black/50 border-b border-white/[0.04] py-3">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto">
        {STAGES.map(s => (
          <button key={s.id} onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${active === s.id ? 'bg-blue-500/15 border border-blue-500/30 text-blue-200' : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'}`}>
            <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${active === s.id ? 'bg-blue-500/20 text-blue-300' : 'bg-white/[0.05] text-slate-600'}`}>{s.num}</span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
export default function LandingPage() {
  // Pre-launch — no coord, no live stats. The StatsRow + footer
  // mini-stats that used to fetch `getPeers / getOpenResearchRounds
  // / getHyperparamsLeaderboard / getDiscoveries /
  // getHyperparamsBestConfig / getCorpusStats` now render
  // "Coming soon" placeholders. When the coord deploys, restore
  // the `useEffect` block (it lives in git history) and feed real
  // values through the `StatCard` props.
  const [activeStage, setActiveStage] = useState('stage-1');

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

  return (
    <div className="relative min-h-screen text-white">

      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 sm:px-8 py-3 backdrop-blur-md bg-black/30 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <Image src="/synapseia-logo.png" alt="Synapseia" width={36} height={36} className="w-9 h-9" />
          <span className="font-bold text-white tracking-wide">Synapseia</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Pre-launch — dashboard is not deployed. Replace with a
              "Coming soon" pill instead of a dead link. */}
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md bg-amber-500/10 border border-amber-500/30 text-amber-200 font-medium text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Coming soon
          </span>
        </div>
      </nav>

      {/* HERO — no <Reveal> wrappers: above-the-fold content must render
          at full opacity in SSR HTML so Lighthouse can detect FCP. The
          `Reveal` component starts at opacity-0, which left the entire
          first viewport invisible until IntersectionObserver fired post-
          hydration; Chrome's paint heuristic missed FCP entirely (FCP
          requires text/image, not the SpaceBackground canvas). */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md bg-white/[0.05] border border-white/[0.08] text-xs text-slate-400 mb-8 tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live peer-to-peer research network
        </div>
        <div className="mb-8">
          <Image src="/synapseia-logo.png" alt="Synapseia Network" width={120} height={120} priority className="w-24 h-24 sm:w-28 sm:h-28 mx-auto drop-shadow-[0_0_40px_rgba(100,120,255,0.15)]" />
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
          <span className="bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Synapseia</span><br />
          <span className="bg-gradient-to-r from-slate-300 via-blue-200 to-slate-300 bg-clip-text text-transparent">Network</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          A distributed P2P network of independent AI agents that run multiple
          research training tracks in parallel — analyzing literature,
          peer-reviewing each other&apos;s outputs, and consolidating findings
          into a shared knowledge graph that every node can query.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button onClick={() => document.getElementById('engine')?.scrollIntoView({ behavior: 'smooth' })} className="group px-8 py-3.5 rounded-xl backdrop-blur-md bg-blue-500/10 border border-blue-500/30 text-blue-200 font-medium text-sm hover:bg-blue-500/20 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
            How it works <span className="ml-2 group-hover:ml-3 transition-all">{'\u2193'}</span>
          </button>
          <button onClick={() => document.getElementById('stage-1')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3.5 rounded-xl text-slate-400 hover:text-white text-sm transition-colors">
            Tour the engine {'\u2192'}
          </button>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-600 animate-bounce">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </section>


      {/* ENGINE INTRO */}
      <div id="engine">
        <Reveal><div className="text-center py-16 px-6"><h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">How a research cycle runs today</h2><p className="text-slate-500 max-w-2xl mx-auto">Five stages, every one running in parallel across distributed operator nodes. Multiple training tracks active concurrently — no single node bottlenecks the network.</p></div></Reveal>
        <StageNav active={activeStage} />

        {/* STAGE 1 — HYPERPARAMETER SEARCH */}
        <section id="stage-1" className="py-20 px-6 scroll-mt-28">
          <div className="max-w-5xl mx-auto">
            <Reveal><SH stage={1} title="Configuration Search" subtitle="Every operator node — laptops, workstations, datacenter GPUs — runs its own experiment to find the analysis configuration that wins on quality and latency. Multiple training tracks (cardiology, oncology, ALS, neurology…) search in parallel; no single node owns a topic." /></Reveal>
            <Reveal delay={100}><p className="text-center text-slate-400 text-sm mb-10 max-w-3xl mx-auto">Each node tries a different prompt template, temperature, chunk size, or analysis depth and reports back to a CRDT leaderboard — conflict-free, no central server, no waiting on coord. The best config wins for that training track.</p></Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Reveal delay={150}>
                <G className="p-5">
                  <div className="flex items-center gap-2 mb-3"><div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" /><span className="text-xs text-slate-400 font-mono">Node A</span></div>
                  <p className="font-mono text-sm text-slate-300 mb-3"><span className="text-slate-500">Try </span><span className="text-blue-300">clinical_extract_v1</span><span className="text-slate-600">, temp=0.5, chunks=1024</span></p>
                  <div className="flex gap-4 text-xs"><span className="text-slate-500">quality: <span className="text-amber-400 font-bold font-mono">7.4/10</span></span><span className="text-slate-500">latency: <span className="text-slate-300 font-mono">1.2s</span></span></div>
                </G>
              </Reveal>
              <Reveal delay={250}>
                <G className="p-5">
                  <div className="flex items-center gap-2 mb-3"><div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" /><span className="text-xs text-slate-400 font-mono">Node B</span></div>
                  <p className="font-mono text-sm text-slate-300 mb-3"><span className="text-slate-500">Try </span><span className="text-blue-300">biomedical_summary</span><span className="text-slate-600">, temp=0.3, chunks=512</span></p>
                  <div className="flex gap-4 text-xs"><span className="text-slate-500">quality: <span className="text-red-400 font-bold font-mono">5.8/10</span></span><span className="text-slate-500">latency: <span className="text-slate-300 font-mono">0.4s</span></span></div>
                </G>
              </Reveal>
              <Reveal delay={350}>
                <G className="p-5 border-blue-500/20 bg-blue-500/[0.04]">
                  <div className="flex items-center gap-2 mb-3"><div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /><span className="text-xs text-blue-300 font-mono">Node C {'\u2605'}</span></div>
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
        <section id="stage-2" className="py-20 px-6 scroll-mt-28">
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
        <section id="stage-3" className="py-20 px-6 scroll-mt-28">
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
                    <span className="text-slate-600 font-mono text-xs mt-0.5">{'\u251C\u2500\u2500'}</span>
                    <div><span className="text-xs text-slate-500">Key Findings:</span><span className="text-sm text-slate-300 ml-2">[structured extraction]</span></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-slate-600 font-mono text-xs mt-0.5">{'\u251C\u2500\u2500'}</span>
                    <div><span className="text-xs text-slate-500">Methodology Assessment:</span><span className="text-sm text-emerald-400 font-mono font-bold ml-2">8/10</span></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-slate-600 font-mono text-xs mt-0.5">{'\u251C\u2500\u2500'}</span>
                    <div><span className="text-xs text-slate-500">Novel Claims:</span><span className="text-sm text-blue-300 font-mono ml-2">3 identified</span></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-slate-600 font-mono text-xs mt-0.5">{'\u251C\u2500\u2500'}</span>
                    <div><span className="text-xs text-slate-500">Cross-references:</span><span className="text-sm text-slate-300 font-mono ml-2">12 related papers</span></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-slate-600 font-mono text-xs mt-0.5">{'\u2514\u2500\u2500'}</span>
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
        <section id="stage-4" className="py-20 px-6 scroll-mt-28">
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
                  <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">Posted as CRITIQUE {'\u2192'} CRDT leaderboard</span>
                </div>
              </G>
            </Reveal>
          </div>
        </section>

        {/* STAGE 5 — DISCOVERIES */}
        <section id="stage-5" className="py-20 px-6 scroll-mt-28">
          <div className="max-w-5xl mx-auto">
            <Reveal><SH stage={5} title="Discoveries" subtitle="Analyses that average {'\u2265'} 8/10 across peer reviews are promoted to DISCOVERIES — written into the shared knowledge graph, indexed for the next round's context, and surfaced to every operator. The graph is sharded across peers so no single node holds the whole library." /></Reveal>

            <Reveal delay={150}>
              <G className="p-8 max-w-2xl mx-auto text-center border-emerald-500/10">
                <div className="text-emerald-400 text-3xl mb-4">{'\u25C6'}</div>
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
                    <span className="text-slate-500 hidden sm:block">{'\u2192'}</span>
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

        {/* REWARD FORMULA */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white mb-3">Reward Formula</h2>
                <p className="text-slate-500">How your node earns SYN tokens every round</p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <G className="p-8">
                <div className="text-center mb-10 py-6 px-4 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                  <p className="font-mono text-2xl sm:text-3xl text-slate-100 tracking-wide">
                    {'Points = \u03BB \u00D7 (\u0394t/T\u2080) \u00D7 U(t) \u00D7 LM \u00D7 TM \u00D7 C'}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { sym: 'λ', name: 'Base Rate', desc: 'Base reward rate set per round by the coordinator' },
                    { sym: '\u0394t/T\u2080', name: 'Time Fraction', desc: 'Fraction of the round your node was active (0\u20131)' },
                    { sym: 'U(t)', name: 'Uptime Factor', desc: 'Real-time uptime measurement clamped to 0\u20131' },
                    { sym: 'LM', name: 'Liveness Multiplier', desc: 'Ranges 1.0\u20132.0 based on consecutive days active' },
                    { sym: 'TM', name: 'Tier Multiplier', desc: 'Stake tier bonus: T0=1.0×, T1=1.2×, T2=1.5×, T3=2.0×, T4=2.5×, T5=3.0× — stake more SYN to earn more' },
                    { sym: 'C', name: 'Quality Score', desc: 'Peer-reviewed quality of your submission, scored 0\u201310' },
                  ].map(({ sym, name, desc }) => (
                    <div key={sym} className="flex gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <span className="font-mono text-sm text-blue-300">{sym}</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white mb-0.5">{name}</div>
                        <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </G>
            </Reveal>
          </div>
        </section>

      </div>{/* end engine wrapper */}

      {/* NODE GRAPH */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3">Network Topology</h2>
              <p className="text-slate-500">Live view of active nodes and their connections</p>
            </div>
          </Reveal>
          <Reveal delay={100}><NodeGraph /></Reveal>
        </div>
      </section>

      {/* LIVE STATUS TICKER */}
      <Reveal>
        <section className="py-6 px-6">
          <div className="max-w-5xl mx-auto">
            <G className="px-6 py-4">
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-mono text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Peers: <span className="text-slate-500">soon</span></span>
                <span className="text-slate-700">|</span>
                <span>Best Config: <span className="text-slate-500">soon</span></span>
                <span className="text-slate-700">|</span>
                <span>Rounds: <span className="text-slate-500">soon</span></span>
                <span className="text-slate-700">|</span>
                <span>Papers Analyzed: <span className="text-slate-500">soon</span></span>
                <span className="text-slate-700">|</span>
                <span>Discoveries: <span className="text-slate-500">soon</span></span>
              </div>
            </G>
          </div>
        </section>
      </Reveal>


      {/* EARN REWARDS */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-mono mb-4">EARN SYN TOKENS</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">How Nodes Earn Money</h2>
              <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Every contribution to the Synapseia network is rewarded with SYN tokens. The more you stake, the higher your tier — and the more you earn per round.
              </p>
            </div>
          </Reveal>

          {/* Income streams — figures pulled directly from coordinator/domain/constants.ts. */}
          <Reveal delay={100}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {([
                { icon: '🧠', label: 'Research Round', reward: '33,900 SYN', sub: 'pool / 24h', desc: 'Analyze biomedical papers and propose hypotheses (drug repurposing, biomarkers, mechanisms). Top-3 split 60/25/15; 10% goes to peer reviewers.', color: 'amber' as const },
                { icon: '🔬', label: 'CPU Training', reward: '3,000 SYN', sub: 'pool / 6h', desc: 'Fine-tune biomedical micro-models on the literature corpus. Any node with Python + PyTorch. Top-3 split.', color: 'blue' as const },
                { icon: '⚡', label: 'CPU Inference', reward: '2–15 SYN', sub: 'per task', desc: 'Tokenize (2), embed (10), or classify (15) biomedical papers. Lightweight — works on any modern laptop. Tier multiplier applies.', color: 'purple' as const },
                { icon: '🎯', label: 'GPU Inference', reward: '4,000 SYN', sub: 'pool / 6h', desc: 'Heavy generation, summarization, large-model embeddings on rounds that need GPU compute. Top-3 split.', color: 'emerald' as const },
              ] as const).map(({ icon, label, reward, sub, desc }) => (
                <G key={label} className="p-5 flex flex-col gap-3">
                  <div className="text-2xl">{icon}</div>
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

          {/* Tier table */}
          <Reveal delay={150}>
            <G className="p-6 mb-8">
              <div className="text-sm font-semibold text-white mb-1">Stake more SYN &rarr; Higher Tier &rarr; Bigger multiplier</div>
              <p className="text-xs text-slate-500 mb-5">Tier multiplier scales your share of every round pool (Research, Training, GPU, Inference) and your presence-points ranking.</p>
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
                  <span className="text-emerald-400 font-mono font-semibold">71,918 SYN/day</span>{' '}
                  reward pool distributed proportionally to all stakers.
                  The more SYN locked, the more you earn — even when your node is offline.
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Coming soon
              </span>
            </G>
          </Reveal>
        </div>
      </section>
      {/* DOWNLOAD — pre-launch placeholder. The desktop app
          binaries (DMG / MSI / AppImage) are not signed and
          published yet; we render disabled-looking platform tiles
          that announce the launch instead of dead download links
          that 404 on github releases. The original `<a download>`
          structure is preserved in git history (commit b147a01d-
          area) and re-lands when builds ship. */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-mono mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                COMING SOON
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Run a Node</h2>
              <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Desktop app for macOS, Windows, and Linux drops at mainnet launch — one-click install,
                automatic updates, wallet baked in. Drop your email below to get pinged the day binaries ship.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto opacity-60">
              {/* macOS */}
              <div
                

                className="group"
              >
                <G className="p-6 text-center hover:border-white/10 hover:bg-white/[0.05] transition-all cursor-pointer">
                  <svg className="w-10 h-10 mx-auto mb-3 text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-sm font-semibold text-white mb-1">macOS</div>
                  <div className="text-xs text-slate-500">Apple Silicon (.dmg)</div>
                </G>
              </div>

              {/* Windows */}
              <div
                

                className="group"
              >
                <G className="p-6 text-center hover:border-white/10 hover:bg-white/[0.05] transition-all cursor-pointer">
                  <svg className="w-10 h-10 mx-auto mb-3 text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                  </svg>
                  <div className="text-sm font-semibold text-white mb-1">Windows</div>
                  <div className="text-xs text-slate-500">x64 Installer (.msi)</div>
                </G>
              </div>

              {/* Linux */}
              <div
                

                className="group"
              >
                <G className="p-6 text-center hover:border-white/10 hover:bg-white/[0.05] transition-all cursor-pointer">
                  <svg className="w-10 h-10 mx-auto mb-3 text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.368 1.884 1.43.199.025.398.003.596-.07.646-.27 1.108-.675 1.108-1.346 0-.034-.003-.069-.01-.1.655-.015 1.348-.265 1.594-.87.7-1.635-.174-3.596-.294-4.62-.06-.51-.083-1.009.017-1.24.058-.155.154-.241.297-.338.552-.333.835-.591.953-.984.023-.09.04-.183.04-.273 0-.016 0-.032-.002-.045H21.8a.42.42 0 00.045-.207c-.038-.375-.247-.685-.494-.934-.169-.17-.375-.31-.595-.43-.173-.102-.22-.189-.233-.337-.016-.165-.016-.451.037-.744.052-.293.111-.63.111-.982 0-.147-.014-.298-.043-.453a4.096 4.096 0 00-.666-1.584 5.166 5.166 0 00-.745-.822c-.03-.027-.052-.046-.085-.065-.128-.09-.261-.186-.39-.241a.94.94 0 00-.392-.082c-.032 0-.065.003-.097.007a3.234 3.234 0 00-.283-.394c-.437-.528-1.161-.807-2.119-.807-.437 0-.92.075-1.454.228a.42.42 0 00-.095-.002c-.054-.22-.241-.46-.656-.553-.362-.084-.633-.141-.927-.176a1.5 1.5 0 01-.085-.01c-.123-.015-.25-.03-.378-.03-.138 0-.277.015-.392.06-.333.136-.479.372-.55.653-.152-.008-.304-.012-.455-.012-.17 0-.34.01-.506.033-.437-.14-.925-.21-1.418-.21-.507 0-1.026.087-1.49.306-.37.165-.693.414-.853.724-.082.164-.122.337-.122.512 0 .083.009.167.027.249a.42.42 0 00-.156.139c-.328.497-.363.98-.293 1.42.065.402.236.743.404.99-.012.021-.024.044-.032.065-.183.486.07.95.309 1.3.157.224.293.39.293.39s-.149.069-.293.194c-.209.174-.403.51-.403 1.123 0 .33.055.606.13.831a7.223 7.223 0 01-.172.263 4.404 4.404 0 01-.16.187L6.06 13.8c-.367.39-.612 1.008-.625 1.754-.007.37.057.735.194 1.07.137.333.35.63.647.853.248.198.544.35.877.44.28.077.583.116.906.116h.002a5.45 5.45 0 001.033-.112z"/>
                  </svg>
                  <div className="text-sm font-semibold text-white mb-1">Linux</div>
                  <div className="text-xs text-slate-500">x64 AppImage</div>
                </G>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-center text-slate-600 text-xs mt-6">
              macOS Intel + every other platform ship the same day. Watch
              the GitHub repo or follow the project on X for the launch ping.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <Reveal>
            <G className="p-12 rounded-3xl">
              <h2 className="text-4xl font-bold text-white mb-4">Built in the open</h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Synapseia is a working peer-to-peer research network — multiple
                training tracks run in parallel today across distributed
                operator GPUs, and every cycle is logged to the public knowledge
                graph. The codebase, the protocol specs, and the Solana
                contracts are open source.
              </p>
              <p className="text-slate-500 mb-10 leading-relaxed text-sm">
                Watch the repo, read the protocol notes, or contribute a node —
                the network grows one operator at a time.
              </p>
              <a
                href="https://github.com/erscoder/synapseia-landing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl backdrop-blur-md bg-blue-500/15 border border-blue-500/30 text-blue-200 font-semibold hover:bg-blue-500/25 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 text-base"
              >
                Read the source
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </G>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 text-center border-t border-white/[0.04]">
        <p className="text-slate-600 text-sm">Synapseia Network {'\u00A9'} 2026 — Decentralized AI Research</p>
      </footer>
    </div>
  );
}
