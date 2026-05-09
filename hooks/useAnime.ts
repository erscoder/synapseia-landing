// Boilerplate killer for anime.js v4 + Next.js client components.
// Wraps createScope, handles the useEffect lifecycle, and exposes
// the standard reduced-motion media query so every consumer
// branches uniformly.
//
// Usage:
//   const root = useRef<HTMLDivElement>(null);
//   useAnime(root, (self) => {
//     const { reduceMotion } = self.matches;
//     animate('.x', { y: [40, 0], duration: reduceMotion ? 0 : 800 });
//   });
//   return <div ref={root}>...</div>;
//
// The hook re-creates the scope on dep change (default: empty deps,
// runs once on mount) and reverts it on unmount or before the next
// run. `scope.revert()` cancels every animation/timer/scroll-observer
// the scope created and resets inline styles, so leaf components
// never leak across navigation in the App Router.

'use client';

import { useEffect, type RefObject, type DependencyList } from 'react';
import { createScope } from 'animejs';
import type { Scope } from 'animejs';
import { REDUCED_MOTION_QUERY } from '@/lib/motion';

// Public callback shape: anime.js v4 internally types this as
// `(scope?: Scope) => void` (optional), but at runtime the engine
// always invokes the callback with a non-null scope after `add()`.
// We re-type to non-optional here so consumers can destructure
// `self.matches` without a strict-null footgun. The internal wrapper
// in the effect re-bridges the shape.
export type UseAnimeCallback = (self: Scope) => void | (() => void);

// `T extends Element` (not `HTMLElement`) so SVGSVGElement / SVGGElement
// refs bind without an `as` cast. anime.js's Scope.root accepts any
// Element.
export function useAnime<T extends Element>(
  root: RefObject<T | null>,
  cb: UseAnimeCallback,
  deps: DependencyList = [],
): void {
  // StrictMode dev double-invokes effects: mount → cleanup → mount.
  // `scope.revert()` is idempotent and tears down all animations/
  // timers/scroll-observers the scope created, so the dev double-run
  // is safe and a re-mount is intentional behaviour, not a leak.
  //
  // The `cb` is deliberately NOT in the deps array by default — leafs
  // pass an arrow function inline and we don't want a new identity
  // per render to re-trigger the entrance. Pass an explicit `deps`
  // array if you need to re-run on prop change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!root.current) return;
    const scope = createScope({
      root: root.current as unknown as HTMLElement,
      mediaQueries: {
        reduceMotion: REDUCED_MOTION_QUERY,
      },
    }).add((self) => {
      // anime.js's typing makes `self` optional; at runtime it's
      // always defined post-`.add()`. Narrow it for consumers.
      if (!self) return undefined;
      return cb(self);
    });
    return () => {
      scope.revert();
    };
  }, deps);
}
