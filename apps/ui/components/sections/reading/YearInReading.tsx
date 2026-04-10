"use client";

// ─── YearInReading — a small decorative timeline flourish ───────────────────
// A thin horizontal SVG strip stretched across the year. Each finished book
// becomes an amber tick at its `completed_at` month position. Hovering a
// tick surfaces a floating tooltip with the book's title and author.
//
// Intentionally quiet — this is a decoration, not a primary UI. It lives
// inside the "Pressed" shelf header to give the year-to-date count something
// visual to hang onto. When there are no completions yet, it draws just the
// month baseline so the plate still feels alive.

import { useState } from "react";
import type { ApiResource } from "@/lib/api";

interface YearInReadingProps {
  books: ApiResource[];
  year: number;
}

const MONTH_LABELS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export default function YearInReading({ books, year }: YearInReadingProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // SVG layout
  const W = 540;
  const H = 38;
  const padX = 14;
  const plotW = W - padX * 2;
  const baselineY = H - 14;

  // Fraction 0..1 through the year from a YYYY-MM-DD string.
  const yearFraction = (iso: string) => {
    const d = new Date(iso);
    const start = new Date(year, 0, 1).getTime();
    const end = new Date(year + 1, 0, 1).getTime();
    const t = (d.getTime() - start) / (end - start);
    return Math.max(0, Math.min(1, t));
  };

  // Filter to books that finished this year, with valid dates.
  const finishedThisYear = books
    .filter((b) => {
      if (!b.completed_at) return false;
      const d = new Date(b.completed_at);
      return d.getFullYear() === year;
    })
    .map((b) => ({
      book: b,
      x: padX + yearFraction(b.completed_at!) * plotW,
    }));

  const hovered = hoveredId
    ? finishedThisYear.find(({ book }) => book.id === hoveredId)
    : null;

  return (
    <div className="relative w-full max-w-[540px]">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="none">
        {/* Baseline */}
        <line
          x1={padX}
          x2={W - padX}
          y1={baselineY}
          y2={baselineY}
          stroke="#c8b99a"
          strokeWidth="1"
        />

        {/* Monthly tick marks + letter labels */}
        {MONTH_LABELS.map((letter, i) => {
          const x = padX + (plotW * i) / 11;
          return (
            <g key={i}>
              <line
                x1={x}
                x2={x}
                y1={baselineY - 3}
                y2={baselineY + 3}
                stroke="#c8b99a"
                strokeWidth="1"
              />
              <text
                x={x}
                y={H - 2}
                fontFamily="var(--font-jetbrains), monospace"
                fontSize="8"
                textAnchor="middle"
                fill="#9c8f78"
                style={{ letterSpacing: "0.1em" }}
              >
                {letter}
              </text>
            </g>
          );
        })}

        {/* Book ticks — amber circles above the baseline */}
        {finishedThisYear.map(({ book, x }) => {
          const hoveredNow = hoveredId === book.id;
          return (
            <g
              key={book.id}
              onMouseEnter={() => setHoveredId(book.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Stem */}
              <line
                x1={x}
                x2={x}
                y1={baselineY}
                y2={baselineY - (hoveredNow ? 14 : 10)}
                stroke="#c07d2e"
                strokeWidth={hoveredNow ? 1.4 : 1}
              />
              {/* Berry */}
              <circle
                cx={x}
                cy={baselineY - (hoveredNow ? 14 : 10)}
                r={hoveredNow ? 3.2 : 2.4}
                fill="#c07d2e"
              />
            </g>
          );
        })}
      </svg>

      {/* Floating tooltip for the hovered tick */}
      {hovered && (
        <div
          className="absolute -top-2 -translate-x-1/2 -translate-y-full pointer-events-none whitespace-nowrap rounded-[6px] border border-bark bg-surface px-2.5 py-1.5"
          style={{
            left: `${(hovered.x / W) * 100}%`,
            boxShadow: "0 3px 12px rgba(60,40,10,0.2)",
          }}
        >
          <p className="font-display italic font-semibold text-[11px] text-ink leading-none">
            {hovered.book.title}
          </p>
          {hovered.book.author && (
            <p className="font-reading italic text-[10px] text-ink-3 mt-0.5 leading-none">
              {hovered.book.author}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
