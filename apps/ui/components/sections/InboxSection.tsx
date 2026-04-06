"use client";

import { useState, useRef } from "react";
import { Inbox, Trash2, CheckCheck } from "lucide-react";
import { useInbox } from "@/hooks/useInbox";
import { Button } from "@/components/ui/button";
import FernDivider from "@/components/FernDivider";

export function InboxSection() {
  const { items, capture, process, remove } = useInbox();
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const unprocessed = items.filter((i) => !i.processed);

  const handleCapture = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    await capture(text);
    inputRef.current?.focus();
  };

  return (
    <section id="inbox" className="mb-16 scroll-mt-20">
      <div className="flex items-center gap-3 mb-8">
        <Inbox className="text-forest flex-shrink-0" size={20} strokeWidth={1.8} />
        <h3 className="text-[22px] font-semibold text-ink font-display">Inbox</h3>
        {unprocessed.length > 0 && (
          <span className="ml-auto font-data text-[12px] text-amber-sol">
            {unprocessed.length} unprocessed
          </span>
        )}
      </div>

      {/* Quick capture */}
      <div
        className="bg-surface border border-bark rounded-[10px] p-5 mb-6"
        style={{ boxShadow: "0 2px 8px rgba(60,40,10,0.03)" }}
      >
        <div className="flex gap-3 items-center">
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCapture()}
            placeholder="Capture a thought, task, or idea…"
            className="flex-1 bg-transparent font-reading text-[15px] text-ink placeholder:text-ink-3 focus:outline-none border-b border-bark focus:border-forest transition-colors duration-150 py-1.5"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleCapture}
            disabled={!draft.trim()}
          >
            Capture
          </Button>
        </div>
        <p className="font-data text-[10px] text-ink-3 mt-2">
          Press <kbd className="bg-surface-2 border border-bark px-1 rounded text-[10px]">Enter</kbd> to save quickly
        </p>
      </div>

      {/* Item list */}
      {unprocessed.length === 0 ? (
        <div className="flex flex-col items-center py-10 gap-3 opacity-60">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#7a6040" strokeWidth="1" strokeLinecap="round">
            <path d="M24 8 Q 34 8 38 16 Q 42 24 38 32 Q 34 40 24 40 Q 14 40 10 32 Q 6 24 10 16 Q 14 8 24 8" />
            <path d="M18 24 L22 28 L30 20" strokeWidth="1.5" stroke="#3d6b4f" />
          </svg>
          <p className="font-reading text-[14px] text-ink-3 italic">Mind clear.</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {unprocessed.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between px-4 py-3.5 bg-surface border border-bark-subtle rounded-[8px] hover:border-bark transition-colors"
            >
              <p className="text-[14px] text-ink font-reading leading-snug flex-1 min-w-0 pr-4">
                {item.content}
              </p>
              <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => process(item.id)}
                  aria-label="Mark as processed"
                  className="h-7 w-7 text-forest hover:text-forest"
                  title="Process"
                >
                  <CheckCheck size={14} strokeWidth={2} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(item.id)}
                  aria-label="Delete"
                  className="h-7 w-7 text-ink-3 hover:text-amber-sol"
                  title="Delete"
                >
                  <Trash2 size={13} strokeWidth={1.8} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <FernDivider />
    </section>
  );
}
