"use client";

// ─── BookCard — small specimen card ─────────────────────────────────────────
// The compact card used on the "Seeds" (backlog) and "Pressed" (finished)
// shelves. Just a cover + title + author, clickable to open the detail
// drawer. Hover reveals a single quick action in the bottom-right corner
// depending on the book's current status:
//
//   backlog    → 📖 "start reading"  (promotes to active)
//   active     → ✓  "mark finished" (promotes to completed)
//   completed  → ✎  "edit"          (opens drawer)
//   abandoned  → ↺  "restart"       (demotes to backlog)
//
// The outer wrapper is a div with role="button" (not a literal <button>)
// because the hover-reveal quick action IS a real <button> nested inside,
// and <button> inside <button> is invalid HTML — React will refuse to
// hydrate it. Keyboard affordance is preserved via tabIndex + onKeyDown
// so Enter / Space still open the drawer.

import { BookOpen, Check, Pencil, RotateCcw, Star } from "lucide-react";
import type { ApiResource } from "@/lib/api";
import BookCover from "./BookCover";

type QuickActionKind = "start" | "finish" | "edit" | "restart";

interface BookCardProps {
  book: ApiResource;
  onOpen: (book: ApiResource) => void;
  onQuickAction: (book: ApiResource, action: QuickActionKind) => void;
  /** Width of the cover in pixels. Defaults to 88. */
  coverWidth?: number;
}

const quickActionFor = (status: ApiResource["status"]): QuickActionKind => {
  switch (status) {
    case "backlog":   return "start";
    case "active":    return "finish";
    case "completed": return "edit";
    case "abandoned": return "restart";
    default:          return "edit";
  }
};

const ACTION_LABELS: Record<QuickActionKind, string> = {
  start:   "Start reading",
  finish:  "Mark as finished",
  edit:    "Edit",
  restart: "Move back to seeds",
};

const ActionIcon = ({ kind }: { kind: QuickActionKind }) => {
  const props = { size: 13, strokeWidth: 2 };
  if (kind === "start")   return <BookOpen {...props} />;
  if (kind === "finish")  return <Check {...props} />;
  if (kind === "restart") return <RotateCcw {...props} />;
  return <Pencil {...props} />;
};

export default function BookCard({
  book,
  onOpen,
  onQuickAction,
  coverWidth = 88,
}: BookCardProps) {
  const action = quickActionFor(book.status);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(book)}
      onKeyDown={(e) => {
        // Enter / Space behave like a native button click
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(book);
        }
      }}
      className="group relative flex-shrink-0 flex flex-col items-start text-left cursor-pointer focus:outline-none focus-visible:outline-2 focus-visible:outline-forest focus-visible:outline-offset-4 rounded-[4px]"
      style={{ width: `${coverWidth}px` }}
      aria-label={`Open ${book.title}`}
    >
      <div className="relative">
        <BookCover coverUrl={book.cover_url} title={book.title} width={coverWidth} />

        {/* Hover-reveal quick action — bottom-right corner. Stops propagation
            so clicking the action doesn't also open the drawer. */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onQuickAction(book, action);
          }}
          aria-label={ACTION_LABELS[action]}
          title={ACTION_LABELS[action]}
          className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-parchment/95 border border-bark text-forest opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 hover:bg-forest hover:text-parchment hover:border-forest transition-all duration-200 flex items-center justify-center shadow-[0_2px_6px_rgba(60,40,10,0.18)]"
        >
          <ActionIcon kind={action} />
        </button>

        {/* Rating mark — amber pip pinned to the top-right on finished books */}
        {book.status === "completed" && book.rating !== null && book.rating !== undefined && (
          <span
            className="absolute top-1 right-1 inline-flex items-center gap-0.5 bg-parchment/95 border border-bark-subtle rounded-full px-1.5 py-[2px] font-data text-[9px] text-amber-sol leading-none shadow-[0_1px_3px_rgba(60,40,10,0.12)]"
            title={`Rated ${book.rating} of 5`}
          >
            <Star size={8} strokeWidth={0} fill="#c07d2e" />
            {book.rating}
          </span>
        )}
      </div>

      {/* Label — title + author */}
      <div className="mt-2.5 w-full">
        <p
          className={`font-display italic font-semibold leading-tight text-[12px] line-clamp-2 ${
            book.status === "abandoned" ? "text-ink-3" : "text-ink"
          }`}
        >
          {book.title}
        </p>
        {book.author && (
          <p className="mt-0.5 font-reading italic text-[10.5px] text-ink-3 truncate">
            {book.author}
          </p>
        )}
      </div>
    </div>
  );
}
