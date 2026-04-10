"use client";

// ─── WeeklyReviewSection — "A naturalist's weekly spread" ─────────────────────
//
// This is the entire /review route: one long, visually cohesive page that
// automatically surfaces what you actually did this week instead of asking
// you to recall and type it in.
//
// Design direction: opening a hardcover field journal to a two-page weekly
// spread. Large italic Playfair numerals, a calendar ribbon of days, two
// hand-drawn ink sparklines (forest mood / amber energy), a habit rhythm
// grid of filled and hollow circles, journal echoes clipped to a single
// vertical fern-stem, mind-log captures as marginalia, finished books as
// pressed specimens. No new libraries — every chart is a hand-rolled SVG.
//
// Everything lives in one file on purpose: the sections are tightly coupled
// to a single data hook (`useWeeklyDashboard`), the subcomponents are never
// reused elsewhere, and keeping them colocated makes the visual rhythm of
// the page readable top-to-bottom.

import Link from "next/link";
import {
  Leaf, Sprout, Flower2, BookOpen, Feather, Moon, Sparkles,
  BookMarked, Film, Headphones, Newspaper, Video, GraduationCap,
} from "lucide-react";

import { useActiveWeek } from "@/hooks/useActiveWeek";
import { useWeeklyDashboard, type WeeklyPulse } from "@/hooks/useWeeklyDashboard";
import { weekdayInitial, weekdayShort, dayOfMonth } from "@/lib/weekUtils";
import { todayISO } from "@/hooks/useActiveDate";
import WeekNavigator from "@/components/WeekNavigator";
import FernDivider from "@/components/FernDivider";
import OakDivider from "@/components/OakDivider";
import type { ApiJournalEntry, ApiInboxItem, ApiResource, WeeklyHabitRow } from "@/lib/api";

// ══ Main component ═══════════════════════════════════════════════════════════

export function WeeklyReviewSection() {
  const { weekStart, weekEnd, days, weekNumber, isThisWeek } = useActiveWeek();
  const { pulse, loaded } = useWeeklyDashboard(weekStart, weekEnd, days);

  return (
    <section id="review" className="mb-16 scroll-mt-20">
      <WeekNavigator />

      <WeeklyHero
        weekNumber={weekNumber}
        days={days}
        isThisWeek={isThisWeek}
        pulse={pulse}
      />

      <PulseStrip pulse={pulse} />

      <FernDivider />

      <PulseChart days={days} pulse={pulse} />

      <HabitRhythmGrid days={days} habits={pulse.habits} pulse={pulse} loaded={loaded} />

      <FernDivider />

      <JournalEchoes entries={pulse.journal} loaded={loaded} />

      <MindLogCaptures items={pulse.inbox} loaded={loaded} />

      <GardenActivity resources={pulse.completedResources} loaded={loaded} />

      <OakDivider />

      {!loaded && (
        <p className="text-center font-reading italic text-[12px] text-ink-3 -mt-4">
          gathering the week…
        </p>
      )}
    </section>
  );
}

// ══ Hero ═════════════════════════════════════════════════════════════════════
// A large italic "Week N" numeral, a short subtitle, and a calendar ribbon
// of the 7 days with today circled. Sets the tone: this is a page from a
// nature journal, not a corporate dashboard.

