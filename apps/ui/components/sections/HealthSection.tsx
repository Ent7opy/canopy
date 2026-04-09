"use client";

import { useState, useCallback, useEffect } from "react";
import { Heart } from "lucide-react";
import { useHealth } from "@/hooks/useHealth";
import OakDivider from "@/components/OakDivider";

function SliderRow({
  label,
  value,
  max,
  step,
  onChange,
  unit,
}: {
  label: string;
  value: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  unit?: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="font-reading text-[13px] text-ink-2">{label}</span>
        <span className="font-data text-[14px] font-bold text-forest">
          {value}{unit ?? ""}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

function SleepQualityDots({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <p className="font-reading text-[13px] text-ink-2 mb-3">Sleep quality</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            aria-label={`Sleep quality ${n}`}
            className={`w-8 h-8 rounded-full border-2 transition-all duration-150 font-data text-[12px] ${
              value >= n
                ? "bg-forest border-forest text-surface"
                : "border-bark text-ink-3 hover:border-forest"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

// Sparkline — last 7 days sleep hours & sleep quality as bar columns
function Sparkline({
  logs,
}: {
  logs: { log_date: string; sleep_hours: number | null; sleep_quality: number | null }[];
}) {
  const last7 = [...logs]
    .sort((a, b) => a.log_date.localeCompare(b.log_date))
    .slice(-7);

  if (last7.length < 2) return null;

  return (
    <div className="mt-6">
      <p className="font-data text-[10px] text-ink-3 uppercase tracking-wider mb-3">
        Last 7 days
      </p>
      <div className="flex gap-1.5 items-end h-12">
        {last7.map((entry, i) => {
          const sleepH = entry.sleep_hours ? (entry.sleep_hours / 12) * 100 : 0;
          const qualityH = entry.sleep_quality ? (entry.sleep_quality / 5) * 100 : 0;
          return (
            <div key={i} className="flex-1 flex gap-0.5 items-end h-full" title={entry.log_date}>
              <div
                className="flex-1 rounded-sm bg-forest opacity-60 transition-all duration-300"
                style={{ height: `${sleepH}%` }}
                title={`Sleep: ${entry.sleep_hours}h`}
              />
              <div
                className="flex-1 rounded-sm bg-amber-sol opacity-60 transition-all duration-300"
                style={{ height: `${qualityH}%` }}
                title={`Quality: ${entry.sleep_quality}/5`}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 mt-2">
        <span className="flex items-center gap-1 font-data text-[10px] text-ink-3">
          <span className="w-2 h-2 rounded-sm bg-forest opacity-60 inline-block" /> Sleep hours
        </span>
        <span className="flex items-center gap-1 font-data text-[10px] text-ink-3">
          <span className="w-2 h-2 rounded-sm bg-amber-sol opacity-60 inline-block" /> Quality
        </span>
      </div>
    </div>
  );
}

export function HealthSection() {
  const { logs, todayLog, log } = useHealth();
  const todayStr = new Date().toISOString().split("T")[0];

  const [sleepHours, setSleepHours] = useState(todayLog?.sleep_hours ?? 7);
  const [sleepQuality, setSleepQuality] = useState(todayLog?.sleep_quality ?? 3);
  const [activityLevel, setActivityLevel] = useState<number>(
    (todayLog?.metadata?.activity_level as number) ?? 50
  );
  const [performanceNote, setPerformanceNote] = useState<string>(
    (todayLog?.metadata?.performance_note as string) ?? ""
  );

  useEffect(() => {
    if (todayLog) {
      setSleepHours(todayLog.sleep_hours ?? 7);
      setSleepQuality(todayLog.sleep_quality ?? 3);
      setActivityLevel((todayLog.metadata?.activity_level as number) ?? 50);
      setPerformanceNote((todayLog.metadata?.performance_note as string) ?? "");
    }
  }, [todayLog?.log_date]);

  const autosave = useCallback(
    (overrides?: {
      sleep_hours?: number;
      sleep_quality?: number;
      metadata?: Record<string, unknown>;
    }) => {
      const mergedMetadata = {
        activity_level: activityLevel,
        performance_note: performanceNote,
        ...(overrides?.metadata ?? {}),
      };
      log({
        log_date: todayStr,
        // Preserve existing mood/energy from today's log so we don't null them out
        mood: todayLog?.mood ?? null,
        energy: todayLog?.energy ?? null,
        sleep_hours: overrides?.sleep_hours ?? sleepHours,
        sleep_quality: overrides?.sleep_quality ?? sleepQuality,
        metadata: mergedMetadata,
      });
    },
    [sleepHours, sleepQuality, activityLevel, performanceNote, todayStr, todayLog?.mood, todayLog?.energy]
  );

  return (
    <section id="health" className="mb-16 scroll-mt-20">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="text-forest flex-shrink-0" size={20} strokeWidth={1.8} />
        <h3 className="text-[22px] font-semibold text-ink font-display">Health</h3>
      </div>

      <div
        className="bg-surface border border-bark rounded-[10px] p-8"
        style={{ boxShadow: "0 2px 12px rgba(60,40,10,0.04)" }}
      >
        <p className="font-data text-[11px] text-ink-3 uppercase tracking-wider mb-6">
          Today — {todayStr}
        </p>

        <div className="space-y-6">
          <SliderRow
            label="Sleep"
            value={sleepHours}
            max={12}
            step={0.5}
            onChange={(v) => { setSleepHours(v); autosave({ sleep_hours: v }); }}
            unit="h"
          />
          <SleepQualityDots
            value={sleepQuality}
            onChange={(v) => { setSleepQuality(v); autosave({ sleep_quality: v }); }}
          />
          <SliderRow
            label="Activity level"
            value={activityLevel}
            max={100}
            step={5}
            onChange={(v) => {
              setActivityLevel(v);
              autosave({ metadata: { activity_level: v, performance_note: performanceNote } });
            }}
            unit="%"
          />
          <div>
            <label className="font-reading text-[13px] text-ink-2 block mb-2">Performance note</label>
            <textarea
              rows={2}
              value={performanceNote}
              onChange={(e) => setPerformanceNote(e.target.value)}
              onBlur={() =>
                autosave({ metadata: { activity_level: activityLevel, performance_note: performanceNote } })
              }
              className="w-full bg-transparent font-reading text-[14px] text-ink border-b border-bark focus:border-forest focus:outline-none py-1.5 resize-none placeholder:text-ink-3"
              placeholder="How did you perform today?"
            />
          </div>
        </div>

        <Sparkline logs={logs} />
      </div>

      <OakDivider />
    </section>
  );
}
