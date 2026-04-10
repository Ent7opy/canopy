'use client';

import { History } from 'lucide-react';
import { useActiveDate } from '@/hooks/useActiveDate';

export default function PastDateBanner() {
  const { isPast, reset } = useActiveDate();
  if (!isPast) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-1.5 px-6 bg-amber-dim border-b border-bark-subtle">
      <History size={12} className="text-amber-sol" strokeWidth={2} />
      <span className="font-reading text-[12px] italic text-ink-2">
        Viewing a past day — entries saved here will use this date.
      </span>
      <button
        onClick={reset}
        className="font-reading text-[12px] italic text-forest hover:text-amber-sol transition-colors underline decoration-transparent hover:decoration-amber-sol underline-offset-4 ml-1"
      >
        jump to today
      </button>
    </div>
  );
}
