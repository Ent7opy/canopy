'use client';
import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      router.replace('/login?error=invalid_token');
      return;
    }

    fetch(`${API_URL}/api/v1/auth/verify?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          router.replace('/login?verified=true');
        } else {
          router.replace('/login?error=invalid_token');
        }
      })
      .catch(() => router.replace('/login?error=invalid_token'));
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

const Loader = (
  <div className="min-h-screen bg-parchment flex items-center justify-center">
    <div className="text-center">
      <div className="text-4xl mb-4">🌿</div>
      <p className="font-reading text-ink-2">Loading…</p>
    </div>
  </div>
);

export default function VerifyPage() {
  return <Suspense fallback={Loader}><VerifyContent /></Suspense>;
}
