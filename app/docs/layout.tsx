// Server layout for the /docs route segment. Client components cannot
// export `metadata`; the route-segment layout is the standard escape
// hatch. Route-segment layouts override inherited root metadata for
// matched paths, so /docs gets its own title, description, canonical
// URL, and OG card while the page stays client (for its scroll-spy).
import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';

const TITLE = 'Docs - Synapseia Network';
const DESCRIPTION =
  'Operator and developer documentation for the Synapseia Network: how the protocol works, how to run a node, work-order types, rewards, and on-chain integration.';
const PATH = '/docs';

// schema.org TechArticle payload. Headline/description reuse the same
// constants as the Metadata export so the JSON-LD never drifts from the
// <title> / <meta description> Google indexes. `author` / `publisher`
// reference the root layout's Organization via `@id` instead of
// inlining a duplicate Organization node.
import { ORG_ID } from '../layout';

const DOCS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: TITLE,
  description: DESCRIPTION,
  url: 'https://synapseia.network/docs',
  inLanguage: 'en',
  author: { '@id': ORG_ID },
  publisher: { '@id': ORG_ID },
};

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'article',
    url: PATH,
    siteName: 'Synapseia Network',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={DOCS_SCHEMA} />
      {children}
    </>
  );
}
