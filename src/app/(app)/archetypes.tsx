import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { Portrait } from '@/components/dna/Portrait';
import { archetypes } from '@/data/archetypes';
import { buildProfile } from '@/lib/dna';
import { useAuth } from '@/store/auth';
import { useUserRecords } from '@/store/progress';
import { colors, fonts, radius, spacing } from '@/theme';

export default function Archetypes() {
  const userId = useAuth((s) => s.user?.id);
  const records = useUserRecords(userId);
  const current = useMemo(() => buildProfile(records)?.archetype.id, [records]);

  return (
    <AppShell title="12 Decision Archetypes">
      <FlatList
        data={archetypes}
        numColumns={3}
        keyExtractor={(a) => String(a.id)}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => {
          const mine = item.id === current;
          return (
            <View style={[styles.card, mine && styles.cardMine]}>
              <Portrait archetype={item} size={42} />
              <View style={styles.text}>
                <Text style={styles.name}>{item.nameTr}</Text>
                <Text style={styles.code}>{item.code}</Text>
                <Text style={styles.quote} numberOfLines={2}>
                  {item.quote}
                </Text>
              </View>
              {mine && <Text style={styles.you}>YOU</Text>}
            </View>
          );
        }}
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, gap: spacing.sm },
  gridRow: { gap: spacing.sm },
  card: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
  cardMine: { borderColor: colors.primary, backgroundColor: '#0A2233' },
  text: { flex: 1 },
  name: { fontFamily: fonts.bold, fontSize: 12, color: colors.text },
  code: { fontFamily: fonts.mono, fontSize: 8, color: colors.primaryBright, marginTop: 1 },
  quote: { fontFamily: fonts.italic, fontSize: 9.5, lineHeight: 13, color: colors.textSecondary, marginTop: 3 },
  you: {
    position: 'absolute',
    top: 6,
    right: 8,
    fontFamily: fonts.bold,
    fontSize: 8,
    letterSpacing: 1,
    color: colors.primaryBright,
  },
});
