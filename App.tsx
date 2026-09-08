import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation/RootNavigator';
import { DisclaimerModal } from './src/components/DisclaimerModal';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { GradientBackdrop } from './src/components/GradientBackdrop';
import { useTheme } from './src/utils/useTheme';

function AppShell() {
  const { isDark } = useTheme();
  return (
    <>
      <GradientBackdrop />
      <RootNavigator />
      <DisclaimerModal />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AppShell />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
