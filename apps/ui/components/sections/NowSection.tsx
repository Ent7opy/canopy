'use client';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuthStore } from '@/store/authStore';
import FernDivider from '@/components/FernDivider';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

function formatDate() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function NowSection() {
  const { dashboard } = useDashboard();
  const { user } = useAuthStore();

  const kpis = [
    { val: dashboard ? String(dashboard.snapshot.active_projects) : '—', label: 'projects active' },
    { val: dashboard ? String(dashboard.snapshot.active_goals) : '—', label: 'active goals' },
    { val: dashboard ? String(dashboard.snapshot.resources_active) : '—', label: 'resources in progress' },
  ];

  return (
    <section id="now" className="mb-12 sm:mb-16 scroll-mt-20">
      <header className="mb-8 sm:mb-10">
        <p className="font-reading text-xs sm:text-sm text-ink-3 italic mb-2">{formatDate()}</p>
        {/* Fluid display type — clamp keeps the greeting readable at 320px
            and still hits the big 52px showpiece size on wide screens. */}
        <h2
          className="font-bold text-forest leading-[1.05] mb-3 tracking-tight font-display italic"
          style={{ fontSize: 'clamp(2rem, 6vw + 0.5rem, 3.25rem)' }}
        >
          {getGreeting()}, {user?.display_name ?? 'there'}.
        </h2>
        <p className="text-[15px] sm:text-[17px] text-ink-2 font-reading italic">
          Here's where things stand.
        </p>
      </header>

      {/* KPI grid — stacks vertically on the smallest phones, becomes a tidy
          3-up on sm+. We avoid a 2-col intermediate because an orphaned third
          card below two siblings looks ugly at any viewport. */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-surface-2 border border-bark rounded-[10px] p-4 sm:p-6 text-center"
            style={{ boxShadow: '2px 4px 12px rgba(60,40,10,0.05)' }}
          >
            <div className="font-data text-2xl sm:text-3xl font-bold text-forest mb-1">{kpi.val}</div>
            <div className="font-data text-[10px] sm:text-[11px] text-ink-3 uppercase tracking-wider">{kpi.label}</div>
          </div>
        ))}
      </div>

      <FernDivider />
    </section>
  );
}
