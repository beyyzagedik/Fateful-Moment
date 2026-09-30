import { Link, router } from 'expo-router';
import { useRef, useState } from 'react';
import { Keyboard, StyleSheet, Text, type TextInput } from 'react-native';

import { AuthScreen } from '@/components/AuthScreen';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { firstName, simulateRequest } from '@/lib/network';
import { isValidEmail, messages } from '@/lib/validation';
import { useAuth } from '@/store/auth';
import { toast } from '@/store/toast';
import { colors, fonts } from '@/theme';

export default function SignIn() {
  const signIn = useAuth((s) => s.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [error, setError] = useState<{ field: 'email' | 'password'; message: string } | null>(null);
  const passwordRef = useRef<TextInput>(null);

  const formatError = emailTouched && email && !isValidEmail(email) ? messages.wrongEmailFormat : null;
  const [loading, setLoading] = useState(false);
  const canSubmit = isValidEmail(email) && password.length > 0;

  const submit = async () => {
    if (!canSubmit || loading) return;
    Keyboard.dismiss();
    setLoading(true);
    const result = await simulateRequest(() => signIn(email, password));
    if (result.ok) {
      // The auth guard switches to the app; the toast stays on top of it.
      const name = useAuth.getState().user?.fullName ?? '';
      toast.success(`Welcome back, ${firstName(name)}!`, 'You are signed in.');
      return;
    }
    setLoading(false);
    setError(result.error);
    toast.error('Sign in failed', result.error.message);
  };

  return (
    <AuthScreen
      showBack
      title="Welcome to Fateful Moment"
      subtitle="Sign in with Email"
      footer={
        <Text style={styles.footer}>
          No account yet?{' '}
          <Link href="/sign-up" replace style={styles.link}>
            Sign up
          </Link>
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
        onBlur={() => setEmailTouched(true)}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        error={error?.field === 'email' ? error.message : formatError}
      />
      <TextField
        ref={passwordRef}
        password
        placeholder="Your password"
        value={password}
        onChangeText={(v) => {
          setPassword(v);
          if (error?.field === 'password') setError(null);
        }}
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={submit}
        error={error?.field === 'password' ? error.message : null}
      />
      <Button variant="glow" title="Sign In" disabled={!canSubmit} loading={loading} onPress={submit} style={styles.cta} />
      <Text style={styles.forgot} onPress={() => router.push({ pathname: '/forgot-password', params: { email } })}>
        Forgot password?
      </Text>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  cta: { marginTop: 12 },
  forgot: {
    color: colors.primaryBright,
    fontFamily: fonts.medium,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  footer: { color: colors.textSecondary, fontFamily: fonts.regular, fontSize: 12 },
  link: { color: colors.primaryBright, fontFamily: fonts.semibold, textDecorationLine: 'underline' },
});
