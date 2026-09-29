import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts, radius } from '@/theme';

type Props = {
  label: string;
  state: 'idle' | 'selected' | 'faded';
  disabled?: boolean;
  onPress: () => void;
};

export function OptionButton({ label, state, disabled, onPress }: Props) {
  const selected = state === 'selected';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        state === 'faded' && styles.faded,
        pressed && !disabled && styles.pressed,
        selected && styles.selectedShadow,
      ]}
    >
      {selected && (
        <LinearGradient
          colors={['#1FB6D6', '#48D6EE', '#1FB6D6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <Text style={[styles.label, label.length > 48 && styles.labelLong]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 38,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glass,
    paddingHorizontal: 16,
    paddingVertical: 9,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  faded: { opacity: 0.45 },
  pressed: { backgroundColor: 'rgba(20,40,70,0.9)' },
  selectedShadow: {
    borderColor: '#A5F0FF',
    shadowColor: colors.primaryBright,
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  label: { fontFamily: fonts.medium, fontSize: 12, color: colors.text, textAlign: 'center' },
  labelLong: { textAlign: 'left', fontSize: 11, lineHeight: 15 },
});
