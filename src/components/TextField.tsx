import { Feather } from '@expo/vector-icons';
import { forwardRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, fonts, radius } from '@/theme';

type Props = TextInputProps & {
  error?: string | null;
  /** Show the eye toggle and hide the value by default. */
  password?: boolean;
  leftIcon?: ReactNode;
};

export const TextField = forwardRef<TextInput, Props>(function TextField(
  { error, password, leftIcon, style, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const hasValue = Boolean(rest.value);

  return (
    <View>
      <View
        style={[
          styles.box,
          (focused || hasValue) && styles.active,
          focused && styles.focused,
          Boolean(error) && styles.error,
        ]}
      >
        {leftIcon}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          cursorColor={colors.primaryBright}
          secureTextEntry={password && hidden}
          autoCorrect={false}
          style={[styles.input, style]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {password && (
          <Pressable
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            onPress={() => setHidden((h) => !h)}
          >
            <Feather name={hidden ? 'eye' : 'eye-off'} size={16} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  box: {
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.input,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  active: { borderColor: colors.primaryDark },
  focused: {
    borderColor: colors.primaryBright,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  error: { borderColor: colors.danger, shadowOpacity: 0 },
  input: { flex: 1, color: colors.text, fontFamily: fonts.regular, fontSize: 14, paddingVertical: 0 },
  errorText: { color: colors.danger, fontFamily: fonts.regular, fontSize: 12, marginTop: 6, marginLeft: 2 },
});
