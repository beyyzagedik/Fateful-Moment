import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { colors, fonts, radius } from '@/theme';
import type { Category } from '@/types';

type Props = { category: Category; count: number; onPress: () => void };

export function CategoryCard({ category, count, onPress }: Props) {
  const body = (
    <LinearGradient colors={['transparent', 'rgba(3,7,20,0.92)']} style={styles.shade}>
      <View style={styles.countRow}>
        <CategoryIcon kind={category.icon} color={colors.primaryBright} />
        <Text style={styles.count}>
          {count} Scenario{count === 1 ? '' : 's'}
        </Text>
      </View>
      <Text style={styles.title}>{category.title}</Text>
    </LinearGradient>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${category.title}, ${count} scenarios`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {category.image ? (
        <ImageBackground source={category.image} style={styles.fill} imageStyle={styles.image}>
          {body}
        </ImageBackground>
      ) : (
        <LinearGradient colors={category.tint} style={styles.fill}>
          <View style={styles.watermark}>
            <CategoryIcon kind={category.icon} size={64} color="rgba(255,255,255,0.08)" />
          </View>
          {body}
        </LinearGradient>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 170,
    height: 136,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  fill: { flex: 1 },
  image: { borderRadius: radius.lg },
  watermark: { position: 'absolute', top: 14, right: 14 },
  shade: { flex: 1, justifyContent: 'flex-end', padding: 12 },
  countRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 },
  count: { fontFamily: fonts.semibold, fontSize: 11, color: colors.primaryBright },
  title: { fontFamily: fonts.extraBoldItalic, fontSize: 14, color: colors.text },
});
