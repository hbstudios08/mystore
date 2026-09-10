import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../utils/useTheme';
import { getZodiacSignForDate } from '../constants/zodiac';
import { CELL_SALTS, CELL_SALT_MAP, getAllBodySystems } from '../constants/cellSalts';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { DateInput } from '../components/DateInput';
import { Chip, SectionHeader, EmptyState } from '../components/Basics';
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
  const birthSign = useMemo(() => getZodiacSignForDate(birthDate), [birthDate]);
  const birthSalt = CELL_SALT_MAP[birthSign.cellSaltId];

  const [query, setQuery] = useState('');
  const [systemFilter, setSystemFilter] = useState<string | null>(null);
  const bodySystems = useMemo(() => getAllBodySystems(), []);

  const filteredSalts = useMemo(() => {
    return CELL_SALTS.filter((salt) => {
      const matchesQuery =
        !query.trim() ||
        [salt.commonName, salt.chemicalName, ...salt.indications]
          .join(' ')
          .toLowerCase()
          .includes(query.trim().toLowerCase());
      const matchesSystem = !systemFilter || salt.bodySystem.includes(systemFilter);
      return matchesQuery && matchesSystem;
    });
  }, [query, systemFilter]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <View style={styles.headerBlock}>
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
      </View>

      {mode === 'birthdate' ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.fieldLabel, { color: colors.text }]}>Birth Date</Text>
          <DateInput value={birthDate} onChange={setBirthDate} maximumDate={new Date()} />

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
        </ScrollView>
      ) : (
        <>
          {/* Search + body-system filter: a fixed, non-scrolling block, same
              pattern used by the former Directory screen — only the results
              list below grows/scrolls (flex:1), which is what keeps rows
              from overlapping the header on phone-sized viewports. */}
          <View style={styles.filterBlock}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search salts, symptoms, body systems..."
              placeholderTextColor={colors.textMuted}
              style={[
                styles.search,
                { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border },
              ]}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterRow}
              contentContainerStyle={styles.filterRowContent}
            >
              {bodySystems.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  selected={systemFilter === item}
                  onPress={() => setSystemFilter(systemFilter === item ? null : item)}
                />
              ))}
            </ScrollView>
          </View>

          <FlatList
            style={styles.list}
            data={filteredSalts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <EmptyState
                icon="\u{1F50D}"
                title="No matching salts"
                subtitle="Try a different search term or clear the filter."
              />
            }
            renderItem={({ item }) => (
              <CellSaltListItem
                salt={item}
                onPress={() => navigation.navigate('CellSaltDetail', { saltId: item.id })}
              />
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerBlock: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  fieldLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  modeRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
  filterBlock: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  search: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.md,
    marginBottom: SPACING.md,
  },
  filterRow: {
    flexGrow: 0,
    marginBottom: SPACING.sm,
  },
  filterRowContent: {
    paddingVertical: SPACING.xs,
    paddingRight: SPACING.lg,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xxl,
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