function WeeklyHero({
  weekNumber, days, isThisWeek, pulse,
}: {
  weekNumber: number;
  days: string[];
  isThisWeek: boolean;
  pulse: WeeklyPulse;
}) {
  const today = todayISO();
  const subtitle = isThisWeek
    ? "Here's how the week has unfolded so far."
    : "A look back at how that week unfolded.";

  return (
    <header
      className="relative mb-10 overflow-hidden rounded-[14px] border border-bark-subtle bg-surface px-8 pt-10 pb-8"
      style={{ boxShadow: "0 3px 18px rgba(60,40,10,0.05)" }}
    >
      {/* Faint paper-grain texture via repeating-linear-gradient. Just enough
          to suggest parchment without crossing into kitsch. */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #1c1a14 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, #1c1a14 0 1px, transparent 1px 3px)",
        }}
      />
      {/* A decorative leaf tucked in the top-right corner */}
      <Leaf
        className="absolute -top-4 -right-4 text-forest opacity-[0.07] pointer-events-none"
        size={140}
        strokeWidth={1.1}
      />

      <div className="relative flex items-end gap-6 mb-8">
        <div className="flex flex-col items-center flex-shrink-0">
          <span className="font-data text-[10px] uppercase tracking-[0.22em] text-ink-3 mb-1">
            Week
          </span>
          <span
            className="font-display italic font-semibold text-forest leading-none"
            style={{ fontSize: "88px" }}
          >
            {weekNumber}
          </span>
        </div>
        <div className="flex-1 pb-3">
          <p className="font-display italic text-[24px] text-ink leading-snug mb-2">
            {isThisWeek ? "This week in Canopy" : "That week in Canopy"}
          </p>
          <p className="font-reading italic text-[14px] text-ink-2 max-w-[460px]">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Calendar ribbon — 7 day tiles. Past days muted; today marked with a
          small forest dot; future days drawn faint. */}
      <div className="relative grid grid-cols-7 gap-2">
        {days.map((iso) => {
          const isToday = iso === today;
          const isPast = iso < today;
          const hasJournal = pulse.journal.some((e) => e.entry_date === iso);
          const dim = !isPast && !isToday;
          return (
            <div
              key={iso}
              className={`flex flex-col items-center py-3 rounded-[8px] border transition-colors ${
                isToday
                  ? "border-forest bg-forest-dim"
                  : dim
                  ? "border-bark-subtle bg-surface-2/40"
                  : "border-bark-subtle bg-surface-2"
              }`}
            >
              <span
                className={`font-data text-[9px] uppercase tracking-[0.12em] ${
                  dim ? "text-ink-3/60" : "text-ink-3"
                }`}
              >
                {weekdayInitial(iso)}
              </span>
              <span
                className={`font-display italic font-semibold leading-none mt-1 ${
                  isToday
                    ? "text-forest text-[22px]"
                    : dim
                    ? "text-ink-3/60 text-[20px]"
                    : "text-ink text-[20px]"
                }`}
              >
                {dayOfMonth(iso)}
              </span>
              {hasJournal && (
                <span className={`mt-1.5 w-1 h-1 rounded-full ${isToday ? "bg-forest" : "bg-forest/70"}`} />
              )}
            </div>
          );
        })}
      </div>
    </header>
  );
}

// ══ Pulse strip — 4 asymmetric KPI tiles ═════════════════════════════════════
// Breaks the monotony of the usual equal-column KPI grid by making one
// feature tile (avg mood) wider than the other three satellites.

function PulseStrip({ pulse }: { pulse: WeeklyPulse }) {
  const moodLabel = pulse.avgMood !== null ? pulse.avgMood.toFixed(1) : "—";
  const energyLabel = pulse.avgEnergy !== null ? pulse.avgEnergy.toFixed(1) : "—";
  const sleepLabel = pulse.avgSleep !== null ? pulse.avgSleep.toFixed(1) + "h" : "—";
  const habitRate =
    pulse.habitCompletionRate !== null
      ? `${Math.round(pulse.habitCompletionRate * 100)}%`
      : "—";

  return (
    <div className="grid grid-cols-12 gap-3 mb-10">
      {/* Feature tile — avg mood, wider, with a sprig icon */}
      <FeatureTile
        label="Average mood"
        value={moodLabel}
        suffix={pulse.avgMood !== null ? " / 10" : ""}
        caption={`${pulse.daysJournaled} / 7 days journaled`}
      />
      {/* Satellite tiles */}
      <SatelliteTile
        icon={<Flower2 size={14} strokeWidth={1.6} />}
        label="Energy"
        value={energyLabel}
        suffix={pulse.avgEnergy !== null ? "/10" : ""}
      />
      <SatelliteTile
        icon={<Moon size={14} strokeWidth={1.6} />}
        label="Sleep"
        value={sleepLabel}
        suffix=""
      />
      <SatelliteTile
        icon={<Sprout size={14} strokeWidth={1.6} />}
        label="Rhythm"
        value={habitRate}
        suffix=""
        caption={
          pulse.habitScheduledCount > 0
            ? `${pulse.habitDoneCount} / ${pulse.habitScheduledCount}`
            : undefined
        }
      />
    </div>
  );
}

