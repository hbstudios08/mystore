import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ZodiacSign } from '../types';
import { ELEMENT_COLORS } from '../constants/zodiac';
import { useTheme } from '../utils/useTheme';

interface ZodiacBadgeProps {
  sign: ZodiacSign;
  size?: number;
  selected?: boolean;
}

export function ZodiacBadge({ sign, size = 56, selected = false }: ZodiacBadgeProps) {
  const { colors } = useTheme();
  const elementColor = ELEMENT_COLORS[sign.element];

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: selected ? colors.gold : elementColor,
            borderWidth: selected ? 3 : 2,
            backgroundColor: selected ? colors.surfaceAlt : colors.surface,
          },
        ]}
      >
        <Text style={[styles.symbol, { fontSize: size * 0.45, color: colors.text }]}>
          {sign.symbol}
        </Text>
      </View>
      <Text style={[styles.name, { color: colors.textMuted }]} numberOfLines={1}>
        {sign.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    width: 76,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontWeight: '600',
  },
  name: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
  },
});
