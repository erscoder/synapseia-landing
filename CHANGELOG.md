# Changelog - @synapseia/landing

## [2026-05-10] fix(landing): remove 'Intelligence compounds.' pull-quote (67fd1c9)

The big bold pull-quote at the end of HowItWorks was AI-pitch
filler. The supporting line right below already carries the idea
without the marketing flourish.

## [2026-05-10] fix(landing): remove Network Topology section + WorldMap (8473490)

The Network Topology band rendered a static world map with sample
nodes that implied a live mesh which doesn't yet exist. Removed the
section, the `WorldMap.client.tsx` component, the
`landing-nodes-sample.ts` fixture, and dropped the `d3-geo`,
`topojson-client`, `world-atlas`, and matching type deps since
nothing else in the landing consumed them.

## [2026-05-10] fix(landing): drop AI-style em dashes + simplify Hero CTAs (f049471)

`Hero.client.tsx` collapses the three CTAs (Open Dashboard, How it
works, Docs) down to a single primary button: How it works. Drops
the now-unused `next/link` and `DASHBOARD_URL` imports.

Em dashes (U+2014) replaced with hyphens or proper punctuation
across all landing components and the app pages. Em dashes are an
AI-writing tell; the design now reads as plain editorial copy.

## [2026-05-10] fix(landing): drop duplicate Tier summary cards (b39c75b)

The 3-card "Laptop / Workstation / Datacenter" row that sat below
the 6-column Tier spectrum repeated the same capability bullets
the spectrum already covered column-by-column. Removed the cards,
the scanline overlay, and the unused `TIER_LABELS`, `scrambleText`,
and `svg.createDrawable` animation paths. The section keeps the
intro paragraph, the spectrum, and the staking footnote.

## [2026-05-10] fix(landing): declare d3-geo + topojson-client + world-atlas as direct deps (161b7ed)

CF Pages build was failing with `Module not found` for d3-geo,
topojson-client, and world-atlas. The WorldMap migration to the
upstream `world-atlas` npm package landed without committing the
matching `package.json` change. Local pnpm workspace install
hoisted them transitively which masked the gap; CF runs
`npm install` on the standalone sub-repo and only resolves direct
deps, so the build crashed at the `WorldMap.client.tsx` imports.

Same root cause as reviewer-lesson **P13** (`require()` runtime
without the dep declared in `package.json`).

## [2026-05-10] feat(landing): mobile burger menu with animated drawer (7f3bfc6)

`Nav.client.tsx` collapses to a burger button below the `md`
breakpoint and expands to a full-screen drawer on tap. The burger
morphs to an X via CSS rotate; the drawer fades in via anime.js
with the link list staggered up at 60ms intervals.

Closes on link click, on backdrop click, on ESC, and locks body
scroll while open. ARIA wired: `aria-expanded`, `aria-controls`,
`aria-modal=true`, `role="dialog"`, `sr-only` label on the toggle.
Reduced-motion path collapses the entrance to instant via the
`useAnime` scope `mediaQueries` branch. The drawer stays mounted
during the exit animation so the close transition completes before
unmounting.

## [2026-05-10] feat(landing): native KG peer-mesh visual + WhyNow band + drop pptx imagery (e970506)

Replaces the remaining bolted-on PowerPoint screenshots with native
SVG/JSX components built from the actual Synapseia architecture as
described in the project corpus (NotebookLM-sourced specs against
WHITEPAPER, How-It-Works, architecture-diagram).

**KnowledgeGraph (`components/landing/KnowledgeGraph.client.tsx`)**

Rebuilt around the "sharded across the swarm" thesis: six operator
peer hexagons (T0–T5) with per-peer kg_node slices (DISEASE,
PROTEIN, GENE, COMPOUND, PATHWAY, DISCOVERY), eight curved
GossipSub mesh edges, three travelling gossip orbs on sampled
edges, and one faded dotted bootstrap node in the corner to
communicate Phase-6 deprecation. Each peer carries a Tier label
plus an Ed25519 prefix; T4/T5 host DISCOVERY nodes with an emerald
glow. Heartbeat halo pulses on every peer (offscreen-paused via
`onScroll`). Mini legend in the top-right keys colour to kg_node
type. Replaces the prior icosahedron-projection visual which read
as decorative noise rather than communicating sharding.

**HowItWorks Compounding Loop (`components/landing/HowItWorks.client.tsx`)**

Removed the `<CompoundingLemniscate />` SVG that wasn't reading
correctly in production. The Compounding Loop subsection now uses
the chip-stack flow and pull-quote only.

**WhyNow band (`components/landing/WhyNow.client.tsx`, new)**

