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

// "Knowledge graph sharded across the swarm" - visual spec sourced
// from the Synapseia NotebookLM corpus (WHITEPAPER, How-It-Works,
// Brain Dashboard notes). The graph is NOT centralised: each
// operator peer holds its own slice of kg_nodes/kg_edges, and peers
// gossip discoveries to each other over libp2p (GossipSub) /
// KadDHT. The 6 bootstrap nodes are a temporary scaffold (Phase 6
// retires them).
//
// Visual contract:
//   - Six operator peer hexagons distributed organically (no centre).
//   - Inside each peer: 3 small kg_nodes wired by 2 kg_edges; one
//     peer hosts a DISCOVERY (emerald glow ring).
//   - Inter-peer edges represent the GossipSub mesh (8 curves).
//   - One faded dotted "BOOTSTRAP" node sits in the bottom-left as
//     the only currently-centralised piece, drawn small to signal
//     it's deprecated by Phase 6.
//   - Peers carry a Tier label (T0–T5) and an Ed25519 prefix.
//
// Motion contract:
//   - Entrance: peer hex line-draw stagger → inner kg pop-in →
//     inter-peer gossip mesh edges line-draw.
//   - Continuous: peer halo pulse (heartbeat every ~2.5s, staggered)
//     + 3 gossip orbs travelling along sampled mesh paths
//     (paused offscreen via onScroll).
//   - Manual IntersectionObserver `.play()` on entrance to dodge
//     the autoplay:onScroll(...) from-state pitfall (drawables
//     would land at `0 0` - invisible - until the trigger fires).

type Tier = 'T0' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5';

type Peer = {
  i: number;
  x: number;
  y: number;
  tier: Tier;
  /** Ed25519 prefix used as the on-mesh identity hint. */
  id: string;
  /** Cyan = generic peer, emerald = peer hosting a DISCOVERY. */
  accent: 'cyan' | 'emerald';
};

const VB = { w: 800, h: 360 };

// Six peers arranged organically - no central node. Coords hand-
// tuned so the inter-peer mesh reads as a swarm, not a wheel.
const PEERS: ReadonlyArray<Peer> = [
  { i: 0, x: 130, y: 110, tier: 'T0', id: 'ed25519:8f3a', accent: 'cyan' },
  { i: 1, x: 305, y: 75,  tier: 'T2', id: 'ed25519:c19e', accent: 'cyan' },
  { i: 2, x: 525, y: 105, tier: 'T5', id: 'ed25519:4b7d', accent: 'emerald' },
  { i: 3, x: 685, y: 215, tier: 'T3', id: 'ed25519:9e02', accent: 'cyan' },
  { i: 4, x: 425, y: 270, tier: 'T4', id: 'ed25519:2a51', accent: 'emerald' },
  { i: 5, x: 175, y: 250, tier: 'T1', id: 'ed25519:6c8b', accent: 'cyan' },
];

// GossipSub mesh: sparse on purpose so it doesn't read as a complete
// graph. Eight links is enough to convey "every peer reachable in
// ~2 hops" without visual noise.
const MESH: ReadonlyArray<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 0],
  [1, 4],
  [2, 5],
];

// Three sampled mesh edges carry travelling gossip orbs.
const ORBIT_EDGES: ReadonlyArray<[number, number]> = [
  [0, 1],
  [2, 3],
  [4, 5],
];

// Smaller peer markers - filled circles, no inner kg slice.
// Halo size scales off this so the heartbeat pulse still reads.
const PEER_RADIUS = 9;

// kg_node types live inside the conceptual graph (not rendered per
// peer anymore - peers are now solid dots). Kept here to drive the
// legend so the section still tells the user what shapes the
// shared semantic graph stores.
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

function straightMeshPath(a: Peer, b: Peer): string {
  // Straight line between peer centres - cleaner than the previous
  // curved version, reads as direct gossip routes rather than orbits.
  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
}

