# Synapseia Landing

Marketing site for [`synapseia.network`](https://synapseia.network)
apex. Static Next.js export.

Pre-launch — coord is not deployed yet. Every "live" surface
(Network Status counters, Run-a-Node downloads, Connect-my-Agent
CTAs, footer ticker) is rendered as **Coming soon**. Five-stage
narrative + 3D node graph + WebGL space background stay so the
page communicates what Synapseia does and how it works.

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

## Stack

- Next.js 16 (App Router, static export)
- React 19
- Three.js (WebGL background + node graph)
- Tailwind CSS v4
- TypeScript
