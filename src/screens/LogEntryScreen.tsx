import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../utils/useTheme';
import { useAppStore } from '../store/useAppStore';
import { CELL_SALTS, CELL_SALT_MAP } from '../constants/cellSalts';
import { COMMON_SYMPTOMS, POTENCIES, Potency } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Chip, SectionHeader } from '../components/Basics';
import { SeverityScale } from '../components/SeverityScale';
import { SPACING, FONT_SIZES } from '../constants/theme';
import type { RootStackParamList } from '../navigation/types';
import { scheduleFollowUpReminder } from '../utils/notifications';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type LogEntryRoute = RouteProp<RootStackParamList, 'LogEntry'>;

export function LogEntryScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavProp>();
  const route = useRoute<LogEntryRoute>();
  const addLogEntry = useAppStore((s) => s.addLogEntry);
  const notificationsEnabled = useAppStore((s) => s.profile.notificationsEnabled);

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [saltId, setSaltId] = useState(route.params?.saltId ?? CELL_SALTS[0].id);
  const [potency, setPotency] = useState<Potency>('6X');
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [severity, setSeverity] = useState(5);

  const selectedSalt = useMemo(() => CELL_SALT_MAP[saltId], [saltId]);

  function toggleSymptom(symptom: string) {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  }

  async function handleSave() {
    if (selectedSymptoms.length === 0) {
      Alert.alert('Select a symptom', 'Please choose at least one active symptom to log.');
      return;
    }

    const logId = addLogEntry({
      symptoms: selectedSymptoms,
      cellSaltId: saltId,
      potency,
      startDateTime: startDateTime.toISOString(),
      baselineSeverity: severity,
    });

    if (notificationsEnabled) {
      await scheduleFollowUpReminder(logId, selectedSalt.commonName, '2h', startDateTime);
      await scheduleFollowUpReminder(logId, selectedSalt.commonName, '12h', startDateTime);
      await scheduleFollowUpReminder(logId, selectedSalt.commonName, '24h', startDateTime);
    }

    navigation.goBack();
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <SectionHeader title="Log Entry" subtitle="Track a symptom and the salt you're taking" />

      <Card style={{ marginTop: SPACING.md }}>
        <Text style={[styles.label, { color: colors.text }]}>Active Symptom(s)</Text>
        <View style={styles.chipWrap}>
          {COMMON_SYMPTOMS.map((symptom) => (
            <Chip
              key={symptom}
              label={symptom}
              selected={selectedSymptoms.includes(symptom)}
              onPress={() => toggleSymptom(symptom)}
            />
          ))}
        </View>
      </Card>

      <Card style={{ marginTop: SPACING.md }}>
        <Text style={[styles.label, { color: colors.text }]}>Cell Salt Taken</Text>
        <View style={styles.chipWrap}>
          {CELL_SALTS.map((salt) => (
            <Chip
              key={salt.id}
              label={salt.commonName}
              selected={saltId === salt.id}
              onPress={() => setSaltId(salt.id)}
            />
          ))}
        </View>
      </Card>

      <Card style={{ marginTop: SPACING.md }}>
        <Text style={[styles.label, { color: colors.text }]}>Potency</Text>
        <View style={styles.chipWrap}>
          {POTENCIES.map((p) => (
            <Chip key={p} label={p} selected={potency === p} onPress={() => setPotency(p)} />
          ))}
        </View>
      </Card>

      <Card style={{ marginTop: SPACING.md }}>
        <Text style={[styles.label, { color: colors.text }]}>Start Date & Time</Text>
        <Button
          label={startDateTime.toLocaleString()}
          variant="secondary"
          small
          onPress={() => setShowPicker(true)}
          style={{ alignSelf: 'flex-start', marginTop: SPACING.sm }}
        />
        {showPicker && (
          <DateTimePicker
            value={startDateTime}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, selected) => {
              setShowPicker(Platform.OS === 'ios');
              if (selected) setStartDateTime(selected);
            }}
          />
        )}
      </Card>

      <Card style={{ marginTop: SPACING.md }}>
        <Text style={[styles.label, { color: colors.text }]}>Baseline Severity (1–10)</Text>
        <View style={{ marginTop: SPACING.sm }}>
          <SeverityScale value={severity} onChange={setSeverity} />
        </View>
      </Card>

      <Button label="Save Log Entry" onPress={handleSave} style={{ marginTop: SPACING.lg }} />
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
    marginBottom: SPACING.sm,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
