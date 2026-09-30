import { create } from 'zustand';

export type ToastKind = 'success' | 'error' | 'info';

export type ToastMessage = {
  id: number;
  kind: ToastKind;
  title: string;
  message?: string;
};

type ToastState = {
  current: ToastMessage | null;
  show: (kind: ToastKind, title: string, message?: string) => void;
  hide: (id: number) => void;
};

let nextId = 1;

/**
 * App-wide feedback banner. Lives in the root layout so it survives the
 * navigation that follows a successful sign in / sign up.
 */
export const useToast = create<ToastState>((set) => ({
  current: null,
  show: (kind, title, message) => set({ current: { id: nextId++, kind, title, message } }),
  hide: (id) => set((s) => (s.current?.id === id ? { current: null } : s)),
}));

export const toast = {
  success: (title: string, message?: string) => useToast.getState().show('success', title, message),
  error: (title: string, message?: string) => useToast.getState().show('error', title, message),
  info: (title: string, message?: string) => useToast.getState().show('info', title, message),
};
