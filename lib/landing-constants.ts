// Shared landing-page constants. Imported by both server-rendered
// page composition and individual client leaves. Plain `.ts` (no
// `'use client'`) so it stays server-safe.

// Dashboard subdomain (override via NEXT_PUBLIC_DASHBOARD_URL for
// staging or branch previews).
export const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://dashboard.synapseia.network';
