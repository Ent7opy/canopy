// Dashboard page – updated 2026-04-05 to force Vercel rebuild
// Reading list integration live
// Vercel Pro trial enabled 2026-04-05
import RoadmapTimeline from "@/components/Timeline";
import EditableProgressRing from "@/components/EditableProgressRing";
import TaskList from "@/components/TaskList";
import ResourceCard from "@/components/ResourceCard";
import BookList from "@/components/BookList";
import WeeklyReview from "@/components/WeeklyReview";
import {
  progressCategories,
  resources,
  daysUntilDeadline,
  today,
} from "@/data/roadmap";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="border-b border-zinc-200 bg-white px-6 py-8 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight">
            🇩🇪 Environment & Energy B.Sc. Dashboard
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Track your progress towards the degree at Hochschule Rhein‑Waal.
            Next application deadline:{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              15 July 2027
            </span>
            .
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="rounded-lg bg-blue-50 px-4 py-3 dark:bg-blue-900/30">
              <div className="text-sm text-blue-800 dark:text-blue-300">
                Days until deadline
              </div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                {daysUntilDeadline}
              </div>
            </div>
            <div className="rounded-lg bg-zinc-100 px-4 py-3 dark:bg-zinc-800">
              <div className="text-sm text-zinc-700 dark:text-zinc-300">
                Today&apos;s date
              </div>
              <div className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
                {today}
              </div>
            </div>
            <div className="rounded-lg bg-emerald-50 px-4 py-3 dark:bg-emerald-900/30">
              <div className="text-sm text-emerald-800 dark:text-emerald-300">
                Total phases
              </div>
              <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-200">
                7
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Timeline Section */}
        <section className="mb-10">
          <RoadmapTimeline />
        </section>

        {/* Progress & Tasks Side-by-side */}
        <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Progress Rings */}
          <section>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                📊 Progress
              </h2>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                {progressCategories.map((cat) => (
                  <EditableProgressRing
                    key={cat.id}
                    id={cat.id}
                    label={cat.label}
                    value={cat.value}
                    color={cat.color}
                  />
                ))}
              </div>
              <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
                Update percentages as you advance. Click a ring to edit.
              </p>
            </div>
          </section>

          {/* Task List */}
          <section>
            <TaskList />
          </section>
        </div>

        {/* Resources */}
        <section className="mb-10">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              🔗 Resources
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
            <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
              Bookmark these links for quick access. More can be added in the
              data file.
            </p>
          </div>
        </section>

        {/* Reading List */}
        <section className="mb-10">
          <BookList />
        </section>

        {/* Weekly Review */}
        <section className="mb-10">
          <WeeklyReview />
        </section>

        {/* Footer note */}
        <footer className="mt-12 text-center text-sm text-zinc-500 dark:text-zinc-500">
          <p>
            Dashboard built with Next.js & Tailwind. Data stored locally in your
            browser.{" "}
            <a
              href="https://github.com/Ent7opy/degree-dashboard"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              View source on GitHub
            </a>
            .
          </p>
        </footer>
      </main>
    </div>
  );
}