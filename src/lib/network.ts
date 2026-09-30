/**
 * There is no backend; auth calls resolve instantly. A short delay keeps the
 * loading state visible so the UI behaves like it would against a real API.
 */
export const FAKE_LATENCY_MS = 700;

export const simulateRequest = <T>(work: () => T, ms = FAKE_LATENCY_MS) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(work()), ms));

export const firstName = (fullName: string) => fullName.trim().split(/\s+/)[0] ?? fullName;
