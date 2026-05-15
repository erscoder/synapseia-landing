import type { Metadata } from 'next';
import Script from 'next/script';
import { JsonLd } from '@/components/JsonLd';
import './globals.css';

// schema.org Organization payload for the homepage. Stable `@id`
// (`#org` fragment) lets every other JSON-LD block reference this
// Organization instead of inlining a duplicate Organization node —
// otherwise a strict parser sees three anonymous Organizations and
// can't merge them.
//
// `sameAs` is intentionally empty: `github.com/erscoder` is a user
// profile, not an org page, and pointing there would violate
// schema.org's requirement that `sameAs` URLs unambiguously identify
// the same entity. There is no live X/Twitter handle either. An
// empty array is honest; a fabricated one risks a manual action.
export const ORG_ID = 'https://synapseia.network/#org';

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Synapseia Network',
  url: 'https://synapseia.network',
  logo: 'https://synapseia.network/synapseia-logo.png',
  description:
    'A peer-to-peer network of GPUs running LLM inference, evaluation, and knowledge-graph hosting. Secured by Solana, owned by its operators.',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://synapseia.network'),
  title: 'Synapseia Network - Decentralized AI compute',
  description:
    'A peer-to-peer network of GPUs running LLM inference, evaluation, and knowledge-graph hosting. Secured by Solana, owned by its operators.',
  icons: { icon: '/favicon.ico' },
  // Relative canonical so Next resolves it through `metadataBase`. Keeps
  // canonical + sitemap `<loc>` byte-aligned for every route and avoids
  // re-hardcoding the origin in four files (reviewer P28).
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Synapseia Network',
    description: 'Decentralized AI compute for autonomous research.',
    type: 'website',
    url: '/',
    siteName: 'Synapseia Network',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Synapseia Network',
    description: 'Decentralized AI compute for autonomous research.',
  },
};

/**
 * Root layout. Cosmic backdrop now comes from `globals.css`
 * (radial gradients + sparse starfield) - pure CSS, no WebGL.
 * Three.js was removed in slice S1.5 of the landing redesign.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <JsonLd data={ORG_SCHEMA} />
        {/* Skip-to-content link - first focusable element so keyboard
            users can bypass the fixed nav and the decorative hero
            motion. Visually hidden until focused. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-blue-500/90 focus:text-white focus:font-semibold focus:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
        >
          Skip to content
        </a>
        <div className="relative z-10">{children}</div>
        {/* Umami analytics - cookieless, no PII, salted-IP hashing.
            Loaded with `afterInteractive` strategy so it never blocks
            paint. See /privacy for the data we record. */}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="7536f31c-ba22-48b9-8958-e38608a9620f"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
