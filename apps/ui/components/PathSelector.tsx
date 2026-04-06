"use client";

import { useState, useEffect } from "react";
import { paths } from "@/data/universityPaths";

type PathSelectorProps = {
  selectedPath: string;
  onPathChange: (pathId: string) => void;
};

export default function PathSelector({ selectedPath, onPathChange }: PathSelectorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-2">
        <div className="h-10 w-24 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-10 w-24 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-10 w-24 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {Object.values(paths).map((path) => (
        <button
          key={path.id}
          onClick={() => onPathChange(path.id)}
          className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
            selectedPath === path.id
              ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300"
              : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">
              {path.country === "Germany" ? "🇩🇪" : path.country === "Bulgaria" ? "🇧🇬" : "🌍"}
            </span>
            <div className="text-left">
              <div className="font-semibold">{path.name}</div>
              <div className="text-xs opacity-75">{path.university.split("→")[0].trim()}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}