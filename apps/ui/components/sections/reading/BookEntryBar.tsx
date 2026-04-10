"use client";

// ─── BookEntryBar — the Herbarium's ledger entry row ────────────────────────
// A single parchment-framed row with two fields: Title and Author. Hitting
// Enter in either field (or clicking the quill button) adds the book to the
// Seeds shelf. Matches the hand-written naturalist-ledger vibe — you're
// scribbling entries, not searching a database.
//
// Title is required; author is optional. If the user just wants a title
// placeholder (e.g. "Untitled work"), they can leave author blank and fill
// it in later via the drawer.

import { BookOpen, Plus } from "lucide-react";
import { useState } from "react";

interface BookEntryBarProps {
  onAdd: (title: string, author: string | null) => Promise<void>;
  /** Exposed so the parent can programmatically focus the title input
   *  (e.g. from the `/` keyboard shortcut). */
  titleInputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function BookEntryBar({ onAdd, titleInputRef }: BookEntryBarProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [saving, setSaving] = useState(false);

  const canAdd = title.trim().length > 0 && !saving;

  const submit = async () => {
    if (!canAdd) return;
    setSaving(true);
    await onAdd(title.trim(), author.trim() || null);
    setSaving(false);
    setTitle("");
    setAuthor("");
    titleInputRef?.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
    if (e.key === "Escape") {
      setTitle("");
      setAuthor("");
      (e.currentTarget as HTMLInputElement).blur();
    }
  };

  return (
    <div className="mb-8">
      <div
        className="relative flex items-center gap-3 rounded-[10px] border border-bark bg-surface px-4 py-3 focus-within:border-forest transition-colors overflow-hidden"
        style={{ boxShadow: "0 2px 10px rgba(60,40,10,0.04)" }}
      >
        {/* Paper grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #1c1a14 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, #1c1a14 0 1px, transparent 1px 3px)",
          }}
        />

        {/* Leading icon */}
        <BookOpen
          size={16}
          strokeWidth={1.8}
          className="relative text-forest flex-shrink-0"
        />

        {/* Title field — Playfair italic placeholder so empty state looks like
            a line in a field journal waiting for ink */}
        <input
          ref={titleInputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Title…"
          aria-label="Book title"
          className="relative flex-1 min-w-0 bg-transparent font-display italic text-[15px] text-ink placeholder:text-ink-3/70 focus:outline-none"
        />

        {/* "by" separator — italic serif, muted, non-selectable */}
        <span
          aria-hidden="true"
          className="relative font-reading italic text-[12px] text-ink-3 flex-shrink-0 select-none"
        >
          by
        </span>

        {/* Author field */}
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Author…"
          aria-label="Book author"
          className="relative flex-1 min-w-0 bg-transparent font-reading italic text-[13px] text-ink-2 placeholder:text-ink-3/60 focus:outline-none"
        />

        {/* `/` kbd hint — muted, only meaningful on focus-first-field */}
        <span className="relative hidden sm:inline font-data text-[9px] uppercase tracking-[0.14em] text-ink-3 flex-shrink-0 border border-bark-subtle rounded-sm px-1.5 py-0.5 select-none">
          /
        </span>

        {/* Add button */}
        <button
          type="button"
          onClick={submit}
          disabled={!canAdd}
          className="relative flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-forest hover:bg-forest-light text-parchment font-data text-[10px] uppercase tracking-[0.14em] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(61,107,79,0.25)]"
          aria-label="Add book"
        >
          <Plus size={11} strokeWidth={2.5} />
          {saving ? "adding…" : "add"}
        </button>
      </div>

      {/* Tiny hint beneath the bar — an aesthetic afterthought */}
      <p className="mt-1.5 pl-1 font-reading italic text-[11px] text-ink-3/80">
        Press <span className="font-data not-italic">Enter</span> to plant a new seed. Edit rating, pages, and notes later by clicking its cover.
      </p>
    </div>
  );
}
