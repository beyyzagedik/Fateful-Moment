import { Stack } from 'expo-router';

import { useOrientationLock } from '@/hooks/useOrientationLock';
import { colors } from '@/theme';

// After sign-in the root auth guard lands on the anchor screen (Scenarios).
export const unstable_settings = { anchor: 'index' };

export default function AppLayout() {
  useOrientationLock('landscape');
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        orientation: 'landscape',
        animation: 'fade',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="scenario/[id]" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
