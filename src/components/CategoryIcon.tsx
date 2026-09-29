import { Feather } from '@expo/vector-icons';

import type { CategoryIcon as Kind } from '@/types';

const MAP: Record<Kind, keyof typeof Feather.glyphMap> = {
  history: 'clock',
  business: 'briefcase',
  crisis: 'shield',
  science: 'aperture',
};

export function CategoryIcon({ kind, size = 12, color }: { kind: Kind; size?: number; color: string }) {
  return <Feather name={MAP[kind]} size={size} color={color} />;
}
