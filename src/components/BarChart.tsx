import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../utils/useTheme';
import { SPACING, RADIUS, FONT_SIZES } from '../constants/theme';

export interface BarChartDatum {
  label: string;
  value: number; // 0-100 typically, but any positive number works
  color?: string;
  caption?: string;
}

interface BarChartProps {
  data: BarChartDatum[];
  maxValue?: number;
}

/**
 * A dependency-free horizontal bar chart. Keeping this hand-rolled (rather
 * than pulling in a charting library) keeps the app lightweight and avoids
 * native-module version drift across Expo SDKs.
 */
export function BarChart({ data, maxValue }: BarChartProps) {
  const { colors, accent } = useTheme();
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <View>
      {data.map((d, idx) => {
        const widthPct = Math.max(4, (d.value / max) * 100);
        return (
          <View key={`${d.label}-${idx}`} style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]} numberOfLines={1}>
              {d.label}
            </Text>
            <View style={[styles.track, { backgroundColor: colors.surfaceAlt }]}>
              <View
                style={[
                  styles.fill,
                  { width: `${widthPct}%`, backgroundColor: d.color ?? accent },
                ]}
              />
            </View>
            <Text style={[styles.caption, { color: colors.textMuted }]}>
              {d.caption ?? `${Math.round(d.value)}`}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  label: {
    width: 92,
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  track: {
    flex: 1,
    height: 16,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
    marginHorizontal: SPACING.sm,
  },
  fill: {
    height: '100%',
    borderRadius: RADIUS.pill,
  },
  caption: {
    width: 44,
    fontSize: FONT_SIZES.xs,
    textAlign: 'right',
  },
});
