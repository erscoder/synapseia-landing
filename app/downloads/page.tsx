// Dedicated download page. Mirrors `/docs` route convention: server
// component shell that composes the existing client leaves. The
// landing keeps its in-flow `RunNode` band intact - this page is an
// alternative entry point so visitors can deep-link or share the
// clean `synapseia.network/downloads` URL.
import type { Metadata } from 'next';
import { Nav } from '@/components/landing/Nav.client';
import { RunNode } from '@/components/landing/RunNode.client';
import { Footer } from '@/components/landing/Footer.client';

const TITLE = 'Download Synapseia Node - synapseia.network';
const DESCRIPTION =
  'Download the Synapseia node desktop app for macOS, Windows, and Linux. One-click install, wallet baked in, automatic updates.';
const PATH = '/downloads';

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
      <Nav />
      <main className="pt-24">
        <RunNode />
      </main>
      <Footer />
    </div>
  );
}
