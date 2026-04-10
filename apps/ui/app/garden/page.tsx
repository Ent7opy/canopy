"use client";

import { useState, useEffect } from "react";
import { GoalsSection }    from "@/components/sections/GoalsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { LearningSection } from "@/components/sections/LearningSection";
import { HobbiesSection }  from "@/components/sections/HobbiesSection";
import { ReadingSection }  from "@/components/sections/reading/ReadingSection";

/**
 * The Garden — status-scoped views.
 *
 * This page is date-agnostic: its sections fetch by status/state and do not
 * react to ActiveDate. The DateNavigator is intentionally hidden here
 * (see AppShell) to reinforce that boundary.
 */
export default function GardenPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex justify-center py-10 sm:py-14 md:py-20">
      <div className="w-full max-w-[780px] px-4 sm:px-6 md:px-8">
        <GoalsSection />
        <ProjectsSection />
        <LearningSection />
        <HobbiesSection />
        <ReadingSection />
      </div>
    </div>
  );
}
