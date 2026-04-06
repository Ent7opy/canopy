"use client";

import { useEffect, useState } from "react";
import { BookOpen, Star } from "lucide-react";
import { getResources, patchResource, type ApiResource } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import FernDivider from "@/components/FernDivider";

type StatusFilter = "backlog" | "active" | "completed";

const STATUS_LABELS: Record<StatusFilter, string> = {
  backlog: "Backlog",
  active: "Reading",
  completed: "Done",
};

const leftBorderColor: Record<StatusFilter, string> = {
  backlog:   "#e8dfc9",
  active:    "#c07d2e",
  completed: "#3d6b4f",
};

export function ResourcesSection() {
  const [allBooks, setAllBooks] = useState<ApiResource[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("active");

  useEffect(() => {
    getResources({ type: "book" }).then((data) => {
      if (data) setAllBooks(data);
    });
  }, []);

  const filtered = allBooks.filter((b) => b.status === filter);
  const completedCount = allBooks.filter((b) => b.status === "completed").length;
  const total = allBooks.length;

  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const cycleStatus = (book: ApiResource) => {
    const next: Record<string, ApiResource["status"]> = {
      backlog: "active",
      active: "completed",
      completed: "backlog",
    };
    const newStatus = next[book.status] ?? "backlog";
    setAllBooks((prev) => prev.map((b) => b.id === book.id ? { ...b, status: newStatus } : b));
    patchResource(book.id, { status: newStatus });
  };

  return (
    <section id="reading" className="mb-16 scroll-mt-20">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="text-forest flex-shrink-0" size={20} strokeWidth={1.8} />
        <h3 className="text-[22px] font-semibold text-ink font-display">Reading</h3>
      </div>

      {/* Progress bar + filter */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-36 h-1 rounded-full bg-bark-subtle overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-sol transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="font-data text-[12px] text-ink-3">
            {completedCount} of {total} read
          </span>
        </div>

        <div className="flex gap-1.5">
          {(Object.keys(STATUS_LABELS) as StatusFilter[]).map((s) => (
            <button key={s} onClick={() => setFilter(s)} className="focus:outline-none">
              <Badge variant={filter === s ? "active" : "subtle"}>
                {STATUS_LABELS[s]}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Book list */}
      {filtered.length === 0 ? (
        <p className="font-reading text-[14px] text-ink-3 italic">Nothing in {STATUS_LABELS[filter].toLowerCase()} yet.</p>
      ) : (
        <div className="space-y-0.5">
          {filtered.map((book) => (
            <div
              key={book.id}
              className="group flex items-center justify-between px-3 py-3.5 rounded-sm transition-colors duration-150 hover:bg-surface-2 cursor-pointer"
              style={{ borderLeft: `3px solid ${leftBorderColor[book.status as StatusFilter] ?? "#e8dfc9"}` }}
              onClick={() => cycleStatus(book)}
            >
              <div className="pl-3 min-w-0">
                <p className={`text-[15px] font-medium leading-snug font-reading truncate ${
                  book.status === "completed" ? "text-ink-3 line-through" : "text-ink"
                }`}>
                  {book.title}
                </p>
                <p className="font-data text-[11px] text-ink-3 mt-0.5 truncate">
                  {book.author ?? ""}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 pl-4">
                {book.rating !== null && (
                  <span className="flex items-center gap-0.5 font-data text-[11px] text-amber-sol">
                    <Star size={10} strokeWidth={0} fill="#c07d2e" />
                    {book.rating}
                  </span>
                )}
                {book.progress_current !== null && book.progress_total !== null && book.status === "active" && (
                  <span className="font-data text-[11px] text-ink-3">
                    {book.progress_current}/{book.progress_total}p
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <FernDivider />
    </section>
  );
}
