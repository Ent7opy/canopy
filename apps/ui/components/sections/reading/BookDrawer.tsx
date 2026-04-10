"use client";

// ─── BookDrawer — the edit / delete surface ─────────────────────────────────
// A right-side parchment-framed drawer that owns all the rich book editing:
// title, author, URL, status, rating (1–5 amber stars), progress pages, notes
// (uses the `review` column), and delete.
//
// Opens from the right with a 240ms slide. Closes on: the X button, clicking
// the dim backdrop, or pressing Escape. The drawer is uncontrolled from the
// parent's POV — `open` toggles visibility and `book` provides the current
// row. On Save, we pass the patched fields up via `onSave`.

import { useEffect, useState } from "react";
import { BookMarked, Flower2, Leaf, Link2, Sprout, Star, Trash2, X } from "lucide-react";
import type { ApiResource } from "@/lib/api";
import BookCover from "./BookCover";

type DrawerStatus = "backlog" | "active" | "completed" | "abandoned";

interface BookDrawerProps {
  book: ApiResource | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, patch: Partial<ApiResource>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const STATUS_OPTIONS: Array<{ value: DrawerStatus; label: string; icon: React.ReactNode }> = [
  { value: "backlog",   label: "Seeds",    icon: <Sprout size={12} strokeWidth={1.8} /> },
  { value: "active",    label: "In bloom", icon: <Flower2 size={12} strokeWidth={1.8} /> },
  { value: "completed", label: "Pressed",  icon: <Leaf size={12} strokeWidth={1.8} /> },
  { value: "abandoned", label: "Wilted",   icon: <Trash2 size={12} strokeWidth={1.8} /> },
];

export default function BookDrawer({ book, open, onClose, onSave, onDelete }: BookDrawerProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<DrawerStatus>("backlog");
  const [rating, setRating] = useState<number | null>(null);
  const [progressCurrent, setProgressCurrent] = useState("");
  const [progressTotal, setProgressTotal] = useState("");
  const [review, setReview] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Rehydrate the form whenever the target book changes.
  useEffect(() => {
    if (!book) return;
    setTitle(book.title ?? "");
    setAuthor(book.author ?? "");
    setUrl(book.url ?? "");
    setStatus((book.status as DrawerStatus) ?? "backlog");
    setRating(book.rating);
    setProgressCurrent(book.progress_current?.toString() ?? "");
    setProgressTotal(book.progress_total?.toString() ?? "");
    setReview(book.review ?? "");
    setConfirmDelete(false);
  }, [book]);

  // Escape key closes the drawer — only while it's actually open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!book) return null;

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);

    // Only patch fields that changed to keep the payload tidy.
    const patch: Partial<ApiResource> = {};
    if (title.trim() !== book.title) patch.title = title.trim();
    if ((author.trim() || null) !== book.author) patch.author = author.trim() || null;
    if ((url.trim() || null) !== book.url) patch.url = url.trim() || null;
    if (status !== book.status) {
      patch.status = status;
      // Auto-stamp dates when transitioning status — so the Finished shelf
      // can show "finished Mar 14" without the user having to backfill.
      const today = new Date().toISOString().slice(0, 10);
      if (status === "active" && !book.started_at) patch.started_at = today;
      if (status === "completed" && !book.completed_at) patch.completed_at = today;
    }
    if (rating !== book.rating) patch.rating = rating;
    const pcNum = progressCurrent === "" ? null : Number(progressCurrent);
    const ptNum = progressTotal === "" ? null : Number(progressTotal);
    if (pcNum !== book.progress_current) patch.progress_current = pcNum;
    if (ptNum !== book.progress_total) patch.progress_total = ptNum;
    if ((review.trim() || null) !== book.review) patch.review = review.trim() || null;

    await onSave(book.id, patch);
    setSaving(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setSaving(true);
    await onDelete(book.id);
    setSaving(false);
    onClose();
  };

