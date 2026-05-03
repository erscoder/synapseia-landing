'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// Pre-launch landing — no coord client. NodeGraph renders mock
// peers only (the original dashboard component pulled `Peer` and
// `coordinatorApi.getPeers` for live data; here both are stripped
// because the coord is not deployed yet).

interface NodeData {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number;
  isCoordinator?: boolean;
  /** true = active (colored + edges), false/undefined = inactive (gray, no edges) */
  active?: boolean;
}

function truncatePeerId(id: string): string {
  if (!id || id.length < 12) return id || 'unknown';
  return `${id.slice(0, 4)}....${id.slice(-4)}`;
}

function generateMockPeerId(): string {
  const hex = '0123456789abcdef';
  let id = '';
  for (let i = 0; i < 40; i++) id += hex[Math.floor(Math.random() * 16)];
  return id;
}

function mockNodes(): NodeData[] {
  const nodes: NodeData[] = [
    {
      id: 'coordinator',
      label: 'COORDINATOR',
      x: 0,
      y: 0,
      z: 0,
      isCoordinator: true,
      active: true,
    },
  ];
  const count = 10 + Math.floor(Math.random() * 6);
  for (let i = 0; i < count; i++) {
    const peerId = generateMockPeerId();
    // Distribute nodes in a sphere around center
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r = 80 + Math.random() * 100;
    // ~70% active, 30% inactive (gray demo)
    const active = Math.random() > 0.3;
    nodes.push({
      id: peerId,
      label: truncatePeerId(peerId),
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta) * 0.7,
      z: r * Math.cos(phi),
      active,
    });
  }
  return nodes;
}

// Logo palette — kept in sync with packages/dashboard/components/nodes/NodeGraph.tsx.
// Cyan → blue → purple is the Orbital Constellation gradient introduced 2026-04-26;
// every Network Topology surface in the product now uses the same three stops.
const LOGO_CYAN = '#22d3ee';
const LOGO_BLUE = '#3b82f6';
const LOGO_PURPLE = '#a78bfa';

