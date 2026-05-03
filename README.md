# Synapseia Landing

Marketing site for [`synapseia.network`](https://synapseia.network)
apex. Static Next.js export deployable to **Cloudflare Pages**.

Web presence only — no dashboard CTAs, no "run a node" buttons,
no live network counters. Coord is not deployed yet, so the live
data sections were intentionally removed. When the network ships,
that surface returns via the dashboard route group, NOT here.

## Local dev

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Production build

```bash
pnpm build        # → out/  (static HTML/CSS/JS)
```

`output: 'export'` in `next.config.ts`. No Node server, no API
routes, no middleware. Plain HTML/CSS/JS.

## Deploy to Cloudflare Pages

One-time:

```bash
pnpm exec wrangler login
pnpm exec wrangler pages project create synapseia-landing \
  --production-branch main
```

Production:

```bash
pnpm deploy
# = pnpm build && pnpm exec wrangler pages deploy out \
#     --project-name=synapseia-landing
```

### Custom domain — `synapseia.network` apex

After first deploy:

1. CF dashboard → **Pages** → `synapseia-landing` → **Custom
   domains** → **Set up a custom domain**.
2. Enter `synapseia.network`. Cloudflare prompts to add CNAME
   flattening on the apex; accept.
3. SSL provisions automatically.

Subdomains (`app.synapseia.network`, `coord.synapseia.network`)
remain on their own deployments — the landing only owns the apex.

## Stack

- Next.js 16 (App Router, static export)
- React 19
- Tailwind CSS v4
- TypeScript

No Three.js, no Solana adapters, no live coord fetches. Cosmic
background is pure CSS (radial gradients + sparse starfield).
