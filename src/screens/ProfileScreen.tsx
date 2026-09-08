import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Switch, Alert, Pressable } from 'react-native';
import { useTheme } from '../utils/useTheme';
import { useAppStore } from '../store/useAppStore';
import { ZODIAC_SIGNS, getZodiacSignForDate } from '../constants/zodiac';
import { Card } from '../components/Card';
import { DateInput } from '../components/DateInput';
import { Chip, SectionHeader } from '../components/Basics';
import { requestNotificationPermissions } from '../utils/notifications';
import { SPACING, FONT_SIZES, RADIUS, GRADIENT_THEME_ORDER, GRADIENT_THEMES } from '../constants/theme';
import { ZodiacId } from '../types';

export function ProfileScreen() {
  const { colors } = useTheme();
  const profile = useAppStore((s) => s.profile);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);
  const setGradientTheme = useAppStore((s) => s.setGradientTheme);

  const [name, setName] = useState(profile.name ?? '');
  const birthDate = profile.birthDate ? new Date(profile.birthDate) : undefined;

  function handleSaveName() {
    updateProfile({ name: name.trim() || undefined });
  }

  function handleSetBirthDate(date: Date) {
    const sign = getZodiacSignForDate(date);
    updateProfile({ birthDate: date.toISOString(), sunSign: sign.id });
  }

  function selectSign(field: 'sunSign' | 'ascendant' | 'moonSign', id: ZodiacId) {
    updateProfile({ [field]: profile[field] === id ? undefined : id });
  }

  async function handleToggleNotifications(value: boolean) {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          'Permission Needed',
          'Enable notifications in your device settings to receive follow-up reminders.'
        );
        return;
      }
    }
    updateProfile({ notificationsEnabled: value });
  }

  function renderSignPicker(field: 'sunSign' | 'ascendant' | 'moonSign', label: string) {
    return (
      <Card style={{ marginTop: SPACING.md }}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        <View style={styles.chipWrap}>
          {ZODIAC_SIGNS.map((sign) => (
            <Chip
              key={sign.id}
              label={`${sign.symbol} ${sign.name}`}
              selected={profile[field] === sign.id}
              onPress={() => selectSign(field, sign.id)}
            />
          ))}
        </View>
      </Card>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: 'transparent' }} contentContainerStyle={styles.container}>
      <SectionHeader title="Profile" subtitle="Personalize your celestial dashboard" />

      <Card style={{ marginTop: SPACING.md }}>
        <Text style={[styles.label, { color: colors.text }]}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          onEndEditing={handleSaveName}
          onBlur={handleSaveName}
          placeholder="Your name"
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border },
          ]}
        />
      </Card>

      <Card style={{ marginTop: SPACING.md }}>
        <Text style={[styles.label, { color: colors.text }]}>Birth Date</Text>
        <View style={{ marginTop: SPACING.sm }}>
          <DateInput value={birthDate} onChange={handleSetBirthDate} maximumDate={new Date()} />
        </View>
        <Text style={{ color: colors.textMuted, fontSize: FONT_SIZES.xs, marginTop: SPACING.sm }}>
          Setting a birth date automatically calculates your Sun Sign below.
        </Text>
      </Card>

      {renderSignPicker('sunSign', 'Sun Sign')}
      {renderSignPicker('ascendant', 'Ascendant (Rising)')}
      {renderSignPicker('moonSign', 'Moon Sign')}

      <Card style={{ marginTop: SPACING.lg }}>
        <Text style={[styles.label, { color: colors.text }]}>Gradient Theme</Text>
        <Text style={{ color: colors.textMuted, fontSize: FONT_SIZES.xs, marginTop: 2, marginBottom: SPACING.md }}>
          Choose the backdrop behind the glass UI.
        </Text>
        <View style={styles.swatchRow}>
          {GRADIENT_THEME_ORDER.map((id) => {
            const preset = GRADIENT_THEMES[id];
            const selected = profile.gradientThemeId === id;
            return (
              <Pressable
                key={id}
                onPress={() => setGradientTheme(id)}
                style={styles.swatchWrap}
              >
                <View
                  style={[
                    styles.swatch,
                    {
                      backgroundColor: preset.swatch,
                      borderColor: selected ? colors.gold : colors.border,
                      borderWidth: selected ? 3 : StyleSheet.hairlineWidth,
                    },
                  ]}
                />
                <Text
                  style={{
                    color: selected ? colors.text : colors.textMuted,
                    fontSize: FONT_SIZES.xs,
                    fontWeight: selected ? '700' : '500',
                    marginTop: 4,
                  }}
                >
                  {preset.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card style={{ marginTop: SPACING.lg }}>
        <View style={styles.switchRow}>
          <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
          <Switch value={profile.darkMode} onValueChange={toggleDarkMode} />
        </View>
        <View style={[styles.switchRow, { marginTop: SPACING.md }]}>
          <Text style={[styles.label, { color: colors.text }]}>Follow-Up Reminders</Text>
          <Switch value={profile.notificationsEnabled} onValueChange={handleToggleNotifications} />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.md,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  swatchWrap: {
    alignItems: 'center',
    width: 68,
    marginBottom: SPACING.sm,
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.pill,
  },
});
