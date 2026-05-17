# Changelog - @synapseia/landing

## [2026-05-17] chore(downloads): bump all platforms to node-ui-v0.8.64 (4ac1213)

Lockstep with sub node-ui 0.8.64 (4 assets verified live: Mac
arm64/x64 DMG, Linux AppImage, Windows MSI).

## [2026-05-17] chore(downloads): bump all platforms to node-ui-v0.8.63 (aa7cd06)

Lockstep with sub node-ui 0.8.63 (4 assets uploaded: Mac arm64/x64
DMG, Linux AppImage, Windows MSI).

## [2026-05-16] chore(downloads): bump all platforms to node-ui-v0.8.61 (db809ed)

`NODE_UI_VERSION` + Cloudflare Pages download function bumped to
match `node-ui-v0.8.61` release (4 assets uploaded: Mac arm64/x64
DMG, Linux AppImage, Windows MSI). Lockstep with sub node
`ea7e5684` (docking apt/dnf lock retry, plan-parse INFO → WARN).

## [2026-05-16] chore(downloads): bump all platforms to node-ui-v0.8.60 (df835cd)

`NODE_UI_VERSION` + Cloudflare Pages download function bumped
0.8.59 → 0.8.60.

## [2026-05-16] chore(downloads): bump all platforms to node-ui-v0.8.59 (1d15934)

`NODE_UI_VERSION` + Cloudflare Pages download function bumped
0.8.58 → 0.8.59.

## [2026-05-16] chore(downloads): bump all platforms to node-ui-v0.8.58 (9fa9b44)

`NODE_UI_VERSION` + Cloudflare Pages download function bumped
0.8.56 → 0.8.58. Skipped 0.8.57 in the landing because that
release was superseded by 0.8.58 within minutes (0.8.58 added
CRITICAL BIP44 mnemonic fix and keystore-aware `syn export-key`).

## [2026-05-16] chore(downloads): bump all platforms to node-ui-v0.8.56 (148130d)

`NODE_UI_VERSION` + Cloudflare Pages download function bumped
0.8.55 → 0.8.56.

## [2026-05-16] chore(downloads): bump all platforms to node-ui-v0.8.55 (67ee0d7)

`NODE_UI_VERSION` + Cloudflare Pages download function bumped
0.8.54 → 0.8.55 so `synapseia.network/download/<platform>` redirects
to the new GH release assets
(`Synapseia.Node_0.8.55_*.{dmg,msi,AppImage}`).

## [2026-05-16] chore(downloads): bump all platforms to node-ui-v0.8.54 (300fdc5)

`NODE_UI_VERSION` constant in `components/landing/RunNode.client.tsx`
+ Cloudflare Pages Function `functions/download/[platform].js`
bumped 0.8.53 → 0.8.54 so the landing's `/download/<platform>`
redirect filenames match the new GitHub release assets
(`Synapseia.Node_0.8.54_*.{dmg,msi,AppImage}`). Without this bump,
the redirect would 404 on the upstream filename.

Pairs with node-ui release `node-ui-v0.8.54` (assets up at
github.com/erscoder/synapseia-node-ui/releases/tag/node-ui-v0.8.54).

## [2026-05-16] feat(nav): shared header across all routes; current route swapped for Home (45932b8)

Every landing route now renders the same `<Nav />` chrome. The
`/docs` page used to ship its own inline `<nav>` element with a
"Documentation" sub-badge and a "← Home" link; that drifted from the
shared nav across release cycles and let users land on a page where
the menu still contained a no-op link to itself.

Behaviour: `/` → `[Docs, Download, Dashboard]`, `/docs` →
`[Home, Download, Dashboard]`, `/downloads` →
`[Home, Docs, Dashboard]`, anything else → `[Home, Docs, Download,
Dashboard]`. `Nav.client.tsx` derives the link set per `usePathname()`
inside a pure `linksFor()` switch; both desktop and the mobile drawer
share the same `links` array. Static export pre-renders each route
with the correct pathname so the filtered nav is in the initial HTML
(no FOWC, crawler-safe).

