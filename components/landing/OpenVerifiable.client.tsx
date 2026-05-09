'use client';
import { useRef } from 'react';
import { Reveal, G } from './Reveal.client';
import {
  animate,
  scrambleText,
  stagger,
  svg,
  utils,
  useAnime,
} from '@/lib/anime';

// Inline monoline SVG icons - open padlock / chain / shield-key /
// globe-mesh. Authored simple so svg.createDrawable's stroke-dash
// line-draw reads cleanly.
const ICONS = [
  // Open padlock - source-available
  <path key="lock" data-ov-path d="M7 11 V8 a5 5 0 0 1 10 0 M5 11 h14 v10 H5z" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />,
  // Chain links - Solana on-chain
  <path key="chain" data-ov-path d="M9 14 a4 4 0 0 1 0-4 l2-2 a4 4 0 0 1 5.6 5.6 l-1 1 M15 10 a4 4 0 0 1 0 4 l-2 2 a4 4 0 0 1-5.6-5.6 l1-1" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />,
  // Shield with keyhole - Ed25519 signatures
  <path key="shield" data-ov-path d="M12 3 l8 3 v6 c0 5-3.5 8-8 9-4.5-1-8-4-8-9 V6 z M12 11 v3 M12 11 a1.4 1.4 0 1 0 0-2.8 a1.4 1.4 0 0 0 0 2.8z" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />,
  // Globe with mesh - CRDT consensus
  <path key="globe" data-ov-path d="M12 3 a9 9 0 1 0 0 18 a9 9 0 0 0 0-18 M3 12 h18 M12 3 c3 3 3 15 0 18 M12 3 c-3 3-3 15 0 18" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />,
] as const;

const CARDS = [
  { icon: 0, title: 'Source-available',  body: 'Node agent, desktop UI, and Solana programs are public under FSL-1.1 (Apache-2.0 in 2028). Read the code, run a node, audit the protocol.', tone: 'text-purple-300' },
  { icon: 1, title: 'Solana on-chain',   body: 'SYN is an SPL token. Stakes, claims, and discovery commitments land on Solana; timestamps cannot be rewritten.',                          tone: 'text-blue-300'   },
  { icon: 2, title: 'Ed25519 everywhere', body: 'Every analysis, every peer review, every shard ownership grant is signed by an operator pubkey with a 60s replay window.',                  tone: 'text-emerald-300'},
  { icon: 3, title: 'CRDT consensus',    body: 'Leaderboards, ownership state, and reviews converge via conflict-free replicated data types: no quorum round-trips, no central authority breaks ties.', tone: 'text-cyan-300'   },
] as const;

// Signature gesture: each card's monoline icon line-draws on view,
// then the card title decodes via scrambleText. Replaces emoji
// glyphs with semantically-loaded SVG marks (lock, chain, shield,
// globe) - communicates the security/openness story visually,
// not just typographically.
export function OpenVerifiable() {
  const rootRef = useRef<HTMLElement>(null);

  useAnime<HTMLElement>(rootRef, (self) => {
    const root = rootRef.current;
    if (!root) return;
    const { reduceMotion } = self.matches;
    if (reduceMotion) return;

    const drawables = svg.createDrawable('[data-ov-path]');
    const drawAnim = animate(drawables, {
      draw: ['0 0', '0 1'],
      delay: stagger(120),
      duration: 900,
      ease: 'inOutSine',
      autoplay: false,
    });
    const titleAnim = animate('[data-ov-title]', {
      innerHTML: scrambleText({ chars: 'lowercase' }),
      duration: 480,
      delay: stagger(120, { start: 600 }),
      ease: 'linear',
      autoplay: false,
    });

    let played = false;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !played) {
        played = true;
        drawAnim.play();
        titleAnim.play();
        io.disconnect();
      }
    }, { threshold: 0.25 });
    io.observe(root);

    return () => {
      io.disconnect();
      utils.remove('[data-ov-path]');
    };
  });

  return (
    <section ref={rootRef} className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 font-mono mb-4">PUBLIC &amp; VERIFIABLE</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Nothing happens off the record</h2>
            <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Every action on the network is signed, gossipped, and
              replayable. No private servers in the data path, no
              hidden moderation, source-available code under FSL-1.1.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CARDS.map(({ icon, title, body, tone }) => (
              <G key={title} className="p-5">
                <div className={`mb-3 ${tone}`}>
                  <svg viewBox="0 0 24 24" className="w-7 h-7">{ICONS[icon]}</svg>
                </div>
                <div data-ov-title className="text-sm font-semibold text-white mb-1">{title}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{body}</p>
              </G>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
