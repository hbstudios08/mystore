import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { MainTabNavigator } from './MainTabNavigator';
import { CellSaltDetailScreen } from '../screens/CellSaltDetailScreen';
import { FindMySaltScreen } from '../screens/FindMySaltScreen';
import { LogEntryScreen } from '../screens/LogEntryScreen';
import { LogDetailScreen } from '../screens/LogDetailScreen';
import { useTheme } from '../utils/useTheme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { colors, isDark, accent } = useTheme();

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: 'transparent',
      card: colors.glassFillStrong,
      text: colors.text,
      border: colors.border,
      primary: accent,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: 'transparent' },
          // A real blurred, opaque-enough backdrop (matching the tab bar's
          // treatment) instead of a flat translucent color — a flat rgba
          // color on the header can blend unpredictably with whatever
          // gradient/content sits behind it, which is what let the back
          // button lose contrast in some themes.
          headerBackground: () => (
            <BlurView
              intensity={70}
              tint={colors.glassTint}
              style={[StyleSheet.absoluteFill, { backgroundColor: colors.glassFillStrong }]}
            />
          ),
          // The back chevron/label always uses the theme's bright accent
          // color, which is specifically tuned for guaranteed contrast —
          // so it never blends into the header regardless of theme or
          // light/dark mode. The title text stays in the normal reading
          // color via headerTitleStyle below.
          headerTintColor: accent,
          headerTitleStyle: { color: colors.text },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: 'transparent' },
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
