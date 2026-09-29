import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/Button';
import { getScenario } from '@/data/scenarios';
import { useAuth } from '@/store/auth';
import { useUserRecords } from '@/store/progress';
import { colors, fonts, radius, spacing } from '@/theme';

export default function History() {
  const userId = useAuth((s) => s.user?.id);
  const records = useUserRecords(userId);
  const items = [...records].reverse();

  return (
    <AppShell title="Decision History">
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No decisions yet.</Text>
          <Button variant="glow" compact title="Play a scenario" onPress={() => router.replace('/')} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(r) => `${r.decisionId}-${r.at}`}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const scenario = getScenario(item.scenarioId);
            const decision = scenario?.decisions.find((d) => d.id === item.decisionId);
            const option = decision?.options.find((o) => o.id === item.optionId);
            return (
              <View style={styles.row}>
                <View style={[styles.dot, !option && styles.dotTimeout]}>
                  <Feather name={option ? 'check' : 'clock'} size={11} color={option ? colors.textOnPrimary : colors.text} />
                </View>
                <View style={styles.rowBody}>
                  <Text style={styles.scenario}>
                    {scenario?.title} · {scenario?.year}
                  </Text>
                  <Text style={styles.prompt} numberOfLines={1}>
                    {decision?.prompt}
                  </Text>
                  <Text style={styles.choice} numberOfLines={2}>
                    {option ? option.label : 'Time ran out — no decision'}
                  </Text>
                </View>
                <Text style={styles.time}>{(item.responseMs / 1000).toFixed(1)}s</Text>
              </View>
            );
          }}
        />
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  dot: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  dotTimeout: { backgroundColor: colors.danger },
  rowBody: { flex: 1 },
  scenario: { fontFamily: fonts.mono, fontSize: 10, color: colors.primaryBright },
  prompt: { fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  choice: { fontFamily: fonts.semibold, fontSize: 12, color: colors.text, marginTop: 2 },
  time: { fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emptyText: { fontFamily: fonts.regular, color: colors.textSecondary },
});
