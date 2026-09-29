import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { seedUsers, socialDemoUser } from '@/data/users';
import { messages } from '@/lib/validation';
import type { User } from '@/types';

type SignInError = { field: 'email' | 'password'; message: string };
type Result<E> = { ok: true } | { ok: false; error: E };

type AuthState = {
  hydrated: boolean;
  user: User | null;
  /** Accounts created on this device (seed accounts are always available). */
  localUsers: User[];
  signIn: (email: string, password: string) => Result<SignInError>;
  signUp: (fullName: string, email: string, password: string) => Result<string>;
  signInWithProvider: () => void;
  emailExists: (email: string) => boolean;
  signOut: () => void;
};

const normalize = (email: string) => email.trim().toLowerCase();

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => {
      const allUsers = () => [...seedUsers, ...get().localUsers];
      const findUser = (email: string) => allUsers().find((u) => u.email === normalize(email));

      return {
        hydrated: false,
        user: null,
        localUsers: [],

        emailExists: (email) => Boolean(findUser(email)),

        signIn: (email, password) => {
          const user = findUser(email);
          if (!user) return { ok: false, error: { field: 'email', message: messages.emailNotFound } };
          if (user.password !== password) {
            return { ok: false, error: { field: 'password', message: messages.wrongPassword } };
          }
          set({ user });
          return { ok: true };
        },

        signUp: (fullName, email, password) => {
          if (findUser(email)) return { ok: false, error: messages.emailTaken };
          const user: User = { id: `u-${Date.now()}`, fullName: fullName.trim(), email: normalize(email), password };
          set((s) => ({ localUsers: [...s.localUsers, user], user }));
          return { ok: true };
        },

        signInWithProvider: () => set({ user: socialDemoUser }),

        signOut: () => set({ user: null }),
      };
    },
    {
      name: 'fm-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ user: s.user, localUsers: s.localUsers }),
      onRehydrateStorage: () => () => useAuth.setState({ hydrated: true }),
    },
  ),
);
