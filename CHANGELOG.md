# Changelog - @synapseia/landing

## [2026-05-14] chore(downloads): bump NODE_UI_VERSION 0.8.40 -> 0.8.41 (cda33fc)

Sync with node-ui-v0.8.41 GitHub release assets. Ships the
Start/Stop button in LogsPanel + auto-respawn after CLI
self-update + the npm publish workflow fix (patch-package now
runs after `--ignore-scripts` install). 0.8.39 and 0.8.40 npm
publishes failed (patch-package guard missed); 0.8.41 is the
first successful npm publish after 0.8.38.

## [2026-05-14] chore(downloads): bump NODE_UI_VERSION 0.8.39 -> 0.8.40 (f7991b3)

Sync with node-ui-v0.8.40 GitHub release assets. Ships the
Tauri `bootstrap.js` spawn fix that finally activates the
bigint-buffer warning filter on every platform.

## [2026-05-14] chore(downloads): bump NODE_UI_VERSION 0.8.38 -> 0.8.39 (86bbfa8)

Sync with node-ui-v0.8.39 GitHub release assets. Ships the cloud
LLM API key env-var fallback (node CLI now resolves the key from
`NVIDIA_API_KEY` etc. when `--llm-key` is missing) plus the
SettingsPanel revisit-dots fix.

## [2026-05-14] chore(downloads): bump NODE_UI_VERSION 0.8.37 -> 0.8.38 (4a48a90)

Sync with node-ui-v0.8.38 GitHub release assets. Ships the
Windows bigint-buffer warning suppression: the
`bigint: Failed to load bindings, pure JS will be used (try npm
run rebuild?)` line no longer leaks into the SettingsPanel toast
when Windows operators save their cloud LLM config.

## [2026-05-14] chore(downloads): bump NODE_UI_VERSION 0.8.36 -> 0.8.37 (e451fb0)

Sync with node-ui-v0.8.37 GitHub release assets. Ships the NVIDIA
NIM persistence fix: CLI `--set-model` regex now accepts
multi-slash modelIds like `nvidia/meta/llama-3.3-70b-instruct`,
so operators selecting NVIDIA NIM tiers on Mac, Windows, or Linux
no longer see the Settings panel silently revert to default Ollama
on save.

## [2026-05-14] chore(downloads): bump NODE_UI_VERSION 0.8.35 -> 0.8.36 (dca2029)

Sync with node-ui-v0.8.36 GitHub release assets. Ships the Windows
cloud-LLM persistence fix: Settings panel now correctly persists
provider + model + API key in Tauri ui-settings.json AND injects
LLM_CLOUD_* env vars into every spawned CLI process, so operators
selecting NVIDIA NIM (or any cloud provider) on Windows no longer
silently revert to default Ollama on save.

## [2026-05-14] chore(downloads): bump NODE_UI_VERSION 0.8.34 -> 0.8.35 (0d67afc)

Sync with node-ui-v0.8.35 GitHub release assets. Ships the Windows
nvidia-smi hang hotfix to operators clicking the download tiles on
synapseia.network.

## [2026-05-14] feat(run-node): Terminal mode install card for power users (13d0dda)

Adds a muted slate card at the end of the Run a Node download section
showing the npm CLI install path for operators who prefer the terminal:
`npm install -g @synapseia-network/node` followed by `synapseia start`.
Includes a Node.js 22+ prereq note and a link to the node repo README
for the full CLI reference.

Placement is intentional. The card sits last in the visual hierarchy,
after the 3 desktop tiles, the NVIDIA NIM info card, and the macOS
code-signing warning. The 90 percent non-technical operator audience
sees the one-click desktop path first; the 10 percent CLI users scroll
to find their flow without friction. Styling is muted slate (no green
or amber) so the code block does not compete with the primary CTA.

## [2026-05-14] feat(run-node): NVIDIA NIM info block + inline brand mark (76a7aed)

Emerald-tinted card under the download tiles tells operators without a
local GPU to pick NVIDIA NIM (free) as their LLM provider after
install, with a link to register at build.nvidia.com for a personal
nvapi-... key (~5,000 free credits/month). Inline NVIDIA eye logo
(Simple Icons CC0) makes the value prop visually obvious without
implying any partnership relationship.

Copy is intentionally scoped: NIM covers the research / review LLM
path only; training and docking work orders still run locally and
need a GPU. Avoids the over-claim that any laptop without hardware
can earn through the network.

## [2026-05-13] fix(landing): KG nodes no longer drift to top-left after paint (9213d4c)

anime.js v4 `scale` animation was overwriting the SVG `transform`
attribute on each `<g data-kg-node>`, clobbering the `translate(x y)`
that placed the node. All 22 nodes collapsed to (0,0) on tick 1.

