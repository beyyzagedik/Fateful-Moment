import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { colors, fonts, radius, spacing } from '@/theme';
import type { Scenario } from '@/types';

type Props = {
  scenario: Scenario;
  dimmed: boolean;
  completed: boolean;
  onSelect: () => void;
  onStart: () => void;
};

export function ScenarioCard({ scenario, dimmed, completed, onSelect, onStart }: Props) {
  const cover = scenario.cover ? (
    <ImageBackground source={scenario.cover} style={StyleSheet.absoluteFill} resizeMode="cover" />
  ) : (
    <LinearGradient colors={scenario.tint} style={StyleSheet.absoluteFill} />
  );

  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="button"
      accessibilityLabel={`${scenario.title}. ${scenario.teaser}`}
      style={[styles.card, dimmed && styles.dimmed]}
    >
      {cover}
      <LinearGradient
        colors={['rgba(5,10,28,0)', 'rgba(5,10,28,0.75)', 'rgba(5,10,28,0.96)']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      {!scenario.cover && (
        <Text style={styles.year} accessibilityElementsHidden>
          {scenario.year}
        </Text>
      )}
      <View style={styles.body}>
        <View style={styles.metaRow}>
          <Feather name={scenario.available ? 'clock' : 'lock'} size={11} color={colors.primaryBright} />
          <Text style={styles.duration}>{scenario.durationLabel}</Text>
          {completed && (
            <View style={styles.badge}>
              <Feather name="check" size={9} color={colors.textOnPrimary} />
              <Text style={styles.badgeText}>Played</Text>
            </View>
          )}
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {scenario.title}
        </Text>
        <Text style={styles.teaser} numberOfLines={3}>
          {scenario.teaser}
        </Text>
        <View style={styles.actions}>
          {scenario.available ? (
            <Button variant="glow" compact title={completed ? 'Replay' : 'Start'} onPress={onStart} />
          ) : (
            <Text style={styles.soon}>Coming soon</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 250,
    height: 200,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  dimmed: { opacity: 0.35 },
  year: {
    position: 'absolute',
    top: 10,
    right: 14,
    fontFamily: fonts.extraBoldItalic,
    fontSize: 40,
    color: 'rgba(255,255,255,0.08)',
  },
  body: { flex: 1, justifyContent: 'flex-end', padding: spacing.md },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  duration: { fontFamily: fonts.mono, fontSize: 10, color: colors.primaryBright },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 6,
  },
  badgeText: { fontFamily: fonts.bold, fontSize: 9, color: colors.textOnPrimary },
  title: { fontFamily: fonts.extraBoldItalic, fontSize: 13, color: colors.text, marginTop: 3 },
  teaser: { fontFamily: fonts.regular, fontSize: 11, lineHeight: 15, color: colors.textSecondary, marginTop: 3 },
  actions: { alignItems: 'flex-end', marginTop: spacing.sm, minHeight: 36, justifyContent: 'center' },
  soon: { fontFamily: fonts.medium, fontSize: 11, color: colors.textMuted },
});
