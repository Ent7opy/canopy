export default function WorkPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        💼 Work
      </h1>
      <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-lg text-zinc-700 dark:text-zinc-300">
          This page is under construction. Coming soon:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span>Task manager with drag‑and‑drop</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Pomodoro timer & focus sessions</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Project timeline & milestones</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-purple-500" />
            <span>Daily stand‑up notes</span>
          </li>
        </ul>
      </div>
    </div>
  );
}