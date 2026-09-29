import { FontAwesome, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { AuthScreen } from '@/components/AuthScreen';
import { GoogleIcon } from '@/components/BrandIcons';
import { Button } from '@/components/Button';
import { useAuth } from '@/store/auth';
import { colors, fonts } from '@/theme';

export default function Welcome() {
  const signInWithProvider = useAuth((s) => s.signInWithProvider);
  const [fade] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [fade]);

  return (
    <AuthScreen
      gradient
      centered
      title="Welcome to Fateful Moment"
      subtitle="Step into history. Discover your decision DNA."
      footer={
        <Text style={styles.legal}>
          By continuing, you agree to our <Text style={styles.link}>Terms of Use</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>.
        </Text>
      }
    >
      <Animated.View style={{ opacity: fade, gap: 16 }}>
        <Button
          variant="glow"
          title="Continue with Email"
          icon={<Feather name="mail" size={16} color={colors.primaryBright} />}
          onPress={() => router.push('/sign-up')}
        />
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.or}>or</Text>
          <View style={styles.divider} />
        </View>
        <Button
          variant="secondary"
          title="Continue with Apple"
          icon={<FontAwesome name="apple" size={16} color={colors.text} />}
          onPress={signInWithProvider}
        />
        <Button variant="secondary" title="Continue with Google" icon={<GoogleIcon />} onPress={signInWithProvider} />
      </Animated.View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 4 },
  divider: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  or: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 12 },
  legal: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 260,
  },
  link: { color: colors.primaryBright },
});
