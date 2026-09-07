import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../utils/useTheme';
import { SPACING, RADIUS, FONT_SIZES } from '../constants/theme';

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: SPACING.sm }}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function Chip({ label, selected = false, onPress }: ChipProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.surfaceAlt,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}
    >
      <Text
        style={{
          color: selected ? colors.textInverse : colors.text,
          fontSize: FONT_SIZES.sm,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function EmptyState({ icon = '\u2728', title, subtitle }: { icon?: string; title: string; subtitle?: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.emptyWrap}>
      <Text style={{ fontSize: 40, marginBottom: SPACING.sm }}>{icon}</Text>
      <Text style={[styles.title, { color: colors.text, textAlign: 'center' }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textMuted, textAlign: 'center' }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
});
