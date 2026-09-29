import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, usePathname, type Href } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MiniPlayer } from '@/components/MiniPlayer';
import { colors, fonts, spacing } from '@/theme';

type NavItem = { href: Href; match: (path: string) => boolean; icon: ReactNode; iconActive: ReactNode; label: string };

const icon = (name: keyof typeof Feather.glyphMap) => [
  <Feather key="i" name={name} size={20} color={colors.menuText} />,
  <Feather key="a" name={name} size={20} color={colors.primaryBright} />,
];
const dnaIcon = [
  <MaterialCommunityIcons key="i" name="dna" size={20} color={colors.menuText} />,
  <MaterialCommunityIcons key="a" name="dna" size={20} color={colors.primaryBright} />,
];

// Figma menu: Scenarios, DNA, Settings. History and Archetypes follow in the same style.
const NAV: NavItem[] = [
  { href: '/', match: (p) => p === '/', label: 'Scenarios', ...pair(icon('compass')) },
  { href: '/dna', match: (p) => p.startsWith('/dna'), label: 'DNA', ...pair(dnaIcon) },
  { href: '/history', match: (p) => p.startsWith('/history'), label: 'History', ...pair(icon('activity')) },
  { href: '/archetypes', match: (p) => p.startsWith('/archetypes'), label: 'Archetypes', ...pair(icon('users')) },
  { href: '/settings', match: (p) => p.startsWith('/settings'), label: 'Settings', ...pair(icon('settings')) },
];

function pair([i, a]: ReactNode[]) {
  return { icon: i, iconActive: a };
}

const MENU_WIDTH = 256;

type Props = {
  title?: string;
  /** Back arrow before the title (e.g. the scenario briefing). */
  back?: boolean;
  children: ReactNode;
};

export function AppShell({ title, back, children }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [slide] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(slide, { toValue: menuOpen ? 1 : 0, duration: 220, useNativeDriver: true }).start();
  }, [menuOpen, slide]);

  const go = (item: NavItem) => {
    setMenuOpen(false);
    if (!item.match(pathname)) router.replace(item.href);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.flex} edges={['left', 'right', 'top', 'bottom']}>
        <View style={styles.topBar}>
          <View style={styles.titleRow}>
            {back ? (
              <Pressable
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Go back"
                onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
              >
                <Feather name="arrow-left" size={20} color={colors.text} />
              </Pressable>
            ) : null}
            {title ? <Text style={styles.title}>{title}</Text> : null}
          </View>
          <MiniPlayer onMenu={() => setMenuOpen(true)} />
        </View>
        <View style={styles.flex}>{children}</View>
      </SafeAreaView>

      {/* Side menu (Figma 1595:186), slides in from the right edge. */}
      <Animated.View
        pointerEvents={menuOpen ? 'auto' : 'none'}
        style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: slide }]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenuOpen(false)} accessibilityLabel="Close menu" />
      </Animated.View>
      <Animated.View
        pointerEvents={menuOpen ? 'auto' : 'none'}
        style={[
          styles.menu,
          { transform: [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [MENU_WIDTH, 0] }) }] },
        ]}
      >
        <SafeAreaView edges={['top', 'bottom', 'right']} style={styles.menuInner}>
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Pressable
                key={item.label}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => go(item)}
                style={[styles.link, active && styles.linkActive]}
              >
                {active ? item.iconActive : item.icon}
                <Text style={[styles.linkText, active && styles.linkTextActive]}>{item.label}</Text>
                {active && <View style={styles.dot} />}
              </Pressable>
            );
          })}
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  topBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.navBorder,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { fontFamily: fonts.bold, fontSize: 17, color: colors.text },

  backdrop: { backgroundColor: 'rgba(0,0,0,0.45)' },
  menu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: MENU_WIDTH,
    backgroundColor: 'rgba(2,6,24,0.95)',
    borderLeftWidth: 1,
    borderLeftColor: '#1D293D',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 16,
  },
  menuInner: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, gap: 12 },
  link: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 0.75,
    borderColor: 'rgba(29,41,61,0.5)',
    backgroundColor: 'rgba(15,23,43,0.4)',
  },
  linkActive: { backgroundColor: 'rgba(0,184,219,0.1)', borderColor: 'rgba(0,184,219,0.3)' },
  linkText: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 14,
    letterSpacing: -0.5,
    textTransform: 'uppercase',
    color: colors.menuText,
  },
  linkTextActive: { color: colors.primaryBright },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.primaryBright },
});
