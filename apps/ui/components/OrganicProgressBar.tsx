"use client";

interface OrganicProgressBarProps {
  progress: number; // 0–100
  color?: string;
  bgColor?: string;
}

// A slightly wobbly SVG progress bar — like ink drawn with a slightly
// unsteady hand. The path approximates a horizontal line with minor
// vertical variation, giving it an organic, hand-made quality.
export default function OrganicProgressBar({
  progress,
  color = "#3d6b4f",
  bgColor = "#e8dfc9",
}: OrganicProgressBarProps) {
  const totalLength = 800;
  const filled = totalLength * (Math.min(100, Math.max(0, progress)) / 100);

  return (
    <div className="relative w-full h-4 flex items-center">
      <svg
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
        viewBox="0 0 800 10"
      >
        {/* Background track — wobbly */}
        <path
          d="M 0,5 Q 100,4 200,6 Q 300,5 400,7 Q 500,5 600,6 Q 700,5 800,5"
          fill="none"
          stroke={bgColor}
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Progress fill — same path, dashoffset to reveal */}
        <path
          d="M 0,5 Q 100,4 200,6 Q 300,5 400,7 Q 500,5 600,6 Q 700,5 800,5"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength - filled}
          style={{ transition: "stroke-dashoffset 700ms ease-out, stroke 200ms ease" }}
        />
      </svg>
    </div>
  );
}
