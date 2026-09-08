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
  /** Tint passed to expo-blur's BlurView ('light' | 'dark' | 'default') */
  glassTint: 'light' | 'dark' | 'default';
  /** Semi-transparent fill layered under/with the blur for readable glass cards */
  glassFill: string;
  /** Slightly brighter fill for elevated glass surfaces (headers, tab bar) */
  glassFillStrong: string;
  /** Subtle 1px edge highlight that sells the "glass" look */
  glassBorder: string;
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
  textMuted: '#5B5F72',
  textInverse: '#FFFFFF',
  border: 'rgba(27, 30, 43, 0.12)',
  success: '#2E9E5B',
  warning: '#D68A1E',
  danger: '#C0392B',
  tabBarBg: '#FFFFFF',
  overlay: 'rgba(15, 18, 40, 0.55)',
  glassTint: 'light',
  glassFill: 'rgba(255, 255, 255, 0.55)',
  glassFillStrong: 'rgba(255, 255, 255, 0.72)',
  glassBorder: 'rgba(255, 255, 255, 0.6)',
};

export const DARK_THEME: ThemeColors = {
  background: '#0B0E23',
  surface: '#151A38',
  surfaceAlt: '#1D2247',
  card: '#181D40',
  primary: '#9DAAF2',
  primaryMuted: '#4C5AA0',
  gold: '#E3C567',
  text: '#F1F2FA',
  textMuted: '#B4B8D6',
  textInverse: '#0B0E23',
  border: 'rgba(255, 255, 255, 0.14)',
  success: '#4FCF87',
  warning: '#F0AC4E',
  danger: '#F0776B',
  tabBarBg: '#12163030',
  overlay: 'rgba(0, 0, 0, 0.65)',
  glassTint: 'dark',
  glassFill: 'rgba(20, 22, 48, 0.45)',
  glassFillStrong: 'rgba(24, 27, 56, 0.62)',
  glassBorder: 'rgba(255, 255, 255, 0.16)',
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

// ============================================================================
// Gradient theme presets — the colorful backdrop behind the glass UI.
// Each preset supplies a light and dark variant so the gradient still makes
// sense with either text theme.
// ============================================================================

export type GradientThemeId =
  | 'nebula'
  | 'ocean'
  | 'sunset'
  | 'aurora'
  | 'rosequartz'
  | 'midnight';

export interface GradientPreset {
  id: GradientThemeId;
  name: string;
  /** Small swatch shown in the picker (matches the gradient's midtone) */
  swatch: string;
  light: string[];
  dark: string[];
}

export const GRADIENT_THEMES: Record<GradientThemeId, GradientPreset> = {
  nebula: {
    id: 'nebula',
    name: 'Nebula',
    swatch: '#7B5CE0',
    light: ['#E7E3FB', '#CFC6F7', '#B9A9EF'],
    dark: ['#1B1440', '#2E1E63', '#4A2A82'],
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    swatch: '#2F86C9',
    light: ['#DDF1F7', '#C4E4F2', '#A9CFEA'],
    dark: ['#071D33', '#0B3355', '#0F4C75'],
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    swatch: '#E8804F',
    light: ['#FDE9DC', '#FBD3B8', '#F3AE85'],
    dark: ['#2B0F14', '#5A1F26', '#8A3A2D'],
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora',
    swatch: '#3FBFA5',
    light: ['#DFF7ED', '#C4EEDC', '#A6DFCE'],
    dark: ['#062420', '#0B3B37', '#125447'],
  },
  rosequartz: {
    id: 'rosequartz',
    name: 'Rose Quartz',
    swatch: '#E27FA6',
    light: ['#FCE7EF', '#F8D0E1', '#F0B4D0'],
    dark: ['#2B0F1C', '#4A1930', '#6E2748'],
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    swatch: '#3B4C7A',
    light: ['#E7EAF5', '#D2D8ED', '#B9C2E0'],
    dark: ['#050814', '#0D1330', '#161F4C'],
  },
};

export const GRADIENT_THEME_ORDER: GradientThemeId[] = [
  'nebula',
  'ocean',
  'sunset',
  'aurora',
  'rosequartz',
  'midnight',
];
