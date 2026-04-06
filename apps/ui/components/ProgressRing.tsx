"use client";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface ProgressRingProps {
  label: string;
  value: number;
  color: string;
}

export default function ProgressRing({ label, value, color }: ProgressRingProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="h-24 w-24">
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
    </div>
  );
}