// Beta launch landing - coord deployed (Fly.io), dashboard live on its
// own subdomain, node-ui binaries published per release. Earlier this
// file held "Coming soon" placeholders; the download band and the
// dashboard CTAs now point at real artefacts.
//
// Server component shell. Each section is an interactive client leaf
// under `components/landing/*.client.tsx`. Composition order below
// mirrors the original monolith verbatim.
import { Nav } from '@/components/landing/Nav.client';
import { Hero } from '@/components/landing/Hero.client';
import { WhyNow } from '@/components/landing/WhyNow.client';
import { HowItWorks } from '@/components/landing/HowItWorks.client';
import { TrainingTracks } from '@/components/landing/TrainingTracks.client';
import { KnowledgeGraph } from '@/components/landing/KnowledgeGraph.client';
import { OpenVerifiable } from '@/components/landing/OpenVerifiable.client';
import { HardwareTiers } from '@/components/landing/HardwareTiers.client';
import { EarnBand } from '@/components/landing/EarnBand.client';
import { RunNode } from '@/components/landing/RunNode.client';
import { Cta } from '@/components/landing/Cta.client';
import { Footer } from '@/components/landing/Footer.client';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen text-white">
      <Nav />
      {/* `id="main"` is the target of the skip-to-content link in
          `app/layout.tsx`; `tabIndex={-1}` makes the wrapper
          programmatically focusable so the skip link actually moves
          focus. */}
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <WhyNow />
        <HowItWorks />
        <TrainingTracks />
        <KnowledgeGraph />
        <OpenVerifiable />
        <HardwareTiers />
        <EarnBand />
        <RunNode />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
