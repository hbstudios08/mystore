import React, { useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, TextInput } from 'react-native';
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search salts, symptoms, body systems..."
        placeholderTextColor={colors.textMuted}
        style={[
          styles.search,
          { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border },
        ]}
      />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={ZODIAC_SIGNS}
        keyExtractor={(item) => item.id}
        style={{ flexGrow: 0, marginBottom: SPACING.sm }}
        contentContainerStyle={{ paddingVertical: SPACING.xs }}
        renderItem={({ item }) => (
          <Chip
            label={`${item.symbol} ${item.name}`}
            selected={zodiacFilter === item.id}
            onPress={() => setZodiacFilter(zodiacFilter === item.id ? null : item.id)}
          />
        )}
      />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={bodySystems}
        keyExtractor={(item) => item}
        style={{ flexGrow: 0, marginBottom: SPACING.md }}
        contentContainerStyle={{ paddingVertical: SPACING.xs }}
        renderItem={({ item }) => (
          <Chip
            label={item}
            selected={systemFilter === item}
            onPress={() => setSystemFilter(systemFilter === item ? null : item)}
          />
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: SPACING.xxl }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
  },
  search: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.md,
    marginBottom: SPACING.md,
  },
});
