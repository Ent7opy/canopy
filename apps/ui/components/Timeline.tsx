"use client";

import { useEffect, useRef } from "react";
import { DataSet } from "vis-data";
import { Timeline } from "vis-timeline/peer/esm/vis-timeline-graph2d.mjs";
import "vis-timeline/styles/vis-timeline-graph2d.css";
import { Phase } from "@/data/roadmap";

interface RoadmapTimelineProps {
  phases: Phase[];
}

export default function RoadmapTimeline({ phases }: RoadmapTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<Timeline | null>(null);

  // Calculate min and max dates from phases
  const allDates = phases.flatMap(p => [new Date(p.start), new Date(p.end)]);
  const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
  
  // Add some padding
  minDate.setMonth(minDate.getMonth() - 1);
  maxDate.setMonth(maxDate.getMonth() + 1);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create items for each phase
    const items = new DataSet(
      phases.map((phase) => ({
        id: phase.id,
        content: phase.title,
        start: phase.start,
        end: phase.end,
        className: "timeline-item",
        style: `background-color: ${phase.color}; border-color: ${phase.color}`,
      }))
    );

    // Options
    const options = {
      height: "200px",
      stack: false,
      showCurrentTime: true,
      zoomable: true,
      moveable: true,
      format: {
        minorLabels: {
          month: "MMM YYYY",
        },
      },
      min: minDate,
      max: maxDate,
    };

    timelineRef.current = new Timeline(containerRef.current, items, options);

    return () => {
      if (timelineRef.current) {
        timelineRef.current.destroy();
      }
    };
  }, [phases, minDate, maxDate]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        🗓️ Timeline
      </h2>
      <div ref={containerRef} className="timeline-container" />
      <div className="mt-4 flex flex-wrap gap-2">
        {phases.map((phase) => (
          <div key={phase.id} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded"
              style={{ backgroundColor: phase.color }}
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              {phase.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}