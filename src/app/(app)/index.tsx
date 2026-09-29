import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { CategoryCard } from '@/components/CategoryCard';
import { categories } from '@/data/categories';
import { scenarios, scenariosByCategory } from '@/data/scenarios';
import { colors, fonts, spacing, type } from '@/theme';

export default function Scenarios() {
  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Scenarios</Text>
        <Text style={styles.prompt}>
          Choose A Scenario And Ask Yourself, “If You Were In That Situation, What Would You Do?”
        </Text>
        <Text style={styles.total}>{scenarios.length} Scenarios</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {categories.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              count={scenariosByCategory(c.id).length}
              onPress={() => router.push({ pathname: '/category/[id]', params: { id: c.id } })}
            />
          ))}
        </ScrollView>
        <View style={styles.hint}>
          <Text style={type.caption}>
            Every choice shapes your decision DNA. Play more scenarios for a sharper profile.
          </Text>
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: spacing.xxl, paddingTop: spacing.lg, paddingBottom: spacing.xl },
  heading: { fontFamily: fonts.bold, fontSize: 20, color: colors.text },
  prompt: { fontFamily: fonts.mono, fontSize: 11, color: colors.primaryBright, marginTop: 6 },
  total: { fontFamily: fonts.semibold, fontSize: 11, color: colors.textSecondary, marginTop: spacing.lg, marginBottom: spacing.sm },
  row: { gap: spacing.md, paddingRight: spacing.xxl },
  hint: { marginTop: spacing.lg },
});
