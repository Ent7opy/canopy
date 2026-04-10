'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useActiveDate } from '@/hooks/useActiveDate';

function formatLabel(iso: string): string {
  // Parse YYYY-MM-DD as local date (avoid UTC drift on the display label).
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d, 12, 0, 0, 0);
  return dt.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
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

  return (
    <div className="flex items-center justify-center gap-4 py-4 px-6 border-b border-bark-subtle bg-parchment/70 backdrop-blur-sm">
      <button
        onClick={prev}
        aria-label="Previous day"
        className="w-9 h-9 rounded-full border border-bark text-ink-2 hover:border-forest hover:text-forest transition-colors flex items-center justify-center"
      >
        <ChevronLeft size={16} strokeWidth={2} />
      </button>

      <button
        onClick={openPicker}
        className="flex items-center gap-2 px-4 py-1.5 rounded-md hover:bg-surface-2 transition-colors group"
        aria-label="Pick a date"
      >
        <Calendar size={14} className="text-ink-3 group-hover:text-forest transition-colors" strokeWidth={1.8} />
        <span className="font-display text-[16px] font-semibold text-ink tabular-nums">
          {formatLabel(date)}
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
        className="w-9 h-9 rounded-full border border-bark text-ink-2 hover:border-forest hover:text-forest transition-colors flex items-center justify-center"
      >
        <ChevronRight size={16} strokeWidth={2} />
      </button>

      {!isToday && (
        <button
          onClick={reset}
          className="ml-2 font-reading text-[13px] italic text-forest hover:text-amber-sol transition-colors underline decoration-transparent hover:decoration-amber-sol underline-offset-4"
        >
          back to today
        </button>
      )}
    </div>
  );
}
