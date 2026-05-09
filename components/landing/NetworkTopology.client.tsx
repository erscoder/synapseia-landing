'use client';
import dynamic from 'next/dynamic';
import { Reveal } from './Reveal.client';

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

export function NetworkTopology() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Network Topology</h2>
            <p className="text-slate-500">Snapshot of active nodes and their connections</p>
          </div>
        </Reveal>
        <Reveal delay={100}><NodeGraph /></Reveal>
      </div>
    </section>
  );
}
