import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts, radius } from '@/theme';

type Variant = 'primary' | 'glow' | 'secondary' | 'ghost';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
};

/**
 * - primary: solid cyan; disabled = dark teal
 * - glow: dark with cyan outline ("Continue with Email", "Sign In", "Start", "Send Reset Link", "Back to Sign in")
 * - secondary: dark surface ("Continue with Apple / Google")
 */
export function Button({ title, onPress, variant = 'primary', disabled, loading, icon, style, compact }: Props) {
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        variantStyles[variant],
        inactive && (variant === 'primary' || variant === 'glow') && styles.disabled,
        pressed && !inactive && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.textOnPrimary : colors.primary} />
      ) : (
        <View style={styles.row}>
          {icon}
          <Text
            style={[
              styles.label,
              compact && styles.labelCompact,
              { color: variant === 'primary' ? colors.text : variant === 'glow' ? colors.primaryBright : colors.text },
              inactive && styles.labelDisabled,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.primary },
  glow: {
    backgroundColor: '#07202C',
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.55,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  secondary: { backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border },
  ghost: { backgroundColor: 'transparent' },
});

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  compact: { height: 36, paddingHorizontal: 18, borderRadius: radius.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { fontFamily: fonts.semibold, fontSize: 14 },
  labelCompact: { fontSize: 13, fontFamily: fonts.bold },
  disabled: {
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: colors.primaryMutedBorder,
    shadowOpacity: 0,
    elevation: 0,
  },
  labelDisabled: { color: colors.primaryMutedText },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
});
