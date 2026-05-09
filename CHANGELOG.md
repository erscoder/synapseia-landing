# Changelog — @synapseia/landing

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
