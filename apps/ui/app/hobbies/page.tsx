export default function HobbiesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        🎨 Hobbies
      </h1>
      <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-lg text-zinc-700 dark:text-zinc-300">
          Your personal space for hobbies, side projects, and leisure.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              📚 Reading List
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Track books, articles, and podcasts. Mark progress, take notes.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              🎵 Media Log
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Log movies, series, music albums. Rate and review.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              🧵 Side Projects
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Track personal coding, DIY, or creative projects.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              🚴 Fitness Goals
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Log workouts, hiking, cycling. Set personal records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}