'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { authRegister } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (user) router.replace('/');
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authRegister(email, password, displayName || undefined);
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
        <div className="w-full max-w-[420px] text-center">
          <h1 className="font-display text-5xl font-bold text-forest italic mb-2">Canopy</h1>
          <p className="font-reading text-ink-2 italic text-base mb-10">your life, tended carefully</p>
          <div className="bg-surface border border-sepia rounded-2xl p-8">
            <div className="text-4xl mb-4">🌿</div>
            <h2 className="font-display text-2xl text-ink font-bold mb-3">Check your inbox</h2>
            <p className="font-reading text-ink-2 leading-relaxed">
              We've sent a verification link to <strong className="text-ink">{email}</strong>.
              Click it to activate your account.
            </p>
            <p className="font-reading text-sm text-ink-3 mt-4">The link expires in 24 hours.</p>
          </div>
          <p className="text-center font-reading text-sm text-ink-3 mt-6">
            Already verified?{' '}
            <Link href="/login" className="text-forest hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-10">
          <h1 className="font-display text-5xl font-bold text-forest italic mb-2">Canopy</h1>
          <p className="font-reading text-ink-2 italic text-base">your life, tended carefully</p>
        </div>

        <div className="bg-surface border border-sepia rounded-2xl p-8 shadow-sm">
          <h2 className="font-display text-2xl text-ink font-bold mb-6">Create your account</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-reading mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-reading text-sm text-ink-2 mb-1.5">Your name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-parchment border border-sepia rounded-lg px-4 py-2.5 font-reading text-ink text-base focus:outline-none focus:border-forest transition-colors"
                placeholder="Vanyo"
              />
            </div>
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
                minLength={8}
                className="w-full bg-parchment border border-sepia rounded-lg px-4 py-2.5 font-reading text-ink text-base focus:outline-none focus:border-forest transition-colors"
                placeholder="At least 8 characters"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest text-parchment font-reading font-medium py-3 rounded-lg text-base hover:bg-forest/90 transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center font-reading text-sm text-ink-3 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-forest hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
