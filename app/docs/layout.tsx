// Server layout for the /docs route segment. Client components cannot
// export `metadata`; the route-segment layout is the standard escape
// hatch. Route-segment layouts override inherited root metadata for
// matched paths, so /docs gets its own title, description, canonical
// URL, and OG card while the page stays client (for its scroll-spy).
import type { Metadata } from 'next';

const TITLE = 'Docs - Synapseia Network';
const DESCRIPTION =
  'Operator and developer documentation for the Synapseia Network: how the protocol works, how to run a node, work-order types, rewards, and on-chain integration.';
const PATH = '/docs';

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
  return <>{children}</>;
}
