import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { passwordRules } from '@/lib/validation';
import { colors, fonts } from '@/theme';

export function PasswordRules({ value }: { value: string }) {
  return (
    <View style={styles.list} accessibilityRole="summary">
      {passwordRules.map((rule) => {
        const ok = rule.test(value);
        return (
          <View key={rule.id} style={styles.row}>
            <View style={[styles.dot, ok && styles.dotOk]}>
              <Feather name="check" size={9} color={ok ? colors.textOnPrimary : colors.background} />
            </View>
            <Text style={[styles.label, ok && styles.labelOk]}>{rule.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 4, marginTop: 10, marginLeft: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotOk: { backgroundColor: colors.primary },
  label: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 11 },
  labelOk: { color: colors.text },
});
