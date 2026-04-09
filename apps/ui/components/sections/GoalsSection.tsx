"use client";

import { useState } from "react";
import { Target, Plus, Trash2 } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WheatDivider from "@/components/WheatDivider";
import type { ApiGoal } from "@/lib/api";

const timeframeOrder = ["yearly", "quarterly", "monthly", "weekly"];

const statusColor: Record<string, string> = {
  active:    "text-forest border-forest",
  completed: "text-amber-sol border-amber-sol",
  paused:    "text-ink-3 border-bark",
  abandoned: "text-ink-3 border-bark",
};

const STATUS_OPTIONS = ["active", "completed", "paused", "abandoned"] as const;

function GoalCard({
  goal,
  onStatusChange,
  onDelete,
}: {
  goal: ApiGoal;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const hasProgress =
    goal.metric_target !== null && goal.metric_target > 0;
  const pct = hasProgress
    ? Math.min(100, Math.round((goal.metric_current / goal.metric_target!) * 100))
    : null;

  return (
    <div
      className="bg-surface border border-bark rounded-[8px] px-5 py-4 group hover:border-forest transition-colors duration-200"
      style={{ boxShadow: "0 1px 6px rgba(60,40,10,0.03)" }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-[15px] font-medium text-ink font-reading leading-snug flex-1">
          {goal.title}
        </p>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Status badge — clickable */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="focus:outline-none"
            >
              <Badge
                variant="subtle"
                className={`uppercase text-[9px] tracking-wider cursor-pointer hover:opacity-80 ${statusColor[goal.status] ?? ""}`}
              >
                {goal.status}
              </Badge>
            </button>
            {showStatusMenu && (
              <div className="absolute right-0 top-full mt-1 bg-surface border border-bark rounded-[6px] shadow-lg z-10 py-1 min-w-[120px]">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      onStatusChange(goal.id, s);
                      setShowStatusMenu(false);
                    }}
                    className={`block w-full text-left px-3 py-1.5 font-reading text-[12px] hover:bg-surface-2 transition-colors ${
                      s === goal.status ? "text-forest font-semibold" : "text-ink-2"
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Delete button */}
          <button
            onClick={() => onDelete(goal.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-ink-3 hover:text-amber-sol p-1"
            aria-label="Delete goal"
            title="Delete"
          >
            <Trash2 size={13} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {pct !== null && (
        <div className="mt-3">
          <div className="flex justify-between mb-1">
            <span className="font-data text-[10px] text-ink-3">
              {goal.metric_name ?? "progress"}
            </span>
            <span className="font-data text-[11px] font-bold text-forest">
              {goal.metric_current} / {goal.metric_target}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-bark-subtle overflow-hidden">
            <div
              className="h-full rounded-full bg-forest transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function GoalsSection() {
  const { goals, add, update, remove } = useGoals();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [timeframe, setTimeframe] = useState("quarterly");
  const [submitting, setSubmitting] = useState(false);

  const grouped = timeframeOrder
    .map((tf) => ({
      tf,
      items: goals.filter((g) => g.timeframe === tf),
    }))
    .filter((g) => g.items.length > 0);

  const handleAdd = async () => {
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    try {
      await add(title.trim(), { timeframe, status: "active" });
      setTitle("");
      setShowAdd(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this goal?")) remove(id);
  };

  const handleStatusChange = (id: string, status: string) => {
    update(id, { status });
  };

  return (
    <section id="goals" className="mb-16 scroll-mt-20">
      <div className="flex items-center gap-3 mb-8">
        <Target className="text-forest flex-shrink-0" size={20} strokeWidth={1.8} />
        <h3 className="text-[22px] font-semibold text-ink font-display">Goals</h3>
      </div>

      {grouped.length === 0 && (
        <p className="font-reading text-[14px] text-ink-3 italic mb-6">
          No goals set yet. Add one below.
        </p>
      )}

      <div className="space-y-8 mb-6">
        {grouped.map(({ tf, items }) => (
          <div key={tf}>
            <h4 className="font-data text-[11px] text-ink-3 uppercase tracking-widest mb-3">
              {tf}
            </h4>
            <div className="space-y-3">
              {items.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add goal */}
      {showAdd ? (
        <div className="bg-surface border border-bark rounded-[8px] p-5 space-y-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setShowAdd(false);
            }}
            placeholder="Goal title…"
            autoFocus
          />
          <div className="flex items-center gap-3">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="font-reading text-[13px] text-ink bg-transparent border border-bark rounded-[6px] px-3 py-2 focus:outline-none focus:border-forest flex-1"
            >
              {timeframeOrder.map((tf) => (
                <option key={tf} value={tf}>
                  {tf.charAt(0).toUpperCase() + tf.slice(1)}
                </option>
              ))}
            </select>
            <Button variant="primary" size="sm" onClick={handleAdd} disabled={!title.trim() || submitting}>
              {submitting ? "Adding…" : "Add goal"}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdd(true)}
          className="gap-1.5"
        >
          <Plus size={13} strokeWidth={2.5} />
          Add goal
        </Button>
      )}

      <WheatDivider />
    </section>
  );
}
