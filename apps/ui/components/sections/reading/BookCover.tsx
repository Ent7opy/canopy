"use client";

// ─── BookCover ───────────────────────────────────────────────────────────────
// The reusable cover primitive used everywhere in the Reading Herbarium.
//
// Design notes:
// • Covers get a subtle sepia wash by default (`filter: sepia(0.14) ...`) so
//   they feel like they belong in the parchment field-journal aesthetic.
//   The wash lifts on hover — the one tactile moment of delight.
// • Spine shadow on the left edge via box-shadow + an inset highlight makes
//   every cover feel "mounted" on the page rather than floating.
// • When Open Library has no match (or the cover_url fetch fails), we render
//   a parchment-grain fallback with the title typeset in Playfair Display and
//   a small fern motif in the corner — still aesthetically consistent.
//
// The component is deliberately stupid: it owns no state, no click handling,
// no status mark. That's the parent card's job. It just renders a book.

import { Leaf } from "lucide-react";
import { useState } from "react";

interface BookCoverProps {
  coverUrl?: string | null;
  title: string;
  /** Width in pixels; height derives from a 2:3 book aspect ratio. */
  width?: number;
  /** When true, suppress the sepia wash (used inside the detail drawer). */
  raw?: boolean;
  className?: string;
}

export default function BookCover({
  coverUrl,
  title,
  width = 80,
  raw = false,
  className = "",
}: BookCoverProps) {
  const height = Math.round(width * 1.5);
  const [errored, setErrored] = useState(false);
  const showImage = coverUrl && !errored;

  return (
    <div
      className={`relative flex-shrink-0 overflow-hidden rounded-[3px] ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        boxShadow:
          "-3px 0 10px rgba(60,40,10,0.14), inset 2px 0 0 rgba(255,255,255,0.05), 0 4px 12px rgba(60,40,10,0.08)",
      }}
    >
      {showImage ? (
        <img
          src={coverUrl}
          alt={title}
          width={width}
          height={height}
          loading="lazy"
          onError={() => setErrored(true)}
          className="w-full h-full object-cover transition-[filter,transform] duration-200 ease-out will-change-transform group-hover:[filter:none] group-hover:-translate-y-[2px]"
          style={{
            filter: raw ? "none" : "sepia(0.14) brightness(0.97) contrast(1.02)",
          }}
        />
      ) : (
        <FallbackCover title={title} width={width} height={height} />
      )}
    </div>
  );
}

// ─── Fallback — parchment plate with typeset title ──────────────────────────
// Used when Open Library has no match. The aim is to look like a hand-bound
// cover the naturalist made themselves: surface-2 base, the title typeset in
// italic Playfair, a small fern in the corner, a hairline border that hints
// at stitching.

function FallbackCover({
  title,
  width,
  height,
}: {
  title: string;
  width: number;
  height: number;
}) {
  // Truncate so very long titles don't break the layout. Short covers
  // (width ≤ 60) get even shorter truncation.
  const maxChars = width <= 60 ? 30 : width <= 90 ? 56 : 120;
  const display = title.length > maxChars ? title.slice(0, maxChars - 1) + "…" : title;
  const titleSize = width <= 60 ? 9 : width <= 90 ? 11 : 14;

  return (
    <div
      className="relative w-full h-full bg-surface-2 flex flex-col items-center justify-center px-2 py-3 text-center"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(28,26,20,0.04) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(28,26,20,0.03) 0 1px, transparent 1px 3px)",
        boxShadow: "inset 0 0 0 1px rgba(200,185,154,0.6)",
      }}
    >
      {/* Corner fern */}
      <Leaf
        className="absolute bottom-1 right-1 text-forest opacity-[0.18] pointer-events-none"
        size={Math.max(14, Math.round(width * 0.28))}
        strokeWidth={1.1}
      />
      {/* Tiny top rule to suggest a printed cover */}
      <span
        className="absolute top-2 left-2 right-2 h-px bg-bark"
        style={{ opacity: 0.5 }}
      />
      <span
        className="absolute bottom-2 left-2 right-2 h-px bg-bark"
        style={{ opacity: 0.5 }}
      />

      <span
        className="relative font-display italic font-semibold text-forest leading-tight line-clamp-5"
        style={{
          fontSize: `${titleSize}px`,
          maxWidth: `${width - 16}px`,
          // subtle drop shadow so it reads against the grain
          textShadow: "0 1px 0 rgba(255,253,245,0.7)",
        }}
      >
        {display}
      </span>

      {/* Bottom-left monogram decoration to fill negative space on larger covers */}
      {height >= 120 && (
        <span
          className="absolute bottom-2 left-2 font-data text-[7px] text-ink-3 uppercase tracking-[0.2em]"
          style={{ opacity: 0.6 }}
        >
          canopy
        </span>
      )}
    </div>
  );
}