function createTextSprite(text: string, isCoordinator: boolean, active: boolean): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const fontSize = isCoordinator ? 28 : 20;
  canvas.width = 256;
  canvas.height = 64;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `bold ${fontSize}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (isCoordinator) {
    ctx.fillStyle = '#cffafe'; // bright cyan tint for the coordinator label
    ctx.shadowColor = LOGO_CYAN;
    ctx.shadowBlur = 8;
  } else if (!active) {
    ctx.fillStyle = '#6b7280';
    ctx.shadowColor = '#374151';
    ctx.shadowBlur = 2;
  } else {
    ctx.fillStyle = '#e2e8f0';
    ctx.shadowColor = LOGO_BLUE;
    ctx.shadowBlur = 4;
  }
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    opacity: active || isCoordinator ? 1.0 : 0.4,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(isCoordinator ? 40 : 30, isCoordinator ? 10 : 7.5, 1);
  return sprite;
}

export function NodeGraph() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [nodeCount, setNodeCount] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;
    const W = mount.clientWidth;
    const H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
    camera.position.z = 320;

    let animId: number;

    const buildGraph = (nodes: NodeData[]) => {
      setNodeCount(nodes.length);

      const cyan = new THREE.Color(LOGO_CYAN);
      const blue = new THREE.Color(LOGO_BLUE);
      const purple = new THREE.Color(LOGO_PURPLE);
      const inactiveColor = new THREE.Color(0x4b5563);

      // Distribute peers across the gradient so the cluster reads as the
      // Orbital Constellation (cyan core, blue mid, purple edge).
      let peerIdx = 0;
      const peerPalette = [cyan, blue, purple];

      nodes.forEach((node) => {
        const isCoord = node.isCoordinator;
        const isActive = node.active !== false;
        const radius = isCoord ? 9 : 5.5;

        const sphereGeo = new THREE.SphereGeometry(radius, 24, 24);
        let nodeColor: THREE.Color;
        if (isCoord) {
          // Coordinator = brightest core (cyan→blue mid)
          nodeColor = cyan.clone().lerp(blue, 0.35);
        } else if (!isActive) {
          nodeColor = inactiveColor;
        } else {
          nodeColor = peerPalette[peerIdx % peerPalette.length].clone();
          peerIdx++;
        }
        const mat = new THREE.MeshBasicMaterial({
          color: nodeColor,
          transparent: true,
          opacity: isCoord ? 1.0 : isActive ? 0.95 : 0.4,
        });
        const mesh = new THREE.Mesh(sphereGeo, mat);
        mesh.position.set(node.x, node.y, node.z);
        scene.add(mesh);

        // Halo — same gradient stops as the dashboard NodeGraph + logo.
        // Coordinator gets a bigger, hotter halo; active peers a softer one.
        if (isCoord || isActive) {
          const haloRadius = isCoord ? 18 : 10;
          const haloGeo = new THREE.SphereGeometry(haloRadius, 16, 16);
          const haloColor = isCoord ? cyan.clone() : nodeColor.clone().lerp(purple, 0.3);
          const haloMat = new THREE.MeshBasicMaterial({
            color: haloColor,
            transparent: true,
            opacity: isCoord ? 0.22 : 0.14,
            blending: THREE.AdditiveBlending,
          });
          const halo = new THREE.Mesh(haloGeo, haloMat);
          halo.position.copy(mesh.position);
          scene.add(halo);
        }

        const label = createTextSprite(node.label, !!isCoord, isActive);
        label.position.set(node.x, node.y + (isCoord ? 16 : 11), node.z);
        scene.add(label);
      });

      // Full peer-to-peer mesh — every active node connects to every
      // other active node, including the coord. Synapseia is P2P;
      // there is no hub-and-spoke. Coord is just one of many peers
      // visually highlighted (cyan, brighter) so the topology is
      // legible, but its edges are not topologically special.
      const meshNodes = nodes.filter((n) => n.isCoordinator || n.active !== false);
      const coordEdgeVerts: number[] = []; // kept for API symmetry; empty
      const edgeVerts: number[] = [];
      for (let i = 0; i < meshNodes.length; i++) {
        for (let j = i + 1; j < meshNodes.length; j++) {
          edgeVerts.push(meshNodes[i].x, meshNodes[i].y, meshNodes[i].z);
          edgeVerts.push(meshNodes[j].x, meshNodes[j].y, meshNodes[j].z);
        }
      }

      // Helper: build LineSegments with a per-vertex gradient (cyan at the
      // coord/source end → purple at the peer/target end). Three.js
      // interpolates the colors along each segment, which gives the same
      // soft cyan→purple ramp as the 2D dashboard NodeGraph.
      const buildGradientLines = (verts: number[], startColor: THREE.Color, endColor: THREE.Color, opacity: number) => {
        if (verts.length === 0) return null;
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
        const colors = new Float32Array(verts.length);
        for (let i = 0; i < verts.length; i += 6) {
          colors[i + 0] = startColor.r; colors[i + 1] = startColor.g; colors[i + 2] = startColor.b;
          colors[i + 3] = endColor.r;   colors[i + 4] = endColor.g;   colors[i + 5] = endColor.b;
        }
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const mat = new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
        });
        return new THREE.LineSegments(geo, mat);
      };

      // Coordinator → peer edges: cyan (core) → blue (peer). Slightly
      // brighter than the peer-to-peer mesh.
      const coordLines = buildGradientLines(coordEdgeVerts, cyan, blue, 0.22);
      if (coordLines) scene.add(coordLines);

      // Peer ↔ peer edges: blue → purple.
      const peerLines = buildGradientLines(edgeVerts, blue, purple, 0.16);
      if (peerLines) scene.add(peerLines);

      // Animate orbit
      let theta = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        theta += 0.003;
        camera.position.x = Math.sin(theta) * 320;
        camera.position.z = Math.cos(theta) * 320;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
      };
      animate();
    };

    // Pre-launch — coord is not deployed. Always render the mock
    // node sphere so the visualisation reads as "live network" even
    // without a real peer set behind it. The dashboard's NodeGraph
    // pulls `coordinatorApi.getPeers(50)`; this landing variant
    // intentionally drops that call to avoid 404 spam in the console
    // and a CORS error on the apex.
    buildGraph(mockNodes());

    const onResize = () => {
      const nW = mount.clientWidth;
      const nH = mount.clientHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full h-[560px] rounded-2xl overflow-hidden backdrop-blur-md bg-white/[0.03] border border-white/[0.06]">
      <div ref={mountRef} className="w-full h-full" />
      {nodeCount > 0 && (
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-xs text-slate-300 font-mono">
          {nodeCount} nodes
        </div>
      )}
      <div className="absolute bottom-4 left-4 flex items-center gap-4 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg, #22d3ee, #3b82f6)' }} />
          Coordinator
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg, #22d3ee, #3b82f6, #a78bfa)' }} />
          Active Peer
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gray-500 opacity-40" />
          Inactive
        </span>
      </div>
    </div>
  );
}
