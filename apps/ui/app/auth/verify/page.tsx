'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'redirecting'>('loading');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setStatus('redirecting');
      // The actual verification happens on the backend which redirects here via /api/v1/auth/verify
      // This page is just a fallback — backend redirects directly to /login?verified=true
      router.replace(`/login?verified=true`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🌿</div>
        <p className="font-reading text-ink-2">Verifying your email…</p>
      </div>
    </div>
  );
}
