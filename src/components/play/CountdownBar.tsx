import { useEffect, useEffectEvent, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

type Props = {
  durationSec: number;
  running: boolean;
  onTimeout: () => void;
};

/**
 * Shrinking timer bar under the options: yellow while there is time,
 * red in the last third (matches "Unselected / Selected Option" frames).
 */
export function CountdownBar({ durationSec, running, onTimeout }: Props) {
  const [remaining] = useState(() => new Animated.Value(1));
  const fireTimeout = useEffectEvent(onTimeout);

  useEffect(() => {
    if (!running) {
      remaining.stopAnimation();
      return;
    }
    remaining.setValue(1);
    const anim = Animated.timing(remaining, {
      toValue: 0,
      duration: durationSec * 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    anim.start();
    // The deadline runs on a timer so it does not depend on animation frames.
    const deadline = setTimeout(() => fireTimeout(), durationSec * 1000);
    return () => {
      anim.stop();
      clearTimeout(deadline);
    };
  }, [running, durationSec, remaining]);

  const redOpacity = remaining.interpolate({ inputRange: [0, 0.3, 0.36, 1], outputRange: [1, 1, 0, 0] });

  return (
    <View style={styles.track} accessibilityRole="progressbar" accessibilityLabel="Time remaining">
      <Animated.View style={[styles.fill, { transform: [{ scaleX: remaining }] }]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.warning }]} />
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.danger, opacity: redOpacity }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.14)', overflow: 'hidden' },
  fill: { ...StyleSheet.absoluteFill, borderRadius: 2, overflow: 'hidden' },
});
