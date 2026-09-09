import { useColorScheme } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { LIGHT_THEME, DARK_THEME, ThemeColors, GRADIENT_THEMES, GradientThemeId } from '../constants/theme';

interface UseThemeResult {
  colors: ThemeColors;
  isDark: boolean;
  /** Ordered gradient stops for the currently selected gradient preset */
  gradient: string[];
  gradientThemeId: GradientThemeId;
  /**
   * The active accent color for the selected gradient preset, resolved for
   * the current light/dark mode. Use this — not colors.primary — for any
   * "brand-colored" button, chip, tab highlight, etc. so it follows the
   * user's chosen gradient theme instead of staying a fixed blue.
   */
  accent: string;
}

/**
 * Resolves the active theme. Users can force dark/light mode via their
 * profile setting; otherwise we fall back to the system preference. Also
 * resolves the selected gradient backdrop preset and its matching accent
 * color (with a safe fallback for profiles persisted before the
 * gradient-theme feature existed).
 */
export function useTheme(): UseThemeResult {
  const darkMode = useAppStore((s) => s.profile.darkMode);
  const gradientThemeId = useAppStore((s) => s.profile.gradientThemeId);
  const systemScheme = useColorScheme();

  const isDark = darkMode ?? systemScheme === 'dark';
  const preset = GRADIENT_THEMES[gradientThemeId] ?? GRADIENT_THEMES.nebula;
  const gradient = isDark ? preset.dark : preset.light;
  const accent = isDark ? preset.accentDark : preset.accentLight;

  return {
    colors: isDark ? DARK_THEME : LIGHT_THEME,
    isDark,
    gradient,
    gradientThemeId: preset.id,
    accent,
  };
}
