'use client';
import { Reveal } from './Reveal.client';
import { WorldMap } from './WorldMap.client';

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
        <Reveal delay={100}><WorldMap /></Reveal>
      </div>
    </section>
  );
}
