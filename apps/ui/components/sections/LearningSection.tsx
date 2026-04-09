"use client";

import { useEffect, useState } from "react";
import { Sprout, Wind, Plus, Pencil, X, Check } from "lucide-react";
import { getResources, createResource, patchResource, deleteResource, type ApiResource } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OakDivider from "@/components/OakDivider";

const LEARNING_TYPES = ["course", "video", "paper"] as const;

export function LearningSection() {
  const [resources, setResources] = useState<ApiResource[]>([]);

  useEffect(() => {
    getResources({ status: "active" }).then((data) => {
      if (data) setResources(data);
    });
  }, []);

  const courses = resources.filter((r) => r.type === "course" || r.type === "video" || r.type === "paper");
  const featured = courses[0] ?? null;

  // Add form state
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<ApiResource['type']>("course");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    const created = await createResource({
      type: newType,
      title: newTitle.trim(),
      author: newAuthor.trim() || undefined,
      url: newUrl.trim() || undefined,
      status: "active",
    });
    if (created) setResources((prev) => [...prev, created]);
    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
    setShowAdd(false);
  };

  const startEdit = (r: ApiResource) => {
    setEditingId(r.id);
    setEditTitle(r.title);
    setEditAuthor(r.author ?? "");
  };

  const saveEdit = async (id: string) => {
    const updated = await patchResource(id, {
      title: editTitle.trim(),
      author: editAuthor.trim() || null,
    });
    if (updated) {
      setResources((prev) => prev.map((r) => (r.id === id ? updated : r)));
    }
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this resource?")) return;
    await deleteResource(id);
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <section id="learning" className="mb-16 scroll-mt-20">
      <div className="flex items-center gap-3 mb-8">
        <Sprout className="text-forest flex-shrink-0" size={20} strokeWidth={1.8} />
        <h3 className="text-[22px] font-semibold text-ink font-display">
          Learning
        </h3>
      </div>

      {/* Featured current focus */}
      {featured ? (
        <div
          className="bg-surface border border-bark rounded-[10px] p-8 relative overflow-hidden group mb-6"
          style={{ boxShadow: "0 2px 12px rgba(60,40,10,0.04)" }}
        >
          <div className="absolute top-0 right-0 opacity-[0.05] group-hover:opacity-[0.09] transition-opacity duration-500 pointer-events-none">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="#7a6040" strokeWidth="1">
              <path d="M80 0 Q 40 0 0 40 M80 20 Q 60 20 40 40 M80 40 Q 70 40 60 50" />
            </svg>
          </div>

          <div className="flex gap-7 items-start">
            <div className="w-14 h-14 bg-surface-2 rounded-full flex items-center justify-center border border-bark flex-shrink-0">
              <Wind className="text-amber-sol" size={24} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-data text-[11px] text-ink-3 uppercase tracking-wider mb-1">
                Currently studying
              </div>
              <h4 className="text-[20px] font-bold text-ink mb-2 font-display leading-snug">
                {featured.title}
              </h4>
              {featured.author && (
                <p className="font-data text-[12px] text-ink-3 mb-2">{featured.author}</p>
              )}
              {featured.progress_current !== null && featured.progress_total !== null && (
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex-1 h-1.5 rounded-full bg-bark-subtle overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-sol transition-all duration-500"
                      style={{
                        width: `${Math.round((featured.progress_current / featured.progress_total) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="font-data text-[11px] text-ink-3 flex-shrink-0">
                    {featured.progress_current}/{featured.progress_total}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-10 gap-3 opacity-60 mb-6">
          <p className="font-reading text-[14px] text-ink-3 italic">No active learning resources.</p>
        </div>
      )}

      {/* Other active resources */}
      {courses.length > 1 && (
        <div className="space-y-2 mb-6">
          {courses.slice(1).map((r) => (
            <div
              key={r.id}
              className="group flex items-center gap-4 px-4 py-3 rounded-[8px] bg-surface-2 border border-bark-subtle hover:border-bark transition-colors"
            >
              {editingId === r.id ? (
                <div className="flex-1 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(r.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="flex-1"
                    autoFocus
                  />
                  <Input
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    placeholder="Author"
                    className="w-32"
                  />
                  <Button variant="ghost" size="icon" onClick={() => saveEdit(r.id)} className="h-6 w-6 text-forest">
                    <Check size={13} strokeWidth={2.5} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setEditingId(null)} className="h-6 w-6 text-ink-3">
                    <X size={13} />
                  </Button>
                </div>
              ) : (
                <>
                  <Badge variant="subtle">{r.type}</Badge>
                  <p className="flex-1 text-[14px] text-ink font-reading truncate">{r.title}</p>
                  {r.author && (
                    <span className="font-data text-[11px] text-ink-3 flex-shrink-0">{r.author}</span>
                  )}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={() => startEdit(r)}
                      className="text-ink-3 hover:text-forest p-1"
                      title="Edit"
                    >
                      <Pencil size={12} strokeWidth={1.8} />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-ink-3 hover:text-amber-sol p-1"
                      title="Delete"
                    >
                      <X size={13} strokeWidth={2} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add resource */}
      {showAdd ? (
        <div className="bg-surface border border-bark rounded-[8px] p-5 space-y-3">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setShowAdd(false);
            }}
            placeholder="Resource title…"
            autoFocus
          />
          <div className="flex items-center gap-3">
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="font-reading text-[13px] text-ink bg-transparent border border-bark rounded-[6px] px-3 py-2 focus:outline-none focus:border-forest"
            >
              {LEARNING_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
            <Input
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              placeholder="Author (optional)"
              className="flex-1"
            />
          </div>
          <Input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="URL (optional)"
          />
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handleAdd} disabled={!newTitle.trim()}>
              Add resource
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
          Add resource
        </Button>
      )}

      <OakDivider />
    </section>
  );
}
