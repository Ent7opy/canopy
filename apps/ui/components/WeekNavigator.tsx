'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useActiveWeek } from '@/hooks/useActiveWeek';

/**
 * Header ribbon for the /review page. Shows the selected week as a title,
 * flanks it with prev/next arrows, and surfaces a quiet "this week" reset
 * link when the user is looking at a past (or future) week.
 *
 * Lives inside the /review page content, not in AppShell, because the
 * DateNavigator is intentionally hidden on /review — the week ribbon *is*
 * the navigator here.
 */
export default function WeekNavigator() {
  const { rangeLabel, weekNumber, isThisWeek, next, prev, reset } = useActiveWeek();

  return (
    <div className="flex items-center justify-between gap-4 mb-10">
      {/* Prev */}
      <button
        onClick={prev}
        aria-label="Previous week"
        className="w-10 h-10 rounded-full border border-bark text-ink-2 hover:border-forest hover:text-forest transition-colors flex items-center justify-center flex-shrink-0"
      >
        <ChevronLeft size={16} strokeWidth={1.8} />
      </button>

      {/* Center label — stacked: week number in data font on top, range in display font below */}
      <div className="flex flex-col items-center flex-1 min-w-0">
        <span className="font-data text-[10px] uppercase tracking-[0.18em] text-ink-3">
          Week {weekNumber}
        </span>
        <span className="font-display text-[22px] italic font-semibold text-ink leading-tight mt-1 text-center">
          {rangeLabel}
        </span>
        {!isThisWeek && (
          <button
            onClick={reset}
            className="mt-1 font-reading text-[12px] italic text-forest hover:text-amber-sol transition-colors underline decoration-transparent hover:decoration-amber-sol underline-offset-4"
          >
            back to this week
          </button>
        )}
      </div>

      {/* Next */}
      <button
        onClick={next}
        aria-label="Next week"
        className="w-10 h-10 rounded-full border border-bark text-ink-2 hover:border-forest hover:text-forest transition-colors flex items-center justify-center flex-shrink-0"
      >
        <ChevronRight size={16} strokeWidth={1.8} />
      </button>
    </div>
  );
}
