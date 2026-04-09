"use client";

import { useRef, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { useSkills } from "@/hooks/useSkills";
import OrganicProgressBar from "@/components/OrganicProgressBar";
import WheatDivider from "@/components/WheatDivider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SkillsSection() {
  const { skills, updateSkill, addSkill, removeSkill } = useSkills();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Add skill form state
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newValue, setNewValue] = useState(0);
  const [newTarget, setNewTarget] = useState(100);

  const startEdit = (id: string, currentValue: number) => {
    setEditingId(id);
    setDraft(currentValue);
    setTimeout(() => inputRef.current?.focus(), 40);
  };

  const commit = (id: string) => {
    const clamped = Math.min(100, Math.max(0, draft));
    updateSkill(id, clamped);
    setEditingId(null);
  };

  const cancel = () => setEditingId(null);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await addSkill(newName.trim(), {
      category: newCategory.trim() || undefined,
      value: newValue,
      target: newTarget,
    });
    setNewName("");
    setNewCategory("");
    setNewValue(0);
    setNewTarget(100);
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this skill?")) removeSkill(id);
  };

  return (
    <section id="skills" className="mb-16 scroll-mt-20">
      <div className="flex items-center gap-3 mb-8">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3d6b4f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C6 2 2 6 2 12s4 10 10 10 10-4 10-10" />
          <path d="M12 6v6l3 1.5" />
          <path d="M18 2l2 2-2 2" />
        </svg>
        <h3 className="text-[22px] font-semibold text-ink font-display">Skills</h3>
      </div>

      <div className="space-y-7">
        {skills.map((skill) => {
          const isEditing = editingId === skill.id;
          const displayValue = isEditing ? draft : skill.value;

          return (
            <div
              key={skill.id}
              className="group relative cursor-pointer"
              onClick={() => !isEditing && startEdit(skill.id, skill.value)}
            >
              <div className="flex justify-between items-end mb-2 px-0.5">
                <span className="text-[15px] text-ink font-reading">{skill.name}</span>

                <div className="flex items-center gap-1.5">
                  {isEditing ? (
                    <div
                      className="flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        ref={inputRef}
                        type="number"
                        min={0}
                        max={100}
                        value={draft}
                        onChange={(e) => setDraft(Number(e.target.value))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")  commit(skill.id);
                          if (e.key === "Escape") cancel();
                        }}
                        className="w-12 bg-transparent border-b border-amber-sol font-data text-[13px] text-amber-sol text-right focus:outline-none"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => commit(skill.id)}
                        aria-label="Save"
                        className="h-6 w-6 text-forest"
                      >
                        <Check size={13} strokeWidth={2.5} />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-data text-[14px] font-bold text-forest group-hover:text-amber-sol transition-colors">
                        {skill.value}%
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(skill.id); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-ink-3 hover:text-amber-sol p-0.5"
                        aria-label="Delete skill"
                        title="Delete"
                      >
                        <X size={13} strokeWidth={2} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <OrganicProgressBar
                progress={displayValue}
                color={isEditing ? "#c07d2e" : "#3d6b4f"}
              />

              {!isEditing && (
                <p className="mt-1 font-data text-[10px] text-ink-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  click to edit
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Add skill */}
      {showAdd ? (
        <div className="bg-surface border border-bark rounded-[8px] p-5 space-y-3 mt-6">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setShowAdd(false);
            }}
            placeholder="Skill name…"
            autoFocus
          />
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category (optional)…"
          />
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="font-data text-[10px] text-ink-3 block mb-1">Value (0-100)</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={newValue}
                onChange={(e) => setNewValue(Math.min(100, Math.max(0, Number(e.target.value))))}
              />
            </div>
            <div className="flex-1">
              <label className="font-data text-[10px] text-ink-3 block mb-1">Target (0-100)</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={newTarget}
                onChange={(e) => setNewTarget(Math.min(100, Math.max(0, Number(e.target.value))))}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handleAdd} disabled={!newName.trim()}>
              Add skill
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdd(true)}
            className="gap-1.5"
          >
            <Plus size={13} strokeWidth={2.5} />
            Add skill
          </Button>
        </div>
      )}

      <WheatDivider />
    </section>
  );
}
