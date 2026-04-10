"use client";

import { useState, useEffect } from "react";
import { NowSection }     from "@/components/sections/NowSection";
import { HistorySection } from "@/components/sections/HistorySection";

/**
 * Root dashboard — the Timeline group.
 *
 * Intentionally thin: just "Now" (today's snapshot) and "History" (past
 * entries). The date-scoped detail lives on /stream and the status-scoped
 * content lives on /garden.
 */
export default function Home() {
  // Guard against Zustand persist / localStorage hydration mismatches on SSR.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex justify-center py-10 sm:py-14 md:py-20">
      <div className="w-full max-w-[780px] px-4 sm:px-6 md:px-8">
        <NowSection />
        <HistorySection />
      </div>
    </div>
  );
}
