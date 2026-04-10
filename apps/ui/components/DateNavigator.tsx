'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useActiveDate } from '@/hooks/useActiveDate';

// On desktop we show the long form ("Thursday, 10 April 2026"); on mobile the
// full weekday + year would overflow next to the prev/next buttons and the
// hamburger, so we render a compact form instead ("Thu 10 Apr"). Both use
// `en-GB` so the day comes before the month (10 Apr, not Apr 10).
function formatLabel(iso: string, compact: boolean): string {
  // Parse YYYY-MM-DD as local date (avoid UTC drift on the display label).
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d, 12, 0, 0, 0);
  return dt.toLocaleDateString(
    'en-GB',
    compact
      ? { weekday: 'short', day: 'numeric', month: 'short' }
      : { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  );
}

export default function DateNavigator() {
  const { date, isToday, next, prev, goto, reset } = useActiveDate();
  const pickerRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    const el = pickerRef.current;
    if (!el) return;
    // showPicker() is the modern API; fall back to focus() for older browsers.
    if (typeof el.showPicker === 'function') el.showPicker();
    else el.focus();
  };

  const longLabel = formatLabel(date, false);
  const shortLabel = formatLabel(date, true);

  return (
    // pl-16 on mobile reserves space for the fixed hamburger button (top-3
    // left-3 w-10 = ~52px). On md+ we drop that reservation because the
    // hamburger is hidden.
    <div className="flex items-center justify-center gap-1.5 sm:gap-4 py-3 sm:py-4 pl-16 pr-3 sm:px-6 md:pl-6 border-b border-bark-subtle bg-parchment/70 backdrop-blur-sm">
      <button
        onClick={prev}
        aria-label="Previous day"
        className="w-9 h-9 rounded-full border border-bark text-ink-2 hover:border-forest hover:text-forest transition-colors flex items-center justify-center flex-shrink-0"
      >
        <ChevronLeft size={16} strokeWidth={2} />
      </button>

      <button
        onClick={openPicker}
        className="flex items-center gap-2 px-2 sm:px-4 py-1.5 rounded-md hover:bg-surface-2 transition-colors group min-w-0"
        aria-label="Pick a date"
      >
        <Calendar
          size={14}
          className="text-ink-3 group-hover:text-forest transition-colors flex-shrink-0 hidden sm:block"
          strokeWidth={1.8}
        />
        {/* Two spans, one per breakpoint — avoids Intl calls at render time
            twice and keeps the DOM static. */}
        <span className="sm:hidden font-display text-[14px] font-semibold text-ink tabular-nums truncate">
          {shortLabel}
        </span>
        <span className="hidden sm:inline font-display text-[16px] font-semibold text-ink tabular-nums truncate">
          {longLabel}
        </span>
      </button>

      {/* Hidden native date picker, triggered by the label button */}
      <input
        ref={pickerRef}
        type="date"
        value={date}
        onChange={(e) => e.target.value && goto(e.target.value)}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />

      <button
        onClick={next}
        aria-label="Next day"
        className="w-9 h-9 rounded-full border border-bark text-ink-2 hover:border-forest hover:text-forest transition-colors flex items-center justify-center flex-shrink-0"
      >
        <ChevronRight size={16} strokeWidth={2} />
      </button>

      {!isToday && (
        <button
          onClick={reset}
          className="ml-1 sm:ml-2 font-reading text-[12px] sm:text-[13px] italic text-forest hover:text-amber-sol transition-colors underline decoration-transparent hover:decoration-amber-sol underline-offset-4 flex-shrink-0"
        >
          <span className="hidden sm:inline">back to today</span>
          <span className="sm:hidden">today</span>
        </button>
      )}
    </div>
  );
}
