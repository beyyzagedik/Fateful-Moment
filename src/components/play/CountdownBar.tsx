import { useEffect, useEffectEvent } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

type Props = {
  /** 1 → 0 over the decision. Owned by the screen so it can tint the background too. */
  remaining: Animated.Value;
  durationSec: number;
  running: boolean;
  onTimeout: () => void;
};

/** Opacity curve for "time is running out" visuals: off until the last ~third. */
export const urgencyOpacity = (remaining: Animated.Value) =>
  remaining.interpolate({ inputRange: [0, 0.3, 0.36, 1], outputRange: [1, 1, 0, 0] });

/**
 * Full-width timer bar along the bottom (Figma decision frames): the yellow
 * segment shrinks toward the center and turns red in the last third.
 */
export function CountdownBar({ remaining, durationSec, running, onTimeout }: Props) {
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

  return (
    <View style={styles.track} accessibilityRole="progressbar" accessibilityLabel="Time remaining">
      {/* scaleX shrinks around the center, so the bar closes in from both ends. */}
      <Animated.View style={[styles.fill, { transform: [{ scaleX: remaining }] }]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.warning }]} />
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.danger, opacity: urgencyOpacity(remaining) }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 4, borderRadius: 2, backgroundColor: 'rgba(49,65,88,0.6)', overflow: 'hidden' },
  fill: { ...StyleSheet.absoluteFill, borderRadius: 2, overflow: 'hidden' },
});
