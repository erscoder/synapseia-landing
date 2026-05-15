// Static sitemap generator. Next 16's static export emits this as
// `out/sitemap.xml`. Update the route list whenever a new top-level
// route is added under `app/`.
import type { MetadataRoute } from 'next';

// Defensive on Next 16 `output: 'export'`: tells Next this route is
// fully static so it can be emitted at build time even without
// PPR / ISR config.
export const dynamic = 'force-static';

// Apex URL form must match the home page's emitted canonical
// (`<link rel="canonical" href="https://synapseia.network"/>` —
// Next strips the trailing slash when resolving `'/'` against
// `metadataBase`). Sitemap `<loc>` and canonical MUST be
// byte-identical or Google treats them as separate URLs.
const ORIGIN = 'https://synapseia.network';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: ORIGIN,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${ORIGIN}/docs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${ORIGIN}/downloads`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${ORIGIN}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
