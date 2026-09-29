import { create } from 'zustand';

/**
 * State for the ambient mini player in the top bar ("STANDBY · THIS IS THE
 * FATEFUL MOMENT"). No audio files ship with the demo, so this only drives UI.
 */
export const tracks = [
  'This Is The Fateful Moment',
  'Echoes Of The Situation Room',
  'Countdown In Blue',
] as const;

type PlayerState = {
  playing: boolean;
  index: number;
  toggle: () => void;
  next: () => void;
  prev: () => void;
};

export const useMiniPlayer = create<PlayerState>((set) => ({
  playing: false,
  index: 0,
  toggle: () => set((s) => ({ playing: !s.playing })),
  next: () => set((s) => ({ index: (s.index + 1) % tracks.length })),
  prev: () => set((s) => ({ index: (s.index - 1 + tracks.length) % tracks.length })),
}));
