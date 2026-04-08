'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/auth'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (!isPublic && !user) {
      router.replace('/login');
    } else {
      setChecked(true);
    }
  }, [user, pathname]);

  if (!isPublic && !checked) return null;
  return <>{children}</>;
}
