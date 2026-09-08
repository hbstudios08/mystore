import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../utils/useTheme';
import { RADIUS, SPACING } from '../constants/theme';

interface CardProps extends ViewProps {
  padded?: boolean;
  /** Blur intensity 0-100. Lower = more subtle. Defaults to 40. */
  intensity?: number;
}

/**
 * Glassmorphic card: a blurred, semi-transparent surface with a soft edge
 * highlight, designed to float over the app's gradient backdrop.
 */
export function Card({ style, padded = true, intensity = 40, children, ...rest }: CardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.clip, { borderColor: colors.glassBorder }, style]}
      {...rest}
    >
      <BlurView
        intensity={intensity}
        tint={colors.glassTint}
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.glassFill }]}
      />
      <View style={{ padding: padded ? SPACING.md : 0 }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    borderRadius: RADIUS.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
});
