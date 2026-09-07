export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  card: string;
  primary: string;
  primaryMuted: string;
  gold: string;
  text: string;
  textMuted: string;
  textInverse: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  tabBarBg: string;
  overlay: string;
}

export const LIGHT_THEME: ThemeColors = {
  background: '#F5F6FB',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF1FA',
  card: '#FFFFFF',
  primary: '#2A3D8F',
  primaryMuted: '#5A6FC0',
  gold: '#C9A227',
  text: '#1B1E2B',
  textMuted: '#6B7080',
  textInverse: '#FFFFFF',
  border: '#E2E5F1',
  success: '#2E9E5B',
  warning: '#D68A1E',
  danger: '#C0392B',
  tabBarBg: '#FFFFFF',
  overlay: 'rgba(15, 18, 40, 0.55)',
};

export const DARK_THEME: ThemeColors = {
  background: '#0B0E23',
  surface: '#151A38',
  surfaceAlt: '#1D2247',
  card: '#181D40',
  primary: '#7C8FE8',
  primaryMuted: '#4C5AA0',
  gold: '#E3C567',
  text: '#F1F2FA',
  textMuted: '#9BA0C0',
  textInverse: '#0B0E23',
  border: '#2A2F55',
  success: '#4FCF87',
  warning: '#F0AC4E',
  danger: '#F0776B',
  tabBarBg: '#12163030',
  overlay: 'rgba(0, 0, 0, 0.65)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 34,
};
