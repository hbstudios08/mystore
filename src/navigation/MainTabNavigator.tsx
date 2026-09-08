import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { HomeScreen } from '../screens/HomeScreen';
import { DirectoryScreen } from '../screens/DirectoryScreen';
import { TrackerScreen } from '../screens/TrackerScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useTheme } from '../utils/useTheme';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, string> = {
  Home: '\u2726',
  Directory: '\u{1F9EA}',
  Tracker: '\u{1F4CB}',
  Analytics: '\u{1F4CA}',
  Profile: '\u{1F464}',
};

export function MainTabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Smooth cross-fade + slide when switching between tabs, instead of
        // an abrupt cut.
        animation: 'shift',
        sceneStyle: { backgroundColor: 'transparent' },
        headerStyle: { backgroundColor: colors.glassFillStrong },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopColor: colors.glassBorder,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={60}
            tint={colors.glassTint}
            style={[StyleSheet.absoluteFill, { backgroundColor: colors.glassFillStrong }]}
          />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => (
          <Text style={{ color, fontSize: size * 0.8 }}>
            {TAB_ICONS[route.name as keyof MainTabParamList]}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Directory" component={DirectoryScreen} options={{ title: 'Directory' }} />
      <Tab.Screen name="Tracker" component={TrackerScreen} options={{ title: 'Tracker' }} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Analytics' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
