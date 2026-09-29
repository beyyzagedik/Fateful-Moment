import { Link } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, Text, type TextInput } from 'react-native';

import { AuthScreen } from '@/components/AuthScreen';
import { Button } from '@/components/Button';
import { PasswordRules } from '@/components/PasswordRules';
import { TextField } from '@/components/TextField';
import { isStrongPassword, isValidEmail, isValidFullName, messages } from '@/lib/validation';
import { useAuth } from '@/store/auth';
import { colors, fonts } from '@/theme';

export default function SignUp() {
  const signUp = useAuth((s) => s.signUp);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ fullName: false, email: false });
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const nameError = touched.fullName && fullName && !isValidFullName(fullName) ? messages.wrongFullNameFormat : null;
  const emailFormatError = touched.email && email && !isValidEmail(email) ? messages.wrongEmailFormat : null;
  const canSubmit = isValidFullName(fullName) && isValidEmail(email) && isStrongPassword(password);

  const submit = () => {
    if (!canSubmit) return;
    const result = signUp(fullName, email, password);
    if (!result.ok) setEmailError(result.error);
    // On success the auth guard in the root layout switches to the app.
  };

  return (
    <AuthScreen
      showBack
      title="Create your Fateful Moment Account"
      footer={
        <Text style={styles.footer}>
          Already have an account?{' '}
          <Link href="/sign-in" replace style={styles.link}>
            Sign in
          </Link>
        </Text>
      }
    >
      <TextField
        placeholder="Full name"
        value={fullName}
        onChangeText={setFullName}
        onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
        autoCapitalize="words"
        textContentType="name"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
        error={nameError}
      />
      <TextField
        ref={emailRef}
        placeholder="Your email address"
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          setEmailError(null);
        }}
        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        error={emailError ?? emailFormatError}
      />
      <TextField
        ref={passwordRef}
        password
        placeholder="Your password"
        value={password}
        onChangeText={setPassword}
        onFocus={() => setPasswordFocused(true)}
        onBlur={() => setPasswordFocused(false)}
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={submit}
      />
      {(passwordFocused || password.length > 0) && <PasswordRules value={password} />}
      <Button variant="glow" title="Sign up" disabled={!canSubmit} onPress={submit} style={styles.cta} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  cta: { marginTop: 16 },
  footer: { color: colors.textSecondary, fontFamily: fonts.regular, fontSize: 12 },
  link: { color: colors.primaryBright, fontFamily: fonts.semibold, textDecorationLine: 'underline' },
});