const ACCENT_BORDER: Record<Peer['accent'], string> = {
  cyan: 'rgb(34 211 238)',
  emerald: 'rgb(110 231 183)',
};

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
      utils.set('[data-kg-peer]', { opacity: 1, scale: 1 });
      utils.set('[data-kg-mesh]', { opacity: 1 });
      utils.set('[data-kg-halo]', { opacity: 0 });
      utils.set('[data-kg-orb]', { opacity: 0 });
      utils.set('[data-kg-bootstrap]', { opacity: 0.45 });
      return;
    }

    // 1. Peer dots scale-in.
    const peerAnim = animate('[data-kg-peer]', {
      scale: [0, 1],
      opacity: [0, 1],
      delay: stagger(80),
      duration: 480,
      ease: 'outBack',
      autoplay: false,
    });

    // 2. Inter-peer mesh edges line-draw after peers land.
    const meshDrawables = svg.createDrawable('[data-kg-mesh]');
    const meshAnim = animate(meshDrawables, {
      draw: ['0 0', '0 1'],
      delay: stagger(40, { start: 700 }),
      duration: 480,
      ease: 'inOutSine',
      autoplay: false,
    });

    // 3. Bootstrap node (deprecated Phase 6 piece) fades in last -
    //    visually subordinate to the swarm.
    const bootAnim = animate('[data-kg-bootstrap]', {
      opacity: [0, 0.45],
      duration: 600,
      delay: 1300,
      ease: 'outSine',
      autoplay: false,
    });

    // 5. Continuous heartbeat halo on every peer (every ~2.5s,
    //    staggered). Mirrors the Pulse Round cadence (90s in the
    //    real network, but we compress for visual rhythm). Pauses
    //    when offscreen.
    const haloAnim = animate('[data-kg-halo]', {
      r: [PEER_RADIUS, PEER_RADIUS + 18],
      opacity: [
        { to: 0.35, duration: 200 },
        { to: 0, duration: 1300 },
      ],
      duration: 2500,
      ease: 'outQuad',
      loop: true,
      delay: stagger(420),
      autoplay: onScroll({ target: svgEl, sync: false }),
    });

    // 6. Three gossip orbs traverse selected mesh edges. Each orb
    //    binds to its own hidden flow path so motion-path tracing
    //    is unambiguous. Pauses offscreen.
    const orbAnims = ORBIT_EDGES.map((_, i) => {
      const motion = svg.createMotionPath(`[data-kg-orbit="${i}"]`);
      return animate(`[data-kg-orb="${i}"]`, {
        ...motion,
        duration: 3200 + i * 500,
        delay: i * 700,
        loop: true,
        ease: 'linear',
        opacity: [
          { to: 0.95, duration: 250 },
          { to: 0.95, duration: 2700 + i * 500 },
          { to: 0, duration: 250 },
        ],
        autoplay: onScroll({ target: svgEl, sync: false }),
      });
    });

    let played = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !played) {
          played = true;
          peerAnim.play();
          meshAnim.play();
          bootAnim.play();
          titleAnim.play();
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(root);

    return () => {
      io.disconnect();
      peerAnim.pause();
      meshAnim.pause();
      bootAnim.pause();
      haloAnim.pause();
      titleAnim.pause();
      orbAnims.forEach((a) => a.pause());
    };
  });

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
                  <stop offset="0%" stopColor="rgb(110 231 183)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="rgb(110 231 183)" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* GossipSub mesh - drawn first so peer hexes layer on top. */}
              {MESH.map(([a, b], idx) => {
                const A = PEERS[a]!;
                const B = PEERS[b]!;
                return (
                  <path
                    key={`mesh-${idx}`}
                    data-kg-mesh
                    d={straightMeshPath(A, B)}
                    fill="none"
                    stroke="rgba(148, 163, 184, 0.30)"
                    strokeWidth={1}
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Hidden orbit paths - one per gossip orb. */}
              {ORBIT_EDGES.map(([a, b], idx) => (
                <path
                  key={`orbit-${idx}`}
                  data-kg-orbit={idx}
                  d={straightMeshPath(PEERS[a]!, PEERS[b]!)}
                  fill="none"
                  stroke="none"
                />
              ))}

              {/* Peers. Each peer = halo (heartbeat) + filled circle +
                  identity strip. Emerald peers also get a soft glow
                  to mark a DISCOVERY host. */}
              {PEERS.map((p) => {
                const accent = ACCENT_BORDER[p.accent];
                const isDiscovery = p.accent === 'emerald';
                return (
                  <g key={`peer-${p.i}`}>
                    {/* Pulsing halo (continuous heartbeat). */}
                    <circle
                      data-kg-halo
                      cx={p.x}
                      cy={p.y}
                      r={PEER_RADIUS}
                      fill="none"
                      stroke={accent}
                      strokeOpacity={0.4}
                      strokeWidth={1}
                      opacity={0}
                    />

                    {/* Discovery glow (emerald peers only). */}
                    {isDiscovery && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={PEER_RADIUS + 8}
                        fill="url(#kgDiscoveryGlow)"
                        pointerEvents="none"
                      />
                    )}

                    {/* Peer node - filled circle. */}
                    <circle
                      data-kg-peer
                      cx={p.x}
                      cy={p.y}
                      r={PEER_RADIUS}
                      fill={accent}
                      fillOpacity={0.9}
                      style={{ transformOrigin: `${p.x}px ${p.y}px`, transformBox: 'fill-box' }}
                    />

                    {/* Identity strip below the peer - Tier + Ed25519 prefix. */}
                    <text
                      x={p.x}
                      y={p.y + PEER_RADIUS + 12}
                      textAnchor="middle"
                      fill={accent}
                      fillOpacity={0.85}
                      style={{ font: '600 9px ui-monospace, SFMono-Regular, monospace', letterSpacing: '0.08em' }}
                    >
                      {p.tier}
                    </text>
                    <text
                      x={p.x}
                      y={p.y + PEER_RADIUS + 24}
                      textAnchor="middle"
                      fill="rgb(148 163 184)"
                      fillOpacity={0.6}
                      style={{ font: '500 8px ui-monospace, SFMono-Regular, monospace' }}
                    >
                      {p.id}
                    </text>
                  </g>
                );
              })}

              {/* Gossip orbs - three travelling pulses on the mesh. */}
              {ORBIT_EDGES.map((_, idx) => (
                <circle
                  key={`orb-${idx}`}
                  data-kg-orb={idx}
                  r={3.2}
                  fill="rgb(110 231 183)"
                  fillOpacity={0.95}
                  opacity={0}
                />
              ))}

              {/* Bootstrap node - deprecated by Phase 6, drawn faded
                  and dotted to communicate "scaffolding only". */}
              <g data-kg-bootstrap opacity={0}>
                <circle
                  cx={62}
                  cy={335}
                  r={9}
                  fill="rgba(15, 23, 42, 0.7)"
                  stroke="rgb(148 163 184)"
                  strokeOpacity={0.55}
                  strokeWidth={1}
                  strokeDasharray="3 2"
                />
                <text
                  x={62}
                  y={358}
                  textAnchor="middle"
                  fill="rgb(148 163 184)"
                  fillOpacity={0.7}
                  style={{ font: '600 8px ui-monospace, SFMono-Regular, monospace', letterSpacing: '0.08em' }}
                >
                  BOOTSTRAP
                </text>
              </g>

              {/* Legend (top-right) - the kg_node types each peer
                  stores in its slice of the shared semantic graph. */}
              <g transform="translate(580 18)" opacity={0.85}>
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
