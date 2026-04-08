import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@canopy/types';

export type { AuthUser };

interface AuthState {
  user: AuthUser | null;
  setAuth: (user: AuthUser) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setAuth: (user) => set({ user }),
      clearAuth: () => set({ user: null }),
    }),
    { name: 'canopy-auth' }
  )
);
