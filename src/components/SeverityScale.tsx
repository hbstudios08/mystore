import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../utils/useTheme';
import { RADIUS, SPACING, FONT_SIZES } from '../constants/theme';

interface SeverityScaleProps {
  value: number;
  onChange: (value: number) => void;
}

export function SeverityScale({ value, onChange }: SeverityScaleProps) {
  const { colors } = useTheme();
  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

  function colorFor(n: number) {
    if (n <= 3) return colors.success;
    if (n <= 6) return colors.warning;
    return colors.danger;
  }

  return (
    <View>
      <View style={styles.grid}>
        {numbers.map((n) => {
          const selected = n === value;
          return (
            <Pressable
              key={n}
              onPress={() => onChange(n)}
              style={[
                styles.cell,
                {
                  backgroundColor: selected ? colorFor(n) : colors.surfaceAlt,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={{
                  color: selected ? colors.textInverse : colors.text,
                  fontWeight: '700',
                  fontSize: FONT_SIZES.sm,
                }}
              >
                {n}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.labels}>
        <Text style={[styles.labelText, { color: colors.textMuted }]}>Mild</Text>
        <Text style={[styles.labelText, { color: colors.textMuted }]}>Severe</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  cell: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.sm,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  labelText: {
    fontSize: FONT_SIZES.xs,
  },
});
