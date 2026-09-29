import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts } from '@/theme';

type Props = {
  label: string;
  state: 'idle' | 'selected' | 'faded';
  disabled?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Figma "Option Card" (1644:1014): Default / Selected / Passive, plus the "Your Choice" badge. */
export function OptionButton({ label, state, disabled, onPress, style }: Props) {
  const selected = state === 'selected';
  // Long options read as a paragraph (left aligned), short ones are centered.
  const long = label.length > 48;
  return (
    <View style={style}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected, disabled }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          state === 'faded' && styles.faded,
          pressed && !disabled && styles.pressed,
          selected && styles.selected,
        ]}
      >
        {selected && (
          <LinearGradient
            colors={['rgba(15,23,43,0.63)', 'rgba(0,211,243,0.63)', 'rgba(15,23,43,0.63)']}
            start={{ x: 0, y: 0.45 }}
            end={{ x: 1, y: 0.55 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        <Text style={[styles.label, !long && styles.center]} numberOfLines={3}>
          {label}
        </Text>
      </Pressable>
      {selected && (
        <View style={styles.badgeWrap} pointerEvents="none">
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Your Choice</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 66,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.optionBorder,
    backgroundColor: colors.optionFill,
    paddingHorizontal: 17,
    paddingVertical: 9,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  selected: { borderWidth: 2, paddingHorizontal: 16, paddingVertical: 8 },
  faded: { opacity: 0.5 },
  pressed: { backgroundColor: 'rgba(20,40,70,0.9)' },
  label: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, color: colors.text },
  center: { textAlign: 'center' },
  badgeWrap: { position: 'absolute', top: -14, left: 0, right: 0, alignItems: 'center' },
  badge: {
    backgroundColor: colors.choiceBadge,
    borderWidth: 1,
    borderColor: colors.choiceBadgeBorder,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  badgeText: { fontFamily: fonts.black, fontSize: 12, lineHeight: 16, color: colors.text },
});
