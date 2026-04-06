"use client";

import { useState, useCallback, useEffect } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import { useJournal } from "@/hooks/useJournal";
import { Textarea } from "@/components/ui/textarea";
import WheatDivider from "@/components/WheatDivider";

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function SliderField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="font-reading text-[13px] text-ink-2">{label}</span>
        <span className="font-data text-[14px] font-bold text-forest">{value}/10</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

export function JournalSection() {
  const { entries, todayEntry, save } = useJournal();
  const todayStr = new Date().toISOString().split("T")[0];

  const [body, setBody] = useState(todayEntry?.body ?? "");
  const [mood, setMood] = useState(todayEntry?.mood ?? 5);
  const [energy, setEnergy] = useState(todayEntry?.energy ?? 5);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Sync form from loaded today entry
  useEffect(() => {
    if (todayEntry) {
      setBody(todayEntry.body ?? "");
      setMood(todayEntry.mood ?? 5);
      setEnergy(todayEntry.energy ?? 5);
    }
  }, [todayEntry?.id]);

  const autosave = useCallback(
    (overrides?: { body?: string; mood?: number; energy?: number }) => {
      save({
        entry_date: todayStr,
        body: overrides?.body ?? body,
        mood: overrides?.mood ?? mood,
        energy: overrides?.energy ?? energy,
      });
    },
    [body, mood, energy, todayStr]
  );

  const pastEntries = [...entries]
    .filter((e) => e.entry_date !== todayStr)
    .sort((a, b) => b.entry_date.localeCompare(a.entry_date))
    .slice(0, 3);

  return (
    <section id="journal" className="mb-16 scroll-mt-20">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="text-forest flex-shrink-0" size={20} strokeWidth={1.8} />
        <h3 className="text-[22px] font-semibold text-ink font-display">Journal</h3>
      </div>

      {/* Today card */}
      <div
        className="bg-surface border border-bark rounded-[10px] p-8 mb-6"
        style={{ boxShadow: "0 2px 12px rgba(60,40,10,0.04)" }}
      >
        <p className="font-data text-[11px] text-ink-3 uppercase tracking-wider mb-5">
          {formatDate(todayStr)}
        </p>

        <div className="mb-6">
          <label className="font-reading text-[13px] text-ink-2 block mb-2">
            How are you feeling?
          </label>
          <Textarea
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onBlur={() => autosave({ body })}
            placeholder="Write freely… thoughts, observations, gratitude."
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <SliderField
            label="Mood"
            value={mood}
            onChange={(v) => { setMood(v); autosave({ mood: v }); }}
          />
          <SliderField
            label="Energy"
            value={energy}
            onChange={(v) => { setEnergy(v); autosave({ energy: v }); }}
          />
        </div>
      </div>

      {/* Past entries */}
      {pastEntries.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-display text-[15px] font-semibold text-ink mb-3">Recent entries</h4>
          {pastEntries.map((entry) => {
            const isExpanded = expandedId === entry.id;
            return (
              <div
                key={entry.id}
                className="bg-surface-2 border border-bark-subtle rounded-[8px] overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-surface transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-data text-[12px] text-ink-3">{entry.entry_date}</span>
                    {entry.mood !== null && (
                      <span className="font-data text-[11px] text-forest">
                        mood {entry.mood}
                      </span>
                    )}
                    {entry.energy !== null && (
                      <span className="font-data text-[11px] text-amber-sol">
                        energy {entry.energy}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-ink-3 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                {isExpanded && entry.body && (
                  <div className="px-5 pb-4">
                    <p className="font-reading text-[14px] text-ink-2 leading-relaxed">
                      {entry.body}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <WheatDivider />
    </section>
  );
}
