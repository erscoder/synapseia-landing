import Image from 'next/image';

/**
 * Web presence only — no dashboard CTAs, no "run a node" buttons,
 * no live network counters (coord is not deployed yet). Single-page
 * hero + value props + footer. When the network ships, hero CTAs
 * + live counters land back via the dashboard route group.
 */
export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col">
      {/* Top nav — logo only, no auth */}
      <header className="px-6 py-6 sm:px-10 sm:py-8 flex items-center">
        <div className="flex items-center gap-3">
          <Image
            src="/synapseia-logo.png"
            alt="Synapseia"
            width={36}
            height={36}
            priority
            className="w-9 h-9"
          />
          <span className="text-white font-semibold tracking-tight text-lg">
            Synapseia
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 sm:px-10">
        <div className="max-w-3xl text-center">
          <Image
            src="/synapseia-logo.png"
            alt="Synapseia Network"
            width={120}
            height={120}
            priority
            className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-8 drop-shadow-[0_0_60px_rgba(100,120,255,0.25)]"
          />
          <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
            Decentralized AI compute for{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              autonomous research
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            A peer-to-peer network of GPUs running large-language-model
            inference, evaluation, and knowledge-graph hosting — secured by
            Solana, owned by its operators.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Mainnet launch — coming soon
          </div>
        </div>
      </section>

      {/* Three pillars */}
      <section className="px-6 sm:px-10 pb-20 pt-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Pillar
            title="Open inference"
            body="Any operator can serve LLM inference and earn for the work. Models are bid on competitively per request."
          />
          <Pillar
            title="Verifiable research"
            body="Multi-stage hyperparameter search, peer review, and discovery rounds — every result auditable on-chain."
          />
          <Pillar
            title="Shared knowledge graph"
            body="A distributed semantic index of medical and scientific literature, hosted across the peer mesh."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-10 py-8 border-t border-white/[0.04] text-center text-sm text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} Synapseia Network</span>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/erscoder/synapseia-landing"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Pillar({ title, body }: { title: string; body: string }) {
  return (
    <div className="backdrop-blur-md bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.05] transition-colors">
      <h3 className="text-white font-semibold mb-2 text-lg">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
    </div>
  );
}