`app/docs/page.tsx` lost its hand-rolled `<nav>` and orphan
`next/link` / `next/image` imports.

## [2026-05-16] feat(docs): plain-markdown view at /docs.md + "View as Markdown" link (6fc63fc)

Slice 4 (final) of the SEO + AI-search hardening pass.
`https://synapseia.network/docs.md` now serves a plain GitHub-
flavoured-markdown rendering of the docs page (257 lines, 15.6 KB).
Two audiences: developers / operators who curl the page or paste it
into an LLM context window, and AI agents grounding queries against
the site. Mirrors Google's own `<page>.md.txt` convention from
`developers.google.com/.../ai-optimization-guide.md.txt`.

A small "View as Markdown" pill link sits below the docs intro
paragraph (`app/docs/page.tsx`, `lucide-react` `FileText` icon,
same border/bg tokens used elsewhere).

Source-of-truth tradeoff documented in the markdown header: this is
currently a hand-mirrored copy of `app/docs/page.tsx`. Full MDX
source-of-truth migration is out of scope for this slice; if the two
drift, file an issue. Reviewer (`superpowers:code-reviewer`) softened
the original "Until MDX lands" language to remove an undeliverable
promise (P10) and confirmed content parity + accessibility.

## [2026-05-16] feat(seo): JSON-LD structured data for Organization, TechArticle, SoftwareApplication (16b66f9)

Slice 3 of the SEO + AI-search hardening pass. Per Google's official
guidance, schema.org is for rich-result eligibility — NOT "AI feed"
markup. Types added here map 1:1 to actual on-page content.

- `/` (root layout): `Organization` block with stable `@id:
  https://synapseia.network/#org`. Logo, description, no `sameAs`
  (honest empty: no canonical org page to point at).
- `/docs`: `TechArticle` referencing the root Organization by `@id`
  for `author` and `publisher`.
- `/downloads`: `SoftwareApplication` with
  `applicationCategory: DeveloperApplication`,
  `operatingSystem: [macOS, Windows, Linux]`,
  `publisher: { @id: ORG_ID }`,
  `offers: { price: '0', priceCurrency: 'USD' }` (binary is free).

Shared helper `components/JsonLd.tsx` emits one
`<script type="application/ld+json">` per call and escapes
`</script>` in stringified output.

Reviewer round fixed a 404 in the footer along the way: the GH link
pointed at `github.com/synapseia-network/node` (that org doesn't
exist); corrected to the actual repo remote
`github.com/erscoder/synapseia-node`. The `sameAs` field that
originally listed the maintainer's user profile was dropped — schema
requires `sameAs` URLs to unambiguously identify the same entity, and
a personal profile doesn't.

## [2026-05-16] fix(seo): one h2 per landing block + stage panels as h3 (81ae5c6)

Slice 2 of the SEO + AI-search hardening pass. Heading outline is
what AI agents parse from the accessibility tree first; a duplicate
h2 in the same conceptual block confuses both Google's outline
algorithm and assistive tech.

