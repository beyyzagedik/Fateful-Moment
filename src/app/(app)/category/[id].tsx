import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { ScenarioCard } from '@/components/ScenarioCard';
import { categories } from '@/data/categories';
import { scenariosByCategory } from '@/data/scenarios';
import { useAuth } from '@/store/auth';
import { useUserRecords } from '@/store/progress';
import { colors, fonts, spacing } from '@/theme';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const category = categories.find((c) => c.id === id);
  const list = scenariosByCategory(id);
  const userId = useAuth((s) => s.user?.id);
  const records = useUserRecords(userId);
  const played = useMemo(() => new Set(records.map((r) => r.scenarioId)), [records]);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <AppShell back title={category?.title ?? 'Scenarios'}>
      {list.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No scenarios here yet.</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {list.map((s) => (
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
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.lg, paddingHorizontal: spacing.xxl, alignItems: 'center', paddingVertical: spacing.lg },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontFamily: fonts.regular, color: colors.textSecondary },
});
