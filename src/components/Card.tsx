import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useTheme } from '../utils/useTheme';
import { RADIUS, SPACING } from '../constants/theme';

interface CardProps extends ViewProps {
  padded?: boolean;
}

export function Card({ style, padded = true, children, ...rest }: CardProps) {
  const { colors, isDark } = useTheme();
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          padding: padded ? SPACING.md : 0,
          shadowOpacity: isDark ? 0 : 0.06,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.lg,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
});
