import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { DecisionRecord } from '@/types';

type ProgressState = {
  /** Decision history keyed by user id, so each account has its own DNA. */
  byUser: Record<string, DecisionRecord[]>;
  record: (userId: string, record: DecisionRecord) => void;
  /** Replaying a scenario replaces its previous answers. */
  clearScenario: (userId: string, scenarioId: string) => void;
  reset: (userId: string) => void;
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      byUser: {},
      record: (userId, record) =>
        set((s) => ({ byUser: { ...s.byUser, [userId]: [...(s.byUser[userId] ?? []), record] } })),
      clearScenario: (userId, scenarioId) =>
        set((s) => ({
          byUser: { ...s.byUser, [userId]: (s.byUser[userId] ?? []).filter((r) => r.scenarioId !== scenarioId) },
        })),
      reset: (userId) => set((s) => ({ byUser: { ...s.byUser, [userId]: [] } })),
    }),
    { name: 'fm-progress', storage: createJSONStorage(() => AsyncStorage) },
  ),
);

const EMPTY: DecisionRecord[] = [];

export function useUserRecords(userId: string | undefined) {
  return useProgress((s) => (userId ? s.byUser[userId] ?? EMPTY : EMPTY));
}
