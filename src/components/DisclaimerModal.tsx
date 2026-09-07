import React from 'react';
import { Modal, View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../utils/useTheme';
import { Button } from './Button';
import { SPACING, RADIUS, FONT_SIZES } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';

export function DisclaimerModal() {
  const { colors } = useTheme();
  const hasSeenDisclaimer = useAppStore((s) => s.profile.hasSeenDisclaimer);
  const markDisclaimerSeen = useAppStore((s) => s.markDisclaimerSeen);

  return (
    <Modal visible={!hasSeenDisclaimer} animationType="fade" transparent>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={styles.icon}>{'\u26A0\uFE0F'}</Text>
          <Text style={[styles.title, { color: colors.text }]}>Before You Begin</Text>
          <ScrollView style={{ maxHeight: 220 }}>
            <Text style={[styles.body, { color: colors.textMuted }]}>
              This app is a wellness companion pairing Schuessler's 12 Cell (Tissue) Salts with
              astrological tradition for reflection and personal tracking purposes only.
              {'\n\n'}
              Cell salts are a complementary and traditional practice. They are{' '}
              <Text style={{ fontWeight: '700', color: colors.text }}>
                not a substitute for professional medical advice, diagnosis, or treatment
              </Text>
              . Always consult a qualified healthcare provider about any health condition or
              before starting any new supplement routine, especially if you are pregnant,
              nursing, taking medication, or managing a chronic condition.
              {'\n\n'}
              Never disregard professional medical advice or delay seeking it because of
              something you tracked in this app.
            </Text>
          </ScrollView>
          <Button label="I Understand" onPress={markDisclaimerSeen} style={{ marginTop: SPACING.md }} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  icon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  body: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
});
