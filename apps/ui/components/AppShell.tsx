'use client';
import { Suspense, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { AuthGuard } from '@/components/AuthGuard';
import DateNavigator from '@/components/DateNavigator';
import PastDateBanner from '@/components/PastDateBanner';

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/auth'];

// Date-scoped routes — these subscribe to ActiveDate, so the DateNavigator
// is meaningful here. On date-agnostic routes (/garden, /review) we hide
// the navigator entirely to reinforce that those views don't react to it.
const DATE_SCOPED_PATHS = ['/', '/stream'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const showDateNav = DATE_SCOPED_PATHS.includes(pathname);

  // Mobile drawer state. On desktop (md+) the sidebar is always visible,
  // so this flag only matters below the md breakpoint. We close the drawer
  // automatically whenever the route changes so a tap through the nav doesn't
  // leave the drawer sitting open over the new page.
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => setDrawerOpen(false), [pathname]);

  // Lock body scroll while the drawer is open so the background page doesn't
  // scroll underneath the overlay.
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  return (
    <AuthGuard>
      {isPublic ? (
        <>{children}</>
      ) : (
        // Suspense wraps both Sidebar and main content because Sidebar now
        // reads `useSearchParams` (to preserve `?d=` across nav links), and
        // Next.js 16 requires `useSearchParams` callers to sit inside a
        // Suspense boundary for static-export compatibility.
        <Suspense fallback={null}>
          <Sidebar
            mobileOpen={drawerOpen}
            onMobileClose={() => setDrawerOpen(false)}
          />

          {/* Mobile backdrop — tapping it closes the drawer. Hidden on md+. */}
          {drawerOpen && (
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setDrawerOpen(false)}
              className="md:hidden fixed inset-0 z-30 bg-ink/30 backdrop-blur-sm transition-opacity"
            />
          )}

          {/* Mobile hamburger — only visible below md. Sits above content
              but below the drawer itself (drawer is z-40, backdrop z-30,
              this button z-20 so the drawer's own close button covers it). */}
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setDrawerOpen(true)}
            className="md:hidden fixed top-3 left-3 z-20 w-10 h-10 rounded-full bg-parchment/90 backdrop-blur-sm border border-bark text-ink-2 hover:text-forest hover:border-forest transition-colors flex items-center justify-center shadow-sm"
          >
            <Menu size={18} strokeWidth={1.8} />
          </button>

          <main
            className={`md:ml-[200px] min-h-screen ${
              // When the sticky DateNavigator is absent we still need to
              // reserve vertical space on mobile so the fixed hamburger
              // button doesn't collide with the page's own top content.
              showDateNav ? "" : "pt-16 md:pt-0"
            }`}
          >
            {showDateNav && (
              <div className="sticky top-0 z-10">
                <DateNavigator />
                <PastDateBanner />
              </div>
            )}
            {children}
          </main>
        </Suspense>
      )}
    </AuthGuard>
  );
}