function FeatureTile({
  label, value, suffix, caption,
}: {
  label: string;
  value: string;
  suffix: string;
  caption: string;
}) {
  return (
    <div
      className="col-span-6 relative rounded-[12px] border border-bark bg-surface-2 px-6 py-5 flex flex-col justify-between overflow-hidden"
      style={{ boxShadow: "0 2px 12px rgba(60,40,10,0.05)" }}
    >
      <Leaf
        className="absolute -bottom-3 -right-3 text-forest opacity-[0.09] pointer-events-none"
        size={80}
        strokeWidth={1.1}
      />
      <div className="flex items-center gap-2">
        <Sparkles size={12} strokeWidth={1.8} className="text-forest" />
        <span className="font-data text-[10px] uppercase tracking-[0.18em] text-ink-3">
          {label}
        </span>
      </div>
      <div className="relative flex items-baseline gap-1 mt-1">
        <span className="font-display italic font-semibold text-forest leading-none text-[56px]">
          {value}
        </span>
        {suffix && (
          <span className="font-data text-[14px] text-ink-3 ml-1">{suffix}</span>
        )}
      </div>
      <p className="font-reading italic text-[12px] text-ink-3 mt-1">{caption}</p>
    </div>
  );
}

function SatelliteTile({
  icon, label, value, suffix, caption,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix: string;
  caption?: string;
}) {
  return (
    <div className="col-span-2 rounded-[12px] border border-bark-subtle bg-surface px-4 py-4 flex flex-col justify-between min-h-[138px]">
      <div className="flex items-center gap-1.5 text-ink-3">
        {icon}
        <span className="font-data text-[9px] uppercase tracking-[0.16em]">{label}</span>
      </div>
      <div className="flex items-baseline gap-1 mt-2">
        <span className="font-display italic font-semibold text-ink leading-none text-[28px]">
          {value}
        </span>
        {suffix && <span className="font-data text-[11px] text-ink-3">{suffix}</span>}
      </div>
      {caption && (
        <p className="font-data text-[9px] text-ink-3 mt-1 tabular-nums">{caption}</p>
      )}
    </div>
  );
}

// ══ Pulse chart — hand-drawn SVG sparkline of mood + energy ═════════════════
// Two gentle ink lines with dots at each logged day. A dashed midline at the
// 5/10 mark. Weekday initials as ticks along the bottom. If no mood data at
// all, the chart collapses to a quiet placeholder.

