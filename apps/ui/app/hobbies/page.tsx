export default function HobbiesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 pt-16 md:pt-12">
      <h1 className="mb-5 sm:mb-6 text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        🎨 Hobbies
      </h1>
      <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300">
          Your personal space for hobbies, side projects, and leisure.
        </p>
        <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 p-5 sm:p-6 dark:border-zinc-800">
            <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              📚 Reading List
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              Track books, articles, and podcasts. Mark progress, take notes.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 p-5 sm:p-6 dark:border-zinc-800">
            <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              🎵 Media Log
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              Log movies, series, music albums. Rate and review.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 p-5 sm:p-6 dark:border-zinc-800">
            <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              🧵 Side Projects
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              Track personal coding, DIY, or creative projects.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 p-5 sm:p-6 dark:border-zinc-800">
            <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              🚴 Fitness Goals
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              Log workouts, hiking, cycling. Set personal records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}