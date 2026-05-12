// Privacy policy page. Static long-form content. Reuses the
// landing Nav + Footer so the page sits inside the same chrome
// as / and /downloads. No client interactivity beyond what those
// shared components already bring.
import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/landing/Nav.client';
import { Footer } from '@/components/landing/Footer.client';

export const metadata: Metadata = {
  title: 'Privacy Policy - Synapseia Network',
  description:
    'How Synapseia Network collects, uses, and protects personal data on synapseia.network and across its desktop node app.',
};

const EFFECTIVE_DATE = '12 May 2026';
const LAST_UPDATED = '12 May 2026';
const CONTACT_EMAIL = 'support@erslabs.net';

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="text-2xl sm:text-3xl font-bold text-white mt-16 mb-4 scroll-mt-28"
    >
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-semibold text-white mt-8 mb-3">{children}</h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-slate-300 leading-relaxed mb-4 text-[15px]">{children}</p>
  );
}

function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="text-slate-300 leading-relaxed mb-4 text-[15px] space-y-2 list-disc pl-5 marker:text-slate-600">
      {children}
    </ul>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen text-white">
      <Nav />
      <main className="pt-24 px-4 sm:px-6 lg:px-10 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-slate-400 text-sm">
              Effective date: {EFFECTIVE_DATE} &middot; Last updated: {LAST_UPDATED}
            </p>
          </div>

          <P>
            This Privacy Policy explains how Synapseia Network
            (&quot;Synapseia&quot;, &quot;we&quot;, &quot;us&quot;) collects,
            uses, and protects personal data when you visit{' '}
            <Link
              href="/"
              className="text-blue-300 underline underline-offset-2"
            >
              synapseia.network
            </Link>{' '}
            (the &quot;Site&quot;) and when you run the Synapseia desktop node
            application (the &quot;Node App&quot;). It complies with the EU
            General Data Protection Regulation (GDPR), the UK GDPR, and the
            California Consumer Privacy Act (CCPA).
          </P>
          <P>
            We aim to collect as little data as possible. We do not sell or rent
            personal data. We do not use third-party advertising trackers.
          </P>

          <H2 id="controller">1. Data controller</H2>
          <P>
            The data controller responsible for processing your personal data
            is Synapseia Network. For any privacy-related question or request,
            contact us at{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-blue-300 underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </P>

          <H2 id="data-collected">2. Data we collect</H2>

          <H3>2.1 Site analytics (Umami)</H3>
          <P>
            We use Umami, a privacy-focused, cookieless analytics tool, to
            understand how the Site is used. Umami does not set cookies, does
            not use browser storage to track visitors, and does not collect
            personally identifiable information. For each page view, Umami
            records:
          </P>
          <UL>
            <li>Page URL and referrer URL.</li>
            <li>Browser, operating system, and device type.</li>
            <li>Country (derived from a salted, daily-rotated hash of the IP address - the IP itself is not stored).</li>
            <li>Anonymous session indicator (also salted and rotated daily).</li>
          </UL>
          <P>
            This information cannot, on its own, identify you as an individual.
            Because Umami operates without cookies and without persistent
            identifiers, the French data protection authority (CNIL) and
            equivalent EU regulators consider this kind of analytics exempt
            from prior consent requirements.
          </P>

          <H3>2.2 Server and infrastructure logs</H3>
          <P>
            Our hosting provider (Cloudflare) automatically records minimal
            request metadata (IP address, request URL, timestamp, user agent,
            response status) for security, abuse prevention, and basic
            reliability. These logs are retained for a short rolling window and
            are not used for profiling or advertising.
          </P>

          <H3>2.3 Downloads</H3>
          <P>
            When you download the Node App, the request is served as a
            redirect to GitHub Releases. We do not record who downloads which
            version on our side. GitHub processes the download request under
            its own privacy terms.
          </P>

          <H3>2.4 Node App</H3>
          <P>
            The Node App connects to the Synapseia coordinator to receive work
            orders and report results. When you operate a node, we process:
          </P>
          <UL>
            <li>Your node identity (Ed25519 public key).</li>
            <li>Your Solana wallet address (public on the blockchain).</li>
            <li>Operational telemetry: heartbeats, work-order submissions, peer-review scores, hardware capability flags, software version.</li>
            <li>Network metadata (IP address) required to route peer-to-peer traffic and to enforce abuse rate limits.</li>
          </UL>
          <P>
            We do NOT collect or transmit the contents of files outside the
            work-order scope, your private keys, personal documents, or any
            content unrelated to network participation.
          </P>

          <H3>2.5 Contact and support</H3>
          <P>
            If you email us, open a GitHub issue, or join our community
            channels, we process the information you choose to share (name,
            email address, message content) for the sole purpose of responding
            to you.
          </P>

          <H2 id="legal-basis">3. Legal basis for processing</H2>
          <UL>
            <li>
              <strong>Legitimate interests</strong> (GDPR Art. 6(1)(f)) -
              cookieless analytics, security logs, abuse prevention, and basic
              operation of the Site and the Node App.
            </li>
            <li>
              <strong>Contract performance</strong> (GDPR Art. 6(1)(b)) -
              issuing rewards, validating submissions, and operating the
              economic incentives of the network when you run a node.
            </li>
            <li>
              <strong>Consent</strong> (GDPR Art. 6(1)(a)) - any optional
              feature that we add later requiring explicit opt-in (newsletters,
              optional telemetry) will ask for consent and let you withdraw it
              at any time.
            </li>
          </UL>

          <H2 id="cookies">4. Cookies and similar technologies</H2>
          <P>
            The Site does not set any tracking, advertising, or analytics
            cookies. We may set strictly necessary cookies if and when required
            to make the Site work (for example, a session token if we add a
            login flow). Strictly necessary cookies are exempt from prior
            consent under the EU ePrivacy Directive.
          </P>

          <H2 id="retention">5. Data retention</H2>
          <UL>
            <li>Umami aggregated analytics: up to 24 months.</li>
            <li>Cloudflare access logs: short rolling window (typically less than 30 days).</li>
            <li>Node operational telemetry: kept while the node is active and for up to 24 months after last activity, for fraud prevention and reward auditability.</li>
            <li>Support correspondence: up to 36 months from the last interaction.</li>
            <li>On-chain data (Solana transactions, reward claims): permanent by design - we cannot delete or modify it.</li>
          </UL>

          <H2 id="sharing">6. Sharing and sub-processors</H2>
          <P>
            We share data only with the following categories of recipients,
            each acting as a processor or independent controller under
            appropriate agreements:
          </P>
          <UL>
            <li>
              <strong>Cloudflare, Inc.</strong> - hosting, CDN, DDoS protection
              for the Site.
            </li>
            <li>
              <strong>Umami</strong> - privacy-focused analytics. We use Umami
              configured to anonymize data; no cookies are set.
            </li>
            <li>
              <strong>Fly.io</strong> - hosting of the coordinator service that
              powers the Node App.
            </li>
            <li>
              <strong>GitHub, Inc.</strong> - hosting of the open source
              repositories and the binary release artifacts you download.
            </li>
            <li>
              <strong>Solana validators and RPC providers</strong> - process
              on-chain transactions when you claim rewards or stake tokens.
            </li>
          </UL>
          <P>
            We do not sell, rent, or trade personal data. We may disclose
            information when required by law, court order, or to protect the
            rights, property, or safety of users and the network.
          </P>

          <H2 id="transfers">7. International data transfers</H2>
          <P>
            Some sub-processors listed above are based outside the European
            Economic Area (e.g. in the United States). Transfers rely on the
            European Commission&apos;s Standard Contractual Clauses or other
            valid transfer mechanisms recognised under GDPR.
          </P>

          <H2 id="rights">8. Your rights</H2>
          <P>
            Subject to applicable law, you have the right to:
          </P>
          <UL>
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate or incomplete data.</li>
            <li>Request deletion of your data (subject to the on-chain caveat in section 5).</li>
            <li>Object to or restrict processing based on legitimate interests.</li>
            <li>Withdraw any previously granted consent at any time.</li>
            <li>Request a portable copy of the data you provided to us.</li>
            <li>Lodge a complaint with your local data protection authority.</li>
          </UL>
          <P>
            To exercise any of these rights, contact us at{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-blue-300 underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </a>
            . We will respond within 30 days.
          </P>

          <H2 id="ccpa">9. California residents (CCPA)</H2>
          <P>
            If you are a California resident, you have the right to know what
            personal information we collect, to request deletion, and to
            opt-out of the sale of personal information. We do not sell
            personal information.
          </P>

          <H2 id="security">10. Security</H2>
          <P>
            We protect data with industry-standard measures: TLS for all
            network traffic, encryption at rest where supported by our hosting
            providers, signed (Ed25519) messages for every authority claim on
            the network, and the principle of least privilege for internal
            access. No system is ever 100% secure; we cannot guarantee absolute
            security, but we work to minimise risk.
          </P>

          <H2 id="children">11. Children</H2>
          <P>
            The Site and the Node App are not directed at children under the
            age of 16. We do not knowingly collect personal data from children.
            If you believe a child has provided us with personal data, contact
            us at{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-blue-300 underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </a>{' '}
            and we will delete it.
          </P>

          <H2 id="changes">12. Changes to this policy</H2>
          <P>
            We may update this Privacy Policy from time to time. The
            &quot;Last updated&quot; date at the top of this page reflects the
            most recent revision. Material changes will be announced on the
            Site or by other reasonable means before they take effect.
          </P>

          <H2 id="contact">13. Contact us</H2>
          <P>
            Questions, requests, or complaints about this Privacy Policy or
            our data practices? Reach us at{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-blue-300 underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </P>
        </div>
      </main>
      <Footer />
    </div>
  );
}
