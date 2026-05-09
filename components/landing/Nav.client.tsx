'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DASHBOARD_URL } from '@/lib/landing-constants';
import { animate, stagger, useAnime, DURATION, EASE } from '@/lib/anime';

type NavLink = {
  label: string;
  href: string;
  external?: boolean;
  cta?: boolean;
};

const LINKS: NavLink[] = [
  { label: 'Docs', href: '/docs' },
  { label: 'Download', href: '/downloads' },
  { label: 'GitHub', href: 'https://github.com/erscoder/synapseia-landing', external: true },
  { label: 'Dashboard', href: DASHBOARD_URL, external: true, cta: true },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  // Tracks the previous `open` so we can run an exit animation
  // before unmounting; we keep the drawer rendered while exiting.
  const [mounted, setMounted] = useState(false);

  // Lock body scroll while the mobile drawer is open. Restored on
  // close so the rest of the page can scroll normally.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC closes the drawer.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  // Animate drawer + links in/out via anime.js. We toggle a
  // `mounted` mirror so the exit anim has a chance to run before
  // the drawer DOM is removed.
  useAnime<HTMLDivElement>(drawerRef, (self) => {
    const el = drawerRef.current;
    if (!el) return;
    const { reduceMotion } = self.matches;

    if (open) {
      setMounted(true);
      animate(el, {
        opacity: [0, 1],
        duration: reduceMotion ? 0 : DURATION.short,
        ease: EASE.snap,
      });
      animate('[data-mobile-link]', {
        opacity: [0, 1],
        y: reduceMotion ? 0 : [12, 0],
        delay: stagger(reduceMotion ? 0 : 60, { start: reduceMotion ? 0 : 80 }),
        duration: reduceMotion ? 0 : DURATION.short,
        ease: EASE.authoritative,
      });
    } else if (mounted) {
      animate(el, {
        opacity: [1, 0],
        duration: reduceMotion ? 0 : DURATION.short,
        ease: EASE.snap,
        onComplete: () => setMounted(false),
      });
    }
  }, [open]);

  return (
    <>
      <nav
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 sm:px-8 py-3 backdrop-blur-md bg-black/30 border-b border-white/[0.04]"
      >
        <Link href="/" className="flex items-center gap-3" aria-label="Synapseia home">
          <Image src="/synapseia-logo.png" alt="" width={36} height={36} className="w-9 h-9" />
          <span className="font-bold text-white tracking-wide">Synapseia</span>
        </Link>

        {/* Desktop links — hidden on small viewports. */}
        <div className="hidden md:flex items-center gap-3">
          {LINKS.map((l) => renderLink(l, 'desktop'))}
        </div>

        {/* Mobile burger — visible <md. Animates between bars and X
            via plain CSS rotate; no JS rAF needed. */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-drawer"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden relative w-10 h-10 -mr-2 flex items-center justify-center rounded-lg text-slate-200 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span aria-hidden className="relative block w-6 h-4">
            <span
              className={`absolute left-0 top-0 h-[2px] w-6 bg-current rounded-full transition-transform duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`}
            />
            <span
              className={`absolute left-0 top-[7px] h-[2px] w-6 bg-current rounded-full transition-opacity duration-200 ${open ? 'opacity-0' : 'opacity-100'}`}
            />
            <span
              className={`absolute left-0 top-[14px] h-[2px] w-6 bg-current rounded-full transition-transform duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile drawer. Stays mounted while exit-animating. */}
      {(open || mounted) && (
        <div
          id="mobile-drawer"
          ref={drawerRef}
          aria-modal="true"
          role="dialog"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-40 md:hidden"
          // Prevents bg flash before anime.js takes over.
          style={{ opacity: 0 }}
          onClick={(e) => {
            // Close on backdrop click — anything not a link.
            if ((e.target as HTMLElement).closest('a, button')) return;
            setOpen(false);
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" />

          {/* Panel — full-screen on mobile, cleaner than a slide-in
              drawer for a 4-link nav. */}
          <div className="relative h-full w-full pt-24 pb-10 px-6 flex flex-col gap-2">
            {LINKS.map((l) => renderLink(l, 'mobile', () => setOpen(false)))}

            <p className="mt-auto text-center text-[11px] text-slate-600 font-mono">
              Synapseia Network · Source-available · FSL-1.1
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function renderLink(l: NavLink, variant: 'desktop' | 'mobile', onSelect?: () => void) {
  const desktopBase =
    'px-4 py-2 rounded-lg text-sm font-medium transition-colors';
  const mobileBase =
    'block w-full px-5 py-4 rounded-xl text-base font-medium transition-colors';
  const desktopText = l.cta
    ? 'backdrop-blur-md bg-blue-500/10 border border-blue-500/30 text-blue-200 hover:bg-blue-500/20 hover:border-blue-400/50'
    : l.external
    ? 'backdrop-blur-md bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white hover:border-white/20'
    : 'text-slate-300 hover:text-white';
  const mobileText = l.cta
    ? 'bg-blue-500/15 border border-blue-500/30 text-blue-200 hover:bg-blue-500/25 hover:border-blue-400/50'
    : 'border border-white/[0.06] bg-white/[0.03] text-slate-200 hover:bg-white/[0.06] hover:border-white/15';

  const className =
    variant === 'desktop'
      ? `${desktopBase} ${desktopText}`
      : `${mobileBase} ${mobileText}`;

  if (l.external) {
    return (
      <a
        key={l.label}
        href={l.href}
        target={l.href.startsWith('http') ? '_blank' : undefined}
        rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={className}
        onClick={onSelect}
        {...(variant === 'mobile' ? { 'data-mobile-link': '' } : {})}
      >
        {l.label}
      </a>
    );
  }
  return (
    <Link
      key={l.label}
      href={l.href}
      className={className}
      onClick={onSelect}
      {...(variant === 'mobile' ? { 'data-mobile-link': '' } : {})}
    >
      {l.label}
    </Link>
  );
}
