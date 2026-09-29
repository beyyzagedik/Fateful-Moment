import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { AuthScreen } from '@/components/AuthScreen';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { isValidEmail, messages } from '@/lib/validation';
import { useAuth } from '@/store/auth';
import { colors, fonts } from '@/theme';

export default function ForgotPassword() {
  const params = useLocalSearchParams<{ email?: string }>();
  const emailExists = useAuth((s) => s.emailExists);
  const [email, setEmail] = useState(params.email ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!isValidEmail(email)) return setError(messages.wrongEmailFormat);
    if (!emailExists(email)) return setError(messages.emailNotFound);
    // Simulate the network round-trip of sending the reset mail.
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace({ pathname: '/check-email', params: { email: email.trim() } });
    }, 700);
  };

  return (
    <AuthScreen
      showBack
      gradient
      title="Reset Password"
      subtitle="Enter your email to receive a reset link"
      footer={
        <Text style={styles.legal}>
          By continuing, you agree to our <Text style={styles.link}>Terms of Use</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>.
        </Text>
      }
    >
      <TextField
        placeholder="Your email address"
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          setError(null);
        }}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="send"
        onSubmitEditing={submit}
        leftIcon={email ? null : <Feather name="mail" size={14} color={colors.textMuted} />}
        error={error}
      />
      <Button title="Send Reset Link" disabled={!email} loading={loading} onPress={submit} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  legal: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 11, textAlign: 'center', lineHeight: 16, maxWidth: 260 },
  link: { color: colors.primaryBright },
});
