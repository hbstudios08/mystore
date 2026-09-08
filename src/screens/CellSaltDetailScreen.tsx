import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../utils/useTheme';
import { CELL_SALT_MAP } from '../constants/cellSalts';
import { ZODIAC_MAP } from '../constants/zodiac';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ZodiacBadge } from '../components/ZodiacBadge';
import { SPACING, FONT_SIZES, RADIUS } from '../constants/theme';
import type { RootStackParamList } from '../navigation/types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type DetailRoute = RouteProp<RootStackParamList, 'CellSaltDetail'>;

function BulletList({ items, color }: { items: string[]; color: string }) {
  return (
    <View>
      {items.map((item, idx) => (
        <View key={idx} style={styles.bulletRow}>
          <Text style={{ color, marginRight: 8 }}>{'\u2022'}</Text>
          <Text style={[styles.bulletText, { color }]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function CellSaltDetailScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavProp>();
  const route = useRoute<DetailRoute>();
  const salt = CELL_SALT_MAP[route.params.saltId];
  const sign = ZODIAC_MAP[salt.zodiacId];

  return (
    <ScrollView style={{ backgroundColor: 'transparent' }} contentContainerStyle={styles.container}>
      <View style={[styles.headerBanner, { backgroundColor: salt.color }]}>
        <ZodiacBadge sign={sign} size={72} selected />
        <View style={{ marginLeft: SPACING.md, flex: 1 }}>
          <Text style={styles.headerName}>{salt.commonName}</Text>
          <Text style={styles.headerChem}>{salt.chemicalName}</Text>
        </View>
      </View>

      <Card style={{ marginTop: SPACING.lg }}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Overview</Text>
        <Text style={[styles.paragraph, { color: colors.textMuted }]}>{salt.description}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Zodiac Association</Text>
          <Text style={[styles.metaValue, { color: colors.text }]}>
            {sign.symbol} {sign.name} ({sign.dateRange})
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Ruling Body Part</Text>
          <Text style={[styles.metaValue, { color: colors.text }]}>{salt.rulingBodyPart}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Body Systems</Text>
          <Text style={[styles.metaValue, { color: colors.text }]}>{salt.bodySystem.join(', ')}</Text>
        </View>
      </Card>

      <Card style={{ marginTop: SPACING.md }}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Primary Indications</Text>
        <BulletList items={salt.indications} color={colors.text} />
      </Card>

      <Card style={{ marginTop: SPACING.md }}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Deficiency Symptoms</Text>
        <BulletList items={salt.deficiencySymptoms} color={colors.text} />
      </Card>

      <Card style={{ marginTop: SPACING.md }}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommended Dietary Sources</Text>
        <BulletList items={salt.dietarySources} color={colors.text} />
      </Card>

      <Button
        label="Log This Salt"
        onPress={() => navigation.navigate('LogEntry', { saltId: salt.id })}
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
  headerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  headerName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerChem: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  paragraph: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  metaRow: {
    marginTop: SPACING.sm,
  },
  metaLabel: {
    fontSize: FONT_SIZES.xs,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  metaValue: {
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
    fontWeight: '600',
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bulletText: {
    fontSize: FONT_SIZES.sm,
    flex: 1,
    lineHeight: 20,
  },
});
