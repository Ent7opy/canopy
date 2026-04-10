"use client";

// ─── BookshelfShelf — a plate in the herbarium ──────────────────────────────
// A container for one status's worth of books. Renders a label, a count,
// a sort control, and the grid/scroller of cards. Also owns the empty-state
// prose ("No seeds yet…") so the plate never reads as broken.
//
// Two layout modes:
//   • "grid"       — single-column stack, used for the "In bloom" shelf.
//                    Full-width cards give the inline page logger room to
//                    breathe; two hero cards squeezed side-by-side on a
//                    780px plate was unusable.
//   • "row"        — horizontal flex scroller, used for Seeds + Pressed.
//
// Each plate is wrapped in a parchment-grained card that mirrors the Weekly
// Review hero's chrome (faint grid, corner botanical) so the whole /garden
// feels like one bound volume.

import type { ReactNode } from "react";
import { Flower2, Leaf, Sprout, Trash2 } from "lucide-react";

type ShelfKind = "in-bloom" | "seeds" | "pressed" | "wilted";

interface BookshelfShelfProps {
  kind: ShelfKind;
  title: string;
  count: number;
  subtitle?: ReactNode;
  sortControl?: ReactNode;
  layout: "grid" | "row";
  emptyLabel: string;
  children: ReactNode;
}

const KIND_ICON: Record<ShelfKind, (props: { size: number; className: string; strokeWidth: number }) => ReactNode> = {
  "in-bloom": (p) => <Flower2 {...p} />,
  "seeds":    (p) => <Sprout {...p} />,
  "pressed":  (p) => <Leaf {...p} />,
  "wilted":   (p) => <Trash2 {...p} />,
};

// Corner decoration for each plate. Sized and rotated per kind to look hand-placed.
const CORNER_DECORATION: Record<ShelfKind, { rotate: number; size: number; opacity: number }> = {
  "in-bloom": { rotate: -12, size: 160, opacity: 0.07 },
  "seeds":    { rotate: 8,   size: 140, opacity: 0.06 },
  "pressed":  { rotate: -6,  size: 150, opacity: 0.07 },
  "wilted":   { rotate: 0,   size: 110, opacity: 0.05 },
};

export default function BookshelfShelf({
  kind,
  title,
  count,
  subtitle,
  sortControl,
  layout,
  emptyLabel,
  children,
}: BookshelfShelfProps) {
  const Icon = KIND_ICON[kind];
  const corner = CORNER_DECORATION[kind];

  return (
    <section
      className="relative rounded-[14px] border border-bark-subtle bg-surface px-6 pt-6 pb-7 mb-6 overflow-hidden"
      style={{ boxShadow: "0 2px 14px rgba(60,40,10,0.05)" }}
    >
      {/* Paper grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #1c1a14 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, #1c1a14 0 1px, transparent 1px 3px)",
        }}
      />
      {/* Corner botanical — rotated/sized per shelf for hand-placed feel */}
      <div
        className="absolute -top-6 -right-6 text-forest pointer-events-none"
        style={{
          opacity: corner.opacity,
          transform: `rotate(${corner.rotate}deg)`,
        }}
      >
        {Icon({ size: corner.size, className: "", strokeWidth: 1.1 })}
      </div>

      {/* Plate header */}
      <header className="relative flex items-end justify-between gap-4 mb-5">
        <div className="flex items-baseline gap-3 min-w-0">
          <span className="text-forest flex-shrink-0 -translate-y-[2px]">
            {Icon({ size: 18, className: "", strokeWidth: 1.6 })}
          </span>
          <h3 className="font-display italic font-semibold text-[22px] text-ink leading-none">
            {title}
          </h3>
          <span className="font-data text-[11px] text-ink-3 tabular-nums">
            {count === 0 ? "—" : count}
          </span>
          {subtitle && (
            <span className="font-data text-[9px] uppercase tracking-[0.14em] text-ink-3 truncate">
              {subtitle}
            </span>
          )}
        </div>
        {sortControl && <div className="flex-shrink-0">{sortControl}</div>}
      </header>

      {/* Plate body */}
      {count === 0 ? (
        <p className="relative font-reading italic text-[13px] text-ink-3 py-6 text-center">
          {emptyLabel}
        </p>
      ) : layout === "grid" ? (
        <div className="relative grid grid-cols-1 gap-5">{children}</div>
      ) : (
        // Horizontal scroller — a touch of right padding so the last card
        // has breathing room from the plate edge, and a custom scrollbar
        // baseline inherited from globals.css.
        <div className="relative -mx-1 px-1">
          <div className="flex gap-5 overflow-x-auto pb-3 pt-1 scroll-smooth">
            {children}
            <div className="flex-shrink-0 w-2" aria-hidden="true" />
          </div>
        </div>
      )}
    </section>
  );
}
