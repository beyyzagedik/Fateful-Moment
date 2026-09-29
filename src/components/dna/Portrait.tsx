import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';

import { colors, fonts } from '@/theme';
import type { Archetype } from '@/types';

type Props = { archetype: Archetype; size?: number; source?: ImageSourcePropType };

/**
 * Archetype portrait. The Figma portraits are already circular PNGs with a
 * transparent background (some, like "Uyumcu", extend past the circle), so
 * they are drawn unclipped. Without an image, a numbered badge is shown.
 */
export function Portrait({ archetype, size = 64, source }: Props) {
  const image = source ?? archetype.portrait;
  if (image) {
    return (
      <Image
        source={image}
        style={{ width: size, height: size }}
        resizeMode="contain"
        accessibilityLabel={`${archetype.nameEn} portrait`}
      />
    );
  }
  const round = { width: size, height: size, borderRadius: size / 2 };
  return (
    <LinearGradient colors={['#6D3FD0', '#2563EB', '#0B1838']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[round, styles.ring]}>
      <View style={styles.center}>
        <Text style={[styles.num, { fontSize: size * 0.36 }]}>{String(archetype.id).padStart(2, '0')}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  ring: { borderWidth: 1.5, borderColor: 'rgba(165,240,255,0.6)', overflow: 'hidden' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  num: { fontFamily: fonts.extraBoldItalic, color: colors.text },
});
