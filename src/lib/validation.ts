export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Letters (incl. Turkish / accented), spaces, apostrophes and hyphens; at least 2 chars.
const FULLNAME_RE = /^[\p{L}][\p{L}' -]*[\p{L}]$/u;

export const isValidEmail = (value: string) => EMAIL_RE.test(value.trim());
export const isValidFullName = (value: string) => FULLNAME_RE.test(value.trim());

export type PasswordRule = { id: string; label: string; test: (value: string) => boolean };

/** Rules shown live under the password field on "Create Account". */
export const passwordRules: PasswordRule[] = [
  { id: 'length', label: 'Must be at least 8 characters long', test: (v) => v.length >= 8 },
  { id: 'upper', label: 'Must contain at least 1 uppercase letter', test: (v) => /\p{Lu}/u.test(v) },
  { id: 'lower', label: 'Must contain at least 1 lowercase letter', test: (v) => /\p{Ll}/u.test(v) },
  { id: 'digit', label: 'Must contain at least 1 digit', test: (v) => /\d/.test(v) },
];

export const isStrongPassword = (value: string) => passwordRules.every((r) => r.test(value));

export const messages = {
  wrongEmailFormat: 'Please enter a valid email address.',
  wrongFullNameFormat: 'Full name can only contain letters.',
  emailNotFound: 'We couldn’t find an account with this email.',
  wrongPassword: 'Incorrect password. Please try again.',
  emailTaken: 'An account with this email already exists.',
} as const;
