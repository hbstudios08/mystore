import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from './Button';
import { LIGHT_THEME } from '../constants/theme';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Top-level error boundary. Catches render-time errors anywhere in the tree
 * below it and shows a recoverable fallback screen instead of a blank/crashed
 * app. Uses static colors (not the theme hook) since a crash could originate
 * from theme/store logic itself.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Uncaught error in component tree:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <ScrollView
          style={{ backgroundColor: LIGHT_THEME.background }}
          contentContainerStyle={styles.container}
        >
          <Text style={styles.icon}>{'\u26A0\uFE0F'}</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            {this.state.error.message || 'An unexpected error occurred.'}
          </Text>
          <Button label="Try Again" onPress={this.handleReset} style={{ marginTop: 24 }} />
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  icon: {
    fontSize: 40,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: LIGHT_THEME.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: LIGHT_THEME.textMuted,
    textAlign: 'center',
  },
});
