'use client';
import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { authLogin } from '@/lib/api';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth, user } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (user) router.replace('/');
    if (searchParams.get('verified') === 'true') {
      setNotice('Email verified! You can now log in.');
    }
    if (searchParams.get('error') === 'invalid_token') {
      setError('Verification link is invalid or has expired. Please register again.');
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await authLogin(email, password);
      setAuth(user);
      router.replace('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-10">
          <h1 className="font-display text-5xl font-bold text-forest italic mb-2">Canopy</h1>
          <p className="font-reading text-ink-2 italic text-base">your life, tended carefully</p>
        </div>

        <div className="bg-surface border border-sepia rounded-2xl p-8 shadow-sm">
          <h2 className="font-display text-2xl text-ink font-bold mb-6">Welcome back</h2>

          {notice && (
            <div className="bg-forest/10 border border-forest/30 text-forest rounded-lg px-4 py-3 text-sm font-reading mb-5">
              {notice}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-reading mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-reading text-sm text-ink-2 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-parchment border border-sepia rounded-lg px-4 py-2.5 font-reading text-ink text-base focus:outline-none focus:border-forest transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block font-reading text-sm text-ink-2 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-parchment border border-sepia rounded-lg px-4 py-2.5 font-reading text-ink text-base focus:outline-none focus:border-forest transition-colors"
                placeholder="••••••••"
              />
            </div>
            <div className="text-right">
              <Link href="/forgot-password" className="font-reading text-sm text-ink-3 hover:text-forest transition-colors">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest text-parchment font-reading font-medium py-3 rounded-lg text-base hover:bg-forest/90 transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center font-reading text-sm text-ink-3 mt-6">
          New to Canopy?{' '}
          <Link href="/register" className="text-forest hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <div className="text-4xl">🌿</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
