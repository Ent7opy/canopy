"use client";

// ─── ActiveBookCard — large specimen card for the "In bloom" shelf ──────────
// The hero card for books currently being read. Full-width plate (after the
// single-column shift) with cover on the left and title / author / progress /
// inline page logger on the right. Clicking the card body opens the detail
// drawer; the "+pages" control is inline so you can log a reading session
// without leaving the page.
//
// When the logger is open, the form stacks vertically: label row, large
// number input row, action row. This was previously crammed into a single
// flex row and the input collapsed to ~40px when the card sat in a 2-col
// grid — now that the card is full-width and the form stacks, the input
// has real breathing room.
//
// On a successful save, we briefly pulse the progress bar (amber glow)
// so the user actually sees the delta land. Keyframes live in globals.css
// under `.bar-pulse`.

import { useState } from "react";
import { Check, Pencil } from "lucide-react";
import type { ApiResource } from "@/lib/api";
import BookCover from "./BookCover";

interface ActiveBookCardProps {
  book: ApiResource;
  onOpen: (book: ApiResource) => void;
  onLogProgress: (book: ApiResource, delta: number) => Promise<void>;
  onFinish: (book: ApiResource) => void;
}

export default function ActiveBookCard({
  book,
  onOpen,
  onLogProgress,
  onFinish,
}: ActiveBookCardProps) {
  const [logging, setLogging] = useState(false);
  const [delta, setDelta] = useState("");
  const [saving, setSaving] = useState(false);
  // Brief post-save pulse on the progress bar. 850ms matches the CSS
  // `.bar-pulse` keyframe duration in globals.css.
  const [pulsed, setPulsed] = useState(false);

  const current = book.progress_current ?? 0;
  const total = book.progress_total ?? 0;
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  const startedLabel = book.started_at
    ? new Date(book.started_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
    : null;

  const cancelLogging = () => {
    setLogging(false);
    setDelta("");
  };

  const submitDelta = async () => {
    const n = Number(delta);
    if (!Number.isFinite(n) || n === 0) {
      cancelLogging();
      return;
    }
    setSaving(true);
    await onLogProgress(book, n);
    setSaving(false);
    setLogging(false);
    setDelta("");
    // Flash the progress bar so the delta is visually unmistakable.
    setPulsed(true);
    setTimeout(() => setPulsed(false), 850);
  };

  return (
    <div
      className="group relative flex gap-6 rounded-[12px] border border-bark bg-surface-2 p-5 overflow-hidden transition-colors hover:border-forest"
      style={{ boxShadow: "0 2px 12px rgba(60,40,10,0.05)" }}
    >
      {/* Faint parchment grain, matching the Weekly Review hero */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #1c1a14 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, #1c1a14 0 1px, transparent 1px 3px)",
        }}
      />

      {/* Cover — clicking opens the drawer */}
      <button
        type="button"
        onClick={() => onOpen(book)}
        className="relative z-10 flex-shrink-0 focus:outline-none focus-visible:outline-2 focus-visible:outline-forest focus-visible:outline-offset-4 rounded-[4px]"
        aria-label={`Open ${book.title}`}
      >
        <BookCover coverUrl={book.cover_url} title={book.title} width={120} />
      </button>

      {/* Info column */}
      <div className="relative z-10 flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => onOpen(book)}
              className="block text-left focus:outline-none"
            >
              <h4 className="font-display italic font-semibold text-[19px] text-ink leading-tight truncate hover:text-forest transition-colors">
                {book.title}
              </h4>
              {book.author && (
                <p className="font-reading italic text-[13px] text-ink-3 mt-0.5 truncate">
                  {book.author}
                </p>
              )}
            </button>
          </div>
          <button
            type="button"
            onClick={() => onOpen(book)}
            aria-label="Edit"
            className="flex-shrink-0 text-ink-3 hover:text-forest transition-colors opacity-0 group-hover:opacity-100 p-1 -mr-1"
          >
            <Pencil size={13} strokeWidth={1.8} />
          </button>
        </div>

        {/* Progress bar */}
        {total > 0 ? (
          <div className="mt-auto">
            <div className="flex items-baseline justify-between gap-2 mb-1.5">
              <span className="font-data text-[10px] uppercase tracking-[0.14em] text-ink-3 tabular-nums">
                {current} / {total} pp
              </span>
              <span className="font-display italic font-semibold text-[15px] text-forest tabular-nums">
                {pct}%
              </span>
            </div>
            <div
              className={`relative h-[6px] rounded-full bg-bark-subtle overflow-hidden ${
                pulsed ? "bar-pulse" : ""
              }`}
            >
              <div
                className="absolute inset-y-0 left-0 bg-amber-sol rounded-full transition-all duration-500 ease-out"
                style={{ width: `${pct}%` }}
              />
              {/* Quarter tick marks */}
              {[25, 50, 75].map((t) => (
                <span
                  key={t}
                  className="absolute top-0 bottom-0 w-px bg-parchment/60"
                  style={{ left: `${t}%` }}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-auto font-reading italic text-[11px] text-ink-3">
            No page count yet. <span className="underline decoration-dotted underline-offset-2">Edit</span> to add one.
          </p>
        )}

        {/* Footer — inline log form or quick-action row.
            When logging, the form stacks vertically so the number input
            can be a proper, legible control instead of a cramped sliver. */}
        <div className="mt-3 pt-3 border-t border-bark-subtle/70">
          {logging ? (
            <div className="space-y-2">
              <label
                htmlFor={`log-${book.id}`}
                className="block font-data text-[9px] uppercase tracking-[0.14em] text-ink-3"
              >
                Log a reading session
              </label>
              <div className="flex items-stretch gap-2">
                <div className="relative flex-1 min-w-0">
                  <span
                    aria-hidden="true"
                    className="absolute left-3 top-1/2 -translate-y-1/2 font-data text-[11px] uppercase tracking-[0.14em] text-ink-3 pointer-events-none select-none"
                  >
                    pages
                  </span>
                  <input
                    id={`log-${book.id}`}
                    type="number"
                    value={delta}
                    onChange={(e) => setDelta(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitDelta();
                      if (e.key === "Escape") cancelLogging();
                    }}
                    autoFocus
                    placeholder="+10"
                    className="w-full pl-[62px] pr-3 py-2.5 rounded-[6px] border border-bark bg-parchment font-display italic text-[18px] text-ink placeholder:text-ink-3/60 focus:outline-none focus:border-forest tabular-nums"
                  />
                </div>
                <button
                  type="button"
                  onClick={submitDelta}
                  disabled={saving || delta === ""}
                  className="flex-shrink-0 px-4 rounded-[6px] bg-forest hover:bg-forest-light text-parchment font-data text-[10px] uppercase tracking-[0.14em] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(61,107,79,0.2)]"
                >
                  {saving ? "saving…" : "save"}
                </button>
                <button
                  type="button"
                  onClick={cancelLogging}
                  className="flex-shrink-0 px-3 rounded-[6px] border border-bark-subtle text-ink-3 font-data text-[10px] uppercase tracking-[0.14em] hover:text-ink-2 hover:border-bark transition-colors"
                >
                  cancel
                </button>
              </div>
              <p className="font-reading italic text-[11px] text-ink-3/80 pl-0.5">
                Enter a positive delta — e.g. <span className="font-data not-italic">24</span> for 24 more pages. Negatives work too if you skimmed back.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <span className="font-data text-[9px] uppercase tracking-[0.14em] text-ink-3 tabular-nums">
                {startedLabel ? `started ${startedLabel}` : "reading"}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLogging(true)}
                  className="font-data text-[10px] uppercase tracking-[0.12em] text-forest hover:text-amber-sol transition-colors"
                >
                  + pages
                </button>
                <button
                  type="button"
                  onClick={() => onFinish(book)}
                  className="font-data text-[10px] uppercase tracking-[0.12em] text-amber-sol hover:text-forest transition-colors inline-flex items-center gap-1"
                >
                  <Check size={10} strokeWidth={2.2} />
                  finish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
