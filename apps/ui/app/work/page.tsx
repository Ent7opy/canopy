export default function WorkPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 pt-16 md:pt-12">
      <h1 className="mb-5 sm:mb-6 text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        💼 Work
      </h1>
      <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300">
          This page is under construction. Coming soon:
        </p>
        <ul className="mt-4 space-y-3 text-sm sm:text-base">
          <li className="flex items-center gap-3">
            <div className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
            <span>Task manager with drag‑and‑drop</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <span>Pomodoro timer & focus sessions</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />
            <span>Project timeline & milestones</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="h-2 w-2 shrink-0 rounded-full bg-purple-500" />
            <span>Daily stand‑up notes</span>
          </li>
        </ul>
      </div>
    </div>
  );
}