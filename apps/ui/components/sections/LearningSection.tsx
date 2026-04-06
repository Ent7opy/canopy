"use client";

import { useEffect, useState } from "react";
import { Sprout, Wind } from "lucide-react";
import { getResources, type ApiResource } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import OakDivider from "@/components/OakDivider";

export function LearningSection() {
  const [resources, setResources] = useState<ApiResource[]>([]);

  useEffect(() => {
    getResources({ status: "active" }).then((data) => {
      if (data) setResources(data);
    });
  }, []);

  const courses = resources.filter((r) => r.type === "course" || r.type === "video" || r.type === "paper");
  const featured = courses[0] ?? null;

  return (
    <section id="learning" className="mb-16 scroll-mt-20">
      <div className="flex items-center gap-3 mb-8">
        <Sprout className="text-forest flex-shrink-0" size={20} strokeWidth={1.8} />
        <h3 className="text-[22px] font-semibold text-ink font-display">
          Learning
        </h3>
      </div>

      {/* Featured current focus */}
      {featured ? (
        <div
          className="bg-surface border border-bark rounded-[10px] p-8 relative overflow-hidden group mb-6"
          style={{ boxShadow: "0 2px 12px rgba(60,40,10,0.04)" }}
        >
          <div className="absolute top-0 right-0 opacity-[0.05] group-hover:opacity-[0.09] transition-opacity duration-500 pointer-events-none">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="#7a6040" strokeWidth="1">
              <path d="M80 0 Q 40 0 0 40 M80 20 Q 60 20 40 40 M80 40 Q 70 40 60 50" />
            </svg>
          </div>

          <div className="flex gap-7 items-start">
            <div className="w-14 h-14 bg-surface-2 rounded-full flex items-center justify-center border border-bark flex-shrink-0">
              <Wind className="text-amber-sol" size={24} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-data text-[11px] text-ink-3 uppercase tracking-wider mb-1">
                Currently studying
              </div>
              <h4 className="text-[20px] font-bold text-ink mb-2 font-display leading-snug">
                {featured.title}
              </h4>
              {featured.author && (
                <p className="font-data text-[12px] text-ink-3 mb-2">{featured.author}</p>
              )}
              {featured.progress_current !== null && featured.progress_total !== null && (
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex-1 h-1.5 rounded-full bg-bark-subtle overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-sol transition-all duration-500"
                      style={{
                        width: `${Math.round((featured.progress_current / featured.progress_total) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="font-data text-[11px] text-ink-3 flex-shrink-0">
                    {featured.progress_current}/{featured.progress_total}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="bg-surface border border-bark rounded-[10px] p-8 relative overflow-hidden group mb-6"
          style={{ boxShadow: "0 2px 12px rgba(60,40,10,0.04)" }}
        >
          <div className="flex gap-7 items-start">
            <div className="w-14 h-14 bg-surface-2 rounded-full flex items-center justify-center border border-bark flex-shrink-0">
              <Wind className="text-amber-sol" size={24} strokeWidth={1.5} />
            </div>
            <div>
              <div className="font-data text-[11px] text-ink-3 uppercase tracking-wider mb-1">
                Currently studying
              </div>
              <h4 className="text-[20px] font-bold text-ink mb-2 font-display">
                Climate Data Orchestration
              </h4>
              <p className="text-[15px] text-ink-2 leading-relaxed font-reading">
                Analyzing historical carbon flux datasets using Python. Moving
                from simple regressions toward distributed environmental modeling
                frameworks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Other active resources */}
      {courses.length > 1 && (
        <div className="space-y-2">
          {courses.slice(1).map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-4 px-4 py-3 rounded-[8px] bg-surface-2 border border-bark-subtle hover:border-bark transition-colors"
            >
              <Badge variant="subtle">{r.type}</Badge>
              <p className="flex-1 text-[14px] text-ink font-reading truncate">{r.title}</p>
              {r.author && (
                <span className="font-data text-[11px] text-ink-3 flex-shrink-0">{r.author}</span>
              )}
            </div>
          ))}
        </div>
      )}

      <OakDivider />
    </section>
  );
}
