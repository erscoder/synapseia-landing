'use client';
import { useRef } from 'react';
import { Reveal, G } from './Reveal.client';
import { animate, stagger, onScroll, useAnime, DURATION, EASE, STAGGER } from '@/lib/anime';

export function KnowledgeGraph() {
  const rootRef = useRef<HTMLDivElement>(null);

  // S7 entrance: section has no SVG (just text + card grid + footnote),
  // so this is a pure text reveal — fade + slide-up on every element
  // tagged `.kg-text`. `<Reveal>` wrappers stay in place to keep the
  // existing layout/grid; the inner targets carry `opacity-0` in SSR
  // so there's no hydration flash, and `useAnime` brings them up when
  // the section enters the viewport. `sync: false` = play-once.
  // Class selector (not `data-*`) is used to match the project
  // convention and because `<G>` has a strict prop signature that
  // doesn't forward arbitrary `data-*` attributes.
  // Reduced-motion: duration 0 — final state shown instantly, no slide.
  useAnime(rootRef, (self) => {
    const { reduceMotion } = self.matches;
    animate('.kg-text', {
      y: reduceMotion ? 0 : [40, 0],
      opacity: [0, 1],
      delay: reduceMotion ? 0 : stagger(STAGGER.base),
      duration: reduceMotion ? 0 : DURATION.medium,
      ease: EASE.snap,
      autoplay: reduceMotion
        ? true
        : onScroll({ target: rootRef.current!, sync: false }),
    });
  });

  return (
    <section ref={rootRef} className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <div className="kg-text inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-mono mb-4 opacity-0">DISTRIBUTED LIBRARY</div>
            <h2 className="kg-text text-3xl sm:text-4xl font-bold text-white mb-3 opacity-0">The knowledge graph is sharded across the swarm</h2>
            <p className="kg-text text-slate-500 max-w-2xl mx-auto leading-relaxed opacity-0">
              Every discovery, every embedding, every cross-reference lives
              in a shared semantic graph. Coord doesn&apos;t hold it — the
              peer mesh does.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <G className="kg-text p-6 opacity-0">
              <div className="text-[10px] uppercase tracking-widest text-emerald-300/80 font-mono mb-2">SHARDING</div>
              <div className="text-sm font-semibold text-white mb-2">32 shards · 3 replicas</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Embeddings are deterministically hashed into 32 shards;
                each shard lives on 3 different operator nodes. Coord
                signs the grants but never serves the data path.
              </p>
            </G>
            <G className="kg-text p-6 opacity-0">
              <div className="text-[10px] uppercase tracking-widest text-emerald-300/80 font-mono mb-2">CHAINED SYNC</div>
              <div className="text-sm font-semibold text-white mb-2">Peer-to-peer bootstrap</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                New nodes pull shard snapshots from other peers first,
                not coord. Coord uplink stays ≈ zero in steady state —
                the library scales sideways with operator count.
              </p>
            </G>
            <G className="kg-text p-6 opacity-0">
              <div className="text-[10px] uppercase tracking-widest text-emerald-300/80 font-mono mb-2">HNSW LOOKUPS</div>
              <div className="text-sm font-semibold text-white mb-2">~0.3 ms ANN per node</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Each peer indexes its shards with HNSW (usearch) — top-K
                semantic search returns in under a millisecond, locally,
                before the next research round even ships work orders.
              </p>
            </G>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="kg-text text-center text-slate-500 text-xs mt-8 max-w-2xl mx-auto leading-relaxed opacity-0">
            Every shard envelope is signed twice — once by coord at grant
            time (proves authority), once on the gossipsub frame (proves
            transport). Hostile peers can&apos;t inject fake ownership or
            steal a shard route.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
