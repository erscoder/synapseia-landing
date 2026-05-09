// Motion design tokens for the Synapseia landing. Every leaf
// component that animates with anime.js imports its constants
// from here. Touch this file if you want to globally tune the
// snap/feel of the page; touch a leaf if you want to tune one
// specific section.

import { spring, cubicBezier } from 'animejs';

export const DURATION = {
  micro: 220,    // hover / click microinteractions
  short: 480,    // entrance fades, single-property reveals
  medium: 720,   // hero text, splitText stagger floor
  long: 1100,    // multi-step timelines, scroll-pinned reveals
  ambient: 1800, // continuous loops (pulses, gradient drifts)
} as const;

export const EASE = {
  // Default snap — used for almost everything that isn't physics.
  snap: 'outExpo' as const,
  // Authoritative entry — slower deceleration.
  authoritative: 'outQuart' as const,
  // Sticky / settle.
  settle: 'inOutCirc' as const,
  // Custom bezier kept here so it lives next to the named eases.
  hero: cubicBezier(0.16, 1, 0.3, 1),
  // Reserved for CTA scale, accordion height, slider thumbs.
  spring: spring({ stiffness: 220, damping: 14 }),
  // Softer spring — counter values, ambient bounces.
  springSoft: spring({ stiffness: 140, damping: 18 }),
} as const;

export const STAGGER = {
  fast: 20,    // splitText chars from center
  base: 60,    // typical reveal stagger
  slow: 120,   // grid sweeps, distant elements
} as const;

// Single source of truth for the reduced-motion media query string.
// Pass directly into createScope({ mediaQueries: { reduceMotion: REDUCED_MOTION_QUERY } }).
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
