import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../utils/useTheme';
import { useAppStore } from '../store/useAppStore';
import { ZODIAC_SIGNS, ZODIAC_MAP } from '../constants/zodiac';
import { CELL_SALT_MAP } from '../constants/cellSalts';
import { ZodiacBadge } from '../components/ZodiacBadge';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/Basics';
import { Button } from '../components/Button';
import { SPACING, FONT_SIZES } from '../constants/theme';
import type { RootStackParamList } from '../navigation/types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavProp>();
  const profile = useAppStore((s) => s.profile);
  const logs = useAppStore((s) => s.logs);
  const recentLogs = useMemo(() => logs.slice(0, 3), [logs]);

  const sunSign = profile.sunSign ? ZODIAC_MAP[profile.sunSign] : undefined;
  const primarySalt = sunSign ? CELL_SALT_MAP[sunSign.cellSaltId] : undefined;

  const secondarySigns = useMemo(
    () =>
      [profile.ascendant, profile.moonSign]
        .filter(Boolean)
        .map((id) => ZODIAC_MAP[id as string])
        .filter(Boolean),
    [profile.ascendant, profile.moonSign]
  );

  return (
    <ScrollView
      style={{ backgroundColor: 'transparent' }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.greeting, { color: colors.text }]}>
        {profile.name ? `Hello, ${profile.name}` : 'Welcome'}
      </Text>
      <Text style={[styles.tagline, { color: colors.textMuted }]}>
        Your celestial guide to the 12 Cell Salts
      </Text>

      {/* Primary salt highlight */}
      {sunSign && primarySalt ? (
        <Card style={{ marginTop: SPACING.lg }}>
          <View style={styles.highlightRow}>
            <ZodiacBadge sign={sunSign} size={64} selected />
            <View style={styles.highlightText}>
              <Text style={[styles.highlightLabel, { color: colors.textMuted }]}>
                Your Sun Sign Salt
              </Text>
              <Text style={[styles.highlightSalt, { color: colors.text }]}>
                {primarySalt.commonName}
              </Text>
              <Text style={[styles.highlightSub, { color: colors.textMuted }]} numberOfLines={2}>
                {primarySalt.rulingBodyPart}
              </Text>
            </View>
          </View>
          <Button
            label="View Detail"
            variant="outline"
            small
            onPress={() => navigation.navigate('CellSaltDetail', { saltId: primarySalt.id })}
            style={{ marginTop: SPACING.md, alignSelf: 'flex-start' }}
          />
        </Card>
      ) : (
        <Card style={{ marginTop: SPACING.lg }}>
          <Text style={[styles.highlightSalt, { color: colors.text }]}>
            Set your Sun Sign to personalize
          </Text>
          <Text style={[styles.highlightSub, { color: colors.textMuted, marginBottom: SPACING.md }]}>
            Head to your profile to highlight your primary and secondary cell salts.
          </Text>
          <Button
            label="Go to Profile"
            small
            onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' } as never)}
            style={{ alignSelf: 'flex-start' }}
          />
        </Card>
      )}

      {secondarySigns.length > 0 && (
        <View style={{ marginTop: SPACING.md }}>
          <Text style={[styles.smallLabel, { color: colors.textMuted }]}>
            Secondary influences
          </Text>
          <View style={styles.rowWrap}>
            {secondarySigns.map((sign) => {
              const salt = CELL_SALT_MAP[sign.cellSaltId];
              return (
                <Pressable
                  key={sign.id}
                  onPress={() => navigation.navigate('CellSaltDetail', { saltId: salt.id })}
                  style={[styles.pill, { borderColor: colors.border, backgroundColor: colors.surface }]}
                >
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: FONT_SIZES.xs }}>
                    {sign.symbol} {salt.commonName}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* Zodiac wheel */}
      <View style={{ marginTop: SPACING.xl }}>
        <SectionHeader title="The Zodiac Wheel" subtitle="Tap a sign to explore its cell salt" />
        <FlatList
          data={ZODIAC_SIGNS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: SPACING.sm }}
          renderItem={({ item }) => (
            <Pressable
              style={{ marginRight: SPACING.md }}
              onPress={() =>
                navigation.navigate('CellSaltDetail', { saltId: item.cellSaltId })
              }
            >
              <ZodiacBadge sign={item} selected={item.id === profile.sunSign} />
            </Pressable>
          )}
        />
      </View>

      {/* Quick actions */}
      <View style={{ marginTop: SPACING.xl }}>
        <SectionHeader title="Quick Actions" />
        <View style={styles.actionsRow}>
          <Button
            label="Find My Salt"
            onPress={() => navigation.navigate('FindMySalt')}
            style={{ flex: 1, marginRight: SPACING.sm }}
          />
          <Button
            label="Log Symptom"
            variant="outline"
            onPress={() => navigation.navigate('LogEntry', {})}
            style={{ flex: 1 }}
          />
        </View>
      </View>

      {/* Recent activity */}
      {recentLogs.length > 0 && (
        <View style={{ marginTop: SPACING.xl }}>
          <SectionHeader title="Recent Activity" />
          {recentLogs.map((log) => {
            const salt = CELL_SALT_MAP[log.cellSaltId];
            return (
              <Card key={log.id} style={{ marginBottom: SPACING.sm }}>
                <Text style={{ color: colors.text, fontWeight: '700' }}>{salt.commonName}</Text>
                <Text style={{ color: colors.textMuted, fontSize: FONT_SIZES.xs, marginTop: 2 }}>
                  {log.symptoms.join(', ')}
                </Text>
              </Card>
            );
          })}
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
  greeting: {
    fontSize: FONT_SIZES.display,
    fontWeight: '800',
  },
  tagline: {
    fontSize: FONT_SIZES.md,
    marginTop: 2,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightText: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  highlightLabel: {
    fontSize: FONT_SIZES.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  highlightSalt: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    marginTop: 2,
  },
  highlightSub: {
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  smallLabel: {
    fontSize: FONT_SIZES.xs,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  actionsRow: {
    flexDirection: 'row',
  },
});
