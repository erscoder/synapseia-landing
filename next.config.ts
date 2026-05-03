import type { NextConfig } from 'next';

/**
 * Static export targeted at Cloudflare Pages.
 *
 * `output: 'export'` produces a `out/` dir of plain HTML/CSS/JS that
 * any CDN can serve. Cloudflare Pages picks it up via
 * `wrangler pages deploy out`.
 *
 * - `images.unoptimized: true` because the static export has no
 *   Image Optimization API server.
 * - `productionBrowserSourceMaps` for Lighthouse "Best Practices".
 *   The landing is small enough that the `.map` payload is
 *   trivial.
 *
 * Web presence only — no Three.js, no Solana adapter, no live
 * coord fetches. When the network ships, hero CTAs + live
 * counters re-land via the dashboard route group, NOT here.
 */
const nextConfig: NextConfig = {
  output: 'export',
  productionBrowserSourceMaps: true,
  images: {
    unoptimized: true,
  },
  // Three.js ships untranspiled ESM that Next can't resolve through
  // the pnpm symlink layout without an explicit transpile pass —
  // same workaround the dashboard uses for `globe.gl`.
  transpilePackages: ['three'],
};

export default nextConfig;
