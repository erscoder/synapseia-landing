'use client';
import { Reveal, G } from './Reveal.client';

export function OpenVerifiable() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 font-mono mb-4">OPEN &amp; VERIFIABLE</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Nothing happens off the record</h2>
            <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Every action on the network is signed, gossipped, and
              replayable. No private servers in the data path, no
              hidden moderation, no closed-source backend.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <G className="p-5">
              <div className="text-2xl mb-3">🔓</div>
              <div className="text-sm font-semibold text-white mb-1">Open source</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Node agent, desktop UI, and Solana programs are public.
                Audit them, fork them, run your own node.
              </p>
            </G>
            <G className="p-5">
              <div className="text-2xl mb-3">⛓️</div>
              <div className="text-sm font-semibold text-white mb-1">Solana on-chain</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                SYN is an SPL token. Stakes, claims, and discovery
                commitments land on Solana — timestamps cannot be
                rewritten.
              </p>
            </G>
            <G className="p-5">
              <div className="text-2xl mb-3">🔐</div>
              <div className="text-sm font-semibold text-white mb-1">Ed25519 everywhere</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every analysis, every peer review, every shard
                ownership grant is signed by an operator pubkey
                with a 60s replay window.
              </p>
            </G>
            <G className="p-5">
              <div className="text-2xl mb-3">🌐</div>
              <div className="text-sm font-semibold text-white mb-1">CRDT consensus</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Leaderboards, ownership state, and reviews converge
                via conflict-free replicated data types — no quorum
                round-trips, no central authority breaks ties.
              </p>
            </G>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