3-stat row (10–15 yrs / $2.6 B / 90%) with anime.js count-ups +
ALS callout. Replaces the previous `problem-stats.png` pasted slide.
Pure native SVG/text, integrates with the section's `prefers-
reduced-motion` scope.

**HardwareTiers (`components/landing/HardwareTiers.client.tsx`)**

Added a 6-column Tier 0–5 spectrum table with graduated cyan/
emerald/fuchsia accents and per-tier multiplier count-ups. The
three simplified summary cards remain below.

**TrainingTracks (`components/landing/TrainingTracks.client.tsx`)**

SVG connector serpentine 1→2→3→6→5→4 with a soft pulse on each
card and three particles flowing along the connector path.

**OpenVerifiable (`components/landing/OpenVerifiable.client.tsx`)**

Replaced emoji glyphs with monoline SVG icons (open-padlock /
chain / shield-key / globe-mesh) that line-draw on view. Card
titles decode via `scrambleText`. Copy switched from "Open source"
to "Source-available" with explicit FSL-1.1 mention; the network
is public but not OSI-OSS, this is now correctly stated.

**Hero (`components/landing/Hero.client.tsx`)**

Dropped the `splitText` per-character word-deploy gimmick that was
fighting `bg-clip-text` gradients (chars inherit `color:transparent`
but not the `background-image`, so the title disappeared). Now a
soft fade-up on the whole `<h1>` with the tagline trailing 200 ms
behind and the CTAs cascading at 400 ms.

**WorldMap (`components/landing/WorldMap.client.tsx`)**

Migrated from a hand-rolled topojson slice (now-deleted
`lib/world-atlas.ts`) to the upstream `world-atlas` npm package,
keeping the d3-geo equirectangular pipeline. Pulses, particles,
and node entrance loops now scope to `onScroll` so they pause when
the section is offscreen instead of ticking forever.

**Cta (`components/landing/Cta.client.tsx`)**

Copy: "Built in the open" → "Built in public" with FSL-1.1
attribution underneath, matching the OpenVerifiable correction.

**Misc**

- `app/page.tsx` mounts the new `WhyNow` band between Hero and HowItWorks.
- `RunNode.client.tsx` keeps the magnetic hover + click ripple from S5;
  no behavioural change in this slice.

## [2026-05-09] feat(landing): anime.js v4 motion across all leaves (S3-S13) + a11y pass (d3e77fa)

Slices S3-S13 of the redesign in a single commit. Every leaf now
uses the `createScope`-based `useAnime` hook from S2, branches on
`prefers-reduced-motion` via the scope mediaQueries, and ships an
SSR-friendly initial state so there is no hydration flash.

**Per-leaf motion**:

- **Hero**: `splitText` chars + spring entrance, tagline fade-up
  trailing 600ms.
- **WorldMap**: continents line-draw, nodes scale-in spring,
  edges line-draw stagger 40ms, ambient pulse loop on every
  node, and 10 motion-path data-flow particles. Pulse +
  particle loops are gated on `autoplay: onScroll(...)` so they
  pause when the section is offscreen.
- **HowItWorks**: per-stage scroll-linked slide-up (y only;
  opacity owned by the surrounding `Reveal` wrappers — no
  flicker), plus a sliding StageNav active indicator that
  follows the `activeStage` state.
- **TrainingTracks**: 3×2 grid sweep on view.
- **KnowledgeGraph**: text + cards stagger reveal.
- **OpenVerifiable**: text + 4 bullet cards reveal trailing
  200ms.
- **HardwareTiers**: 3 tier cards spring sweep on view.
- **EarnBand**: count-up on `71,918 SYN/day` bound to `onScroll`;
  skipped (and SSR value kept) if the section is already in view
  at mount.
- **RunNode + Cta**: magnetic hover + click ripple on the four
  platform tiles, spring scale-on-hover on the primary CTA. All
  listeners early-return under reduced-motion and clean up via
  `cleanups[]` returned from the scope `add()` callback.
- **Footer**: 30 deterministic SVG stars with a twinkle loop
  bound to `onScroll` for offscreen pause.

**`hooks/useAnime.ts` touch-up** (from the S2 reviewer pass):
generic widened from `T extends HTMLElement` to `T extends
Element` so SVG refs bind without a cast. The `cb` parameter is
re-typed via a non-optional `UseAnimeCallback` so consumers
destructure `self.matches` without a strict-null footgun.

**A11y pass (S13)**: skip-to-content link in `app/layout.tsx`,
`<main id="main" tabIndex={-1}>` landmark in `app/page.tsx`,
`aria-hidden` on Hero's decorative scroll-cue, and five
`animate-bounce` / `animate-pulse` usages across Hero, HowItWorks
(3×), and EarnBand gated by `motion-safe:` so reduced-motion
users see static decorations.

Reviewer over the batch found 0 BLOCKER, 2 HIGH (loops without
offscreen pause), 2 MEDIUM (SSR flicker on EarnBand and
HowItWorks); all four applied before commit. `tsc --noEmit`
clean, `pnpm run build` green, 4 static routes prerender.

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
