import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AuthScreen } from '@/components/AuthScreen';
import { Button } from '@/components/Button';
import { colors, fonts } from '@/theme';

export default function CheckEmail() {
  const { email } = useLocalSearchParams<{ email?: string }>();

  return (
    <AuthScreen
      gradient
      centered
      title="Check Your Email"
      hero={
        <View style={styles.badge}>
          <Feather name="check-circle" size={22} color={colors.primaryBright} />
        </View>
      }
      subtitle={
        <Text style={styles.subtitle}>
          We’ve sent password reset{'\n'}instructions to <Text style={styles.email}>{email}</Text>
        </Text>
      }
    >
      <Button title="Back to Sign in" onPress={() => router.replace('/sign-in')} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  subtitle: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 19 },
  email: { color: colors.text, fontFamily: fonts.semibold },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#123A55',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
