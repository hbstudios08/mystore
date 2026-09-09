import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../utils/useTheme';
import { useAppStore } from '../store/useAppStore';
import { CELL_SALT_MAP } from '../constants/cellSalts';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { EmptyState } from '../components/Basics';
import { formatDateTime, timeAgo } from '../utils/dateUtils';
import { SPACING, FONT_SIZES } from '../constants/theme';
import type { RootStackParamList } from '../navigation/types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function TrackerScreen() {
  const { colors, accent } = useTheme();
  const navigation = useNavigation<NavProp>();
  const logs = useAppStore((s) => s.logs);

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.text }]}>Symptom Tracker</Text>
        <Button label="+ New" small onPress={() => navigation.navigate('LogEntry', {})} />
      </View>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: SPACING.xxl }}
        ListEmptyComponent={
          <EmptyState
            icon="\u{1F4CB}"
            title="No entries yet"
            subtitle="Log a symptom and the cell salt you're taking to start tracking."
          />
        }
        renderItem={({ item }) => {
          const salt = CELL_SALT_MAP[item.cellSaltId];
          const lastFollowUp = item.followUps[item.followUps.length - 1];
          return (
            <Pressable onPress={() => navigation.navigate('LogDetail', { logId: item.id })}>
              <Card style={{ marginBottom: SPACING.sm }}>
                <View style={styles.rowBetween}>
                  <Text style={{ color: colors.text, fontWeight: '700', fontSize: FONT_SIZES.md }}>
                    {salt.commonName}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: FONT_SIZES.xs }}>
                    {timeAgo(item.createdAt)}
                  </Text>
                </View>
                <Text style={{ color: colors.textMuted, fontSize: FONT_SIZES.sm, marginTop: 2 }}>
                  {item.symptoms.join(', ')}
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: FONT_SIZES.xs, marginTop: 4 }}>
                  Started {formatDateTime(item.startDateTime)} · Severity {item.baselineSeverity}/10
                </Text>
                {lastFollowUp && (
                  <Text style={{ color: accent, fontSize: FONT_SIZES.xs, marginTop: 4, fontWeight: '600' }}>
                    {item.followUps.length} follow-up{item.followUps.length > 1 ? 's' : ''} recorded
                  </Text>
                )}
              </Card>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});
