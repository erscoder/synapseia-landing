# Changelog — @synapseia/landing

## [2026-05-09] feat(landing): install anime.js v4 + motion tokens + useAnime scope hook (f878040)

Slice S2 — foundation for the motion redesign. No visible
animation yet; this slice only adds plumbing so the upcoming
S3-S12 motion slices stay short.

- `animejs@^4.4.1` runtime dep (zero transitive deps, built-in
  TS types).
- `lib/motion.ts` — `DURATION`, `EASE`, `STAGGER`,
  `REDUCED_MOTION_QUERY` tokens.
- `hooks/useAnime.ts` — generic hook wrapping `createScope` with
  `useEffect` + `revert` cleanup and the `reduceMotion` media
  query already wired.
- `lib/anime.ts` — convenience barrel re-exporting the v4 named
  API plus the motion tokens and the hook.

## [2026-05-09] feat(landing): add /downloads page + Download nav link (fc00cc1)

Mirrors the existing `/docs` route pattern. Visitors can now
deep-link to `synapseia.network/downloads` for a dedicated download
page composing `Nav` + `RunNode` + `Footer`. The in-flow `RunNode`
band on the landing stays put — this is a UX add, not a content
reshuffle. The nav gains a `Download` entry between `Docs` and
`GitHub`, reusing the ghost-link styling. Page is a server
component with SEO metadata (`title`, `description`).

## [2026-05-09] refactor(landing): drop Three.js, replace 3D NodeGraph with flat SVG world map (d160da4)

Three.js, `three-globe`, and the `NodeGraph` + `SpaceBackground`
3D components are gone. The network topology section renders a
deterministic, SSR-friendly SVG instead: hand-curated low-poly
continents path (`lib/world-atlas.ts`, ~3.6 KB raw), 25 sample
nodes plotted via a 12-line equirectangular projection helper, and
30 lines drawn between connected pairs. No motion yet — anime.js
arrives in slice S2 and the WorldMap will gain pulses, edge draw,
and data-flow particles in S4.

**Removed**:

- `components/landing/NodeGraph.tsx` (Three.js globe, ~280 LOC).
- `components/landing/SpaceBackground.tsx` (Three.js starfield,
  ~200 LOC).
- `lib/scheduleIdle.ts` — was only used by `SpaceBackground`,
  reviewer flagged as dead code.
- `three` + `@types/three` from `package.json`.
- `transpilePackages: ['three']` block + comment from
  `next.config.ts`.

**Added**:

- `lib/landing-nodes-sample.ts` — 25 nodes covering NA/EU/APAC/SA
  plus 30 edges. `SampleNode` / `SampleEdge` TS interfaces. Tier
  → Tailwind colour map documented inline
  (`cpu → fill-cyan-400`, `gpu → fill-fuchsia-500`,
  `inference → fill-emerald-400`).
- `lib/world-atlas.ts` — hand-trimmed continents SVG path for
  `viewBox 1000×500`.
- `components/landing/WorldMap.client.tsx` — pure render, no
  `useEffect`, decorative `aria-hidden`. `NetworkTopology.client.tsx`
  renders it in place of the dynamic NodeGraph import.

The CSS-only cosmic backdrop in `app/globals.css` (radial
gradients + 6-layer starfield) was already shipped and is now the
sole owner of the night-sky look.

**Bundle**: total static JS dropped from 1.3+ MB to ~735 KB
(Three.js alone was ~600 KB). `pnpm why three` returns empty for
the landing package. Dev compile clean, all 5 static pages
prerender, no warnings vs baseline.

## [2026-05-09] refactor(landing): split monolithic page.tsx into server shell + 12 client leaves (afdf0cc)

Pure structural split, regression-free. `app/page.tsx` was a 958-line
`'use client'` monolith holding the entire landing — nav, hero with
the Three.js NodeGraph, all engine stages, training tracks, hardware
tiers, earn band, downloads, footer, plus the shared `useReveal`
hook and `Reveal` wrapper. It is now a 39-line Next.js App Router
**server component** that imports 12 leaf **client components** in
document order:

```
Nav → Hero → HowItWorks → TrainingTracks → KnowledgeGraph
   → OpenVerifiable → HardwareTiers → NetworkTopology
   → EarnBand → RunNode → Cta → Footer
```

Plus `components/landing/Reveal.client.tsx` exporting the `Reveal`
wrapper, the `useReveal` hook, and three layout primitives (`G` /
`FA` / `SH`) shared across leaves.

Constants:

- `DASHBOARD_URL` moved to `lib/landing-constants.ts` (consumed by
  `Nav` + `Hero`).
- `NODE_UI_VERSION` + `RELEASE_*` stayed inside
  `RunNode.client.tsx` (single consumer).

The Three.js `NodeGraph` dynamic import keeps its
`dynamic({ ssr: false, loading })` wrapper, just relocated into
`NetworkTopology.client.tsx`. The actual teardown of Three.js (and
the swap to a flat SVG world map with anime.js-driven nodes + edges)
is a follow-up slice and is **not** part of this change.

Why split:

- Animations land at the leaf level. Each leaf can own its own
  `'use client'` boundary and its own `createScope`/`useEffect`
  lifecycle without the whole page being client-rendered.
- The page itself becomes a server component → smaller hydration
  payload, better LCP/TTFB.
- Reviewer + tests per leaf. The 958-line monolith was opaque to
  any review pass.

Verification:

- `pnpm run build` passes (Next.js 16.2.4 Turbopack, all 5 static
  pages prerender, no new warnings versus baseline).
- Byte-diff of `out/index.html` before vs after: **identical**
  (59,482 chars on both sides after stripping HTML comments and
  chunk-hash `<script>` tags).
- `pnpm run lint` fails with a pre-existing
  `@eslint/eslintrc@3.3.5/ajv` `Cannot set properties of undefined
  (setting 'defaultMeta')` error that also fails on `main`. Not
  introduced.

Three pre-existing bugs in the source were preserved verbatim per
the regression-free contract — flagged for a future copy-fix slice
but not touched here:

1. Stage 5 subtitle (`HowItWorks.client.tsx:227`) holds
   `subtitle="Analyses that average {'≥'} 8/10..."`. JSX
   string-attribute values do not interpolate `{...}` — the
   rendered HTML literally shows `{'≥'}`.
2. `TrainingTracks.client.tsx:27` neurology body uses
   `'Beyond ALS — Alzheimer&apos;s, …'` — `&apos;` inside a JS
   string literal does not decode to `'`.
3. `NODE_UI_VERSION` in `RunNode.client.tsx:10` is declared with
   CI-sync comments but never referenced by any JSX.
