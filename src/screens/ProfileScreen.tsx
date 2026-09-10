import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Switch, Alert, Pressable } from 'react-native';
import * as Location from 'expo-location';
import { useTheme } from '../utils/useTheme';
import { useAppStore } from '../store/useAppStore';
import { ZODIAC_SIGNS, ZODIAC_MAP, getZodiacSignForDate } from '../constants/zodiac';
import { Card } from '../components/Card';
import { DateInput } from '../components/DateInput';
import { TimeInput } from '../components/TimeInput';
import { Button } from '../components/Button';
import { Chip, SectionHeader } from '../components/Basics';
import { requestNotificationPermissions } from '../utils/notifications';
import { computeMoonSign, computeAscendant } from '../utils/astronomy';
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

  const [latitudeText, setLatitudeText] = useState(
    profile.birthLatitude !== undefined ? String(profile.birthLatitude) : ''
  );
  const [longitudeText, setLongitudeText] = useState(
    profile.birthLongitude !== undefined ? String(profile.birthLongitude) : ''
  );
  const [utcOffsetText, setUtcOffsetText] = useState(
    profile.birthUtcOffsetHours !== undefined ? String(profile.birthUtcOffsetHours) : ''
  );
  const [locationLoading, setLocationLoading] = useState(false);

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

  function commitLatitude() {
    const n = Number(latitudeText);
    if (latitudeText.trim() === '') {
      updateProfile({ birthLatitude: undefined });
    } else if (Number.isFinite(n) && n >= -90 && n <= 90) {
      updateProfile({ birthLatitude: n });
    }
  }

  function commitLongitude() {
    const n = Number(longitudeText);
    if (longitudeText.trim() === '') {
      updateProfile({ birthLongitude: undefined });
    } else if (Number.isFinite(n) && n >= -180 && n <= 180) {
      updateProfile({ birthLongitude: n });
    }
  }

  function commitUtcOffset() {
    const n = Number(utcOffsetText);
    if (utcOffsetText.trim() === '') {
      updateProfile({ birthUtcOffsetHours: undefined });
    } else if (Number.isFinite(n) && n >= -14 && n <= 14) {
      updateProfile({ birthUtcOffsetHours: n });
    }
  }

  async function handleUseCurrentLocation() {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Needed',
          'Enable location access in your device settings, or enter latitude/longitude manually below.'
        );
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      const lat = Math.round(position.coords.latitude * 10000) / 10000;
      const lon = Math.round(position.coords.longitude * 10000) / 10000;
      // Current device UTC offset, as a starting default — the person
      // should adjust this if their birth location/date had a different
      // offset (e.g. no daylight saving at the time, a different zone).
      const offset = -new Date().getTimezoneOffset() / 60;
      setLatitudeText(String(lat));
      setLongitudeText(String(lon));
      setUtcOffsetText(String(offset));
      updateProfile({ birthLatitude: lat, birthLongitude: lon, birthUtcOffsetHours: offset });
    } catch {
      Alert.alert('Couldn\u2019t Get Location', 'Please enter latitude/longitude manually below.');
    } finally {
      setLocationLoading(false);
    }
  }

  function handleCalculate() {
    const missing: string[] = [];
    if (!birthDate) missing.push('Birth Date');
    if (!profile.birthTime) missing.push('Birth Time');
    if (profile.birthLatitude === undefined) missing.push('Latitude');
    if (profile.birthLongitude === undefined) missing.push('Longitude');
    if (profile.birthUtcOffsetHours === undefined) missing.push('UTC Offset');

    if (missing.length > 0) {
      Alert.alert('Missing Details', `Please fill in: ${missing.join(', ')}`);
      return;
    }

    const details = {
      date: birthDate as Date,
      time: profile.birthTime as string,
      latitude: profile.birthLatitude as number,
      longitude: profile.birthLongitude as number,
      utcOffsetHours: profile.birthUtcOffsetHours as number,
    };

    const moonSignId = computeMoonSign(details);
    const ascendantId = computeAscendant(details);

    if (!moonSignId || !ascendantId) {
      Alert.alert('Couldn\u2019t Calculate', 'Please double-check the birth time format (HH:MM).');
      return;
    }

    updateProfile({ moonSign: moonSignId, ascendant: ascendantId });
    Alert.alert(
      'Estimated',
      `Moon Sign: ${ZODIAC_MAP[moonSignId].name}\nAscendant: ${ZODIAC_MAP[ascendantId].name}\n\n` +
        'This is a best-effort estimate from the birth details you entered — accuracy ' +
        'depends on how precise the time and location are.'
    );
  }

  function renderSignPicker(field: 'sunSign' | 'ascendant' | 'moonSign', label: string) {
    const needsManualNote = field === 'ascendant' || field === 'moonSign';
    return (
      <Card style={{ marginTop: SPACING.md }}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        {needsManualNote && (
          <Text style={{ color: colors.textMuted, fontSize: FONT_SIZES.xs, marginTop: 2, marginBottom: SPACING.xs }}>
            Calculated automatically once you fill in Birth Time &amp; Location above and tap
            Calculate — or select manually below if you already know it.
          </Text>
        )}
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

      <Card style={{ marginTop: SPACING.md }}>
        <Text style={[styles.label, { color: colors.text }]}>Birth Time &amp; Location</Text>
        <Text style={{ color: colors.textMuted, fontSize: FONT_SIZES.xs, marginTop: 2, marginBottom: SPACING.md }}>
          Optional — but needed to calculate your Moon Sign and Ascendant, since (unlike
          your Sun Sign) those depend on the exact time and place you were born, not just
          the date.
        </Text>

        <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Birth Time (local, 24-hour)</Text>
        <TimeInput
          value={profile.birthTime}
          onChange={(time) => updateProfile({ birthTime: time })}
        />

        <View style={[styles.row, { marginTop: SPACING.md }]}>
          <View style={{ flex: 1, marginRight: SPACING.sm }}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Latitude</Text>
            <TextInput
              value={latitudeText}
              onChangeText={setLatitudeText}
              onBlur={commitLatitude}
              placeholder="e.g. 40.7128"
              placeholderTextColor={colors.textMuted}
              keyboardType="numbers-and-punctuation"
              style={[
                styles.input,
                { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border, marginTop: SPACING.xs },
              ]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Longitude</Text>
            <TextInput
              value={longitudeText}
              onChangeText={setLongitudeText}
              onBlur={commitLongitude}
              placeholder="e.g. -74.0060"
              placeholderTextColor={colors.textMuted}
              keyboardType="numbers-and-punctuation"
              style={[
                styles.input,
                { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border, marginTop: SPACING.xs },
              ]}
            />
          </View>
        </View>

        <Text style={[styles.fieldLabel, { color: colors.textMuted, marginTop: SPACING.md }]}>
          UTC Offset at birth (hours, e.g. -5 or 5.5)
        </Text>
        <TextInput
          value={utcOffsetText}
          onChangeText={setUtcOffsetText}
          onBlur={commitUtcOffset}
          placeholder="e.g. -5"
          placeholderTextColor={colors.textMuted}
          keyboardType="numbers-and-punctuation"
          style={[
            styles.input,
            { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border, marginTop: SPACING.xs },
          ]}
        />
        <Text style={{ color: colors.textMuted, fontSize: FONT_SIZES.xs, marginTop: SPACING.xs }}>
          The UTC offset in effect at that place and moment (including daylight saving, if
          any) — not necessarily today's offset for that location.
        </Text>

        <Button
          label={locationLoading ? 'Getting Location\u2026' : 'Use Current Location'}
          variant="outline"
          small
          disabled={locationLoading}
          onPress={handleUseCurrentLocation}
          style={{ marginTop: SPACING.md, alignSelf: 'flex-start' }}
        />
        <Text style={{ color: colors.textMuted, fontSize: FONT_SIZES.xs, marginTop: SPACING.xs }}>
          Only a shortcut for filling in the fields above — use this if you're currently at
          (or near) your actual birthplace, then adjust if needed.
        </Text>

        <Button
          label="Calculate Moon Sign & Ascendant"
          onPress={handleCalculate}
          style={{ marginTop: SPACING.lg }}
        />
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
  fieldLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.md,
  },
  row: {
    flexDirection: 'row',
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
