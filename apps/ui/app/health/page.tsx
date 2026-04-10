export default function HealthPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 pt-16 md:pt-12">
      <h1 className="mb-5 sm:mb-6 text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        🩺 Health
      </h1>
      <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300">
          Track wellness habits, sleep, nutrition, and exercise.
        </p>
        <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-5 sm:p-6 dark:bg-blue-900/30">
            <h2 className="mb-2 text-lg sm:text-xl font-semibold text-blue-900 dark:text-blue-200">
              💤 Sleep
            </h2>
            <p className="text-sm sm:text-base text-blue-800 dark:text-blue-300">
              Log hours, quality, bedtime routine.
            </p>
            <div className="mt-4 h-2 w-full rounded-full bg-blue-200 dark:bg-blue-800">
              <div className="h-full w-3/4 rounded-full bg-blue-500" />
            </div>
          </div>
          <div className="rounded-lg bg-emerald-50 p-5 sm:p-6 dark:bg-emerald-900/30">
            <h2 className="mb-2 text-lg sm:text-xl font-semibold text-emerald-900 dark:text-emerald-200">
              🥗 Nutrition
            </h2>
            <p className="text-sm sm:text-base text-emerald-800 dark:text-emerald-300">
              Track meals, water intake, macros.
            </p>
            <div className="mt-4 h-2 w-full rounded-full bg-emerald-200 dark:bg-emerald-800">
              <div className="h-full w-2/3 rounded-full bg-emerald-500" />
            </div>
          </div>
          <div className="rounded-lg bg-amber-50 p-5 sm:p-6 dark:bg-amber-900/30 sm:col-span-2 lg:col-span-1">
            <h2 className="mb-2 text-lg sm:text-xl font-semibold text-amber-900 dark:text-amber-200">
              🏋️ Exercise
            </h2>
            <p className="text-sm sm:text-base text-amber-800 dark:text-amber-300">
              Workout frequency, type, duration.
            </p>
            <div className="mt-4 h-2 w-full rounded-full bg-amber-200 dark:bg-amber-800">
              <div className="h-full w-5/6 rounded-full bg-amber-500" />
            </div>
          </div>
        </div>
        <div className="mt-6 sm:mt-8">
          <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Weekly Habit Tracker
          </h3>
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              Grid of days vs habits (sleep 8h, exercise, meditate, water). Coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}