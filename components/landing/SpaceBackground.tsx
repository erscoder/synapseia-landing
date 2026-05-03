'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { scheduleIdle } from '@/lib/scheduleIdle';

export function SpaceBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    // Defer the WebGL renderer + 3200-star buffer setup past first
    // paint. THREE.WebGLRenderer.setSize() is a long task that was
    // blocking ~70 ms on the critical path. Idle-scheduling moves it
    // off the FCP/LCP timeline; the canvas appears once the browser
    // is otherwise idle, which is fine because it's purely decorative.
    scheduleIdle(() => {
      if (cancelled || !mountRef.current) return;
      cleanup = initScene(mountRef.current);
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}

function initScene(mount: HTMLDivElement): () => void {
    const W = window.innerWidth;
    const H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050508, 1);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, W / H, 0.1, 3000);
    camera.position.z = 600;

    // ── Stars ───────────────────────────────────────────────
    const starCount = 3200;
    const starPos   = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starPhase = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      starPos[i*3]   = (Math.random() - 0.5) * 2400;
      starPos[i*3+1] = (Math.random() - 0.5) * 2400;
      starPos[i*3+2] = (Math.random() - 0.5) * 2400;
      starSizes[i]   = Math.random() * 1.8 + 0.4;
      starPhase[i]   = Math.random() * Math.PI * 2;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    starGeo.setAttribute('phase', new THREE.BufferAttribute(starPhase, 1));

    const starMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: [
        'attribute float size; attribute float phase; uniform float uTime; varying float vA;',
        'void main() {',
        '  vA = 0.35 + 0.65 * abs(sin(uTime * 0.7 + phase));',
        '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
        '  gl_PointSize = size * (280.0 / -mv.z);',
        '  gl_Position = projectionMatrix * mv;',
        '}',
      ].join('\n'),
      fragmentShader: [
        'varying float vA;',
        'void main() {',
        '  float d = length(gl_PointCoord - vec2(0.5));',
        '  if (d > 0.5) discard;',
        '  gl_FragColor = vec4(0.80, 0.84, 0.96, smoothstep(0.5, 0.0, d) * vA);',
        '}',
      ].join('\n'),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });    scene.add(new THREE.Points(starGeo, starMat));

    // ── Nebula clouds (canvas texture quads) ────────────────
    function makeNebulaTexture(r: number, g: number, b: number): THREE.CanvasTexture {
      const sz = 512;
      const c = document.createElement('canvas');
      c.width = c.height = sz;
      const ctx = c.getContext('2d')!;
      const cx = sz / 2;
      const grad = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx);
      grad.addColorStop(0, `rgba(${r},${g},${b},0.18)`);
      grad.addColorStop(0.4, `rgba(${r},${g},${b},0.06)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, sz, sz);
      return new THREE.CanvasTexture(c);
    }

    const nebulaData = [
      { x: -200, y: 100, z: -300, sx: 700, sy: 500, r: 60, g: 30, b: 120 },
      { x: 300, y: -150, z: -400, sx: 600, sy: 400, r: 20, g: 50, b: 130 },
      { x: 0, y: 200, z: -500, sx: 900, sy: 600, r: 40, g: 20, b: 100 },
    ];

    const nebulaPlanes: THREE.Mesh[] = [];
    nebulaData.forEach((n) => {
      const tex = makeNebulaTexture(n.r, n.g, n.b);
      const mat = new THREE.MeshBasicMaterial({
        map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(n.sx, n.sy), mat);
      mesh.position.set(n.x, n.y, n.z);
      mesh.rotation.z = Math.random() * Math.PI;
      scene.add(mesh);
      nebulaPlanes.push(mesh);
    });

    // ── Floating particles + connection lines ────────────────
    const particleCount = 70;
    const pPos = new Float32Array(particleCount * 3);
    const pVel: THREE.Vector3[] = [];
    for (let i = 0; i < particleCount; i++) {
      pPos[i*3]   = (Math.random() - 0.5) * 800;
      pPos[i*3+1] = (Math.random() - 0.5) * 600;
      pPos[i*3+2] = (Math.random() - 0.5) * 200;
      pVel.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.08,
        (Math.random() - 0.5) * 0.08,
        (Math.random() - 0.5) * 0.04,
      ));
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x4477aa, size: 2.5, transparent: true, opacity: 0.6,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Connection lines
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * particleCount * 6);
    const lineMat = new THREE.LineSegments(lineGeo,
      new THREE.LineBasicMaterial({ color: 0x2255aa, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending })
    );
    scene.add(lineMat);

    // ── Resize handler ───────────────────────────────────────
    const onResize = () => {
      const nW = window.innerWidth;
      const nH = window.innerHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    };
    window.addEventListener('resize', onResize);

    // ── Animation loop ───────────────────────────────────────
    let animId: number;
    // THREE.Clock is deprecated in r170+. Use Timer instead — it requires
    // an explicit update() call each frame before reading getElapsed().
    const timer = new THREE.Timer();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      timer.update();
      const t = timer.getElapsed();
      starMat.uniforms.uTime.value = t;

      // Update particles
      let lineIdx = 0;
      const positions3d: THREE.Vector3[] = [];
      for (let i = 0; i < particleCount; i++) {
        pPos[i*3]   += pVel[i].x;
        pPos[i*3+1] += pVel[i].y;
        pPos[i*3+2] += pVel[i].z;
        if (Math.abs(pPos[i*3])   > 400) pVel[i].x *= -1;
        if (Math.abs(pPos[i*3+1]) > 300) pVel[i].y *= -1;
        if (Math.abs(pPos[i*3+2]) > 100) pVel[i].z *= -1;
        positions3d.push(new THREE.Vector3(pPos[i*3], pPos[i*3+1], pPos[i*3+2]));
      }
      pGeo.attributes.position.needsUpdate = true;

      // Rebuild connection lines
      lineIdx = 0;
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dist = positions3d[i].distanceTo(positions3d[j]);
          if (dist < 120) {
            linePositions[lineIdx++] = positions3d[i].x;
            linePositions[lineIdx++] = positions3d[i].y;
            linePositions[lineIdx++] = positions3d[i].z;
            linePositions[lineIdx++] = positions3d[j].x;
            linePositions[lineIdx++] = positions3d[j].y;
            linePositions[lineIdx++] = positions3d[j].z;
          }
        }
      }
      lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions.slice(0, lineIdx), 3));
      lineGeo.setDrawRange(0, lineIdx / 3);
      if (lineGeo.attributes.position) lineGeo.attributes.position.needsUpdate = true;

      // Slow nebula drift
      nebulaPlanes.forEach((n, idx) => {
        n.rotation.z += 0.0001 * (idx % 2 === 0 ? 1 : -1);
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
}
