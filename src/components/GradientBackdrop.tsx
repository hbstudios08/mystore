import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../utils/useTheme';

/**
 * Fixed, full-screen gradient rendered once behind the entire app (see
 * App.tsx). All screens use transparent backgrounds and float glass cards
 * over this, so the gradient shows through everywhere. Cross-fades smoothly
 * whenever the user switches gradient presets or toggles dark mode.
 */
export function GradientBackdrop() {
  const { gradient, gradientThemeId, isDark } = useTheme();
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [gradientThemeId, isDark]);

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: fade }]}>
      <LinearGradient
        colors={gradient as [string, string, ...string[]]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}
