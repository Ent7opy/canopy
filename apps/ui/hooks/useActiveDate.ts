'use client';
// ─── ActiveDate ───────────────────────────────────────────────────────────────
// Globally shared "selected date" state, URL-backed.
//
// Source of truth: the `?d=YYYY-MM-DD` search param. Next.js `useSearchParams`
// re-renders every subscribed component when the URL changes, so no extra
// state lib is needed — one hook, one param, one re-render path.
//
// Shape:
//   useActiveDate() → {
//     date,        // "YYYY-MM-DD" — the currently selected date
//     dateObj,     // Date instance (local noon; avoids timezone drift)
//     isToday,     // true if date === today (local)
//     isPast,      // true if date < today
//     isFuture,    // true if date > today
//     next(),      // jump to next day
//     prev(),      // jump to previous day
//     goto(d),     // jump to a specific "YYYY-MM-DD"
//     reset(),     // jump back to today (clears ?d)
//   }
//
// Notes on timezone: we use local-time date math. `new Date().toISOString()`
// gives UTC, which is wrong near midnight in non-UTC zones. `toISODate()`
// below formats a Date as "YYYY-MM-DD" in local time.

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

// Format a Date as YYYY-MM-DD in the user's local timezone.
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Parse "YYYY-MM-DD" into a local Date at noon (avoids DST edge cases).
export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

// Today's date as "YYYY-MM-DD" in local time.
export function todayISO(): string {
  return toISODate(new Date());
}

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

export function useActiveDate() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const raw = searchParams.get('d');
  const today = todayISO();
  const date = raw && ISO_RE.test(raw) ? raw : today;

  const dateObj = useMemo(() => fromISODate(date), [date]);
  const isToday = date === today;
  const isPast = date < today;
  const isFuture = date > today;

  const updateUrl = useCallback(
    (nextDate: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextDate === todayISO()) {
        params.delete('d');
      } else {
        params.set('d', nextDate);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const goto = useCallback(
    (nextDate: string) => {
      if (!ISO_RE.test(nextDate)) return;
      updateUrl(nextDate);
    },
    [updateUrl]
  );

  const next = useCallback(() => {
    const d = fromISODate(date);
    d.setDate(d.getDate() + 1);
    updateUrl(toISODate(d));
  }, [date, updateUrl]);

  const prev = useCallback(() => {
    const d = fromISODate(date);
    d.setDate(d.getDate() - 1);
    updateUrl(toISODate(d));
  }, [date, updateUrl]);

  const reset = useCallback(() => {
    updateUrl(todayISO());
  }, [updateUrl]);

  return { date, dateObj, isToday, isPast, isFuture, next, prev, goto, reset };
}