  return (
    <>
      {/* Dim backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-ink/30 backdrop-blur-[1px] transition-opacity duration-240 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[440px] bg-surface border-l border-bark-subtle overflow-y-auto transition-transform duration-240 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          boxShadow: "-12px 0 36px rgba(60,40,10,0.18)",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        aria-label="Book detail"
      >
        {/* Paper grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #1c1a14 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, #1c1a14 0 1px, transparent 1px 3px)",
          }}
        />
        {/* Corner leaf */}
        <Leaf
          className="absolute -top-5 -right-5 text-forest opacity-[0.07] pointer-events-none"
          size={150}
          strokeWidth={1.1}
        />

        <div className="relative p-8 pb-10">
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="absolute top-5 right-5 w-8 h-8 rounded-full border border-bark text-ink-2 hover:border-forest hover:text-forest transition-colors flex items-center justify-center"
          >
            <X size={14} strokeWidth={1.8} />
          </button>

          {/* Header — cover + type label */}
          <div className="flex items-end gap-5 mb-8 pr-10">
            <div className="flex-shrink-0">
              <BookCover coverUrl={book.cover_url} title={title || book.title} width={110} raw />
            </div>
            <div className="flex-1 pb-2 min-w-0">
              <div className="flex items-center gap-2 text-ink-3 mb-1">
                <BookMarked size={12} strokeWidth={1.6} />
                <span className="font-data text-[9px] uppercase tracking-[0.16em]">
                  Specimen
                </span>
              </div>
              <p className="font-display italic font-semibold text-[22px] text-ink leading-tight line-clamp-3">
                {title || "Untitled"}
              </p>
              {author && (
                <p className="font-reading italic text-[13px] text-ink-3 mt-0.5 truncate">
                  {author}
                </p>
              )}
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-6">
            {/* Title + author */}
            <div className="grid grid-cols-1 gap-4">
              <LabeledInput
                label="Title"
                value={title}
                onChange={setTitle}
                placeholder="The untitled book…"
              />
              <LabeledInput
                label="Author"
                value={author}
                onChange={setAuthor}
                placeholder="Unknown"
              />
              <LabeledInput
                label="Link"
                value={url}
                onChange={setUrl}
                placeholder="https://…"
                icon={<Link2 size={11} strokeWidth={1.8} />}
              />
            </div>

            {/* Status */}
            <div>
              <Label>Status</Label>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-data text-[10px] uppercase tracking-[0.14em] transition-colors ${
                      status === opt.value
                        ? "border-forest bg-forest-dim text-forest"
                        : "border-bark-subtle text-ink-3 hover:border-bark hover:text-ink-2"
                    }`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <Label>Rating</Label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => {
                  const filled = rating !== null && n <= rating;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(rating === n ? null : n)}
                      aria-label={`Rate ${n} of 5`}
                      className="p-1 -m-1 transition-transform hover:scale-110"
                    >
                      <Star
                        size={20}
                        strokeWidth={1.6}
                        className={filled ? "text-amber-sol" : "text-bark"}
                        fill={filled ? "#c07d2e" : "none"}
                      />
                    </button>
                  );
                })}
                {rating !== null && (
                  <button
                    type="button"
                    onClick={() => setRating(null)}
                    className="ml-2 font-data text-[9px] uppercase tracking-[0.12em] text-ink-3 hover:text-amber-sol transition-colors"
                  >
                    clear
                  </button>
                )}
              </div>
            </div>

            {/* Progress */}
            <div>
              <Label>Progress (pages)</Label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={progressCurrent}
                  onChange={(e) => setProgressCurrent(e.target.value)}
                  placeholder="current"
                  className="w-24 px-3 py-2 rounded-[6px] border border-bark bg-surface-2 font-data text-[13px] text-ink focus:outline-none focus:border-forest tabular-nums"
                />
                <span className="font-data text-[11px] text-ink-3">of</span>
                <input
                  type="number"
                  value={progressTotal}
                  onChange={(e) => setProgressTotal(e.target.value)}
                  placeholder="total"
                  className="w-24 px-3 py-2 rounded-[6px] border border-bark bg-surface-2 font-data text-[13px] text-ink focus:outline-none focus:border-forest tabular-nums"
                />
              </div>
            </div>

            {/* Notes (review) */}
            <div>
              <Label>Notes</Label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={5}
                placeholder="What did this one leave behind?"
                className="w-full px-3 py-2 rounded-[6px] border border-bark bg-surface-2 font-reading italic text-[13px] text-ink leading-relaxed focus:outline-none focus:border-forest resize-y"
              />
            </div>
          </div>

          {/* Footer — save + delete */}
          <div className="mt-10 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className={`inline-flex items-center gap-1.5 font-data text-[10px] uppercase tracking-[0.14em] transition-colors ${
                confirmDelete
                  ? "text-amber-sol"
                  : "text-ink-3 hover:text-amber-sol"
              }`}
            >
              <Trash2 size={11} strokeWidth={1.8} />
              {confirmDelete ? "click again to confirm" : "delete"}
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="font-data text-[10px] uppercase tracking-[0.14em] text-ink-3 hover:text-ink-2 transition-colors"
              >
                cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !title.trim()}
                className="px-4 py-2 rounded-full bg-forest hover:bg-forest-light text-parchment font-data text-[10px] uppercase tracking-[0.14em] transition-colors disabled:opacity-40 shadow-[0_2px_8px_rgba(61,107,79,0.25)]"
              >
                {saving ? "saving…" : "save"}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Small internal helpers ────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-data text-[9px] uppercase tracking-[0.16em] text-ink-3 mb-2">
      {children}
    </p>
  );
}

function LabeledInput({
  label, value, onChange, placeholder, icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 text-ink-3 pointer-events-none">{icon}</span>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full py-2 rounded-[6px] border border-bark bg-surface-2 font-reading text-[13px] text-ink focus:outline-none focus:border-forest ${
            icon ? "pl-9 pr-3" : "px-3"
          }`}
        />
      </div>
    </div>
  );
}
