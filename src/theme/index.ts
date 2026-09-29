// Design tokens sampled from the Fateful Moment Figma file.
// Keep every color / size used by the UI here so screens stay consistent.
import { Platform } from 'react-native';

export const colors = {
  background: '#020618', // Figma Style Guide: Background / Slate 950
  backgroundAlt: '#08102A',

  surface: '#0D1530',
  surfaceRaised: '#111B38',
  input: '#121A30',
  border: '#1C2744',
  borderStrong: '#2A3A5E',

  primary: '#06B6D4',
  primaryBright: '#22D3EE',
  primaryDark: '#0B7285',
  primaryMuted: '#0A1E2C',
  primaryMutedBorder: '#153A4C',
  primaryMutedText: '#2D5A6B',

  text: '#FFFFFF',
  textSecondary: '#A3ABC2',
  textMuted: '#6B7591',
  textOnPrimary: '#04121A',

  danger: '#F04438',
  dangerSurface: '#1B0C18',
  dangerBorder: '#5A1D2E',
  warning: '#FACC15',
  success: '#22C55E',

  // Figma Playground values
  navBorder: '#314158',
  menuText: '#90A1B9',
  optionFill: 'rgba(15,23,43,0.63)',
  optionBorder: '#F8FAFC',
  choiceBadge: '#FFD230',
  choiceBadgeBorder: '#FFB900',
  urgency: 'rgba(150, 12, 24, 0.5)',

  overlay: 'rgba(3, 7, 20, 0.62)',
  overlayStrong: 'rgba(3, 7, 20, 0.85)',
  glass: 'rgba(10, 18, 42, 0.78)',
  glassBorder: 'rgba(255, 255, 255, 0.55)',
} as const;

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extraBoldItalic: 'Inter_800ExtraBold_Italic',
  black: 'Inter_900Black',
  blackItalic: 'Inter_900Black_Italic',
  boldItalic: 'Inter_700Bold_Italic',
  italic: 'Inter_400Regular_Italic',
  mono: Platform.select({ ios: 'Menlo', default: 'monospace' }),
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 10,
  lg: 14,
  xl: 18,
  pill: 999,
} as const;

export const type = {
  display: { fontFamily: fonts.bold, fontSize: 22, color: colors.text },
  title: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
  subtitle: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary },
  body: { fontFamily: fonts.regular, fontSize: 14, color: colors.text },
  label: { fontFamily: fonts.medium, fontSize: 13, color: colors.text },
  caption: { fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted },
  overline: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.textSecondary,
    textTransform: 'uppercase' as const,
  },
  mono: { fontFamily: fonts.mono, fontSize: 12, color: colors.primaryBright },
} as const;
