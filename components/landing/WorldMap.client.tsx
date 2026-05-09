'use client';

import { useMemo, useRef } from 'react';
import { feature } from 'topojson-client';
import { geoEquirectangular, geoPath } from 'd3-geo';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { Topology } from 'topojson-specification';
// Bundled TopoJSON (~105 KB raw, ~25 KB gzipped). Imported as a JSON
// module so the bundler tree-shakes it into the static export and
// no runtime fetch is needed at first paint.
import worldTopologyJson from 'world-atlas/countries-110m.json';
import { SAMPLE_NODES, SAMPLE_EDGES, type SampleNode } from '@/lib/landing-nodes-sample';
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

const VIEW_W = 1000;
const VIEW_H = 500;

// Cap data-flow particles at 10 - keeps the network feeling alive
// without pushing the active animator count past what mid-tier
// hardware comfortably renders at 60fps. Pulses + particles are
// gated by `prefers-reduced-motion` and pause when the section
// scrolls offscreen via onScroll's IntersectionObserver.
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

// Single shared projection: equirectangular (plate-carrée) fitted to
// the whole world inside a 1000×500 viewport. Used for both the
// country geometries (geoPath) and the node coords (proj([lon,lat]))
// so dots sit on the right cities.
const projection = geoEquirectangular()
  .scale(VIEW_W / (2 * Math.PI))
  .translate([VIEW_W / 2, VIEW_H / 2]);
const pathGen = geoPath(projection);

// Pre-compute the country paths once at module load. The static
// export inlines this work into the JS bundle; at runtime there's
// only DOM creation, no projection cost.
const worldTopology = worldTopologyJson as unknown as Topology;
const countriesGeo = feature(
  worldTopology,
  worldTopology.objects.countries,
) as unknown as FeatureCollection<Geometry>;
const countryPaths: { id: string; d: string }[] = countriesGeo.features
  .map((f: Feature<Geometry>, i: number) => {
    const d = pathGen(f);
    return { id: String(f.id ?? i), d: d ?? '' };
  })
  .filter((p) => p.d.length > 0);

// Only render nodes that participate in at least one edge - explicit
// user request: paint only nodes that are actually connected.
const connectedIds = new Set<string>();
for (const e of SAMPLE_EDGES) {
  connectedIds.add(e.from);
  connectedIds.add(e.to);
}
const connectedNodes: SampleNode[] = SAMPLE_NODES.filter((n) =>
  connectedIds.has(n.id),
);

function projectLatLon(lat: number, lon: number): [number, number] {
  const out = projection([lon, lat]);
  return out ?? [0, 0];
}

/**
 * Animated SVG world map for the landing's "Network Topology" band.
 *
 * Renders the real Natural Earth 1:110m country geometries from
 * `world-atlas` projected through `d3-geo`'s equirectangular -
 * replaces the prior hand-trimmed cartoon-island path. Animation
 * layers (anime.js v4):
 *   1. Country borders → line-draw on view (svg.createDrawable)
 *   2. Node circles    → spring scale-in pop on view (stagger from center)
 *   3. Edges           → line-draw stagger 40ms on view
 *   4. Pulse rings     → continuous ambient scale + opacity loop
 *   5. Flow particles  → motion-path travel along the first 10 edges
 *
 * All motion is gated by `prefers-reduced-motion`. The pulse and
 * particle loops auto-pause when the section is offscreen because
 * `onScroll` installs an IntersectionObserver under the hood.
 */
export function WorldMap() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Pre-project node + edge coords so the JSX and the motion code
  // share one source of truth. Particle motion paths reference the
  // same projected edges by id.
  const projectedNodes: ProjectedNode[] = useMemo(
    () =>
      connectedNodes.map((n) => {
        const [x, y] = projectLatLon(n.lat, n.lon);
        return { id: n.id, x, y, tier: n.tier };
      }),
    [],
  );

  const projectedEdges: ProjectedEdge[] = useMemo(
    () =>
      SAMPLE_EDGES.flatMap((e) => {
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
      }),
    [projectedNodes],
  );

  const flowEdges = projectedEdges.slice(0, PARTICLE_EDGE_COUNT);

  useAnime<HTMLDivElement>(rootRef, (self) => {
    const root = rootRef.current;
    if (!root) return;
    const { reduceMotion } = self.matches;

    // 1. Country borders - line-draw on view.
    const continents = svg.createDrawable('.continent-path');
    animate(continents, {
      draw: ['0 0', '0 1'],
      ease: EASE.authoritative,
      duration: reduceMotion ? 0 : DURATION.long,
      autoplay: onScroll({ target: root, sync: false }),
    });

    // 2. Nodes - spring scale-in pop on view, stagger from center.
    animate('.node-circle', {
      scale: reduceMotion ? 1 : [0, 1],
      opacity: [0, 1],
      delay: stagger(STAGGER.base, { from: 'center' }),
      duration: reduceMotion ? 0 : DURATION.short,
      ease: EASE.spring,
      autoplay: onScroll({ target: root, sync: false }),
    });

    // 3. Edges - line-draw 40ms stagger on view.
    const edges = svg.createDrawable('.edge-line');
    animate(edges, {
      draw: ['0 0', '0 1'],
      delay: stagger(40),
      duration: reduceMotion ? 0 : DURATION.medium,
      ease: EASE.authoritative,
      autoplay: onScroll({ target: root, sync: false }),
    });

    // 4. Pulse rings - continuous ambient loop. Skipped entirely
    // under reduce-motion. `autoplay: onScroll(...)` pauses the
    // loop when the section scrolls offscreen so the engine isn't
    // ticking active animators while the user is at the footer.
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

    // 5. Flow particles - travel along the first 10 edges via
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
        {/* Basemap - one path per country from Natural Earth 1:110m. */}
        <g>
          {countryPaths.map((p) => (
            <path
              key={p.id}
              d={p.d}
              className="continent-path fill-slate-800/50 stroke-slate-700/60"
              strokeWidth={0.5}
            />
          ))}
        </g>

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

        {/* Flow-particle donor paths - invisible <path> elements
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
            solid node so the loop scales outward visually. Only the
            connected nodes are rendered (per user request). */}
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

        {/* Flow particles - small cyan dots that travel along the
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
