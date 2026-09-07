import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../utils/useTheme';
import { getZodiacSignForDate } from '../constants/zodiac';
import { CELL_SALT_MAP, findSaltsBySymptom } from '../constants/cellSalts';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { SectionHeader } from '../components/Basics';
import { CellSaltListItem } from '../components/CellSaltListItem';
import { ZodiacBadge } from '../components/ZodiacBadge';
import { SPACING, FONT_SIZES, RADIUS } from '../constants/theme';
import type { RootStackParamList } from '../navigation/types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type Mode = 'birthdate' | 'symptom';

export function FindMySaltScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavProp>();
  const [mode, setMode] = useState<Mode>('birthdate');
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [symptomQuery, setSymptomQuery] = useState('');

  const birthSign = useMemo(() => getZodiacSignForDate(birthDate), [birthDate]);
  const birthSalt = CELL_SALT_MAP[birthSign.cellSaltId];

  const symptomResults = useMemo(
    () => (symptomQuery.trim() ? findSaltsBySymptom(symptomQuery) : []),
    [symptomQuery]
  );

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <SectionHeader
        title="Find My Salt"
        subtitle="Discover a cell salt by birth date or by active symptoms"
      />

      <View style={styles.modeRow}>
        <Button
          label="By Birth Date"
          variant={mode === 'birthdate' ? 'primary' : 'outline'}
          onPress={() => setMode('birthdate')}
          small
          style={{ flex: 1, marginRight: SPACING.sm }}
        />
        <Button
          label="By Symptom"
          variant={mode === 'symptom' ? 'primary' : 'outline'}
          onPress={() => setMode('symptom')}
          small
          style={{ flex: 1 }}
        />
      </View>

      {mode === 'birthdate' ? (
        <View style={{ marginTop: SPACING.lg }}>
          <Button
            label={`Birth Date: ${birthDate.toLocaleDateString()}`}
            variant="secondary"
            onPress={() => setShowPicker(true)}
          />
          {showPicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, selected) => {
                setShowPicker(Platform.OS === 'ios');
                if (selected) setBirthDate(selected);
              }}
              maximumDate={new Date()}
            />
          )}

          <Card style={{ marginTop: SPACING.lg }}>
            <View style={styles.resultRow}>
              <ZodiacBadge sign={birthSign} size={64} selected />
              <View style={{ marginLeft: SPACING.md, flex: 1 }}>
                <Text style={[styles.resultLabel, { color: colors.textMuted }]}>Your Sign</Text>
                <Text style={[styles.resultValue, { color: colors.text }]}>{birthSign.name}</Text>
                <Text style={[styles.resultLabel, { color: colors.textMuted, marginTop: SPACING.sm }]}>
                  Recommended Salt
                </Text>
                <Text style={[styles.resultValue, { color: colors.text }]}>
                  {birthSalt.commonName}
                </Text>
              </View>
            </View>
            <Button
              label="View Full Detail"
              variant="outline"
              small
              onPress={() => navigation.navigate('CellSaltDetail', { saltId: birthSalt.id })}
              style={{ marginTop: SPACING.md, alignSelf: 'flex-start' }}
            />
          </Card>
        </View>
      ) : (
        <View style={{ marginTop: SPACING.lg }}>
          <TextInput
            value={symptomQuery}
            onChangeText={setSymptomQuery}
            placeholder="e.g. headache, cramps, fatigue..."
            placeholderTextColor={colors.textMuted}
            style={[
              styles.input,
              { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border },
            ]}
          />
          {symptomResults.length > 0 ? (
            <View style={{ marginTop: SPACING.md }}>
              {symptomResults.map((salt) => (
                <CellSaltListItem
                  key={salt.id}
                  salt={salt}
                  onPress={() => navigation.navigate('CellSaltDetail', { saltId: salt.id })}
                />
              ))}
            </View>
          ) : symptomQuery.trim() ? (
            <Text style={{ color: colors.textMuted, marginTop: SPACING.md }}>
              No salts matched that symptom — try a broader term like "pain" or "fatigue".
            </Text>
          ) : null}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  modeRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.md,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: FONT_SIZES.xs,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  resultValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
  },
});
