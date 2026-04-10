"use client";

import { useState, useEffect } from "react";
import { InboxSection }       from "@/components/sections/InboxSection";
import { NowSection }         from "@/components/sections/NowSection";
import { HabitsSection }      from "@/components/sections/HabitsSection";
import { JournalSection }     from "@/components/sections/JournalSection";
import { HealthSection }      from "@/components/sections/HealthSection";
import { GoalsSection }       from "@/components/sections/GoalsSection";
import { ProjectsSection }    from "@/components/sections/ProjectsSection";
import { LearningSection }    from "@/components/sections/LearningSection";
import { HobbiesSection }     from "@/components/sections/HobbiesSection";
import { ResourcesSection }   from "@/components/sections/ResourcesSection";
import { WeeklyReviewSection } from "@/components/sections/WeeklyReviewSection";

export default function Home() {
  // Guard against Zustand persist / localStorage hydration mismatches on SSR.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex justify-center py-20">
      <div className="w-full max-w-[780px] px-8">
        <NowSection />
        <InboxSection />
        <HabitsSection />
        <JournalSection />
        <HealthSection />
        <GoalsSection />
        <ProjectsSection />
        <LearningSection />
        <HobbiesSection />
        <ResourcesSection />
        <WeeklyReviewSection />
      </div>
    </div>
  );
}
