"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

// Three conceptual groups that reinforce the Stream/Garden mental model:
//   Timeline — the "when" of the app (today + the historical record)      → /
//   Stream   — date-scoped views that react to ActiveDate                 → /stream
//   Garden   — status-scoped views that are date-agnostic                 → /garden
//
// Each group corresponds to its own route; the individual items are hash
// links into the sections rendered on that route. This reinforces the
// boundary between date-scoped and status-scoped data — the URL itself
// tells you which mode you're in.
type NavItem = { id: string; label: string };
type NavGroup = {
  label: string;
  route: "/" | "/stream" | "/garden";
  items: NavItem[];
};

const groups: NavGroup[] = [
  {
    label: "Timeline",
    route: "/",
    items: [
      { id: "now",     label: "Now"     },
      { id: "history", label: "History" },
    ],
  },
  {
    label: "The Stream",
    route: "/stream",
    items: [
      { id: "inbox",   label: "Mind Log" },
      { id: "habits",  label: "Habits"   },
      { id: "journal", label: "Journal"  },
      { id: "health",  label: "Health"   },
    ],
  },
  {
    label: "The Garden",
    route: "/garden",
    items: [
      { id: "goals",    label: "Goals"    },
      { id: "projects", label: "Projects" },
      { id: "learning", label: "Learning" },
      { id: "hobbies",  label: "Hobbies"  },
      { id: "reading",  label: "Reading"  },
    ],
  },
];

// Weekly Review sits on its own route below the three main groups.
const REVIEW_ROUTE = "/review";

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Preserve the `?d=` query param across all navigation so that jumping
  // between /stream and /garden (or any nav item) keeps the user's
  // selected ActiveDate without having to re-select it each time.
  const qs = searchParams.toString();
  const withQuery = (href: string) => (qs ? `${href}?${qs}` : href);
  const withHash = (route: string, id: string) =>
    `${route}${qs ? `?${qs}` : ""}#${id}`;

  // Figure out which group the current route belongs to so we can both
  // highlight the group label and scope the IntersectionObserver to only
  // the sections that actually exist on this page.
  const currentGroup = useMemo(
    () => groups.find((g) => g.route === pathname),
    [pathname]
  );
  const currentSections = currentGroup?.items ?? [];

  // Track active section via IntersectionObserver, scoped to the sections
  // on the current route. Without scoping, the observer would spin in a
  // retry loop forever waiting for sections that belong to other routes.
  //
  // The retry loop handles page.tsx's mounted-guard — sections may not be
  // in the DOM on the first effect run, so we poll briefly until they
  // appear (or give up quietly if none ever do).
  useEffect(() => {
    if (currentSections.length === 0) {
      setActiveSection(null);
      return;
    }

    const visible = new Set<string>();
    const observed = new Set<string>();
    const observers: IntersectionObserver[] = [];
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;

    const setup = () => {
      attempts += 1;
      let pending = false;
      for (const { id } of currentSections) {
        if (observed.has(id)) continue;
        const el = document.getElementById(id);
        if (!el) { pending = true; continue; }
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) visible.add(id);
            else visible.delete(id);
            const top = currentSections.find(({ id }) => visible.has(id));
            if (top) setActiveSection(top.id);
          },
          // rootMargin creates a detection band from 20%–40% of the viewport.
          // threshold:0 fires as soon as any part of the section enters that band,
          // which works for sections of any height.
          { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
        );
        obs.observe(el);
        observers.push(obs);
        observed.add(id);
      }
      // Bail after ~2s (20 × 100ms) if sections never show up, so we don't
      // leak a retry loop on routes where some IDs never render.
      if (pending && attempts < 20) {
        retryTimer = setTimeout(setup, 100);
      }
    };

    setup();
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      observers.forEach((o) => o.disconnect());
    };
  }, [currentSections]);

  const isReviewRoute = pathname === REVIEW_ROUTE;

  return (
    <aside className="fixed left-0 top-0 h-screen w-[200px] border-r border-[#c8b99a] bg-[#f7f3e9] flex flex-col p-8 z-40 overflow-y-auto">
      {/* Wordmark */}
      <div className="mb-10 flex flex-col gap-2 flex-shrink-0">
        <h1 className="text-[28px] font-bold text-[#3d6b4f] font-display italic leading-none tracking-tight">
          Canopy
        </h1>
      </div>

      {/* Grouped nav — Timeline / Stream / Garden.
          Group labels are navigation links to their respective routes; the
          items beneath each group are hash links that scroll to the section
          on that route. Both preserve `?d=` via `withQuery`/`withHash`. */}
      <nav className="flex flex-col gap-6 flex-1 min-h-0">
        {groups.map((group) => {
          const isActiveGroup = pathname === group.route;
          return (
            <div key={group.label} className="flex flex-col gap-2">
              <Link
                href={withQuery(group.route)}
                className={`font-data text-[9px] uppercase tracking-[0.12em] mb-1 transition-colors ${
                  isActiveGroup
                    ? "text-[#3d6b4f]"
                    : "text-[#9c8f78] hover:text-[#3d6b4f]"
                }`}
              >
                {group.label}
              </Link>
              <div className="flex flex-col gap-2">
                {group.items.map(({ id, label }) => {
                  // An item is "active" only when we're on its route AND the
                  // IntersectionObserver has placed it in view. Otherwise the
                  // link stays muted — including when we're on another route.
                  const isActive = isActiveGroup && activeSection === id;
                  return (
                    <Link
                      key={id}
                      href={withHash(group.route, id)}
                      className={`flex items-center gap-2.5 text-[14px] font-reading text-left transition-colors duration-200 ${
                        isActive
                          ? "text-[#3d6b4f] font-semibold"
                          : "text-[#5c5540] hover:text-[#3d6b4f]"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-200 ${
                          isActive ? "bg-[#3d6b4f]" : "bg-transparent"
                        }`}
                      />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Weekly Review — pinned to the bottom of the sidebar, visually
          separated from the three main groups by a divider. It's its own
          route (`/review`) because weekly reviews key off `week_start`,
          not a specific day, so it sits outside the Timeline/Stream/Garden
          mental model. */}
      <div className="mt-4 pt-4 border-t border-[#e2d8c2] flex-shrink-0">
        <Link
          href={withQuery(REVIEW_ROUTE)}
          className={`flex items-center gap-2.5 text-[14px] font-reading text-left transition-colors duration-200 ${
            isReviewRoute
              ? "text-[#3d6b4f] font-semibold"
              : "text-[#5c5540] hover:text-[#3d6b4f]"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-200 ${
              isReviewRoute ? "bg-[#3d6b4f]" : "bg-transparent"
            }`}
          />
          Weekly Review
        </Link>
      </div>
    </aside>
  );
}
