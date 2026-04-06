'use client';
import { useState } from 'react';
import Link from 'next/link';
import { authForgotPassword } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await authForgotPassword(email);
      setSent(true);
    } catch {
      setSent(true); // Always show success to prevent enumeration
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-10">
          <h1 className="font-display text-5xl font-bold text-forest italic mb-2">Canopy</h1>
        </div>
        <div className="bg-surface border border-sepia rounded-2xl p-8 shadow-sm">
          {sent ? (
            <div className="text-center">
              <div className="text-3xl mb-3">📬</div>
              <h2 className="font-display text-xl text-ink font-bold mb-2">Check your inbox</h2>
              <p className="font-reading text-ink-2 text-sm leading-relaxed">If that email is registered, a reset link is on its way.</p>
            </div>
          ) : (
            <>
              <h2 className="font-display text-2xl text-ink font-bold mb-2">Reset password</h2>
              <p className="font-reading text-ink-2 text-sm mb-6">We'll send a reset link to your email.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-parchment border border-sepia rounded-lg px-4 py-2.5 font-reading text-ink text-base focus:outline-none focus:border-forest transition-colors"
                  placeholder="you@example.com"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-forest text-parchment font-reading font-medium py-3 rounded-lg text-base hover:bg-forest/90 transition-colors disabled:opacity-60"
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
            </>
          )}
        </div>
        <p className="text-center font-reading text-sm text-ink-3 mt-6">
          <Link href="/login" className="text-forest hover:underline">← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
