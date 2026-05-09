import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Synapseia Network — Decentralized AI compute',
  description:
    'A peer-to-peer network of GPUs running LLM inference, evaluation, and knowledge-graph hosting. Secured by Solana, owned by its operators.',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'Synapseia Network',
    description: 'Decentralized AI compute for autonomous research.',
    type: 'website',
    url: 'https://synapseia.network',
  },
};

/**
 * Root layout. Cosmic backdrop now comes from `globals.css`
 * (radial gradients + sparse starfield) — pure CSS, no WebGL.
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
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
