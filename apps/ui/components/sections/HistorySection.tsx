"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { History } from "lucide-react";
import { useDashboardStore } from "@/store/dashboardStore";
import { useActiveDate } from "@/hooks/useActiveDate";
import OakDivider from "@/components/OakDivider";

type HistoryRow = {
  date: string; // YYYY-MM-DD
  hasJournal: boolean;
  mood: number | null;
  energy: number | null;
  hasHealth: boolean;
  sleepHours: number | null;
};

function formatLongDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function groupByMonth(rows: HistoryRow[]): { label: string; rows: HistoryRow[] }[] {
  const groups: Record<string, HistoryRow[]> = {};
  for (const row of rows) {
    const key = row.date.slice(0, 7); // YYYY-MM
    (groups[key] ??= []).push(row);
  }
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, rows]) => {
      const [y, m] = key.split("-").map(Number);
      const label = new Date(y, m - 1, 1).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      });
      return { label, rows };
    });
}

export function HistorySection() {
  const router = useRouter();
  const journalEntries = useDashboardStore((s) => s.journalEntries);
  const healthLogs = useDashboardStore((s) => s.healthLogs);
  const { date: activeDate } = useActiveDate();

  // Merge journal + health into a single history list keyed by date.
  //
  // The API returns Postgres DATE columns as JS Date objects (node-pg default),
  // which JSON-serialize to "2026-04-09T00:00:00.000Z". We only want the
  // "YYYY-MM-DD" head — anything downstream (formatLongDate, isActive, URL)
  // assumes that shape.
  const toDateKey = (raw: string) => raw.slice(0, 10);
  const rows = useMemo<HistoryRow[]>(() => {
    const byDate = new Map<string, HistoryRow>();
    for (const e of journalEntries) {
      const date = toDateKey(e.entry_date);
      byDate.set(date, {
        date,
        hasJournal: true,
        mood: e.mood ?? null,
        energy: e.energy ?? null,
        hasHealth: false,
        sleepHours: null,
      });
    }
    for (const l of healthLogs) {
      const date = toDateKey(l.log_date);
      const existing = byDate.get(date);
      if (existing) {
        existing.hasHealth = true;
        existing.sleepHours = l.sleep_hours ?? null;
      } else {
        byDate.set(date, {
          date,
          hasJournal: false,
          mood: null,
          energy: null,
          hasHealth: true,
          sleepHours: l.sleep_hours ?? null,
        });
      }
    }
    return [...byDate.values()].sort((a, b) => b.date.localeCompare(a.date));
  }, [journalEntries, healthLogs]);

  const grouped = useMemo(() => groupByMonth(rows), [rows]);

  // Jumping to a historical date lands the user on /stream with the date
  // pre-selected — that's where the date-scoped views live, so they can
  // actually see (and edit) the data for that day.
  const jumpTo = (iso: string) => {
    router.push(`/stream?d=${iso}`);
  };

  return (
    <section id="history" className="mb-16 scroll-mt-20">
      <div className="flex items-center gap-3 mb-8">
        <History className="text-forest flex-shrink-0" size={20} strokeWidth={1.8} />
        <h3 className="text-[22px] font-semibold text-ink font-display">History</h3>
        <span className="ml-auto font-data text-[11px] text-ink-3">
          {rows.length} day{rows.length === 1 ? "" : "s"} logged
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center py-10 gap-3 opacity-60">
          <p className="font-reading text-[14px] text-ink-3 italic">
            No past entries yet — your timeline will grow as you journal and log health.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.label}>
              <p className="font-data text-[10px] text-ink-3 uppercase tracking-wider mb-2">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.rows.map((row) => {
                  const isActive = row.date === activeDate;
                  return (
                    <button
                      key={row.date}
                      onClick={() => jumpTo(row.date)}
                      className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-[8px] border text-left transition-colors ${
                        isActive
                          ? "bg-forest-dim border-forest"
                          : "bg-surface border-bark-subtle hover:border-bark"
                      }`}
                    >
                      <span className="font-data text-[12px] text-ink-2 w-[130px] flex-shrink-0 tabular-nums">
                        {formatLongDate(row.date)}
                      </span>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {row.hasJournal && (
                          <span className="font-reading text-[12px] italic text-forest">
                            journal
                          </span>
                        )}
                        {row.mood !== null && (
                          <span className="font-data text-[11px] text-forest">
                            mood {row.mood}
                          </span>
                        )}
                        {row.energy !== null && (
                          <span className="font-data text-[11px] text-amber-sol">
                            energy {row.energy}
                          </span>
                        )}
                        {row.hasHealth && row.sleepHours !== null && (
                          <span className="font-data text-[11px] text-ink-3">
                            sleep {row.sleepHours}h
                          </span>
                        )}
                      </div>
                      {isActive && (
                        <span className="font-reading text-[11px] italic text-forest flex-shrink-0">
                          viewing
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <OakDivider />
    </section>
  );
}