Fix: split into an outer `<g transform="translate(x y)">` for static
position + an inner `<g data-kg-node>` for the scale animation. anime
only touches the inner element now, so the outer translate survives.

## [2026-05-12] feat(privacy): GDPR/CCPA privacy policy + Umami cookieless analytics

Adds a standard long-form privacy policy at `/privacy` covering
GDPR, UK GDPR, and CCPA: data controller, what we collect (Umami
cookieless analytics, Cloudflare access logs, node telemetry,
contact data), legal basis, retention windows, sub-processors
(Cloudflare, Umami, Fly.io, GitHub, Solana RPC), international
transfers, user rights, CCPA, security, children, contact at
support@erslabs.net. Footer gains a discreet Privacy Policy
link beside the GitHub button. Root layout loads Umami via
`next/script` with `afterInteractive` strategy so it never blocks
paint and runs on every route. No cookies, no PII, salted-IP
country derivation - CNIL-compliant without a consent banner.

## [2026-05-11] chore(downloads): bump NODE_UI_VERSION 0.8.12 → 0.8.13 (a125a89)

Sync with the node-ui 0.8.13 release (README rewrite + CI Node 24
base shipped via node 0.8.13).

## [2026-05-11] chore(downloads): bump NODE_UI_VERSION 0.8.11 → 0.8.12 (6e58efc)

Sync with the node-ui 0.8.12 release (WeakMap iteration on the
`@libp2p/utils` `onProgress` patch shipped via node 0.8.12). CF
Pages Function and `RunNode.client.tsx` template asset filenames
against 0.8.12.

## [2026-05-11] chore(downloads): bump NODE_UI_VERSION 0.8.10 → 0.8.11 (8e29c14)

Sync with the node-ui 0.8.11 release that bundles the
`@libp2p/utils` `onProgress` guard patch (node 0.8.11 ships the
fix; node-ui auto-installs that node CLI). CF Pages Function and
`RunNode.client.tsx` now template asset filenames against 0.8.11.

## [2026-05-10] chore(downloads): bump NODE_UI_VERSION 0.8.8 → 0.8.10 (944170a)

Skips 0.8.9 (superseded same-day by the 0.8.10 security
hardening on the auto-download Node v22 path: SHA256 verify,
runtime mutex, macOS quarantine cleanup). CF Pages function
asset filename now templates against 0.8.10.

## [2026-05-10] chore(downloads): bump NODE_UI_VERSION 0.8.7 → 0.8.8 (c83fa35)

Sync with the node-ui 0.8.8 release that fixes the
`@synapseia/node` (legacy bin) collision blocking the boot-time
auto-install on machines that had the pre-rename package
globally installed. CF Pages function asset filename now
templates against 0.8.8.

## [2026-05-10] chore(downloads): bump NODE_UI_VERSION 0.8.6 → 0.8.7 (0f822d1)

Sync with the node-ui 0.8.7 release that adds boot-time
auto-install of the @synapseia-network/node CLI. Bumped the two
constants that template the asset filename for the CF Pages
Function redirect: `RunNode.client.tsx` and
`functions/download/[platform].js`.

## [2026-05-10] fix(landing): drop Hero scroll chevron + simplify Cta docs CTA (8ac0d91)

- Hero: removed the bouncing chevron-down at the bottom of the
  hero section. It was purely decorative and the page already has
  a clear visible 'How it works' button + the rest of the layout.
- Cta: 'Read the docs ->' becomes just 'Docs', dropping the
  trailing arrow svg.

## [2026-05-10] fix(landing): shrink WhyNow stat numbers to fit on one line (63fc3c0)

Stats in the "Drug discovery has collapsed" band were sized
`text-5xl sm:text-6xl` which wrapped `$2.6 B` onto two lines on
narrow viewports. Dropped to `text-3xl sm:text-4xl` and added
`whitespace-nowrap` so the value + symbol always stay together
on one line.

## [2026-05-10] fix(landing): drop Pool Share column + move GitHub to footer + drop date (f7da15e)

EarnBand: removed the redundant `Effective Pool Share` column from
the tier table. The multiplier column already conveys the same
information.

Nav: removed the GitHub link from the desktop nav and the mobile
drawer.

Footer: dropped the `© 2026` date and added a GitHub icon link
(Lucide `Github`) pointing at `github.com/synapseia-network/node`
so the repo is still one click away.

## [2026-05-10] feat(landing): swap EarnBand emoji icons for lucide-react (90cea7a)