function PulseChart({
  days, pulse,
}: {
  days: string[];
  pulse: WeeklyPulse;
}) {
  // Layout constants
  const W = 640;
  const H = 180;
  const padX = 36;
  const padY = 28;
  const plotW = W - padX * 2;
  const plotH = H - padY * 2;

  // Value → y pixel. Domain is 0..10.
  const yOf = (v: number) => padY + plotH * (1 - v / 10);
  // Index → x pixel. 7 evenly-spaced slots.
  const xOf = (i: number) => padX + (plotW * i) / 6;

  // Turn a nullable series into a list of (x, y) points, skipping nulls.
  const toPoints = (series: Array<number | null>) =>
    series
      .map((v, i) => (v === null ? null : { x: xOf(i), y: yOf(v), i }))
      .filter((p): p is { x: number; y: number; i: number } => p !== null);

  const moodPts = toPoints(pulse.moodByDay);
  const energyPts = toPoints(pulse.energyByDay);

  // Build a smooth-ish polyline path from an array of points.
  const pathFor = (pts: Array<{ x: number; y: number }>) => {
    if (pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    return pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
  };

  const hasAny = moodPts.length + energyPts.length > 0;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <Feather className="text-forest flex-shrink-0" size={18} strokeWidth={1.6} />
        <h3 className="font-display italic text-[18px] font-semibold text-ink">
          The week's pulse
        </h3>
        {hasAny && (
          <div className="ml-auto flex items-center gap-4 font-data text-[10px] uppercase tracking-[0.14em] text-ink-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-forest" /> mood
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-sol" /> energy
            </span>
          </div>
        )}
      </div>

      <div
        className="relative rounded-[12px] border border-bark-subtle bg-surface px-4 pt-3 pb-2"
        style={{ boxShadow: "0 2px 10px rgba(60,40,10,0.04)" }}
      >
        {hasAny ? (
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="none">
            {/* Dashed midline at 5 */}
            <line
              x1={padX} x2={W - padX} y1={yOf(5)} y2={yOf(5)}
              stroke="#c8b99a" strokeWidth="1" strokeDasharray="2 5"
            />

            {/* Faint vertical ticks at each day */}
            {days.map((_, i) => (
              <line
                key={i}
                x1={xOf(i)} x2={xOf(i)}
                y1={padY} y2={H - padY + 4}
                stroke="#e8dfc9" strokeWidth="1"
              />
            ))}

            {/* Weekday labels */}
            {days.map((d, i) => (
              <text
                key={d}
                x={xOf(i)} y={H - 6}
                fontFamily="var(--font-jetbrains), monospace"
                fontSize="10"
                textAnchor="middle"
                fill="#9c8f78"
                style={{ letterSpacing: "0.12em" }}
              >
                {weekdayInitial(d)}
              </text>
            ))}

            {/* Energy line (amber) — drawn first so mood sits on top */}
            <path
              d={pathFor(energyPts)}
              fill="none"
              stroke="#c07d2e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />
            {energyPts.map((p, i) => (
              <circle key={`e${i}`} cx={p.x} cy={p.y} r="3.5" fill="#c07d2e" />
            ))}

            {/* Mood line (forest) */}
            <path
              d={pathFor(moodPts)}
              fill="none"
              stroke="#3d6b4f"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {moodPts.map((p, i) => (
              <circle key={`m${i}`} cx={p.x} cy={p.y} r="3.8" fill="#3d6b4f" />
            ))}

            {/* Axis min/max labels (tiny) */}
            <text
              x={padX - 6} y={yOf(10) + 3}
              fontFamily="var(--font-jetbrains), monospace" fontSize="9" textAnchor="end" fill="#9c8f78"
            >
              10
            </text>
            <text
              x={padX - 6} y={yOf(0) + 3}
              fontFamily="var(--font-jetbrains), monospace" fontSize="9" textAnchor="end" fill="#9c8f78"
            >
              0
            </text>
          </svg>
        ) : (
          <div className="h-[160px] flex items-center justify-center">
            <p className="font-reading italic text-[13px] text-ink-3 text-center">
              No mood or energy logged this week yet.
              <br />
              <Link href="/stream" className="text-forest underline decoration-transparent hover:decoration-amber-sol underline-offset-4">
                open the Stream
              </Link>{" "}
              to log today's pulse.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ══ Habit rhythm grid ════════════════════════════════════════════════════════
// Rows = active habits, columns = 7 days of the week. Filled forest circle
// = done, hollow bark circle = a past day where the habit wasn't done, tiny
// dot = a future day.

function HabitRhythmGrid({
  days, habits, pulse, loaded,
}: {
  days: string[];
  habits: WeeklyHabitRow[];
  pulse: WeeklyPulse;
  loaded: boolean;
}) {
  const today = todayISO();

  if (loaded && habits.length === 0) {
    return (
      <div className="mb-12">
        <SectionHeading icon={<Sprout size={18} strokeWidth={1.6} />} title="Rhythms" />
        <p className="font-reading italic text-[13px] text-ink-3">
          No habits tracked yet.{" "}
          <Link href="/stream#habits" className="text-forest underline decoration-transparent hover:decoration-amber-sol underline-offset-4">
            Plant one in the Stream
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <Sprout className="text-forest flex-shrink-0" size={18} strokeWidth={1.6} />
        <h3 className="font-display italic text-[18px] font-semibold text-ink">
          Rhythms kept
        </h3>
        {pulse.habitScheduledCount > 0 && (
          <span className="ml-auto font-data text-[10px] uppercase tracking-[0.14em] text-ink-3">
            {pulse.habitDoneCount} of {pulse.habitScheduledCount} kept
          </span>
        )}
      </div>

      <div
        className="rounded-[12px] border border-bark-subtle bg-surface overflow-hidden"
        style={{ boxShadow: "0 2px 10px rgba(60,40,10,0.04)" }}
      >
        {/* Header row — weekday letters above each column */}
        <div className="grid grid-cols-[minmax(0,1fr)_repeat(7,32px)_56px] gap-x-2 items-center px-5 py-3 border-b border-bark-subtle/60">
          <span className="font-data text-[9px] uppercase tracking-[0.16em] text-ink-3">
            habit
          </span>
          {days.map((d) => {
            const isToday = d === today;
            return (
              <span
                key={d}
                className={`font-data text-[10px] text-center ${
                  isToday ? "text-forest font-bold" : "text-ink-3"
                }`}
              >
                {weekdayInitial(d)}
              </span>
            );
          })}
          <span className="font-data text-[9px] uppercase tracking-[0.16em] text-ink-3 text-right">
            kept
          </span>
        </div>

        {habits.map((habit) => {
          const hits = new Set(habit.log_dates);
          const doneInWeek = days.filter((d) => hits.has(d)).length;
          const scheduledSoFar = days.filter((d) => d <= today).length;

          return (
            <div
              key={habit.id}
              className="grid grid-cols-[minmax(0,1fr)_repeat(7,32px)_56px] gap-x-2 items-center px-5 py-3 border-b border-bark-subtle/40 last:border-b-0 hover:bg-surface-2/50 transition-colors"
            >
              <span className="font-reading text-[13px] text-ink-2 truncate">
                {habit.name}
              </span>
              {days.map((d) => {
                const isPast = d <= today;
                const done = hits.has(d);
                return (
                  <div key={d} className="flex items-center justify-center">
                    {done ? (
                      <span
                        className="w-[14px] h-[14px] rounded-full bg-forest block"
                        style={{ boxShadow: "0 1px 3px rgba(61,107,79,0.35)" }}
                      />
                    ) : isPast ? (
                      <span className="w-[14px] h-[14px] rounded-full border border-bark block" />
                    ) : (
                      <span className="w-[4px] h-[4px] rounded-full bg-bark-subtle block" />
                    )}
                  </div>
                );
              })}
              <span
                className={`font-data text-[11px] text-right tabular-nums ${
                  doneInWeek === scheduledSoFar && scheduledSoFar > 0
                    ? "text-forest font-bold"
                    : "text-ink-3"
                }`}
              >
                {doneInWeek}/{scheduledSoFar || 7}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══ Journal echoes — stacked entries clipped to a fern stem ═════════════════
// Each echo shows weekday + mood/energy pills + a pulled first line from the
// body. Click jumps to /stream?d=YYYY-MM-DD. A single SVG vertical stem runs
// down the left with a leaf at each echo, visually binding them.

function JournalEchoes({
  entries, loaded,
}: {
  entries: ApiJournalEntry[];
  loaded: boolean;
}) {
  if (loaded && entries.length === 0) {
    return (
      <div className="mb-12">
        <SectionHeading icon={<BookOpen size={18} strokeWidth={1.6} />} title="Journal echoes" />
        <p className="font-reading italic text-[13px] text-ink-3">
          No journal entries this week yet.{" "}
          <Link href="/stream#journal" className="text-forest underline decoration-transparent hover:decoration-amber-sol underline-offset-4">
            Write one
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="text-forest flex-shrink-0" size={18} strokeWidth={1.6} />
        <h3 className="font-display italic text-[18px] font-semibold text-ink">
          Journal echoes
        </h3>
        <span className="ml-auto font-data text-[10px] uppercase tracking-[0.14em] text-ink-3">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      <div className="relative pl-8">
        {/* Vertical fern stem */}
        <svg
          className="absolute left-2 top-2 bottom-2 w-4 pointer-events-none"
          viewBox="0 0 20 400"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M 10 0 L 10 400"
            stroke="#7a6040"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>

        <div className="space-y-4">
          {entries.map((entry) => (
            <Echo key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Echo({ entry }: { entry: ApiJournalEntry }) {
  const body = entry.body?.trim() ?? "";
  const firstLine = body.split("\n").find((l) => l.trim().length > 0) ?? "";
  const preview = firstLine.length > 200 ? firstLine.slice(0, 200).trim() + "…" : firstLine;

  return (
    <Link
      href={`/stream?d=${entry.entry_date}`}
      className="relative block group"
    >
      {/* Leaf pin on the stem, aligned to the left edge of the card */}
      <span className="absolute -left-[28px] top-5 w-3 h-3 rounded-full bg-forest border-2 border-parchment group-hover:bg-amber-sol transition-colors" />

      <div
        className="rounded-[10px] border border-bark-subtle bg-surface px-5 py-4 group-hover:border-bark transition-colors"
        style={{ boxShadow: "0 1px 6px rgba(60,40,10,0.03)" }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="font-data text-[10px] uppercase tracking-[0.14em] text-ink-3 tabular-nums">
            {weekdayShort(entry.entry_date)} {dayOfMonth(entry.entry_date)}
          </span>
          {entry.mood !== null && (
            <span className="inline-flex items-center gap-1 font-data text-[10px] text-forest">
              <span className="w-1.5 h-1.5 rounded-full bg-forest" /> mood {entry.mood}
            </span>
          )}
          {entry.energy !== null && (
            <span className="inline-flex items-center gap-1 font-data text-[10px] text-amber-sol">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-sol" /> energy {entry.energy}
            </span>
          )}
        </div>
        {preview ? (
          <p className="font-reading italic text-[14px] text-ink-2 leading-relaxed">
            &ldquo;{preview}&rdquo;
          </p>
        ) : (
          <p className="font-reading italic text-[13px] text-ink-3">
            (no body — just a pulse recorded)
          </p>
        )}
      </div>
    </Link>
  );
}

// ══ Mind log captures — inline marginalia ══════════════════════════════════
// A quiet, un-boxed list of inbox items from the week. Bullet dashes,
// italic serif text, dated in mono. Intentionally less heavy than the
// journal echoes so it reads as secondary.

function MindLogCaptures({
  items, loaded,
}: {
  items: ApiInboxItem[];
  loaded: boolean;
}) {
  if (loaded && items.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-5">
        <Feather className="text-forest flex-shrink-0" size={18} strokeWidth={1.6} />
        <h3 className="font-display italic text-[18px] font-semibold text-ink">
          On your mind
        </h3>
        <span className="ml-auto font-data text-[10px] uppercase tracking-[0.14em] text-ink-3">
          {items.length} {items.length === 1 ? "capture" : "captures"}
        </span>
      </div>

      <ul className="space-y-2 pl-1">
        {items.map((item) => {
          const when = item.created_at?.slice(0, 10) ?? "";
          return (
            <li key={item.id} className="flex gap-3 items-start">
              <span className="font-data text-[9px] text-ink-3 uppercase tracking-[0.12em] tabular-nums w-12 flex-shrink-0 pt-[3px]">
                {when ? weekdayShort(when).slice(0, 3) : "—"}
              </span>
              <span className="text-forest text-[14px] leading-none pt-[2px]">·</span>
              <span className="font-reading italic text-[13px] text-ink-2 leading-relaxed">
                {item.content}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ══ Garden activity — finished resources this week ═════════════════════════
// Pragmatic v1: just resources whose `completed_at` falls inside the week.
// Each one rendered as a small "pressed specimen" card with the type icon,
// title, author, and date finished.

const resourceIcon: Record<ApiResource["type"], React.ReactNode> = {
  book:    <BookMarked size={15} strokeWidth={1.5} />,
  course:  <GraduationCap size={15} strokeWidth={1.5} />,
  article: <Newspaper size={15} strokeWidth={1.5} />,
  video:   <Video size={15} strokeWidth={1.5} />,
  podcast: <Headphones size={15} strokeWidth={1.5} />,
  paper:   <BookOpen size={15} strokeWidth={1.5} />,
  other:   <Film size={15} strokeWidth={1.5} />,
};

function GardenActivity({
  resources, loaded,
}: {
  resources: ApiResource[];
  loaded: boolean;
}) {
  // Hide entirely on quiet weeks so the page doesn't read "0 things done."
  if (!loaded || resources.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-5">
        <Leaf className="text-forest flex-shrink-0" size={18} strokeWidth={1.6} />
        <h3 className="font-display italic text-[18px] font-semibold text-ink">
          What finished growing
        </h3>
        <span className="ml-auto font-data text-[10px] uppercase tracking-[0.14em] text-ink-3">
          {resources.length} {resources.length === 1 ? "completion" : "completions"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {resources.map((r) => {
          const finishedOn = r.completed_at?.slice(0, 10);
          return (
            <div
              key={r.id}
              className="rounded-[10px] border border-bark-subtle bg-surface-2 px-5 py-4 flex gap-4 items-start"
              style={{ boxShadow: "0 1px 6px rgba(60,40,10,0.03)" }}
            >
              <div className="mt-0.5 text-forest flex-shrink-0">
                {resourceIcon[r.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display italic text-[15px] text-ink leading-tight truncate">
                  {r.title}
                </p>
                {r.author && (
                  <p className="font-reading italic text-[12px] text-ink-3 mt-0.5 truncate">
                    {r.author}
                  </p>
                )}
                {finishedOn && (
                  <p className="font-data text-[9px] text-ink-3 mt-1.5 uppercase tracking-[0.12em] tabular-nums">
                    finished {weekdayShort(finishedOn)} {dayOfMonth(finishedOn)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══ Shared section heading ══════════════════════════════════════════════════

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-forest flex-shrink-0">{icon}</span>
      <h3 className="font-display italic text-[18px] font-semibold text-ink">{title}</h3>
    </div>
  );
}
