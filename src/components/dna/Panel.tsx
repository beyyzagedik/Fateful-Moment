import { Feather } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts, radius, spacing } from '@/theme';

type Props = {
  title?: string;
  icon?: keyof typeof Feather.glyphMap;
  tone?: 'default' | 'danger';
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export function Panel({ title, icon, tone = 'default', style, children }: Props) {
  const danger = tone === 'danger';
  return (
    <View style={[styles.panel, danger && styles.danger, style]}>
      {title ? (
        <View style={styles.header}>
          {icon ? <Feather name={icon} size={11} color={danger ? colors.danger : colors.primaryBright} /> : null}
          <Text style={[styles.title, danger && { color: colors.danger }]}>{title}</Text>
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  danger: { backgroundColor: colors.dangerSurface, borderColor: colors.dangerBorder },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.sm },
  title: { fontFamily: fonts.boldItalic, fontSize: 9.5, letterSpacing: 1, color: colors.text, textTransform: 'uppercase' },
});
