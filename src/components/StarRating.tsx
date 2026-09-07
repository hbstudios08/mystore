import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '../utils/useTheme';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: number;
  readOnly?: boolean;
}

export function StarRating({
  value,
  onChange,
  max = 5,
  size = 28,
  readOnly = false,
}: StarRatingProps) {
  const { colors } = useTheme();
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <View style={styles.row}>
      {stars.map((star) => (
        <Pressable
          key={star}
          disabled={readOnly}
          onPress={() => onChange?.(star)}
          hitSlop={6}
        >
          <Text style={{ fontSize: size, color: star <= value ? colors.gold : colors.border }}>
            {star <= value ? '\u2605' : '\u2606'}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
  },
});
