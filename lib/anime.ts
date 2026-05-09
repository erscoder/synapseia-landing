// Convenience barrel for landing motion code. Leaves can import
// every motion primitive plus the design tokens from a single
// path: `import { animate, stagger, EASE, DURATION, useAnime } from '@/lib/anime'`.
//
// `svg` and `utils` are anime.js namespaces (default re-exports
// pull in the namespace object); leaves access them as
// `svg.morphTo(...)` / `utils.random(...)`.

export {
  animate,
  createTimeline,
  stagger,
  utils,
  onScroll,
  splitText,
  scrambleText,
  svg,
  easings,
  spring,
  cubicBezier,
} from 'animejs';
export type { JSAnimation, Timeline, Scope, ScrollObserver } from 'animejs';

export { useAnime } from '@/hooks/useAnime';
export { DURATION, EASE, STAGGER, REDUCED_MOTION_QUERY } from '@/lib/motion';
