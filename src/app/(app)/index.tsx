import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { ScenarioCard } from '@/components/ScenarioCard';
import { scenarios } from '@/data/scenarios';
import { useAuth } from '@/store/auth';
import { useUserRecords } from '@/store/progress';
import { colors, fonts, spacing } from '@/theme';

// Figma "Home V2": every scenario card in one horizontal row; tapping a card
// highlights it and dims the rest.
export default function Scenarios() {
  const userId = useAuth((s) => s.user?.id);
  const records = useUserRecords(userId);
  const played = useMemo(() => new Set(records.map((r) => r.scenarioId)), [records]);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Scenarios</Text>
        <Text style={styles.prompt}>
          Choose A Scenario And Ask Yourself, “If You Were In That Situation, What Would You Do?”
        </Text>
        <Text style={styles.total}>{scenarios.length} Scenarios</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {scenarios.map((s) => (
            <ScenarioCard
              key={s.id}
              scenario={s}
              completed={played.has(s.id)}
              dimmed={selected !== null && selected !== s.id}
              onSelect={() => setSelected((cur) => (cur === s.id ? null : s.id))}
              onStart={() => router.push({ pathname: '/scenario/[id]', params: { id: s.id } })}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: spacing.xxl, paddingTop: spacing.xl, paddingBottom: spacing.xl },
  heading: { fontFamily: fonts.bold, fontSize: 20, color: colors.text },
  prompt: { fontFamily: fonts.mono, fontSize: 11, color: colors.primaryBright, marginTop: 6 },
  total: { fontFamily: fonts.semibold, fontSize: 11, color: colors.textSecondary, marginTop: spacing.lg, marginBottom: spacing.sm },
  row: { gap: spacing.lg, paddingRight: spacing.xxl },
});
