"use client";

import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getSkills, patchSkill } from "@/lib/api";

interface EditableProgressRingProps {
  label: string;
  value: number;
  color: string;
  id: string;
}

export default function EditableProgressRing({
  label,
  value: initialValue,
  color,
  id,
}: EditableProgressRingProps) {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(initialValue);

  // Load saved value from v1 skills API
  useEffect(() => {
    async function load() {
      const skills = await getSkills();
      if (skills) {
        const skill = skills.find((s) => s.id === id);
        if (skill !== undefined) {
          setValue(skill.value);
          return;
        }
      }
      const saved = localStorage.getItem(`progress-${id}`);
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
          setValue(parsed);
        }
      }
    }
    load();
  }, [id]);

  const handleRingClick = () => {
    setTempValue(value);
    setIsEditing(true);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempValue(parseInt(e.target.value, 10));
  };

  const handleSave = () => {
    setValue(tempValue);
    localStorage.setItem(`progress-${id}`, tempValue.toString());
    patchSkill(id, { value: tempValue });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="h-24 w-24 cursor-pointer" onClick={handleRingClick}>
        <CircularProgressbar
          value={value}
          text={`${value}%`}
          styles={buildStyles({
            textSize: "24px",
            pathColor: color,
            textColor: color,
            trailColor: "var(--tw-bg-opacity)",
          })}
        />
      </div>
      <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </p>

      {/* Edit modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Edit {label}
            </h3>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">0%</span>
                <span className="text-2xl font-bold" style={{ color }}>{tempValue}%</span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">100%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={tempValue}
                onChange={handleSliderChange}
                className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 dark:bg-zinc-700"
                style={{
                  background: `linear-gradient(to right, ${color} ${tempValue}%, var(--tw-bg-opacity) ${tempValue}%)`,
                }}
              />
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={handleCancel}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white"
                  style={{ backgroundColor: color }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
