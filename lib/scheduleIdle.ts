// Defer non-critical work to browser idle time so the main thread
// stays free for the critical paint path. Falls back to a 0ms
// setTimeout where requestIdleCallback isn't available (Safari < 16).
//
// Originally inlined in `app/dashboard/page.tsx` (commit c5eb566 — B4
// of the first perf pass). Promoted to a shared module so
// `app/page.tsx` (landing) and other routes can defer below-fold
// fetches without duplicating the helper.
type IdleScheduler = (cb: () => void) => void;

export const scheduleIdle: IdleScheduler = (cb) => {
  if (typeof window === 'undefined') return;
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void) => number;
  };
  if (typeof w.requestIdleCallback === 'function') {
    w.requestIdleCallback(cb);
  } else {
    setTimeout(cb, 0);
  }
};
