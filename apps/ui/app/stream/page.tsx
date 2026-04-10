"use client";

import { useState, useEffect } from "react";
import { InboxSection }  from "@/components/sections/InboxSection";
import { HabitsSection } from "@/components/sections/HabitsSection";
import { JournalSection } from "@/components/sections/JournalSection";
import { HealthSection } from "@/components/sections/HealthSection";

/**
 * The Stream — date-scoped views.
 *
 * This page subscribes to ActiveDate via the data hooks inside each section
 * (useHabits / useJournal / useHealth / useInbox). Refreshing or navigating
 * here preserves the `?d=` query param thanks to the URL-backed state.
 */
export default function StreamPage() {
  // Guard against Zustand persist / localStorage hydration mismatches on SSR.
  // Matches the pattern used in the root dashboard (apps/ui/app/page.tsx).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex justify-center py-20">
      <div className="w-full max-w-[780px] px-8">
        <InboxSection />
        <HabitsSection />
        <JournalSection />
        <HealthSection />
      </div>
    </div>
  );
}
