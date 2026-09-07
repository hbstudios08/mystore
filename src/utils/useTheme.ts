import { useColorScheme } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { LIGHT_THEME, DARK_THEME, ThemeColors } from '../constants/theme';

/**
 * Resolves the active theme. Users can force dark/light mode via their
 * profile setting; otherwise we fall back to the system preference.
 */
export function useTheme(): { colors: ThemeColors; isDark: boolean } {
  const darkMode = useAppStore((s) => s.profile.darkMode);
  const systemScheme = useColorScheme();

  // profile.darkMode is an explicit user override once they've interacted
  // with the toggle. We treat "false" as a valid explicit choice too by
  // simply respecting whatever is in profile — defaulting new users to
  // system scheme is handled at first-run in App.tsx.
  const isDark = darkMode ?? systemScheme === 'dark';

  return { colors: isDark ? DARK_THEME : LIGHT_THEME, isDark };
}
