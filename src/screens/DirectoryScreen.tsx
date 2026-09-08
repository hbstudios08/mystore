import React, { useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../utils/useTheme';
import { CELL_SALTS, getAllBodySystems } from '../constants/cellSalts';
import { ZODIAC_SIGNS } from '../constants/zodiac';
import { CellSaltListItem } from '../components/CellSaltListItem';
import { Chip, EmptyState } from '../components/Basics';
import { SPACING, RADIUS, FONT_SIZES } from '../constants/theme';
import type { RootStackParamList } from '../navigation/types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function DirectoryScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavProp>();
  const [query, setQuery] = useState('');
  const [zodiacFilter, setZodiacFilter] = useState<string | null>(null);
  const [systemFilter, setSystemFilter] = useState<string | null>(null);

  const bodySystems = useMemo(() => getAllBodySystems(), []);

  const filtered = useMemo(() => {
    return CELL_SALTS.filter((salt) => {
      const matchesQuery =
        !query.trim() ||
        [salt.commonName, salt.chemicalName, ...salt.indications]
          .join(' ')
          .toLowerCase()
          .includes(query.trim().toLowerCase());
      const matchesZodiac = !zodiacFilter || salt.zodiacId === zodiacFilter;
      const matchesSystem = !systemFilter || salt.bodySystem.includes(systemFilter);
      return matchesQuery && matchesZodiac && matchesSystem;
    });
  }, [query, zodiacFilter, systemFilter]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      {/* Fixed, non-scrolling header block: search + filter rows. Each
          filter row is a plain horizontal ScrollView (not a nested
          FlatList) — with only ~10-12 short chips each, virtualization
          isn't needed, and it avoids the sizing/overlap glitches that can
          happen when a VirtualizedList is nested without an explicit
          height inside a flex column on some renderers (notably web). */}
      <View style={styles.header}>
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
          {ZODIAC_SIGNS.map((item) => (
            <Chip
              key={item.id}
              label={`${item.symbol} ${item.name}`}
              selected={zodiacFilter === item.id}
              onPress={() => setZodiacFilter(zodiacFilter === item.id ? null : item.id)}
            />
          ))}
        </ScrollView>

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

      {/* The results list is the only element that should grow/scroll —
          giving it an explicit flex:1 keeps it correctly sized within the
          column instead of collapsing and letting rows overlap the header
          above it. */}
      <FlatList
        style={styles.list}
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="\u{1F50D}"
            title="No matching salts"
            subtitle="Try a different search term or clear your filters."
          />
        }
        renderItem={({ item }) => (
          <CellSaltListItem
            salt={item}
            onPress={() => navigation.navigate('CellSaltDetail', { saltId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
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
});
