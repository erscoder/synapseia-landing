'use client';
import { useRef } from 'react';
import { Reveal, G } from './Reveal.client';
import {
  animate,
  scrambleText,
  stagger,
  svg,
  onScroll,
  utils,
  useAnime,
} from '@/lib/anime';

// "The knowledge graph is sharded across the swarm" - now drawn as
// the actual semantic graph. Nodes are coloured by kg_node type
// (DISEASE / PROTEIN / GENE / COMPOUND / PATHWAY / DISCOVERY) and
// wired by edges typed per the SynapseIA-How-It-Works edge taxonomy
// (TREATS, BINDS, UPREGULATES, DERIVED_FROM, VALIDATES, BUILDS_ON,
// CONTRADICTS, ENCODES, BIOMARKER_OF, MECHANISM_VIA).
//
// Logical structure:
//   - Genes ENCODE proteins.
//   - Proteins are BIOMARKER_OF diseases (and live in pathways).
//   - Compounds TREAT diseases (and BIND proteins).
//   - Pathways UPREGULATE proteins / contain proteins.
//   - Discoveries VALIDATE / BUILD_ON other relations.
//
// The section copy + legend keys colour to type; the cards below
// explain SHARDING / GOSSIPSUB / BOOTSTRAP in prose, so the visual
// is free to focus on the graph itself.

const VB = { w: 800, h: 360 };

type KGType = 'DISEASE' | 'PROTEIN' | 'GENE' | 'COMPOUND' | 'PATHWAY' | 'DISCOVERY';

const KG_FILL: Record<KGType, string> = {
  DISCOVERY: 'rgb(110 231 183)',
  PROTEIN: 'rgb(34 211 238)',
  GENE: 'rgb(96 165 250)',
  COMPOUND: 'rgb(192 132 252)',
  PATHWAY: 'rgb(251 191 36)',
  DISEASE: 'rgb(244 114 182)',
};

const KG_LEGEND_ORDER: ReadonlyArray<KGType> = [
  'DISCOVERY',
  'PROTEIN',
  'GENE',
  'COMPOUND',
  'PATHWAY',
  'DISEASE',
];

type KGNode = {
  id: string;
  type: KGType;
  label: string;
  x: number;
  y: number;
};

// 22 nodes laid out across the 800×360 canvas. Names are real
// biomedical entities to match the ALS / cardiology / oncology
// training tracks the project ships with - keeps the picture
// honest rather than abstract.
const NODES: ReadonlyArray<KGNode> = [
  // ── Diseases (top band) ──────────────────────────────────────
  { id: 'als',      type: 'DISEASE', label: 'ALS',       x: 130, y: 60 },
  { id: 'alz',      type: 'DISEASE', label: "Alzheimer's", x: 320, y: 50 },
  { id: 'park',     type: 'DISEASE', label: "Parkinson's", x: 510, y: 55 },
  { id: 'brca',     type: 'DISEASE', label: 'BRCA1 ca.',   x: 690, y: 70 },

  // ── Proteins (middle-upper) ──────────────────────────────────
  { id: 'sod1p',    type: 'PROTEIN', label: 'SOD1',     x: 175, y: 145 },
  { id: 'tdp43',    type: 'PROTEIN', label: 'TDP-43',   x: 90,  y: 175 },
  { id: 'tau',      type: 'PROTEIN', label: 'Tau',      x: 290, y: 145 },
  { id: 'abeta',    type: 'PROTEIN', label: 'Aβ',       x: 410, y: 130 },
  { id: 'asyn',     type: 'PROTEIN', label: 'α-synuc.', x: 530, y: 150 },
  { id: 'brca1p',   type: 'PROTEIN', label: 'BRCA1 p.', x: 680, y: 155 },

  // ── Genes (middle-lower) ─────────────────────────────────────
  { id: 'sod1g',    type: 'GENE',    label: 'SOD1',     x: 230, y: 230 },
  { id: 'mapt',     type: 'GENE',    label: 'MAPT',     x: 350, y: 220 },
  { id: 'app',      type: 'GENE',    label: 'APP',      x: 460, y: 220 },
  { id: 'snca',     type: 'GENE',    label: 'SNCA',     x: 570, y: 235 },
  { id: 'brca1g',   type: 'GENE',    label: 'BRCA1',    x: 720, y: 235 },

  // ── Pathways (right side, mid) ───────────────────────────────
  { id: 'mito',     type: 'PATHWAY', label: 'Mitoc.',   x: 130, y: 285 },
  { id: 'glut',     type: 'PATHWAY', label: 'Glutam.',  x: 290, y: 295 },
  { id: 'apop',     type: 'PATHWAY', label: 'Apopt.',   x: 470, y: 305 },

  // ── Compounds (bottom) ───────────────────────────────────────
  { id: 'rilu',     type: 'COMPOUND', label: 'Riluzole',  x: 60,  y: 245 },
  { id: 'edar',     type: 'COMPOUND', label: 'Edaravone', x: 50,  y: 305 },
  { id: 'lev',      type: 'COMPOUND', label: 'L-DOPA',    x: 620, y: 305 },

  // ── Discoveries (top-right, glowing) ─────────────────────────
  { id: 'd1',       type: 'DISCOVERY', label: 'D#47',    x: 380, y: 30 },
  { id: 'd2',       type: 'DISCOVERY', label: 'D#52',    x: 760, y: 110 },
];

