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

  const moonSign = profile.moonSign ? ZODIAC_MAP[profile.moonSign] : undefined;
  const moonSalt = moonSign ? CELL_SALT_MAP[moonSign.cellSaltId] : undefined;

  const risingSign = profile.ascendant ? ZODIAC_MAP[profile.ascendant] : undefined;
  const risingSalt = risingSign ? CELL_SALT_MAP[risingSign.cellSaltId] : undefined;

  function renderMinorSaltCard(sign: typeof moonSign, salt: typeof moonSalt, heading: string) {
    if (!sign || !salt) return null;
    return (
      <Card style={{ marginTop: SPACING.sm }} padded>
        <Pressable
          onPress={() => navigation.navigate('CellSaltDetail', { saltId: salt.id })}
          style={styles.highlightRow}
        >
          {/* 25% smaller than the Sun Sign card's 64px badge */}
          <ZodiacBadge sign={sign} size={48} />
          <View style={styles.highlightText}>
            <Text style={[styles.highlightLabel, styles.minorLabel, { color: colors.textMuted }]}>
              {heading}
            </Text>
            <Text style={[styles.highlightSalt, styles.minorSalt, { color: colors.text }]}>
              {salt.commonName}
            </Text>
            <Text
              style={[styles.highlightSub, styles.minorSub, { color: colors.textMuted }]}
              numberOfLines={2}
            >
              {salt.rulingBodyPart}
            </Text>
          </View>
        </Pressable>
      </Card>
    );
  }

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

      {(moonSign || risingSign) && (
        <View style={{ marginTop: SPACING.md }}>
          {renderMinorSaltCard(moonSign, moonSalt, 'Moon Sign Salt')}
          {renderMinorSaltCard(risingSign, risingSalt, 'Ascendant (Rising) Salt')}
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
  // 25% smaller variants used by the Moon Sign / Ascendant mini-cards
  minorLabel: {
    fontSize: FONT_SIZES.xs * 0.75,
  },
  minorSalt: {
    fontSize: FONT_SIZES.lg * 0.75,
  },
  minorSub: {
    fontSize: FONT_SIZES.sm * 0.75,
  },
  actionsRow: {
    flexDirection: 'row',
  },
});
