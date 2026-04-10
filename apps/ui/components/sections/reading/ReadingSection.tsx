"use client";

// ─── ReadingSection — "The Herbarium" ───────────────────────────────────────
// The /garden → Reading plate. Composes the four shelves (In bloom, Seeds,
// Pressed, Wilted), the entry bar, the detail drawer, and the year-in-reading
// strip into one visually cohesive page.
//
// Replaces the old click-to-cycle ResourcesSection. All CRUD for books lives
// here: add via the manual entry bar (title + optional author), edit via
// drawer, delete via drawer, quick promote/finish via hover actions, inline
// page logging via the ActiveBookCard.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createResource,
  deleteResource,
  getResources,
  patchResource,
  type ApiResource,
} from "@/lib/api";

import BookCard from "./BookCard";
import ActiveBookCard from "./ActiveBookCard";
import BookshelfShelf from "./BookshelfShelf";
import BookEntryBar from "./BookEntryBar";
import BookDrawer from "./BookDrawer";
import YearInReading from "./YearInReading";

type QuickActionKind = "start" | "finish" | "edit" | "restart";

export function ReadingSection() {
  const [books, setBooks] = useState<ApiResource[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Drawer state — the currently-editing book (if any).
  const [drawerBook, setDrawerBook] = useState<ApiResource | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // "Just added" banner — a soft confirmation after a new entry.
  const [justAdded, setJustAdded] = useState<ApiResource | null>(null);

  // Abandoned shelf toggle — hidden by default to keep the page calm.
  const [showWilted, setShowWilted] = useState(false);

  // Keyboard: `/` focuses the title input. We keep a ref on the input and
  // wire the listener up at the page level.
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getResources({ type: "book" }).then((data) => {
      if (data) setBooks(data);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" &&
          document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        titleInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Auto-dismiss the "just added" banner after 6 seconds.
  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(null), 6000);
    return () => clearTimeout(t);
  }, [justAdded]);

  // ── Derived slices ────────────────────────────────────────────────────────

  const inBloom = useMemo(
    () =>
      books
        .filter((b) => b.status === "active")
        .sort((a, b) =>
          (b.started_at ?? "").localeCompare(a.started_at ?? "")
        ),
    [books]
  );

  const seeds = useMemo(
    () => books.filter((b) => b.status === "backlog"),
    [books]
  );

  const pressed = useMemo(
    () =>
      books
        .filter((b) => b.status === "completed")
        .sort((a, b) =>
          (b.completed_at ?? "").localeCompare(a.completed_at ?? "")
        ),
    [books]
  );

  const wilted = useMemo(
    () => books.filter((b) => b.status === "abandoned"),
    [books]
  );

  const pressedThisYear = useMemo(() => {
    const thisYear = new Date().getFullYear();
    return pressed.filter((b) => {
      if (!b.completed_at) return false;
      return new Date(b.completed_at).getFullYear() === thisYear;
    });
  }, [pressed]);

  // ── CRUD handlers ─────────────────────────────────────────────────────────

  const upsert = useCallback((row: ApiResource) => {
    setBooks((prev) => {
      const idx = prev.findIndex((b) => b.id === row.id);
      if (idx === -1) return [row, ...prev];
      const next = [...prev];
      next[idx] = row;
      return next;
    });
  }, []);

  const handleAdd = useCallback(async (title: string, author: string | null) => {
    const created = await createResource({
      type: "book",
      title,
      author: author ?? undefined,
      status: "backlog",
    });
    if (created) {
      upsert(created);
      setJustAdded(created);
    }
  }, [upsert]);

  const handleOpen = useCallback((book: ApiResource) => {
    setDrawerBook(book);
    setDrawerOpen(true);
  }, []);

  const handleSave = useCallback(async (id: string, patch: Partial<ApiResource>) => {
    const updated = await patchResource(id, patch);
    if (updated) upsert(updated);
  }, [upsert]);

  const handleDelete = useCallback(async (id: string) => {
    await deleteResource(id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const handleQuickAction = useCallback(
    async (book: ApiResource, action: QuickActionKind) => {
      const today = new Date().toISOString().slice(0, 10);
      if (action === "start") {
        const updated = await patchResource(book.id, {
          status: "active",
          started_at: book.started_at ?? today,
        });
        if (updated) upsert(updated);
      } else if (action === "finish") {
        const updated = await patchResource(book.id, {
          status: "completed",
          completed_at: book.completed_at ?? today,
          // If they had page progress, flush it to 100%
          progress_current:
            book.progress_total && book.progress_current !== book.progress_total
              ? book.progress_total
              : book.progress_current,
        });
        if (updated) upsert(updated);
      } else if (action === "restart") {
        const updated = await patchResource(book.id, {
          status: "backlog",
          // Reset started_at so a re-read gets a fresh stamp
          started_at: null,
        });
        if (updated) upsert(updated);
      } else {
        // action === "edit" — opens the drawer
        handleOpen(book);
      }
    },
    [handleOpen, upsert]
  );

  // Inline page-log handler used by ActiveBookCard.
  const handleLogProgress = useCallback(
    async (book: ApiResource, delta: number) => {
      const nextCurrent = Math.max(0, (book.progress_current ?? 0) + delta);
      const updated = await patchResource(book.id, { progress_current: nextCurrent });
      if (updated) upsert(updated);
    },
    [upsert]
  );

  // ── Render ────────────────────────────────────────────────────────────────

  const totalAllTime = pressed.length;
  const yearCount = pressedThisYear.length;
  const currentYear = new Date().getFullYear();

  return (
    <section id="reading" className="mb-16 scroll-mt-20">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="font-data text-[10px] uppercase tracking-[0.22em] text-ink-3 mb-1">
            The Herbarium
          </p>
          <h3 className="text-[26px] font-display italic font-semibold text-ink leading-none">
            Reading
          </h3>
        </div>
        {loaded && books.length > 0 && (
          <p className="font-reading italic text-[12px] text-ink-3 pb-1">
            {inBloom.length} in bloom · {seeds.length} seeded · {totalAllTime} pressed
          </p>
        )}
      </div>

      {/* Entry bar — write the title and author yourself, no search API */}
      <BookEntryBar onAdd={handleAdd} titleInputRef={titleInputRef} />

      {/* Just-added confirmation banner — soft, auto-dismisses */}
      {justAdded && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-[8px] border border-forest/40 bg-forest-dim px-4 py-2.5">
          <p className="font-reading italic text-[12.5px] text-forest truncate">
            Added <span className="font-semibold not-italic">{justAdded.title}</span> to the seeds shelf.
          </p>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={async () => {
                await handleQuickAction(justAdded, "start");
                setJustAdded(null);
              }}
              className="font-data text-[10px] uppercase tracking-[0.14em] text-forest hover:text-amber-sol transition-colors"
            >
              start reading →
            </button>
            <button
              type="button"
              onClick={() => setJustAdded(null)}
              className="font-data text-[10px] uppercase tracking-[0.14em] text-forest/70 hover:text-forest transition-colors"
            >
              dismiss
            </button>
          </div>
        </div>
      )}

      {/* ── In bloom ─────────────────────────────────────────────────────── */}
      <BookshelfShelf
        kind="in-bloom"
        title="In bloom"
        count={inBloom.length}
        layout="grid"
        emptyLabel="Nothing in bloom right now. Pick a seed to start reading."
      >
        {inBloom.map((book) => (
          <ActiveBookCard
            key={book.id}
            book={book}
            onOpen={handleOpen}
            onLogProgress={handleLogProgress}
            onFinish={(b) => handleQuickAction(b, "finish")}
          />
        ))}
      </BookshelfShelf>

      {/* ── Seeds (backlog) ─────────────────────────────────────────────── */}
      <BookshelfShelf
        kind="seeds"
        title="Seeds"
        count={seeds.length}
        layout="row"
        emptyLabel="No seeds in the jar. Write a title above to plant one."
      >
        {seeds.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onOpen={handleOpen}
            onQuickAction={handleQuickAction}
          />
        ))}
      </BookshelfShelf>

      {/* ── Pressed (finished) ──────────────────────────────────────────── */}
      <BookshelfShelf
        kind="pressed"
        title="Pressed"
        count={pressed.length}
        subtitle={
          pressed.length > 0
            ? `${yearCount} in ${currentYear} · ${totalAllTime} all-time`
            : undefined
        }
        layout="row"
        emptyLabel="No pressings yet. The first harvest awaits."
      >
        {pressed.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onOpen={handleOpen}
            onQuickAction={handleQuickAction}
          />
        ))}
      </BookshelfShelf>

      {/* Year-in-reading strip — only shown when there's at least one pressing */}
      {pressed.length > 0 && (
        <div className="mt-1 mb-8 flex justify-center">
          <YearInReading books={pressed} year={currentYear} />
        </div>
      )}

      {/* ── Wilted (abandoned) — collapsed by default ───────────────────── */}
      {wilted.length > 0 && (
        <div className="mt-2">
          {!showWilted ? (
            <button
              type="button"
              onClick={() => setShowWilted(true)}
              className="w-full text-center font-reading italic text-[12px] text-ink-3 hover:text-amber-sol transition-colors py-3 border-t border-bark-subtle/60"
            >
              and {wilted.length} {wilted.length === 1 ? "book" : "books"} set aside · show
            </button>
          ) : (
            <BookshelfShelf
              kind="wilted"
              title="Wilted"
              count={wilted.length}
              layout="row"
              emptyLabel=""
              subtitle="set aside — not every book is for every season"
            >
              {wilted.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onOpen={handleOpen}
                  onQuickAction={handleQuickAction}
                  coverWidth={72}
                />
              ))}
            </BookshelfShelf>
          )}
        </div>
      )}

      {/* Loading state — only shown on first load */}
      {!loaded && (
        <p className="text-center font-reading italic text-[12px] text-ink-3 mt-6">
          gathering the shelf…
        </p>
      )}

      {/* Detail drawer — rendered once, driven by drawerBook state */}
      <BookDrawer
        book={drawerBook}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </section>
  );
}
