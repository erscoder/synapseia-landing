'use client';

import { useRef } from 'react';
import { SAMPLE_NODES, SAMPLE_EDGES, type SampleNode } from '@/lib/landing-nodes-sample';
import { WORLD_PATH } from '@/lib/world-atlas';
import {
  animate,
  stagger,
  svg,
  onScroll,
  useAnime,
  DURATION,
  EASE,
  STAGGER,
} from '@/lib/anime';

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

// Cap data-flow particles at 10 — keeps the network feeling alive
// without pushing the active animator count past what mid-tier
// hardware comfortably renders at 60fps. Total moving parts:
// 25 nodes (entrance) + 30 edges (entrance) + 25 pulses (loop)
// + 10 particles (loop) = ~90 anime objects. Pulses + particles
// are gated by `prefers-reduced-motion` and pause when the
// section scrolls offscreen via onScroll's IntersectionObserver.
const PARTICLE_EDGE_COUNT = 10;

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

interface ProjectedNode {
  id: string;
  x: number;
  y: number;
  tier: SampleNode['tier'];
}

interface ProjectedEdge {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * Animated SVG world map for the landing's "Network Topology" band.
 *
 * Replaced the Three.js globe in slice S1.5 (flat plate-carrée
 * projection, deterministic JSX). Slice S4 wires anime.js v4 motion
 * on top:
 *   1. Continents path  → line-draw on view (svg.createDrawable)
 *   2. Node circles     → spring scale-in pop on view (stagger from center)
 *   3. Edges            → line-draw stagger 40ms on view
 *   4. Pulse rings      → continuous ambient scale + opacity loop
 *   5. Flow particles   → motion-path travel along the first 10 edges
 *
 * All motion is gated by `prefers-reduced-motion`. The pulse and
 * particle loops auto-pause when the section is offscreen because
 * onScroll-driven entrances and the IntersectionObserver that
 * createScope installs handle the visibility window.
 */
export function WorldMap() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Pre-project everything so the JSX and the motion code share one
  // source of truth for coordinates. Particle motion paths are built
  // from the same projected edges.
  const projectedNodes: ProjectedNode[] = SAMPLE_NODES.map((n) => {
    const { x, y } = project(n.lat, n.lon, VIEW_W, VIEW_H);
    return { id: n.id, x, y, tier: n.tier };
  });

  const projectedEdges: ProjectedEdge[] = SAMPLE_EDGES.flatMap((e) => {
    const a = projectedNodes.find((n) => n.id === e.from);
    const b = projectedNodes.find((n) => n.id === e.to);
    if (!a || !b) return [];
    return [
      {
        key: `${e.from}-${e.to}`,
        x1: a.x,
        y1: a.y,
        x2: b.x,
        y2: b.y,
      },
    ];
  });

  const flowEdges = projectedEdges.slice(0, PARTICLE_EDGE_COUNT);

  useAnime<HTMLDivElement>(rootRef, (self) => {
    const root = rootRef.current;
    if (!root) return;
    const { reduceMotion } = self.matches;

    // 1. Continents — line-draw on view.
    const continents = svg.createDrawable('.continent-path');
    animate(continents, {
      draw: ['0 0', '0 1'],
      ease: EASE.authoritative,
      duration: reduceMotion ? 0 : DURATION.long,
      autoplay: onScroll({ target: root, sync: false }),
    });

    // 2. Nodes — spring scale-in pop on view, stagger from center.
    animate('.node-circle', {
      scale: reduceMotion ? 1 : [0, 1],
      opacity: [0, 1],
      delay: stagger(STAGGER.base, { from: 'center' }),
      duration: reduceMotion ? 0 : DURATION.short,
      ease: EASE.spring,
      autoplay: onScroll({ target: root, sync: false }),
    });

    // 3. Edges — line-draw 40ms stagger on view.
    const edges = svg.createDrawable('.edge-line');
    animate(edges, {
      draw: ['0 0', '0 1'],
      delay: stagger(40),
      duration: reduceMotion ? 0 : DURATION.medium,
      ease: EASE.authoritative,
      autoplay: onScroll({ target: root, sync: false }),
    });

    // 4. Pulse rings — continuous ambient loop. Skipped entirely
    // under reduce-motion. `autoplay: onScroll(...)` pauses the
    // loop when the section scrolls offscreen so the engine isn't
    // ticking 25 animators while the user is at the footer.
    if (!reduceMotion) {
      animate('.node-pulse', {
        scale: [1, 2.4],
        opacity: [0.6, 0],
        loop: true,
        duration: DURATION.ambient,
        delay: stagger(120, { from: 'random' }),
        ease: 'outQuad',
        autoplay: onScroll({ target: root, sync: false }),
      });
    }

    // 5. Flow particles — travel along the first 10 edges via
    // svg.createMotionPath. Skipped under reduce-motion. Same
    // offscreen-pause discipline as the pulses.
    if (!reduceMotion) {
      flowEdges.forEach((_edge, i) => {
        const motionPath = svg.createMotionPath(`#flow-path-${i}`);
        animate(`.flow-particle-${i}`, {
          ...motionPath,
          duration: 3000,
          delay: i * 90,
          loop: true,
          ease: 'linear',
          autoplay: onScroll({ target: root, sync: false }),
        });
      });
    }
  });

  return (
    <div
      ref={rootRef}
      className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 shadow-[0_0_60px_-20px_rgba(0,212,255,0.25)]"
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-auto"
        aria-hidden="true"
      >
        {/* Basemap */}
        <path
          d={WORLD_PATH}
          className="continent-path fill-slate-800/50 stroke-slate-700/60"
          strokeWidth={0.5}
        />

        {/* Edges */}
        {projectedEdges.map((e) => (
          <line
            key={e.key}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            className="edge-line stroke-cyan-400/30"
            strokeWidth={0.5}
            fill="none"
          />
        ))}

        {/* Flow-particle donor paths — invisible <path> elements
            referenced by svg.createMotionPath. Drawn as straight
            segments matching their edge so particles glide between
            the same node coordinates. */}
        <g aria-hidden="true">
          {flowEdges.map((e, i) => (
            <path
              key={`flow-path-${i}`}
              id={`flow-path-${i}`}
              d={`M ${e.x1} ${e.y1} L ${e.x2} ${e.y2}`}
              fill="none"
              stroke="none"
            />
          ))}
        </g>

        {/* Nodes + pulse rings. Pulse circles sit underneath the
            solid node so the loop scales outward visually. */}
        {projectedNodes.map((n) => (
          <g key={n.id}>
            <circle
              cx={n.x}
              cy={n.y}
              r={3}
              className={`node-pulse ${tierFill(n.tier)} opacity-0`}
            />
            <circle
              cx={n.x}
              cy={n.y}
              r={3}
              className={`node-circle ${tierFill(n.tier)}`}
            />
          </g>
        ))}

        {/* Flow particles — small cyan dots that travel along the
            donor paths. One <circle> per flow edge so each can be
            animated with its own motion path. */}
        {flowEdges.map((_e, i) => (
          <circle
            key={`flow-particle-${i}`}
            r={2}
            cx={0}
            cy={0}
            className={`flow-particle-${i} fill-cyan-300`}
          />
        ))}
      </svg>
    </div>
  );
}