Before: HowItWorks rendered two `<h2>` elements ("How a research
cycle runs today" + "The Compounding Loop") inside the same engine
wrapper, and every stage panel header (Stage1-5, via the shared
`SH` helper in `Reveal.client.tsx`) was also `<h2>`.

After: the engine wrapper is now `<section id="engine"
aria-labelledby="how-it-works-title">` with the matching
`<h2 id="how-it-works-title">`. "The Compounding Loop" demoted to
`<h3>`. `SH` helper renders `<h3>`.

Final outline on `out/index.html`: 1× h1 (Hero), 9× h2 (one per
landing block), 2× h3 (currently-active stage panel + Compounding
Loop). Tailwind classes preserved on both demoted headings, zero
visual regression. Reviewer (`superpowers:code-reviewer`) confirmed
`aria-labelledby` referential integrity and balanced JSX tags.

## [2026-05-16] feat(seo): per-route metadata + sitemap.xml + robots.txt (3a72253)

Slice 1 of the SEO + AI-search hardening pass driven by Google's
official guidance
(https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).
AEO/GEO is not a separate discipline; AI Overviews + AI Mode reuse
the classic Search ranking systems, so the high-leverage fixes are
the same ones that improve regular SEO.

Per-route metadata via route-segment layouts + page exports:

- `/` — root `app/layout.tsx` gains `metadataBase`, relative
  canonical, OG `siteName`, Twitter `summary_large_image` card.
- `/docs` — new `app/docs/layout.tsx` server file. The page itself
  stays `'use client'` for scroll-spy, but the layout owns the title,
  description, canonical, OG, and Twitter card. Before the fix, `/docs`
  inherited the root metadata, so every search engine saw the home
  title on the docs page.
- `/downloads` and `/privacy` — existing metadata enhanced with
  relative canonical, OG `siteName`, and Twitter cards.

Discovery files:

- `app/sitemap.ts` — emits `out/sitemap.xml` with the four routes.
  Apex `<loc>` is `https://synapseia.network` (no trailing slash) to
  match the home page's emitted canonical byte-for-byte; Next strips
  the trailing slash when resolving `'/'` against `metadataBase`,
  and Google treats `synapseia.network` and `synapseia.network/` as
  different URLs in a sitemap context.
- `app/robots.ts` — emits `out/robots.txt`. Open policy + sitemap
  pointer + host. No `Disallow: /_next/` — blocking those chunks
  breaks Googlebot's rendering signals without buying any indexing
  protection (no HTML lives there).

Reviewer round (`superpowers:code-reviewer`) flagged a root canonical
vs sitemap byte-mismatch, a missing Twitter card on the apex, and
hardcoded origin literals across four files. All addressed inside the
same slice; only follow-up left is `og:image` (needs a 1200x630 design
asset).

Follow-up slices:
- Slice 2: outline / `<h2>` cleanup in `HowItWorks.client.tsx`.
- Slice 3: JSON-LD structured data (Article on `/docs`,
  SoftwareApplication on `/downloads`).
- Slice 4: `/docs.md` markdown view via MDX source-of-truth.

## [2026-05-15] chore(downloads): bump NODE_UI_VERSION to 0.8.53 (9e84464)

`RunNode.client.tsx` + `functions/download/[platform].js` now
point at the `node-ui-v0.8.53` GitHub release assets:

- `Synapseia.Node_0.8.53_aarch64.dmg`  (mac-arm64)
- `Synapseia.Node_0.8.53_x64.dmg`      (mac-x64)
- `Synapseia.Node_0.8.53_x64_en-US.msi` (windows)
- `Synapseia.Node_0.8.53_amd64.AppImage` (linux)

Auto-deploys via Cloudflare Pages on push.

## [Unreleased]

### Changed
- Sync LoRA per-WO reward copy 7,500 -> 5,000 SYN in `app/docs/page.tsx` (two occurrences: detailed "LoRA training" section + summary list). Mirrors coord `WORK_ORDER_REWARD_SYN[LORA_TRAINING]` reduction in `packages/coordinator/src/domain/constants.ts:24`. Other work-order reward amounts (CPU/GPU/DiLoCo/docking/inference) untouched.

## [2026-05-15] chore(downloads): bump NODE_UI_VERSION 0.8.51 -> 0.8.52 (48b54a7)

Both `components/landing/RunNode.client.tsx` and
`functions/download/[platform].js` now template against
`node-ui-v0.8.52` GitHub Release assets:

- mac-arm64 → `Synapseia.Node_0.8.52_aarch64.dmg`
- mac-x64   → `Synapseia.Node_0.8.52_x64.dmg`
- windows   → `Synapseia.Node_0.8.52_x64_en-US.msi`
- linux     → `Synapseia.Node_0.8.52_amd64.AppImage`

Landing tracks the desktop UI release that decouples the auto-update
freshness check from coord `/version` (lockstep with node-ui
`f67ba91`).

## [2026-05-15] chore(downloads): bump NODE_UI_VERSION 0.8.50 -> 0.8.51 (622912a)

Hotfix carries:
- node `437775bf` syn start honours `SYNAPSEIA_WALLET_PASSWORD`
  env on the keystore branch (Tauri start_node contract).
- node `ea561e75` wallet-verify drops legacy cascade when
  keystore exists.
- node-ui `ae30c63` UnlockScreen labels the field "Vault
  passphrase" with helper copy referencing the keystore.

Together: node-ui 0.8.51 unlock + start are end-to-end clean
when the operator types the vault passphrase.

## [2026-05-15] chore(downloads): bump NODE_UI_VERSION 0.8.49 -> 0.8.50 (44664b8)

Carries three node fixes to every new operator download:
- node `f9544ba0` wallet-verify keystore-first (node-ui unlock
  now works with vault passphrase).
- node `188d0258` staking-cli `COORDINATOR_URL` defaults to the
  official coord + prepends user SYN ATA create when missing.
- node `d033a614` `constants/programs.ts` central + README
  keystore docs.

## [2026-05-15] chore(downloads): bump NODE_UI_VERSION 0.8.48 -> 0.8.49 (ee359a5)

Carries the node `79a45084` staking-cli keystore migration +
`85d71759` self-updater prefix fix to every new operator
download. `syn stake / unstake / claim` now use the vault
passphrase (not the legacy wallet.json password) and the
auto-update no longer loops when the binary is installed in a
non-default npm prefix.

## [2026-05-15] chore(downloads): bump NODE_UI_VERSION 0.8.47 -> 0.8.48 (fdd84cf)

Carries the node `782ee914` persistent `rpcUrl` config + devnet
default to every new operator download. `syn config` now persists
the operator's chosen RPC (Helius / QuickNode / private node) so
they don't have to set `SOLANA_RPC_URL` on every shell.

## [2026-05-15] chore(downloads): bump NODE_UI_VERSION 0.8.46 -> 0.8.47 (d100e36)

Carries the node `44b43447` staking-cli mainnet RPC fallback +
`20f718f0` fresh-install keystore-only path to every new operator
download. 0.8.47 lets `syn stake N` run on a fresh pod without
`SOLANA_RPC_URL=...` and creates the keystore with a single
passphrase prompt (no legacy `wallet.json` side-by-side).

## [2026-05-15] chore(downloads): bump NODE_UI_VERSION 0.8.45 -> 0.8.46 (5a48cbf)

Carries the node `cf0577b5` canonical Ollama tag migration +
auto-pull retry, plus the coord `726c6a07` REVISITABLE_TYPES
rotation fix, to every new operator download. 0.8.45 left
operator configs stuck with `ollama/<dash-name>` slugs that the
Ollama daemon could not resolve; 0.8.46 self-heals those configs
on next boot and auto-pulls the missing model as defense.

## [2026-05-15] chore(downloads): bump NODE_UI_VERSION 0.8.44 -> 0.8.45 (68ec540)

Carries the `a0bb328d` wizard + migration + catalog fix to every
new operator download. `syn config` on 0.8.44 wrote bare catalog
names (e.g. `qwen2.5-coder-14b`) into `config.defaultModel` with
no `ollama/` prefix; migration on next boot rewrote them to
`anthropic/claude-sonnet-4-6` and refused to start with
`Cloud model … requires --llm-key`. 0.8.45 patches all three
layers (wizard, migration, catalog tag overrides).

## [2026-05-15] chore(downloads): bump NODE_UI_VERSION 0.8.42 -> 0.8.44 (00da6f2)

`/download/{mac-arm64,mac-x64,windows,linux}` Cloudflare Pages
functions and the in-page `NODE_UI_VERSION` constant now point at
`node-ui-v0.8.44` GH release assets. Carries the Linux GPU pod
hardware-detect hotfix (sub node `1f2f8857`) to every new operator
download. Note the previous landing pin was at 0.8.42, so this also
absorbs the 0.8.43 lockstep that never landed in the download
pointer file.

## [2026-05-14] chore(downloads): bump NODE_UI_VERSION 0.8.41 -> 0.8.42 (64ca444)

Sync with node-ui-v0.8.42 GitHub release assets. Ships the
plain-ASCII boot banner fix so the operator's first impression
of the node-ui log viewer is not a wall of box-drawing mojibake.

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
