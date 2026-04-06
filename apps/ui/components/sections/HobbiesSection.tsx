"use client";

import { useState } from "react";
import { Leaf, Plus, Play } from "lucide-react";
import { useHobbies } from "@/hooks/useHobbies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import WheatDivider from "@/components/WheatDivider";

type StatusFilter = "active" | "want_to_try" | "paused";

const STATUS_LABELS: Record<StatusFilter, string> = {
  active: "Active",
  want_to_try: "Want to try",
  paused: "Paused",
};

export function HobbiesSection() {
  const { hobbies, add, logSession } = useHobbies();
  const [filter, setFilter] = useState<StatusFilter>("active");
  const [loggingId, setLoggingId] = useState<string | null>(null);
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const filtered = hobbies.filter((h) => h.status === filter);

  const handleLog = async (hobbyId: string) => {
    await logSession(hobbyId, duration ? Number(duration) : undefined, notes || undefined);
    setLoggingId(null);
    setDuration("");
    setNotes("");
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await add(newName.trim(), { category: newCategory.trim() || undefined, status: "active" });
    setNewName("");
    setNewCategory("");
    setShowAdd(false);
  };

  return (
    <section id="hobbies" className="mb-16 scroll-mt-20">
      <div className="flex items-center gap-3 mb-8">
        <Leaf className="text-forest flex-shrink-0" size={20} strokeWidth={1.8} />
        <h3 className="text-[22px] font-semibold text-ink font-display">Hobbies</h3>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6">
        {(Object.keys(STATUS_LABELS) as StatusFilter[]).map((s) => (
          <button key={s} onClick={() => setFilter(s)} className="focus:outline-none">
            <Badge variant={filter === s ? "active" : "subtle"}>
              {STATUS_LABELS[s]}
            </Badge>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="font-reading text-[14px] text-ink-3 italic mb-6">
          Nothing in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {filtered.map((hobby) => (
            <div
              key={hobby.id}
              className="bg-surface border border-bark rounded-[10px] p-5 hover:border-forest transition-colors duration-200"
              style={{ boxShadow: "0 1px 6px rgba(60,40,10,0.03)" }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[16px] font-semibold text-ink font-display">{hobby.name}</p>
                  {hobby.category && (
                    <Badge variant="forest" className="mt-1.5">{hobby.category}</Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLoggingId(loggingId === hobby.id ? null : hobby.id)}
                  className="gap-1 text-ink-2 hover:text-forest flex-shrink-0"
                >
                  <Play size={12} strokeWidth={2} />
                  Log
                </Button>
              </div>

              {hobby.description && (
                <p className="font-reading text-[13px] text-ink-2 leading-relaxed">
                  {hobby.description}
                </p>
              )}

              {/* Inline log form */}
              {loggingId === hobby.id && (
                <div className="mt-4 pt-4 border-t border-bark-subtle space-y-3">
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Duration (minutes)"
                  />
                  <Textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notes (optional)…"
                  />
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" onClick={() => handleLog(hobby.id)}>
                      Save session
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLoggingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add hobby */}
      {showAdd ? (
        <div className="bg-surface border border-bark rounded-[8px] p-5 space-y-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setShowAdd(false)}
            placeholder="Hobby name…"
            autoFocus
          />
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setShowAdd(false);
            }}
            placeholder="Category (optional)…"
          />
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handleAdd} disabled={!newName.trim()}>
              Add hobby
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
          Add hobby
        </Button>
      )}

      <WheatDivider />
    </section>
  );
}