type KGEdge = {
  from: string;
  to: string;
  /** Edge label drawn small + faded near the midpoint. */
  rel: 'TREATS' | 'ENCODES' | 'BIOMARKER_OF' | 'BINDS' | 'UPREGULATES' | 'VALIDATES' | 'BUILDS_ON' | 'DERIVED_FROM';
};

// 22 edges chosen to read as a coherent neuroscience + oncology
// slice of the corpus. Labels match the actual edge taxonomy so a
// curious viewer can map edges back to real kg_edge rows.
const EDGES: ReadonlyArray<KGEdge> = [
  // Genes ENCODE proteins
  { from: 'sod1g',  to: 'sod1p',   rel: 'ENCODES' },
  { from: 'mapt',   to: 'tau',     rel: 'ENCODES' },
  { from: 'app',    to: 'abeta',   rel: 'ENCODES' },
  { from: 'snca',   to: 'asyn',    rel: 'ENCODES' },
  { from: 'brca1g', to: 'brca1p',  rel: 'ENCODES' },

  // Proteins are BIOMARKER_OF diseases
  { from: 'sod1p',  to: 'als',     rel: 'BIOMARKER_OF' },
  { from: 'tdp43',  to: 'als',     rel: 'BIOMARKER_OF' },
  { from: 'tau',    to: 'alz',     rel: 'BIOMARKER_OF' },
  { from: 'abeta',  to: 'alz',     rel: 'BIOMARKER_OF' },
  { from: 'asyn',   to: 'park',    rel: 'BIOMARKER_OF' },
  { from: 'brca1p', to: 'brca',    rel: 'BIOMARKER_OF' },

  // Compounds TREAT diseases
  { from: 'rilu',   to: 'als',     rel: 'TREATS' },
  { from: 'edar',   to: 'als',     rel: 'TREATS' },
  { from: 'lev',    to: 'park',    rel: 'TREATS' },

  // Compounds BIND proteins
  { from: 'rilu',   to: 'sod1p',   rel: 'BINDS' },
  { from: 'lev',    to: 'asyn',    rel: 'BINDS' },

  // Pathways UPREGULATE / are mechanism
  { from: 'mito',   to: 'sod1p',   rel: 'UPREGULATES' },
  { from: 'glut',   to: 'tau',     rel: 'UPREGULATES' },
  { from: 'apop',   to: 'abeta',   rel: 'UPREGULATES' },

  // Discoveries
  { from: 'd1',     to: 'rilu',    rel: 'VALIDATES' },
  { from: 'd1',     to: 'als',     rel: 'BUILDS_ON' },
  { from: 'd2',     to: 'brca1p',  rel: 'DERIVED_FROM' },
];

