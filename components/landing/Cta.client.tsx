'use client';
import Link from 'next/link';
import { Reveal, G } from './Reveal.client';

export function Cta() {
  return (
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl backdrop-blur-md bg-blue-500/15 border border-blue-500/30 text-blue-200 font-semibold hover:bg-blue-500/25 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 text-base"
              >
                Read the docs
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <a
                href="https://github.com/erscoder/synapseia-landing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl backdrop-blur-md bg-white/[0.04] border border-white/[0.08] text-slate-200 font-semibold hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 text-base"
              >
                GitHub
              </a>
            </div>
          </G>
        </Reveal>
      </div>
    </section>
  );
}
