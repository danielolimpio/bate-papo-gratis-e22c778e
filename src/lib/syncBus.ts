/**
 * Cross-hook sync bus + exponential-backoff resync coordinator.
 *
 * Hooks subscribe to SYNC_EVENT to trigger a fresh fetch from the database.
 * `requestResync(reason)` debounces calls and applies exponential backoff
 * (1s → 2s → 4s … capped at 30s). Successful subscriptions should call
 * `resetBackoff()` to bring it back to 1s.
 */

export const SYNC_EVENT = "lovable:sync-refresh";

interface SyncDetail {
  reason: string;
  at: number;
}

let lastRun = 0;
let backoff = 1000;
let pending: ReturnType<typeof setTimeout> | null = null;

export function onSync(handler: (detail: SyncDetail) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<SyncDetail>).detail);
  window.addEventListener(SYNC_EVENT, listener);
  return () => window.removeEventListener(SYNC_EVENT, listener);
}

export function emitSync(reason = "manual") {
  lastRun = Date.now();
  window.dispatchEvent(
    new CustomEvent<SyncDetail>(SYNC_EVENT, { detail: { reason, at: lastRun } })
  );
}

export function requestResync(reason = "auto") {
  if (pending) return;
  const now = Date.now();
  const wait = Math.max(0, lastRun + backoff - now);
  pending = setTimeout(() => {
    pending = null;
    emitSync(reason);
  }, Math.min(wait, 30000));
}

export function resetBackoff() {
  backoff = 1000;
}

export function bumpBackoff() {
  backoff = Math.min(backoff * 2, 30000);
}

export function getBackoff() {
  return backoff;
}
