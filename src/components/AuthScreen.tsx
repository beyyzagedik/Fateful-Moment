import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Logo } from '@/components/Logo';
import { colors, fonts, spacing } from '@/theme';

type Props = {
  title: string;
  subtitle?: ReactNode;
  showBack?: boolean;
  showLogo?: boolean;
  /** Replaces the logo above the title (e.g. the check badge). */
  hero?: ReactNode;
  footer?: ReactNode;
  centered?: boolean;
  children: ReactNode;
};

export function AuthScreen({ title, subtitle, showBack, showLogo = true, hero, footer, centered, children }: Props) {
  const content = (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Android is edge-to-edge (the window no longer resizes), so both platforms need padding. */}
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'web' ? undefined : 'padding'}>
        <ScrollView
          contentContainerStyle={[styles.scroll, centered && styles.centered]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {showBack && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={10}
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/welcome'))}
              style={styles.back}
            >
              <Feather name="arrow-left" size={16} color={colors.textSecondary} />
            </Pressable>
          )}
          <View style={styles.header}>
            {hero ?? (showLogo && <Logo size={100} />)}
            <Text style={styles.title}>{title}</Text>
            {subtitle ? (typeof subtitle === 'string' ? <Text style={styles.subtitle}>{subtitle}</Text> : subtitle) : null}
          </View>
          <View style={styles.body}>{children}</View>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  return <View style={[styles.flex, { backgroundColor: colors.background }]}>{content}</View>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.xxl, paddingBottom: spacing.xl },
  centered: { justifyContent: 'center' },
  back: {
    marginTop: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: { alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.xxl, gap: spacing.sm },
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 26,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.sm,
    maxWidth: 280,
  },
  subtitle: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 19 },
  body: { gap: spacing.lg },
  footer: { marginTop: 'auto', paddingTop: spacing.xxl, alignItems: 'center' },
});
