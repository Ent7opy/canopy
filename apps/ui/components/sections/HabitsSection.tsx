"use client";

import { useState } from "react";
import { Check, Plus, Sprout } from "lucide-react";
import { useHabits } from "@/hooks/useHabits";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OakDivider from "@/components/OakDivider";

export function HabitsSection() {
  const { habits, complete, add } = useHabits();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");

  const doneCount = habits.filter((h) => h.done).length;
  const streak = doneCount;

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await add(newName.trim());
    setNewName("");
    setShowAdd(false);
  };

  return (
    <section id="habits" className="mb-16 scroll-mt-20">
      <div className="flex items-center gap-3 mb-8">
        <Sprout className="text-forest flex-shrink-0" size={20} strokeWidth={1.8} />
        <h3 className="text-[22px] font-semibold text-ink font-display">Habits</h3>
        {streak > 0 && (
          <span className="ml-auto font-data text-[12px] text-forest flex items-center gap-1">
            <span>🌿</span> {streak} done today
          </span>
        )}
      </div>

      {habits.length === 0 ? (
        <div className="flex flex-col items-center py-10 gap-3 opacity-60">
          <p className="font-reading text-[14px] text-ink-3 italic">No habits tracked yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {habits.map((habit) => {
            const isDone = habit.done ?? false;
            return (
              <div
                key={habit.id}
                className={`border rounded-[10px] p-5 flex items-center justify-between transition-all duration-200 ${
                  isDone
                    ? "bg-forest-dim border-forest"
                    : "bg-surface border-bark hover:border-forest"
                }`}
                style={{ boxShadow: "0 1px 6px rgba(60,40,10,0.04)" }}
              >
                <div className="flex-1 min-w-0 pr-3">
                  <p className={`text-[15px] font-medium font-reading leading-snug ${isDone ? "text-forest" : "text-ink"}`}>
                    {habit.name}
                  </p>
                  <Badge variant="subtle" className="mt-1.5">
                    {habit.frequency}
                  </Badge>
                </div>
                <button
                  onClick={() => !isDone && complete(habit.id)}
                  aria-label={isDone ? "Done" : "Mark complete"}
                  disabled={isDone}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    isDone
                      ? "bg-forest border-forest"
                      : "border-bark hover:border-forest hover:bg-forest-dim"
                  }`}
                >
                  {isDone && <Check size={16} color="#fefcf5" strokeWidth={2.5} />}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add habit */}
      {showAdd ? (
        <div className="flex gap-2 mb-4">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setShowAdd(false);
            }}
            placeholder="Habit name…"
            autoFocus
          />
          <Button variant="primary" size="sm" onClick={handleAdd} disabled={!newName.trim()}>
            Add
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdd(true)}
          className="gap-1.5"
        >
          <Plus size={13} strokeWidth={2.5} />
          Add habit
        </Button>
      )}

      <OakDivider />
    </section>
  );
}
