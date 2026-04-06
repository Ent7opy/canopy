"use client";

import { useState } from "react";
import { Sun, Plus, X, ChevronDown, Leaf } from "lucide-react";
import { useWeeklyReview } from "@/hooks/useWeeklyReview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ── Tag input ─────────────────────────────────────────────────────────────────

function TagInput({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    onChange([...values, text]);
    setDraft("");
  };

  return (
    <div>
      <p className="font-reading text-[13px] text-ink-2 mb-2">{label}</p>
      <div className="flex gap-2 mb-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={`Add ${label.toLowerCase()}…`}
          underline
        />
        <Button variant="ghost" size="icon" onClick={add} aria-label="Add">
          <Plus size={13} strokeWidth={2.5} />
        </Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((v, i) => (
            <span
              key={i}
              className="flex items-center gap-1 bg-surface-2 border border-bark-subtle rounded-full px-3 py-1 font-reading text-[12px] text-ink-2"
            >
              {v}
              <button onClick={() => onChange(values.filter((_, j) => j !== i))} className="text-ink-3 hover:text-amber-sol">
                <X size={10} strokeWidth={2} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function WeeklyReviewSection() {
  const { reviews, streak, saveReview, currentWeekStart } = useWeeklyReview();

  const weekStart = currentWeekStart();
  const currentReview = reviews.find((r) => r.week_start === weekStart);

  const [hours, setHours] = useState(currentReview?.hours_logged ?? 0);
  const [reflection, setReflection] = useState(currentReview?.reflection ?? "");
  const [wins, setWins] = useState<string[]>(currentReview?.wins ?? []);
  const [blockers, setBlockers] = useState<string[]>(currentReview?.blockers ?? []);
  const [focus, setFocus] = useState<string[]>(currentReview?.next_week_focus ?? []);
  const [saved, setSaved] = useState(false);
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);

  const pastReviews = [...reviews]
    .filter((r) => r.week_start !== weekStart)
    .sort((a, b) => b.week_start.localeCompare(a.week_start))
    .slice(0, 4);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveReview({
      week_start: weekStart,
      hours_logged: hours,
      reflection: reflection || null,
      wins: wins.length ? wins : null,
      blockers: blockers.length ? blockers : null,
      next_week_focus: focus.length ? focus : null,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <section id="review" className="mb-16 scroll-mt-20">
      <div className="flex items-center gap-3 mb-8">
        <Sun className="text-forest flex-shrink-0" size={20} strokeWidth={1.8} />
        <h3 className="text-[22px] font-semibold text-ink font-display">Weekly Review</h3>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { val: String(streak), label: "week streak" },
          { val: weekStart, label: "current week" },
        ].map((s) => (
          <div key={s.label} className="bg-surface-2 border border-bark-subtle rounded-[8px] px-4 py-4 text-center">
            <div className="font-data text-xl font-bold text-forest leading-none mb-1">{s.val}</div>
            <div className="font-data text-[10px] text-ink-3 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Review form */}
      <form
        onSubmit={handleSubmit}
        className="bg-surface border border-bark rounded-[10px] p-8 mb-8 relative overflow-hidden"
        style={{ boxShadow: "0 2px 10px rgba(60,40,10,0.04)" }}
      >
        <div className="absolute top-4 left-4 opacity-[0.06] pointer-events-none">
          <Leaf size={44} color="#3d6b4f" />
        </div>

        <div className="space-y-6">
          {/* Hours */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-reading text-[13px] text-ink-2">Hours logged this week</span>
              <span className="font-data text-[28px] font-bold text-forest leading-none">
                {hours.toFixed(1)}
              </span>
            </div>
            <input
              type="range" min="0" max="80" step="0.5"
              value={hours}
              onChange={(e) => setHours(parseFloat(e.target.value))}
            />
          </div>

          {/* Reflection */}
          <div>
            <label className="font-reading text-[13px] text-ink-2 block mb-2">
              Reflection
            </label>
            <Textarea
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What happened this week?"
            />
          </div>

          <TagInput label="Wins" values={wins} onChange={setWins} />
          <TagInput label="Blockers" values={blockers} onChange={setBlockers} />
          <TagInput label="Next week focus" values={focus} onChange={setFocus} />

          <Button
            type="submit"
            size="lg"
            variant={saved ? "amber" : "primary"}
            className="w-full"
          >
            {saved ? "Saved ✓" : "Save week"}
          </Button>
        </div>
      </form>

      {/* Past reviews */}
      {pastReviews.length > 0 && (
        <div>
          <h4 className="font-display text-[15px] font-semibold text-ink mb-3">Past weeks</h4>
          <div className="space-y-1.5">
            {pastReviews.map((review) => {
              const isExpanded = expandedWeek === review.week_start;
              return (
                <div
                  key={review.week_start}
                  className="bg-surface-2 border border-bark-subtle rounded-[8px] overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedWeek(isExpanded ? null : review.week_start)}
                    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-surface transition-colors text-left"
                  >
                    <div className="flex items-center gap-5">
                      <span className="font-data text-[12px] text-ink-3">{review.week_start}</span>
                      {review.hours_logged !== null && (
                        <span className="font-data text-[13px] font-bold text-forest">
                          {review.hours_logged}h
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-ink-3 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="px-5 pb-4 space-y-3">
                      {review.reflection && (
                        <p className="font-reading text-[14px] text-ink-2 leading-relaxed">
                          {review.reflection}
                        </p>
                      )}
                      {review.wins && review.wins.length > 0 && (
                        <div>
                          <p className="font-data text-[10px] text-ink-3 uppercase tracking-wider mb-1.5">Wins</p>
                          <ul className="space-y-1">
                            {review.wins.map((w, i) => (
                              <li key={i} className="font-reading text-[13px] text-ink-2 flex gap-2">
                                <span className="text-forest">·</span> {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
