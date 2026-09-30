import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToast, type ToastKind } from '@/store/toast';
import { colors, fonts, radius, spacing } from '@/theme';

const VISIBLE_MS = 2600;

const TONE: Record<ToastKind, { icon: keyof typeof Feather.glyphMap; color: string; border: string }> = {
  success: { icon: 'check-circle', color: colors.primaryBright, border: colors.primaryDark },
  error: { icon: 'alert-circle', color: colors.danger, border: colors.dangerBorder },
  info: { icon: 'info', color: colors.textSecondary, border: colors.borderStrong },
};

/** Top banner that shows the result of an action (sign in, sign up, …). */
export function Toast() {
  const current = useToast((s) => s.current);
  const hide = useToast((s) => s.hide);
  const insets = useSafeAreaInsets();
  const [anim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!current) return;
    anim.setValue(0);
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
    const timer = setTimeout(() => {
      Animated.timing(anim, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => hide(current.id));
    }, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [current, anim, hide]);

  if (!current) return null;
  const tone = TONE[current.kind];

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrap,
        {
          top: insets.top + spacing.sm,
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }) }],
        },
      ]}
    >
      <Pressable
        onPress={() => hide(current.id)}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        style={[styles.card, { borderColor: tone.border }]}
      >
        <Feather name={tone.icon} size={18} color={tone.color} />
        <View style={styles.text}>
          <Text style={styles.title}>{current.title}</Text>
          {current.message ? <Text style={styles.message}>{current.message}</Text> : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 1000, elevation: 1000 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minWidth: 260,
    maxWidth: 420,
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    backgroundColor: colors.surfaceRaised,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  text: { flexShrink: 1 },
  title: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
  message: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});
