import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useEffectEvent, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';
import type { Scene } from '@/types';

type Props = {
  scenes: Scene[];
  onEnd: () => void;
  /** Keep showing the last scene without advancing (behind the decision UI). */
  frozen?: boolean;
};

/**
 * Cinematic fallback for scenarios without a bundled video: timed scenes with
 * a slow zoom and narration captions. Swap in a real video via `Scenario.video`.
 */
export function SceneSlideshow({ scenes, onEnd, frozen }: Props) {
  const [index, setIndex] = useState(0);
  const [fade] = useState(() => new Animated.Value(0));
  const [zoom] = useState(() => new Animated.Value(1));
  const [progress] = useState(() => new Animated.Value(0));
  const fireEnd = useEffectEvent(onEnd);

  const scene = scenes[Math.min(index, scenes.length - 1)];

  useEffect(() => {
    if (!scene) return;
    if (frozen) {
      // Skipped mid-fade: make sure the frozen backdrop is fully visible.
      fade.setValue(1);
      return;
    }
    fade.setValue(0);
    zoom.setValue(1);
    progress.setValue(0);
    const anim = Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(zoom, { toValue: 1.12, duration: scene.durationMs, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(progress, { toValue: 1, duration: scene.durationMs, easing: Easing.linear, useNativeDriver: false }),
    ]);
    anim.start();
    // Scene timing runs on a timer; the animations are purely visual.
    const advance = setTimeout(() => {
      if (index < scenes.length - 1) setIndex((i) => i + 1);
      else fireEnd();
    }, scene.durationMs);
    return () => {
      anim.stop();
      clearTimeout(advance);
    };
  }, [index, frozen, scene, scenes.length, fade, zoom, progress]);

  if (!scene) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fade, transform: [{ scale: zoom }] }]}>
        <LinearGradient colors={scene.tint} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={styles.vignette} />
      </Animated.View>

      {!frozen && (
        <>
          <View style={styles.progressRow}>
            {scenes.map((s, i) => (
              <View key={i} style={styles.track}>
                <Animated.View
                  style={[
                    styles.fill,
                    {
                      width:
                        i < index
                          ? '100%'
                          : i === index
                            ? progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })
                            : '0%',
                    },
                  ]}
                />
              </View>
            ))}
          </View>
          <Animated.View style={[styles.captionWrap, { opacity: fade }]}>
            <Text style={styles.caption}>{scene.caption}</Text>
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  vignette: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.25)' },
  progressRow: { position: 'absolute', top: 18, left: 64, right: 64, flexDirection: 'row', gap: 4 },
  track: { flex: 1, height: 2, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' },
  fill: { height: 2, backgroundColor: colors.text },
  captionWrap: { position: 'absolute', left: 80, right: 80, bottom: 44, alignItems: 'center' },
  caption: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 23,
    color: colors.text,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 8,
  },
});
