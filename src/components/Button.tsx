import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../utils/useTheme';
import { RADIUS, SPACING, FONT_SIZES } from '../constants/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  small?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  small = false,
}: ButtonProps) {
  const { colors } = useTheme();

  const backgroundColor =
    variant === 'primary'
      ? colors.primary
      : variant === 'danger'
      ? colors.danger
      : 'transparent';

  const borderColor =
    variant === 'outline' ? colors.primary : variant === 'secondary' ? colors.border : 'transparent';

  const textColor =
    variant === 'primary' || variant === 'danger'
      ? colors.textInverse
      : variant === 'outline'
      ? colors.primary
      : colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor,
          borderColor,
          borderWidth: variant === 'outline' || variant === 'secondary' ? 1.5 : 0,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
          paddingVertical: small ? SPACING.sm : SPACING.md,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: textColor, fontSize: small ? FONT_SIZES.sm : FONT_SIZES.md },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  label: {
    fontWeight: '600',
  },
});
