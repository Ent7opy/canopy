// ─── Week helpers ─────────────────────────────────────────────────────────────
// Monday-start, Sunday-end ISO week math. All inputs and outputs are
// "YYYY-MM-DD" strings in *local* time — we piggy-back on `toISODate` /
// `fromISODate` from useActiveDate to stay consistent with the rest of the
// app and avoid UTC drift near midnight.

import { toISODate, fromISODate } from '@/hooks/useActiveDate';

/**
 * Return the Monday of the ISO week that contains `date`, as YYYY-MM-DD.
 * Accepts either a Date or an ISO string.
 */
export function mondayStart(date: Date | string): string {
  const src = typeof date === 'string' ? fromISODate(date) : date;
  const d = new Date(src.getFullYear(), src.getMonth(), src.getDate(), 12, 0, 0, 0);
  const day = d.getDay(); // 0=Sun, 1=Mon, ... 6=Sat
  const delta = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + delta);
  return toISODate(d);
}

/** Return the Sunday (end) of the week beginning on `weekStart`. */
export function sundayEnd(weekStart: string): string {
  const d = fromISODate(weekStart);
  d.setDate(d.getDate() + 6);
  return toISODate(d);
}

/** Return the 7 ISO dates (Mon → Sun) of the week beginning on `weekStart`. */
export function weekDays(weekStart: string): string[] {
  const start = fromISODate(weekStart);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return toISODate(d);
  });
}

/** Jump N weeks forward (or backward if negative). */
export function addWeeks(weekStart: string, delta: number): string {
  const d = fromISODate(weekStart);
  d.setDate(d.getDate() + delta * 7);
  return mondayStart(d);
}

/**
 * Human-readable week range like
 *   "6 — 12 April 2026"          (same month)
 *   "30 Mar — 5 Apr 2026"        (cross-month, same year)
 *   "29 Dec 2025 — 4 Jan 2026"   (cross-year)
 */
export function formatWeekRange(weekStart: string): string {
  const s = fromISODate(weekStart);
  const e = fromISODate(sundayEnd(weekStart));
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  const sameYear = s.getFullYear() === e.getFullYear();
  const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-GB', opts);

  if (sameMonth) {
    return `${fmt(s, { day: 'numeric' })} — ${fmt(e, { day: 'numeric', month: 'long', year: 'numeric' })}`;
  }
  if (sameYear) {
    return `${fmt(s, { day: 'numeric', month: 'short' })} — ${fmt(e, { day: 'numeric', month: 'short', year: 'numeric' })}`;
  }
  return `${fmt(s, { day: 'numeric', month: 'short', year: 'numeric' })} — ${fmt(e, { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

/**
 * ISO-8601 week number for the Monday of that week. Used as a decorative
 * "Week 15" numeral in the hero. Algorithm: move to the Thursday of the
 * same week (which decides the year), then count weeks from Jan 4.
 */
export function isoWeekNumber(weekStart: string): number {
  const d = fromISODate(weekStart);
  d.setHours(0, 0, 0, 0);
  // Thursday of this ISO week:
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const jan4 = new Date(d.getFullYear(), 0, 4);
  const diffDays = (d.getTime() - jan4.getTime()) / 86400000;
  return 1 + Math.round((diffDays - 3 + ((jan4.getDay() + 6) % 7)) / 7);
}

/** Single-letter weekday used in the calendar ribbon. */
export function weekdayInitial(iso: string): string {
  const d = fromISODate(iso);
  return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()];
}

/** Three-letter weekday used in echoes + captures. */
export function weekdayShort(iso: string): string {
  return fromISODate(iso).toLocaleDateString('en-GB', { weekday: 'short' });
}

/** Numeric day-of-month for an ISO string. */
export function dayOfMonth(iso: string): number {
  return fromISODate(iso).getDate();
}

/** Short month + day, e.g. "Thu 9 Apr". Used on echoes. */
export function formatShortDay(iso: string): string {
  return fromISODate(iso).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}
