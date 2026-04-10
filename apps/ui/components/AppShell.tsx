'use client';
import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
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
          <Sidebar />
          <main className="ml-[200px] min-h-screen">
            {showDateNav && (
              <div className="sticky top-0 z-30">
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
