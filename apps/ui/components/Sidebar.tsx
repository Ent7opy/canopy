"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";

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

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[200px] border-r border-[#c8b99a] bg-[#f7f3e9] flex flex-col p-8 z-40 overflow-y-auto">
      {/* Wordmark */}
      <div className="mb-10 flex flex-col gap-2 flex-shrink-0">
        <div className="w-9 h-9 border border-[#3d6b4f] rounded-full flex items-center justify-center opacity-80">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3d6b4f"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        </div>
        <h1 className="text-[28px] font-bold text-[#3d6b4f] font-display italic leading-none tracking-tight">
          vanyo.
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2.5 flex-1 min-h-0">
        {sections.map(({ id, label }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
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

        <div className="mt-4 pt-4 border-t border-[#e8dfc9] flex-shrink-0">
          <Link
            href="/settings"
            className="flex items-center gap-2.5 text-[13px] text-[#5c5540] hover:text-[#3d6b4f] transition-colors duration-200 font-reading"
          >
            <Settings size={13} strokeWidth={1.8} />
            Settings
          </Link>
        </div>
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
