import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CellSalt } from '../types';
import { ZODIAC_MAP } from '../constants/zodiac';
import { useTheme } from '../utils/useTheme';
import { SPACING, RADIUS, FONT_SIZES } from '../constants/theme';

interface CellSaltListItemProps {
  salt: CellSalt;
  onPress: () => void;
}

export function CellSaltListItem({ salt, onPress }: CellSaltListItemProps) {
  const { colors } = useTheme();
  const sign = ZODIAC_MAP[salt.zodiacId];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[styles.swatch, { backgroundColor: salt.color }]} />
      <View style={styles.textCol}>
        <Text style={[styles.name, { color: colors.text }]}>{salt.commonName}</Text>
        <Text style={[styles.sub, { color: colors.textMuted }]} numberOfLines={1}>
          {salt.chemicalName} · {sign?.symbol} {sign?.name}
        </Text>
      </View>
      <Text style={[styles.chevron, { color: colors.textMuted }]}>{'\u203A'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: SPACING.sm,
  },
  swatch: {
    width: 10,
    height: 44,
    borderRadius: RADIUS.sm,
    marginRight: SPACING.md,
  },
  textCol: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
  sub: {
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  chevron: {
    fontSize: FONT_SIZES.xl,
    marginLeft: SPACING.sm,
  },
});
