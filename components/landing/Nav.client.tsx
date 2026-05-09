'use client';
import Link from 'next/link';
import Image from 'next/image';
import { DASHBOARD_URL } from '@/lib/landing-constants';

export function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 sm:px-8 py-3 backdrop-blur-md bg-black/30 border-b border-white/[0.04]">
      <div className="flex items-center gap-3">
        <Image src="/synapseia-logo.png" alt="Synapseia" width={36} height={36} className="w-9 h-9" />
        <span className="font-bold text-white tracking-wide">Synapseia</span>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/docs"
          className="px-4 py-2 rounded-lg text-slate-300 hover:text-white text-sm font-medium transition-colors"
        >
          Docs
        </Link>
        <a
          href="https://github.com/erscoder/synapseia-landing"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg backdrop-blur-md bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white hover:border-white/20 text-sm font-medium transition-colors"
        >
          GitHub
        </a>
        <a
          href={DASHBOARD_URL}
          className="px-4 py-2 rounded-lg backdrop-blur-md bg-blue-500/10 border border-blue-500/30 text-blue-200 font-medium text-sm hover:bg-blue-500/20 hover:border-blue-400/50 transition-all"
        >
          Dashboard
        </a>
      </div>
    </nav>
  );
}
