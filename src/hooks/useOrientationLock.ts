import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';
import { Platform } from 'react-native';

/**
 * Auth screens are designed for portrait, the game itself for landscape.
 * Each route group locks its orientation while it is mounted.
 */
export function useOrientationLock(mode: 'portrait' | 'landscape') {
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const lock =
      mode === 'portrait' ? ScreenOrientation.OrientationLock.PORTRAIT_UP : ScreenOrientation.OrientationLock.LANDSCAPE;
    ScreenOrientation.lockAsync(lock).catch(() => {});
  }, [mode]);
}
