'use client';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { AuthGuard } from '@/components/AuthGuard';

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/auth'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  return (
    <AuthGuard>
      {isPublic ? (
        <>{children}</>
      ) : (
        <>
          <Sidebar />
          <main className="ml-[200px] min-h-screen">{children}</main>
        </>
      )}
    </AuthGuard>
  );
}
