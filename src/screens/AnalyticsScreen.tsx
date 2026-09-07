import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../utils/useTheme';
import { useAppStore } from '../store/useAppStore';
import { CELL_SALT_MAP } from '../constants/cellSalts';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { SectionHeader, EmptyState } from '../components/Basics';
import { BarChart, BarChartDatum } from '../components/BarChart';
import { exportLogsAsJson, exportLogsAsPdf } from '../utils/exportUtils';
import { SPACING, FONT_SIZES } from '../constants/theme';

export function AnalyticsScreen() {
  const { colors } = useTheme();
  const logs = useAppStore((s) => s.logs);
  const getEfficacyStats = useAppStore((s) => s.getEfficacyStats);
  const getMostEffectiveSalts = useAppStore((s) => s.getMostEffectiveSalts);

  const allStats = useMemo(() => getEfficacyStats(), [logs]);
  const topStats = useMemo(() => getMostEffectiveSalts(5), [logs]);

  const successRateData: BarChartDatum[] = topStats.map((s) => {
    const salt = CELL_SALT_MAP[s.cellSaltId];
    return {
      label: salt.commonName,
      value: s.successRate,
      color: salt.color,
      caption: `${s.successRate}%`,
    };
  });

  const usageData: BarChartDatum[] = allStats.map((s) => {
    const salt = CELL_SALT_MAP[s.cellSaltId];
    return {
      label: salt.commonName,
      value: s.totalUses,
      color: salt.color,
      caption: `${s.totalUses}`,
    };
  });

  async function handleExportJson() {
    try {
      await exportLogsAsJson(logs);
    } catch (e) {
      Alert.alert('Export Failed', 'Could not export tracking history as JSON.');
    }
  }

  async function handleExportPdf() {
    try {
      await exportLogsAsPdf(logs);
    } catch (e) {
      Alert.alert('Export Failed', 'Could not export tracking history as PDF.');
    }
  }

  if (logs.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <EmptyState
          icon="\u{1F4CA}"
          title="No data yet"
          subtitle="Log a few symptoms and rate their relief to see your analytics here."
        />
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <SectionHeader title="Analytics" subtitle="What's working best for you" />

      <Card style={{ marginTop: SPACING.md }}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>My Most Effective Salts</Text>
        {successRateData.length > 0 ? (
          <BarChart data={successRateData} maxValue={100} />
        ) : (
          <Text style={{ color: colors.textMuted }}>
            Add follow-up ratings to your log entries to see effectiveness rankings.
          </Text>
        )}
      </Card>

      <Card style={{ marginTop: SPACING.md }}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Total Uses vs Success Rate</Text>
        <BarChart data={usageData} />
        <Text style={{ color: colors.textMuted, fontSize: FONT_SIZES.xs, marginTop: SPACING.sm }}>
          Bar length reflects number of times each salt was logged.
        </Text>
      </Card>

      <Card style={{ marginTop: SPACING.md }}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Detailed Breakdown</Text>
        {allStats.map((s) => {
          const salt = CELL_SALT_MAP[s.cellSaltId];
          return (
            <View key={s.cellSaltId} style={styles.breakdownRow}>
              <View style={[styles.dot, { backgroundColor: salt.color }]} />
              <Text style={{ color: colors.text, flex: 1, fontWeight: '600' }}>
                {salt.commonName}
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: FONT_SIZES.xs }}>
                {s.totalUses} uses · {s.averageStars}★ avg · {s.successRate}% success
              </Text>
            </View>
          );
        })}
      </Card>

      <View style={{ marginTop: SPACING.lg }}>
        <SectionHeader title="Export" subtitle="Save your tracking history for personal records" />
        <View style={styles.exportRow}>
          <Button label="Export as JSON" variant="outline" onPress={handleExportJson} style={{ flex: 1, marginRight: SPACING.sm }} />
          <Button label="Export as PDF" onPress={handleExportPdf} style={{ flex: 1 }} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  cardTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.sm,
  },
  exportRow: {
    flexDirection: 'row',
  },
});
