'use client';
import { useRef } from 'react';
import { Reveal, G } from './Reveal.client';
import {
  animate,
  utils,
  onScroll,
  useAnime,
  stagger,
  DURATION,
  EASE,
  STAGGER,
} from '@/lib/anime';

// node-ui release version reflected on the download band. Bump
// alongside the matching constant in
// `functions/download/[platform].js` (the Cloudflare Pages Function
// that proxy-streams the binary from synapseia.network). The function
// hits github.com/erscoder/synapseia-node-ui/releases/latest/download
// upstream - keep filenames in sync with the latest published tag.
const NODE_UI_VERSION = '0.8.45';

// Same-origin proxy routes (Cloudflare Pages Function). The browser
// stays on synapseia.network during download; the binary streams
// through the worker, no GitHub UI flash, no jump in the URL bar.
const RELEASE_DMG_ARM64 = '/download/mac-arm64';
const RELEASE_DMG_X64 = '/download/mac-x64';
const RELEASE_MSI = '/download/windows';
const RELEASE_APPIMAGE = '/download/linux';

// Fallback link to the GitHub release page (manual download, all
// platforms, release notes). Kept in the footer for power users.
const RELEASES_PAGE = 'https://github.com/erscoder/synapseia-node-ui/releases/latest';

export function RunNode() {
  // Scope root for anime.js. All selectors below are scoped to this
  // section, so the magnetic-hover + ripple wiring is leak-free
  // across App Router navigation.
  const root = useRef<HTMLDivElement>(null);

  useAnime<HTMLDivElement>(root, (self) => {
    const { reduceMotion } = self.matches;

    const buttons = utils.$('[data-platform-btn]') as unknown as HTMLElement[];

    // On-view reveal of the platform tiles. The outer <Reveal> already
    // CSS-fades the grid container; this stagger layers a subtle
    // per-button slide so the tiles don't all snap in at once. Skipped
    // (instant) under reduced-motion. Opacity is owned by the parent
    // <Reveal>; we animate only y to avoid stuck-invisible tiles when
    // onScroll fails to fire.
    animate(buttons, {
      y: reduceMotion ? 0 : [16, 0],
      delay: reduceMotion ? 0 : stagger(STAGGER.base),
      duration: reduceMotion ? 0 : DURATION.short,
      ease: EASE.snap,
      autoplay: onScroll({ target: root.current!, enter: 'bottom-=80 top' }),
    });

    // Reduced-motion: skip magnetic + ripple entirely. No listeners
    // registered, so cursor over a button is identical to a normal
    // <a> tag.
    if (reduceMotion) return;

    // Magnetic hover + click ripple. Each button gets its own
    // pointermove/pointerleave/pointerdown handlers; we collect them
    // in `cleanups` so the scope's revert path can drop them. anime.js
    // `scope.revert()` cancels animations but not raw listeners, so
    // returning a cleanup is required to avoid leaks across navigation.
    const cleanups: Array<() => void> = [];

    buttons.forEach((btn) => {
      const onMove = (e: PointerEvent) => {
        const rect = btn.getBoundingClientRect();
        // Translate towards cursor, capped at 6 px on either axis.
        const dx = (e.clientX - rect.left - rect.width / 2) * 0.18;
        const dy = (e.clientY - rect.top - rect.height / 2) * 0.18;
        const x = utils.clamp(dx, -6, 6);
        const y = utils.clamp(dy, -6, 6);
        animate(btn, { x, y, duration: DURATION.micro, ease: EASE.snap });
      };

      const onLeave = () => {
        animate(btn, { x: 0, y: 0, duration: DURATION.short, ease: EASE.spring });
      };

      const onDown = (e: PointerEvent) => {
        // Build a span for the ripple inside the button. The button
        // itself stays a clickable <a>; the ripple is purely cosmetic
        // and pointer-events:none so it never swallows the click.
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('span');
        ripple.className = 'pointer-events-none absolute rounded-full bg-white/40';
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        // Ensure the button is a positioning container for the ripple.
        const prevPos = btn.style.position;
        const prevOverflow = btn.style.overflow;
        if (!prevPos) btn.style.position = 'relative';
        if (!prevOverflow) btn.style.overflow = 'hidden';
        btn.appendChild(ripple);

        animate(ripple, {
          scale: [0, 3],
          opacity: [0.6, 0],
          duration: DURATION.medium,
          ease: EASE.snap,
          onComplete: () => {
            ripple.remove();
          },
        });
      };

      btn.addEventListener('pointermove', onMove);
      btn.addEventListener('pointerleave', onLeave);
      btn.addEventListener('pointerdown', onDown);

      cleanups.push(() => {
        btn.removeEventListener('pointermove', onMove);
        btn.removeEventListener('pointerleave', onLeave);
        btn.removeEventListener('pointerdown', onDown);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  });

  return (
    // DOWNLOAD - beta binaries live. node-ui release CI publishes
    // DMG / MSI / AppImage on every `node-ui-v*` tag. Tiles below
    // link to GitHub `releases/latest/download/<file>` so the
    // newest tag always serves; bump NODE_UI_VERSION at top of
    // file when filenames change.
    <section ref={root} className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 font-mono mb-4">
              DOWNLOAD
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Run a Node</h2>
            <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Desktop app for macOS, Windows, and Linux. One-click install, wallet baked in,
              automatic updates. Pick your platform below.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {/* macOS */}
            <a href={RELEASE_DMG_ARM64} download className="group" data-platform-btn>
              <G className="p-6 text-center hover:border-white/10 hover:bg-white/[0.05] transition-all cursor-pointer">
                <svg className="w-10 h-10 mx-auto mb-3 text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-sm font-semibold text-white mb-1">macOS</div>
                <div className="text-xs text-slate-500">Apple Silicon (.dmg)</div>
              </G>
            </a>

            {/* Windows */}
            <a href={RELEASE_MSI} download className="group" data-platform-btn>
              <G className="p-6 text-center hover:border-white/10 hover:bg-white/[0.05] transition-all cursor-pointer">
                <svg className="w-10 h-10 mx-auto mb-3 text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                </svg>
                <div className="text-sm font-semibold text-white mb-1">Windows</div>
                <div className="text-xs text-slate-500">x64 Installer (.msi)</div>
              </G>
            </a>

            {/* Linux */}
            <a href={RELEASE_APPIMAGE} download className="group" data-platform-btn>
              <G className="p-6 text-center hover:border-white/10 hover:bg-white/[0.05] transition-all cursor-pointer">
                <svg className="w-10 h-10 mx-auto mb-3 text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.368 1.884 1.43.199.025.398.003.596-.07.646-.27 1.108-.675 1.108-1.346 0-.034-.003-.069-.01-.1.655-.015 1.348-.265 1.594-.87.7-1.635-.174-3.596-.294-4.62-.06-.51-.083-1.009.017-1.24.058-.155.154-.241.297-.338.552-.333.835-.591.953-.984.023-.09.04-.183.04-.273 0-.016 0-.032-.002-.045H21.8a.42.42 0 00.045-.207c-.038-.375-.247-.685-.494-.934-.169-.17-.375-.31-.595-.43-.173-.102-.22-.189-.233-.337-.016-.165-.016-.451.037-.744.052-.293.111-.63.111-.982 0-.147-.014-.298-.043-.453a4.096 4.096 0 00-.666-1.584 5.166 5.166 0 00-.745-.822c-.03-.027-.052-.046-.085-.065-.128-.09-.261-.186-.39-.241a.94.94 0 00-.392-.082c-.032 0-.065.003-.097.007a3.234 3.234 0 00-.283-.394c-.437-.528-1.161-.807-2.119-.807-.437 0-.92.075-1.454.228a.42.42 0 00-.095-.002c-.054-.22-.241-.46-.656-.553-.362-.084-.633-.141-.927-.176a1.5 1.5 0 01-.085-.01c-.123-.015-.25-.03-.378-.03-.138 0-.277.015-.392.06-.333.136-.479.372-.55.653-.152-.008-.304-.012-.455-.012-.17 0-.34.01-.506.033-.437-.14-.925-.21-1.418-.21-.507 0-1.026.087-1.49.306-.37.165-.693.414-.853.724-.082.164-.122.337-.122.512 0 .083.009.167.027.249a.42.42 0 00-.156.139c-.328.497-.363.98-.293 1.42.065.402.236.743.404.99-.012.021-.024.044-.032.065-.183.486.07.95.309 1.3.157.224.293.39.293.39s-.149.069-.293.194c-.209.174-.403.51-.403 1.123 0 .33.055.606.13.831a7.223 7.223 0 01-.172.263 4.404 4.404 0 01-.16.187L6.06 13.8c-.367.39-.612 1.008-.625 1.754-.007.37.057.735.194 1.07.137.333.35.63.647.853.248.198.544.35.877.44.28.077.583.116.906.116h.002a5.45 5.45 0 001.033-.112z"/>
                </svg>
                <div className="text-sm font-semibold text-white mb-1">Linux</div>
                <div className="text-xs text-slate-500">x64 AppImage</div>
              </G>
            </a>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="text-center text-slate-600 text-xs mt-6">
            Also available: <a href={RELEASE_DMG_X64} download className="text-slate-500 hover:text-white transition-colors underline underline-offset-2 inline-block" data-platform-btn>macOS Intel (.dmg)</a>
            {' '}· <a href={RELEASES_PAGE} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors underline underline-offset-2">release notes</a>
          </p>
          <div className="max-w-2xl mx-auto mt-6 p-4 rounded-lg bg-[#76b900]/5 border border-[#76b900]/30">
            <div className="flex items-center gap-2 mb-1.5">
              {/* NVIDIA eye mark, nominative use (we direct users to register
                  at build.nvidia.com to obtain their own personal API key). */}
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="#76b900"
                aria-label="NVIDIA"
              >
                <path d="M8.948 8.798v-1.43a6.7 6.7 0 0 1 .424-.018c3.922-.124 6.493 3.374 6.493 3.374s-2.774 3.851-5.75 3.851c-.398 0-.787-.062-1.157-.185v-4.346c1.528.185 1.837.857 2.747 2.385l2.04-1.714s-1.491-1.952-4-1.952a6.247 6.247 0 0 0-.797.05m0-4.732v2.138l.424-.025c5.45-.185 9.01 4.47 9.01 4.47s-4.086 4.964-8.332 4.964c-.379 0-.733-.037-1.078-.099v1.321c.29.037.59.062.913.062 3.955 0 6.81-2.018 9.578-4.408.46.37 2.337 1.265 2.728 1.66-2.632 2.207-8.762 3.982-12.247 3.982-.335 0-.658-.024-.98-.06v1.85h15v-16zm0 10.396v1.13c-3.65-.65-4.667-4.456-4.667-4.456s1.756-1.948 4.668-2.26v1.236h-.005c-1.526-.185-2.72 1.244-2.72 1.244s.671 2.418 2.724 3.106M2.484 9.913s2.166-3.21 6.46-3.532V5.21C4.184 5.59 0 9.617 0 9.617s2.37 6.862 8.94 7.487v-1.235c-4.82-.611-6.456-5.956-6.456-5.956"/>
              </svg>
              <span className="text-xs font-semibold tracking-wide" style={{ color: '#76b900' }}>
                NVIDIA NIM, research LLM, free
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              No local GPU? Pick <span className="font-mono" style={{ color: '#76b900' }}>NVIDIA NIM (free)</span> in the node setup screen for the research / review LLM path. Register at{' '}
              <a href="https://build.nvidia.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80" style={{ color: '#76b900' }}>build.nvidia.com</a>{' '}
              to get a personal API key (~5,000 free credits/month). Training and docking work orders still run locally. Use a node with a GPU for those.
            </p>
          </div>
          <div className="max-w-2xl mx-auto mt-4 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <p className="text-xs text-amber-300/80 font-semibold mb-1">macOS users</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              The app is not yet code-signed. If macOS says {'"'}damaged and can&apos;t be opened{'"'}, run this in Terminal after installing:
            </p>
            <code className="block mt-2 text-xs text-slate-400 bg-black/30 rounded px-3 py-2 font-mono select-all">
              sudo xattr -cr &quot;/Applications/Synapseia Node.app&quot;
            </code>
          </div>
          <div className="max-w-2xl mx-auto mt-4 p-4 rounded-lg bg-slate-500/5 border border-slate-500/20">
            <p className="text-xs text-slate-300 font-semibold mb-1">Terminal mode</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Prefer the CLI? Install the npm package directly. Headless-friendly, scriptable, drops the desktop shell.
            </p>
            <pre className="block mt-2 text-xs text-slate-300 bg-black/30 rounded px-3 py-2 font-mono whitespace-pre overflow-x-auto select-all">
{`npm install -g @synapseia-network/node
synapseia start`}
            </pre>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Requires Node.js 22+. Full CLI reference on the{' '}
              <a
                href="https://github.com/erscoder/synapseia-node#readme"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white underline underline-offset-2"
              >
                node repo README
              </a>.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
