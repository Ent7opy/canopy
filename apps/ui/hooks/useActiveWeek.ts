'use client';
// ─── ActiveWeek ───────────────────────────────────────────────────────────────
// URL-backed "selected week" state for /review. Mirrors the `useActiveDate`
// pattern but scoped to ISO weeks (Monday → Sunday).
//
//   useActiveWeek() → {
//     weekStart,     // "YYYY-MM-DD" — Monday of the selected week
//     weekEnd,       // "YYYY-MM-DD" — Sunday of the selected week
//     days,          // array of 7 ISO dates (Mon..Sun)
//     weekNumber,    // ISO-8601 week number (1..53)
//     rangeLabel,    // e.g. "6 — 12 April 2026"
//     isThisWeek,    // true if weekStart === mondayStart(today)
//     isPastWeek,    // true if weekStart < mondayStart(today)
//     isFutureWeek,  // true if weekStart > mondayStart(today)
//     next(), prev(), reset(),
//   }
//
// Source of truth: the `?w=YYYY-MM-DD` search param (normalised to the Monday
// of that week). When `w` equals this week's Monday, the param is removed
// from the URL so the default view stays clean.

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { todayISO } from '@/hooks/useActiveDate';
import {
  mondayStart, sundayEnd, weekDays, addWeeks,
  formatWeekRange, isoWeekNumber,
} from '@/lib/weekUtils';

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

export function useActiveWeek() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const thisWeek = mondayStart(todayISO());
  const raw = searchParams.get('w');
  // Normalise any date in the URL to the Monday of its week — a user can
  // land on `?w=2026-04-10` (a Friday) and we'll snap to that week's Monday.
  const weekStart = raw && ISO_RE.test(raw) ? mondayStart(raw) : thisWeek;

  const weekEnd = useMemo(() => sundayEnd(weekStart), [weekStart]);
  const days = useMemo(() => weekDays(weekStart), [weekStart]);

  const isThisWeek = weekStart === thisWeek;
  const isPastWeek = weekStart < thisWeek;
  const isFutureWeek = weekStart > thisWeek;

  const updateUrl = useCallback(
    (nextWeek: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextWeek === mondayStart(todayISO())) {
        params.delete('w');
      } else {
        params.set('w', nextWeek);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const next = useCallback(() => updateUrl(addWeeks(weekStart, 1)), [weekStart, updateUrl]);
  const prev = useCallback(() => updateUrl(addWeeks(weekStart, -1)), [weekStart, updateUrl]);
  const reset = useCallback(() => updateUrl(mondayStart(todayISO())), [updateUrl]);

  return {
    weekStart,
    weekEnd,
    days,
    weekNumber: isoWeekNumber(weekStart),
    rangeLabel: formatWeekRange(weekStart),
    isThisWeek,
    isPastWeek,
    isFutureWeek,
    next,
    prev,
    reset,
  };
}
