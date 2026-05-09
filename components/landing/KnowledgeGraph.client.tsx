'use client';
import { Reveal, G } from './Reveal.client';

export function KnowledgeGraph() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-mono mb-4">DISTRIBUTED LIBRARY</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">The knowledge graph is sharded across the swarm</h2>
            <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Every discovery, every embedding, every cross-reference lives
              in a shared semantic graph. Coord doesn&apos;t hold it — the
              peer mesh does.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <G className="p-6">
              <div className="text-[10px] uppercase tracking-widest text-emerald-300/80 font-mono mb-2">SHARDING</div>
              <div className="text-sm font-semibold text-white mb-2">32 shards · 3 replicas</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Embeddings are deterministically hashed into 32 shards;
                each shard lives on 3 different operator nodes. Coord
                signs the grants but never serves the data path.
              </p>
            </G>
            <G className="p-6">
              <div className="text-[10px] uppercase tracking-widest text-emerald-300/80 font-mono mb-2">CHAINED SYNC</div>
              <div className="text-sm font-semibold text-white mb-2">Peer-to-peer bootstrap</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                New nodes pull shard snapshots from other peers first,
                not coord. Coord uplink stays ≈ zero in steady state —
                the library scales sideways with operator count.
              </p>
            </G>
            <G className="p-6">
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
          <p className="text-center text-slate-500 text-xs mt-8 max-w-2xl mx-auto leading-relaxed">
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
