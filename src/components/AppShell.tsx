import { Feather } from '@expo/vector-icons';
import { router, usePathname, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MiniPlayer } from '@/components/MiniPlayer';
import { colors, fonts, spacing } from '@/theme';

type NavItem = { href: Href; match: (path: string) => boolean; icon: keyof typeof Feather.glyphMap; label: string };

const NAV: NavItem[] = [
  { href: '/', match: (p) => p === '/' || p.startsWith('/category'), icon: 'compass', label: 'Scenarios' },
  { href: '/history', match: (p) => p.startsWith('/history'), icon: 'activity', label: 'History' },
  { href: '/dna', match: (p) => p.startsWith('/dna'), icon: 'user', label: 'DNA' },
  { href: '/archetypes', match: (p) => p.startsWith('/archetypes'), icon: 'cpu', label: 'Archetypes' },
];

type Props = {
  title?: string;
  /** Back arrow instead of the menu icon (sub pages like a category). */
  back?: boolean;
  children: ReactNode;
};

export function AppShell({ title, back, children }: Props) {
  const pathname = usePathname();

  return (
    <SafeAreaView style={styles.root} edges={['left', 'right', 'top', 'bottom']}>
      <View style={styles.main}>
        <View style={styles.topBar}>
          <View style={styles.titleRow}>
            {back ? (
              <Pressable
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Go back"
                onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
              >
                <Feather name="arrow-left" size={18} color={colors.text} />
              </Pressable>
            ) : null}
            {title ? <Text style={styles.title}>{title}</Text> : null}
          </View>
          <MiniPlayer />
        </View>
        <View style={styles.content}>{children}</View>
      </View>

      <View style={styles.rail}>
        <View style={styles.railGroup}>
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Pressable
                key={item.label}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                accessibilityState={{ selected: active }}
                onPress={() => !active && router.replace(item.href)}
                style={[styles.railItem, active && styles.railItemActive]}
              >
                <Feather name={item.icon} size={17} color={active ? colors.primaryBright : colors.textSecondary} />
              </Pressable>
            );
          })}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Settings"
          onPress={() => router.replace('/settings')}
          style={[styles.railItem, pathname.startsWith('/settings') && styles.railItemActive]}
        >
          <Feather
            name="settings"
            size={17}
            color={pathname.startsWith('/settings') ? colors.primaryBright : colors.textSecondary}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: colors.background },
  main: { flex: 1 },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { fontFamily: fonts.bold, fontSize: 17, color: colors.text },
  content: { flex: 1 },
  rail: {
    width: 56,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: colors.border,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 64,
    paddingBottom: spacing.lg,
  },
  railGroup: { gap: spacing.md },
  railItem: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  railItemActive: { backgroundColor: '#0B2A3A' },
});
