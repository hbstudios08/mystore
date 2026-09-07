import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { MainTabNavigator } from './MainTabNavigator';
import { CellSaltDetailScreen } from '../screens/CellSaltDetailScreen';
import { FindMySaltScreen } from '../screens/FindMySaltScreen';
import { LogEntryScreen } from '../screens/LogEntryScreen';
import { LogDetailScreen } from '../screens/LogDetailScreen';
import { useTheme } from '../utils/useTheme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { colors, isDark } = useTheme();

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen
          name="CellSaltDetail"
          component={CellSaltDetailScreen}
          options={{ title: 'Cell Salt' }}
        />
        <Stack.Screen
          name="FindMySalt"
          component={FindMySaltScreen}
          options={{ title: 'Find My Salt', presentation: 'modal' }}
        />
        <Stack.Screen
          name="LogEntry"
          component={LogEntryScreen}
          options={{ title: 'New Log Entry', presentation: 'modal' }}
        />
        <Stack.Screen name="LogDetail" component={LogDetailScreen} options={{ title: 'Log Detail' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
