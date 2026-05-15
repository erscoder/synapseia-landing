// Dedicated download page. Mirrors `/docs` route convention: server
// component shell that composes the existing client leaves. The
// landing keeps its in-flow `RunNode` band intact - this page is an
// alternative entry point so visitors can deep-link or share the
// clean `synapseia.network/downloads` URL.
import type { Metadata } from 'next';
import { Nav } from '@/components/landing/Nav.client';
import { RunNode } from '@/components/landing/RunNode.client';
import { Footer } from '@/components/landing/Footer.client';
import { JsonLd } from '@/components/JsonLd';

const TITLE = 'Download Synapseia Node - synapseia.network';
const DESCRIPTION =
  'Download the Synapseia node desktop app for macOS, Windows, and Linux. One-click install, wallet baked in, automatic updates.';
const PATH = '/downloads';

// schema.org SoftwareApplication payload. Maps to the actual download
// page content (cross-platform desktop binary, free to run). `offers`
// price=0 signals the binary itself is gratis; rewards/staking economics
// are out of scope for the rich-result snippet. `publisher` references
// the root layout's Organization via `@id` instead of inlining a
// duplicate.
import { ORG_ID } from '../layout';

const DOWNLOADS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Synapseia Node',
  description:
    'Desktop app to run a Synapseia operator node on macOS, Windows, or Linux.',
  url: 'https://synapseia.network/downloads',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: ['macOS', 'Windows', 'Linux'],
  publisher: { '@id': ORG_ID },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    url: PATH,
    siteName: 'Synapseia Network',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function DownloadsPage() {
  return (
    <div className="relative min-h-screen text-white">
      <JsonLd data={DOWNLOADS_SCHEMA} />
      <Nav />
      <main className="pt-24">
        <RunNode />
      </main>
      <Footer />
    </div>
  );
}