Replaces the WhatsApp-style emoji glyphs (🧠 🚀 🔬 ⚡ 🎯 🧬) in the
"How nodes earn money" grid with stroked Lucide icons (Brain,
Rocket, Microscope, Zap, Target, Dna). Each card carries a
type-specific tone class so the row reads as a graduated palette
rather than a random emoji set.

`lucide-react` added as a direct dep so CF Pages picks it up;
tree-shakes per-icon for minimal bundle impact.

## [2026-05-10] chore(downloads): bump NODE_UI_VERSION 0.8.5 → 0.8.6 (83ea951)

Lockstep update with the node-ui 0.8.6 security release. CF Pages
Function templates the asset filename for the GitHub
`releases/latest/download/<filename>` redirect — bump must precede
the landing remote push so the deploy matches the new release.

## [2026-05-10] feat(landing): KG redrawn as semantic graph with typed nodes + edges (67e55e3)

Replaces the peer-mesh visual with the actual semantic graph.
22 typed nodes across DISEASE / PROTEIN / GENE / COMPOUND / PATHWAY
/ DISCOVERY, wired by 22 edges labelled per the
SynapseIA-How-It-Works edge taxonomy: TREATS, ENCODES,
BIOMARKER_OF, BINDS, UPREGULATES, VALIDATES, BUILDS_ON,
DERIVED_FROM.

Layout follows the biomedical scope: ALS / Alzheimer's /
Parkinson's / BRCA1 cancer along the top, their associated
proteins (SOD1, TDP-43, Tau, Aβ, α-synuclein, BRCA1) below,
encoding genes (SOD1, MAPT, APP, SNCA, BRCA1) below those,
pathways (Mitochondrial, Glutamate, Apoptosis) and compounds
(Riluzole, Edaravone, L-DOPA) ringing the diseases, and two
DISCOVERY nodes that VALIDATE / BUILD_ON / DERIVED_FROM the
relations. Each edge carries its relation label so a viewer can
map it back to a real kg_edge row. DISCOVERY nodes carry a soft
glow + heartbeat halo paused offscreen via onScroll.

Dropped: the peer hexagons / mesh / bootstrap node / per-peer
halo machinery. The cards below the diagram still describe
SHARDING / GOSSIPSUB / BOOTSTRAP in prose so the visual can focus
on the graph itself.

## [2026-05-10] fix(landing): KG peers as filled circles + legend + node GitHub link (b1cecad, 7ea0b48)

- KnowledgeGraph peers redrawn as small (r=9) filled circles
  instead of larger hexagons with an inner kg_node triangle.
  Removed the intra-peer triangle, kg_edges, and the hexPath
  helper. T4/T5 emerald peers keep the radial discovery glow;
  halo heartbeat scaled down to match the smaller peer radius.
  Entrance: peers scale-in -> mesh edges line-draw -> bootstrap
  fades.
- Mesh edges are now straight lines instead of quadratic curves
  (reads as direct gossip routes rather than orbital arcs).
- Restored the kg_node type legend (top-right of the SVG) to key
  DISEASE / PROTEIN / GENE / COMPOUND / PATHWAY / DISCOVERY to
  colour for the cards below.
- Nav GitHub link now points to `github.com/synapseia-network/node`
  (the actual node software repo) instead of the landing repo.

## [2026-05-10] feat(landing): turn HowItWorks stages into a tabbed switcher (245a9e7)

Stages 1-5 used to render as five stacked sections; the StageNav
scrolled between them. The component is now a tab switcher: only
the active stage renders, and clicking a tab swaps the panel with
a soft crossfade (opacity + 12 px slide) via anime.js. The
Compounding Loop subsection sits below the tabbed area and stays
always-visible.

Each stage was extracted into a `Stage1..Stage5` sub-component to
keep the switcher render trivial. Hash deep-links still work on
mount (`#stage-3` lands on Paper Analysis). Reduced-motion path
collapses the crossfade to instant via the `useAnime` `mediaQueries`
branch.

Dropped: the per-stage IntersectionObserver that drove
`activeStage`, the per-stage `onScroll` slide-up entrance, and the
StageNav's `scrollIntoView` click handler - all moot now that only
one panel is in the DOM at a time.

## [2026-05-10] chore(downloads): bump NODE_UI_VERSION 0.8.3 → 0.8.5 (d3d869e)

Aligns the download proxy filenames + the visible version chip on
`/downloads` with the latest node-ui release. Bumped two constants:
`components/landing/RunNode.client.tsx` and
`functions/download/[platform].js`. Both must match the real
release tag — the Cloudflare Pages Function templates the asset
filename, so a stale version yields a silent 404 from the GitHub
`releases/latest/download/<filename>` redirect.

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
