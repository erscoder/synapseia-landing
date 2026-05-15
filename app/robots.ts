// Static robots.txt generator. Next 16's static export emits this as
// `out/robots.txt`. Open policy + sitemap pointer.
//
// `/_next/` intentionally NOT disallowed: blocking the hashed JS/CSS
// chunks can break Googlebot's rendering signals (Mobile-Friendly
// Test, Lighthouse) without gaining anything — there are no HTML
// pages under `/_next/` for crawlers to index anyway.
import type { MetadataRoute } from 'next';

// Defensive on Next 16 `output: 'export'`: tells Next this route is
// fully static so it can be emitted at build time even without
// PPR / ISR config.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://synapseia.network/sitemap.xml',
    host: 'https://synapseia.network',
  };
}
