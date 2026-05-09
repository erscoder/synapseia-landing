'use client';

import { SAMPLE_NODES, SAMPLE_EDGES, type SampleNode } from '@/lib/landing-nodes-sample';
import { WORLD_PATH } from '@/lib/world-atlas';

// Equirectangular projection — direct math, no d3-geo. Maps
// (lat, lon) to (x, y) in a `width × height` SVG viewport.
function project(lat: number, lon: number, width: number, height: number) {
  return {
    x: ((lon + 180) / 360) * width,
    y: ((90 - lat) / 180) * height,
  };
}

const VIEW_W = 1000;
const VIEW_H = 500;

function tierFill(tier: SampleNode['tier']): string {
  switch (tier) {
    case 'gpu':
      return 'fill-fuchsia-500';
    case 'inference':
      return 'fill-emerald-400';
    case 'cpu':
    default:
      return 'fill-cyan-400';
  }
}

/**
 * Static SVG world map for the landing's "Network Topology" band.
 *
 * Replaced the Three.js globe in slice S1.5 of the redesign — this
 * is a flat plate-carrée projection that renders a hard-coded
 * sample of ~25 nodes and ~30 edges. No animation in this slice
 * (motion lands in S4 once anime.js is wired in S2). Server-render
 * friendly: pure deterministic JSX, no `useEffect`, no window
 * access.
 */
export function WorldMap() {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 shadow-[0_0_60px_-20px_rgba(0,212,255,0.25)]">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-auto"
        aria-hidden="true"
      >
        {/* Basemap */}
        <path
          d={WORLD_PATH}
          className="fill-slate-800/50 stroke-slate-700/50"
          strokeWidth={0.5}
        />

        {/* Edges */}
        {SAMPLE_EDGES.map((e) => {
          const a = SAMPLE_NODES.find((n) => n.id === e.from);
          const b = SAMPLE_NODES.find((n) => n.id === e.to);
          if (!a || !b) return null;
          const p1 = project(a.lat, a.lon, VIEW_W, VIEW_H);
          const p2 = project(b.lat, b.lon, VIEW_W, VIEW_H);
          return (
            <line
              key={`${e.from}-${e.to}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              className="stroke-cyan-400/30"
              strokeWidth={0.5}
            />
          );
        })}

        {/* Nodes */}
        {SAMPLE_NODES.map((n) => {
          const { x, y } = project(n.lat, n.lon, VIEW_W, VIEW_H);
          return (
            <circle
              key={n.id}
              cx={x}
              cy={y}
              r={3}
              className={tierFill(n.tier)}
            />
          );
        })}
      </svg>
    </div>
  );
}
