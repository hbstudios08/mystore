import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../utils/useTheme';
import { useAppStore } from '../store/useAppStore';
import { CELL_SALT_MAP } from '../constants/cellSalts';
import { RELIEF_STATUS_LABELS, ReliefStatus } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Chip, SectionHeader } from '../components/Basics';
import { StarRating } from '../components/StarRating';
import { formatDateTime, formatDate } from '../utils/dateUtils';
import { SPACING, FONT_SIZES } from '../constants/theme';
import type { RootStackParamList } from '../navigation/types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type LogDetailRoute = RouteProp<RootStackParamList, 'LogDetail'>;

const RELIEF_OPTIONS: ReliefStatus[] = [
  'completely_relieved',
  'moderate_relief',
  'slight_relief',
  'no_effect',
  'worse',
];

export function LogDetailScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavProp>();
  const route = useRoute<LogDetailRoute>();
  const log = useAppStore((s) => s.logs.find((l) => l.id === route.params.logId));
  const addFollowUp = useAppStore((s) => s.addFollowUp);
  const deleteLogEntry = useAppStore((s) => s.deleteLogEntry);

  const [stars, setStars] = useState(3);
  const [relief, setRelief] = useState<ReliefStatus>('moderate_relief');

  if (!log) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textMuted }}>This log entry no longer exists.</Text>
      </View>
    );
  }

  const salt = CELL_SALT_MAP[log.cellSaltId];

  function handleAddFollowUp() {
    addFollowUp(log!.id, {
      ratedAt: new Date().toISOString(),
      intervalLabel: 'custom',
      starRating: stars,
      reliefStatus: relief,
    });
    Alert.alert('Saved', 'Your efficacy rating has been recorded.');
  }

  function handleDelete() {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this log entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteLogEntry(log!.id);
          navigation.goBack();
        },
      },
    ]);
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <Card>
        <Text style={[styles.saltName, { color: colors.text }]}>{salt.commonName}</Text>
        <Text style={[styles.meta, { color: colors.textMuted }]}>
          {log.potency} · Started {formatDateTime(log.startDateTime)}
        </Text>
        <View style={{ marginTop: SPACING.md }}>
          <Text style={[styles.label, { color: colors.text }]}>Symptoms</Text>
          <Text style={{ color: colors.textMuted }}>{log.symptoms.join(', ')}</Text>
        </View>
        <View style={{ marginTop: SPACING.md }}>
          <Text style={[styles.label, { color: colors.text }]}>Baseline Severity</Text>
          <Text style={{ color: colors.textMuted }}>{log.baselineSeverity} / 10</Text>
        </View>
      </Card>

      <View style={{ marginTop: SPACING.lg }}>
        <SectionHeader title="Follow-Up History" />
        {log.followUps.length === 0 ? (
          <Text style={{ color: colors.textMuted }}>No follow-up ratings recorded yet.</Text>
        ) : (
          log.followUps.map((f) => (
            <Card key={f.id} style={{ marginBottom: SPACING.sm }}>
              <View style={styles.followRow}>
                <StarRating value={f.starRating} readOnly size={18} />
                <Text style={{ color: colors.textMuted, fontSize: FONT_SIZES.xs }}>
                  {formatDate(f.ratedAt)}
                </Text>
              </View>
              <Text style={{ color: colors.text, marginTop: 4, fontWeight: '600' }}>
                {RELIEF_STATUS_LABELS[f.reliefStatus]}
              </Text>
            </Card>
          ))
        )}
      </View>

      <Card style={{ marginTop: SPACING.lg }}>
        <Text style={[styles.label, { color: colors.text }]}>Add a Rating</Text>
        <View style={{ marginTop: SPACING.sm, marginBottom: SPACING.md }}>
          <StarRating value={stars} onChange={setStars} />
        </View>
        <View style={styles.chipWrap}>
          {RELIEF_OPTIONS.map((r) => (
            <Chip
              key={r}
              label={RELIEF_STATUS_LABELS[r]}
              selected={relief === r}
              onPress={() => setRelief(r)}
            />
          ))}
        </View>
        <Button label="Save Rating" onPress={handleAddFollowUp} style={{ marginTop: SPACING.md }} />
      </Card>

      <Button
        label="Delete Entry"
        variant="danger"
        onPress={handleDelete}
        style={{ marginTop: SPACING.lg }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  saltName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
  },
  meta: {
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
  followRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
