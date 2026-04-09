"use client";

import { useState, useEffect } from "react";

const sections = [
  { id: "now",     label: "Now"           },
  { id: "inbox",   label: "Mind Log"      },
  { id: "habits",  label: "Habits"        },
  { id: "journal", label: "Journal"       },
  { id: "health",  label: "Health"        },
  { id: "goals",   label: "Goals"         },
  { id: "projects",label: "Projects"      },
  { id: "skills",  label: "Skills"        },
  { id: "learning",label: "Learning"      },
  { id: "hobbies", label: "Hobbies"       },
  { id: "reading", label: "Reading"       },
  { id: "review",  label: "Weekly Review" },
];

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState("now");

  // Track active section via IntersectionObserver.
  // Uses a retry loop because page.tsx defers rendering sections until after
  // hydration (mounted guard), so they may not be in the DOM on first effect run.
  useEffect(() => {
    const visible = new Set<string>();
    const observed = new Set<string>();
    const observers: IntersectionObserver[] = [];
    let retryTimer: ReturnType<typeof setTimeout>;

    const setup = () => {
      let pending = false;
      for (const { id } of sections) {
        if (observed.has(id)) continue;
        const el = document.getElementById(id);
        if (!el) { pending = true; continue; }
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) visible.add(id);
            else visible.delete(id);
            const top = sections.find(({ id }) => visible.has(id));
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
      if (pending) retryTimer = setTimeout(setup, 100);
    };

    setup();
    return () => {
      clearTimeout(retryTimer);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[200px] border-r border-[#c8b99a] bg-[#f7f3e9] flex flex-col p-8 z-40 overflow-y-auto">
      {/* Wordmark */}
      <div className="mb-10 flex flex-col gap-2 flex-shrink-0">
        <h1 className="text-[28px] font-bold text-[#3d6b4f] font-display italic leading-none tracking-tight">
          Canopy
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2.5 flex-1 min-h-0">
        {sections.map(({ id, label }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => { setActiveSection(id); scrollTo(id); }}
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
            </button>
          );
        })}
      </nav>

      {/* Footer quote */}
      <div className="mt-4 flex-shrink-0">
        <p className="text-[10px] text-[#9c8f78] italic leading-relaxed font-reading">
          Learning in public ·<br />
          Building for the planet
        </p>
      </div>
    </aside>
  );
}