const NODES_BY_ID = new Map(NODES.map((n) => [n.id, n]));

const NODE_RADIUS = 6;

export function KnowledgeGraph() {
  const rootRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useAnime<HTMLElement>(rootRef, (self) => {
    const root = rootRef.current;
    const svgEl = svgRef.current;
    if (!root || !svgEl) return;
    const { reduceMotion } = self.matches;

    const titleAnim = animate('[data-kg-card-title]', {
      innerHTML: scrambleText({ chars: 'lowercase' }),
      duration: 480,
      delay: stagger(200, { start: 200 }),
      ease: 'linear',
      autoplay: false,
    });

    if (reduceMotion) {
      utils.set('[data-kg-card-title]', { opacity: 1 });
      utils.set('[data-kg-node]', { opacity: 1, scale: 1 });
      utils.set('[data-kg-edge]', { opacity: 1 });
      utils.set('[data-kg-pulse]', { opacity: 0 });
      return;
    }

    // 1. Edges line-draw first so nodes pop in over a wired graph.
    const edgeDrawables = svg.createDrawable('[data-kg-edge]');
    const edgeAnim = animate(edgeDrawables, {
      draw: ['0 0', '0 1'],
      delay: stagger(20),
      duration: 520,
      ease: 'inOutSine',
      autoplay: false,
    });

    // 2. Nodes scale-in stagger over the wired edges.
    const nodeAnim = animate('[data-kg-node]', {
      scale: [0, 1],
      opacity: [0, 1],
      delay: stagger(28, { start: 400 }),
      duration: 420,
      ease: 'outBack',
      autoplay: false,
    });

    // 3. Discovery halo - continuous gentle pulse, paused offscreen.
    const haloAnim = animate('[data-kg-halo]', {
      r: [NODE_RADIUS + 2, NODE_RADIUS + 12],
      opacity: [
        { to: 0.45, duration: 200 },
        { to: 0, duration: 1500 },
      ],
      duration: 2400,
      ease: 'outQuad',
      loop: true,
      delay: stagger(800),
      autoplay: onScroll({ target: svgEl, sync: false }),
    });

    let played = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !played) {
          played = true;
          edgeAnim.play();
          nodeAnim.play();
          titleAnim.play();
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(root);

    return () => {
      io.disconnect();
      edgeAnim.pause();
      nodeAnim.pause();
      haloAnim.pause();
      titleAnim.pause();
    };
  });

  // Helpers for label placement: drop the relation label near the
  // midpoint, biased upward by ~6 px so it doesn't overlap the
  // edge stroke.
  const edgeMid = (a: KGNode, b: KGNode) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

  return (
    <section ref={rootRef} className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-mono mb-4">DISTRIBUTED LIBRARY</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">The knowledge graph is sharded across the swarm</h2>
            <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Every discovery, every embedding, every cross-reference lives
              in a shared semantic graph. Coord doesn&apos;t hold it; the
              peer mesh does.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <G className="p-6 mb-8">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${VB.w} ${VB.h}`}
              aria-hidden="true"
              className="w-full h-auto"
            >
              <defs>
                <radialGradient id="kgDiscoveryGlow" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="rgb(110 231 183)" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="rgb(110 231 183)" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Edges first so nodes layer above. */}
              {EDGES.map((e, idx) => {
                const a = NODES_BY_ID.get(e.from);
                const b = NODES_BY_ID.get(e.to);
                if (!a || !b) return null;
                const mid = edgeMid(a, b);
                return (
                  <g key={`e-${idx}`}>
                    <line
                      data-kg-edge
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke="rgba(148, 163, 184, 0.30)"
                      strokeWidth={0.9}
                    />
                    <text
                      x={mid.x}
                      y={mid.y - 4}
                      textAnchor="middle"
                      fill="rgb(148 163 184)"
                      fillOpacity={0.45}
                      style={{ font: '500 6.5px ui-monospace, SFMono-Regular, monospace', letterSpacing: '0.04em' }}
                    >
                      {e.rel}
                    </text>
                  </g>
                );
              })}

              {/* Nodes. DISCOVERY nodes get a soft radial glow. */}
              {/* Outer <g> holds the static translate; inner <g> is what
                  anime.js scales — keeping the two transforms on separate
                  elements prevents anime from overwriting the translate
                  attribute on each tick. */}
              {NODES.map((n) => {
                const fill = KG_FILL[n.type];
                const isDiscovery = n.type === 'DISCOVERY';
                return (
                  <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
                    <g
                      data-kg-node
                      style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                    >
                      {isDiscovery && (
                        <>
                          <circle r={14} fill="url(#kgDiscoveryGlow)" pointerEvents="none" />
                          <circle
                            data-kg-halo
                            r={NODE_RADIUS + 2}
                            fill="none"
                            stroke={fill}
                            strokeOpacity={0.45}
                            strokeWidth={1}
                            opacity={0}
                          />
                        </>
                      )}
                      <circle
                        r={isDiscovery ? NODE_RADIUS + 1 : NODE_RADIUS}
                        fill={fill}
                        fillOpacity={isDiscovery ? 1 : 0.92}
                      />
                      <text
                        x={0}
                        y={NODE_RADIUS + 11}
                        textAnchor="middle"
                        fill="rgb(226 232 240)"
                        fillOpacity={0.85}
                        style={{ font: '600 8px ui-sans-serif, system-ui, sans-serif' }}
                      >
                        {n.label}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Legend (top-right) - kg_node colour roles. */}
              <g transform="translate(580 332)" opacity={0.85}>
                {KG_LEGEND_ORDER.map((t, i) => (
                  <g key={`lg-${t}`} transform={`translate(${(i % 3) * 70} ${Math.floor(i / 3) * 14})`}>
                    <circle r={2.4} cx={0} cy={-3} fill={KG_FILL[t]} />
                    <text
                      x={6}
                      y={0}
                      fill="rgb(148 163 184)"
                      style={{ font: '500 7.5px ui-monospace, SFMono-Regular, monospace', letterSpacing: '0.05em' }}
                    >
                      {t}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
          </G>
        </Reveal>

        <Reveal delay={150}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <G className="p-6">
              <div className="text-[10px] uppercase tracking-widest text-emerald-300/80 font-mono mb-2">SHARDING</div>
              <div data-kg-card-title className="text-sm font-semibold text-white mb-2">Each peer holds a slice</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every operator stores its own kg_nodes (DISEASE, PROTEIN,
                GENE, COMPOUND, PATHWAY, DISCOVERY) and the kg_edges that
                wire them. Coord signs grants but never serves the data
                path.
              </p>
            </G>
            <G className="p-6">
              <div className="text-[10px] uppercase tracking-widest text-emerald-300/80 font-mono mb-2">GOSSIPSUB MESH</div>
              <div data-kg-card-title className="text-sm font-semibold text-white mb-2">libp2p + KadDHT discovery</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Peers gossip discoveries, peer-review scores, and shard
                envelopes over GossipSub. KadDHT routes peers to the slice
                they need. No central directory in the data path.
              </p>
            </G>
            <G className="p-6">
              <div className="text-[10px] uppercase tracking-widest text-emerald-300/80 font-mono mb-2">BOOTSTRAP {'→'} ZERO</div>
              <div data-kg-card-title className="text-sm font-semibold text-white mb-2">Phase 6 retires the scaffold</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Six bootstrap nodes help newcomers find their first peers.
                Once a node is in the mesh, the bootstrap layer is bypassed
                . Phase 6 retires it entirely.
              </p>
            </G>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="text-center text-slate-500 text-xs mt-8 max-w-2xl mx-auto leading-relaxed">
            Every shard envelope and every gossip frame is signed by the
            peer&apos;s Ed25519 identity, so hostile peers can&apos;t
            forge ownership or inject fake discoveries into the swarm.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
