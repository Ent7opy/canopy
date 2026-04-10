"use client";

import { useState, useEffect } from "react";
import { WeeklyReviewSection } from "@/components/sections/WeeklyReviewSection";

/**
 * Weekly Review — standalone route, sits at the bottom of the sidebar,
 * visually separated from the Timeline / Stream / Garden groups.
 * Weekly reviews are keyed on `week_start` rather than a specific day,
 * so this page is also date-agnostic (DateNavigator hidden).
 */
export default function ReviewPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex justify-center py-20">
      <div className="w-full max-w-[780px] px-8">
        <WeeklyReviewSection />
      </div>
    </div>
  );
}
