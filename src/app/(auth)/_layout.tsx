import { Stack } from 'expo-router';

import { useOrientationLock } from '@/hooks/useOrientationLock';
import { colors } from '@/theme';

// The root layout's auth guard lands on the anchor screen.
export const unstable_settings = { anchor: 'welcome' };

export default function AuthLayout() {
  useOrientationLock('portrait');
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        orientation: 'portrait',
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
