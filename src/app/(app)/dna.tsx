import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/Button';
import { Panel } from '@/components/dna/Panel';
import { Portrait } from '@/components/dna/Portrait';
import { RadarChart } from '@/components/dna/RadarChart';
import { traitLabels } from '@/data/archetypes';
import { getScenario } from '@/data/scenarios';
import { buildProfile } from '@/lib/dna';
import { useAuth } from '@/store/auth';
import { useUserRecords } from '@/store/progress';
import { colors, fonts, spacing } from '@/theme';
import { TRAITS, type Trait } from '@/types';

const TRAIT_ICONS: Record<Trait, keyof typeof Feather.glyphMap> = {
  vision: 'eye',
  courage: 'zap',
  risk: 'trending-up',
  control: 'sliders',
  empathy: 'heart',
  ethics: 'shield',
};

export default function DnaScreen() {
  const { fresh } = useLocalSearchParams<{ fresh?: string }>();
  const userId = useAuth((s) => s.user?.id);
  const records = useUserRecords(userId);
  const profile = useMemo(() => buildProfile(records), [records]);
  const freshTitle = fresh ? getScenario(fresh)?.title : undefined;

  if (!profile) {
    return (
      <AppShell title="DNA">
        <View style={styles.empty}>
          <Feather name="activity" size={28} color={colors.primaryBright} />
          <Text style={styles.emptyTitle}>Your decision DNA is still blank</Text>
          <Text style={styles.emptyText}>Play your first scenario — every choice you make shapes your profile.</Text>
          <Button variant="glow" compact title="Choose a scenario" onPress={() => router.replace('/')} />
        </View>
      </AppShell>
    );
  }

  const { archetype, scores } = profile;

  return (
    <AppShell title="DNA">
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        {freshTitle && (
          <View style={styles.banner}>
            <Feather name="refresh-cw" size={11} color={colors.primaryBright} />
            <Text style={styles.bannerText}>Profile updated after “{freshTitle}”</Text>
          </View>
        )}
        <View style={styles.columns}>
          <View style={styles.col}>
            <Panel style={styles.identity}>
              <Portrait archetype={archetype} size={64} />
              <View style={styles.identityText}>
                <Text style={styles.code}>{archetype.code}</Text>
                <Text style={styles.nameTr}>
                  {archetype.nameTr} · {profile.match}% match
                </Text>
                <View style={styles.quoteRow}>
                  <View style={styles.quoteBar} />
                  <Text style={styles.quote}>
                    “{archetype.quote}” {archetype.description}
                  </Text>
                </View>
              </View>
            </Panel>

            <Panel title="Psychological Matrix" icon="grid">
              <View style={styles.matrix}>
                <RadarChart scores={scores} size={170} />
                <View style={styles.stats}>
                  {TRAITS.map((t) => (
                    <View key={t} style={styles.stat}>
                      <View style={styles.statTop}>
                        <Feather name={TRAIT_ICONS[t]} size={9} color={colors.textMuted} />
                        <Text style={styles.statValue}>{scores[t]}</Text>
                      </View>
                      <Text style={styles.statLabel}>{traitLabels[t].toUpperCase()}</Text>
                      <View style={styles.statTrack}>
                        <View style={[styles.statFill, { width: `${scores[t]}%` }]} />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </Panel>
          </View>

          <View style={styles.col}>
            <Panel title="Pattern Detection" icon="activity">
              <View style={{ gap: spacing.sm }}>
                {profile.patterns.map((p, i) => (
                  <View key={i} style={styles.pattern}>
                    <Text style={styles.patternNum}>{String(i + 1).padStart(2, '0')}</Text>
                    <Text style={styles.patternText}>{p}</Text>
                  </View>
                ))}
              </View>
            </Panel>

            <Panel title={`Blind Spot · ${profile.blindSpot.label}`} icon="alert-circle" tone="danger">
              <Text style={styles.blindQ}>{profile.blindSpot.question}</Text>
              <Text style={styles.blindText}>{profile.blindSpot.text}</Text>
            </Panel>

            <View style={styles.metaRow}>
              <Meta label="Scenarios" value={String(profile.scenariosCount)} />
              <Meta label="Decisions" value={String(profile.decisionsCount)} />
              <Meta label="Avg. time" value={`${profile.avgResponseSec.toFixed(1)}s`} />
              <Meta label="Timeouts" value={String(profile.timeouts)} />
            </View>
          </View>
        </View>
      </ScrollView>
    </AppShell>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.meta}>
      <Text style={styles.metaValue}>{value}</Text>
      <Text style={styles.metaLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: spacing.lg, paddingBottom: spacing.xxl },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#0B2A3A',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: spacing.md,
  },
  bannerText: { fontFamily: fonts.medium, fontSize: 11, color: colors.primaryBright },
  columns: { flexDirection: 'row', gap: spacing.md },
  col: { flex: 1, gap: spacing.md },

  identity: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  identityText: { flex: 1 },
  code: { fontFamily: fonts.extraBoldItalic, fontSize: 15, color: colors.text },
  nameTr: { fontFamily: fonts.medium, fontSize: 10, color: colors.primaryBright, marginTop: 1 },
  quoteRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  quoteBar: { width: 2, borderRadius: 1, backgroundColor: colors.primary },
  quote: { flex: 1, fontFamily: fonts.italic, fontSize: 10, lineHeight: 14, color: colors.textSecondary },

  matrix: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stats: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  stat: {
    width: '47%',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 6,
  },
  statTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statValue: { fontFamily: fonts.bold, fontSize: 11, color: colors.primaryBright },
  statLabel: { fontFamily: fonts.medium, fontSize: 7.5, letterSpacing: 0.6, color: colors.textMuted, marginTop: 2 },
  statTrack: { height: 3, borderRadius: 2, backgroundColor: colors.border, marginTop: 4, overflow: 'hidden' },
  statFill: { height: 3, backgroundColor: colors.primary },

  pattern: { flexDirection: 'row', gap: spacing.sm },
  patternNum: { fontFamily: fonts.bold, fontSize: 11, color: colors.primaryBright, width: 18 },
  patternText: { flex: 1, fontFamily: fonts.italic, fontSize: 10.5, lineHeight: 15, color: colors.textSecondary },

  blindQ: { fontFamily: fonts.boldItalic, fontSize: 12, color: colors.text, marginBottom: 4 },
  blindText: { fontFamily: fonts.italic, fontSize: 10.5, lineHeight: 15, color: colors.textSecondary },

  metaRow: { flexDirection: 'row', gap: spacing.sm },
  meta: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    alignItems: 'center',
  },
  metaValue: { fontFamily: fonts.bold, fontSize: 14, color: colors.text },
  metaLabel: { fontFamily: fonts.regular, fontSize: 9, color: colors.textMuted, marginTop: 2 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingHorizontal: 60 },
  emptyTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.text, marginTop: spacing.sm },
  emptyText: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.sm },
});
