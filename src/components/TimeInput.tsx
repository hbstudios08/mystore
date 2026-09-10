import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../utils/useTheme';
import { Button } from './Button';
import { SPACING, RADIUS, FONT_SIZES } from '../constants/theme';

interface TimeInputProps {
  /** "HH:MM", 24-hour */
  value?: string;
  onChange: (time: string) => void;
  placeholder?: string;
}

/** Inserts a colon as the user types raw digits: "1345" -> "13:45" */
function maskDigits(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  const parts = [digits.slice(0, 2), digits.slice(2, 4)].filter(Boolean);
  return parts.join(':');
}

function parseTyped(text: string): { hour: number; minute: number } | null {
  const match = /^(\d{2}):(\d{2})$/.exec(text);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

function formatTimeForDisplay(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/**
 * Cross-platform, directly editable 24-hour time field ("HH:MM"), mirroring
 * DateInput's pattern: typing is the primary interaction everywhere
 * (including web), with a clock-icon shortcut on iOS/Android that opens
 * the native time picker in a modal overlay.
 */
export function TimeInput({ value, onChange, placeholder = 'HH:MM (24-hour)' }: TimeInputProps) {
  const { colors } = useTheme();
  const [text, setText] = useState(value ?? '');
  const [touched, setTouched] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [draftPickerDate, setDraftPickerDate] = useState(() => {
    const parsed = value ? parseTyped(value) : null;
    const d = new Date();
    if (parsed) {
      d.setHours(parsed.hour, parsed.minute, 0, 0);
    }
    return d;
  });

  useEffect(() => {
    setText(value ?? '');
  }, [value]);

  const parsed = text.length === 5 ? parseTyped(text) : null;
  const isInvalid = touched && text.length === 5 && !parsed;

  function handleChangeText(raw: string) {
    const masked = maskDigits(raw);
    setText(masked);
    if (masked.length === 5) {
      const time = parseTyped(masked);
      if (time) onChange(formatTimeForDisplay(time.hour, time.minute));
    }
  }

  function openNativePicker() {
    const parsedNow = text.length === 5 ? parseTyped(text) : null;
    const d = new Date();
    if (parsedNow) d.setHours(parsedNow.hour, parsedNow.minute, 0, 0);
    setDraftPickerDate(d);
    setPickerVisible(true);
  }

  function confirmNativePicker(date: Date) {
    const formatted = formatTimeForDisplay(date.getHours(), date.getMinutes());
    onChange(formatted);
    setText(formatted);
    setPickerVisible(false);
  }

  const showPickerButton = Platform.OS === 'ios' || Platform.OS === 'android';

  return (
    <View>
      <View style={styles.row}>
        <TextInput
          value={text}
          onChangeText={handleChangeText}
          onBlur={() => setTouched(true)}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          maxLength={5}
          style={[
            styles.input,
            {
              backgroundColor: colors.surfaceAlt,
              color: colors.text,
              borderColor: isInvalid ? colors.danger : colors.border,
            },
          ]}
        />
        {showPickerButton && (
          <Pressable
            onPress={openNativePicker}
            style={[styles.iconButton, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
            hitSlop={8}
          >
            <Text style={{ fontSize: FONT_SIZES.lg }}>{'\u{1F550}'}</Text>
          </Pressable>
        )}
      </View>
      {isInvalid && (
        <Text style={[styles.errorText, { color: colors.danger }]}>
          Enter a valid 24-hour time as HH:MM.
        </Text>
      )}

      {showPickerButton && (
        <Modal visible={pickerVisible} transparent animationType="fade">
          <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
            <View style={[styles.pickerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <DateTimePicker
                value={draftPickerDate}
                mode="time"
                is24Hour
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selected) => {
                  if (Platform.OS === 'android') {
                    if (event.type === 'set' && selected) {
                      confirmNativePicker(selected);
                    } else {
                      setPickerVisible(false);
                    }
                  } else if (selected) {
                    setDraftPickerDate(selected);
                  }
                }}
                themeVariant={colors.glassTint === 'dark' ? 'dark' : 'light'}
              />
              {Platform.OS === 'ios' && (
                <View style={styles.pickerActions}>
                  <Button
                    label="Cancel"
                    variant="outline"
                    small
                    onPress={() => setPickerVisible(false)}
                    style={{ flex: 1, marginRight: SPACING.sm }}
                  />
                  <Button
                    label="Done"
                    small
                    onPress={() => confirmNativePicker(draftPickerDate)}
                    style={{ flex: 1 }}
                  />
                </View>
              )}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.md,
  },
  iconButton: {
    marginLeft: SPACING.sm,
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  pickerCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: RADIUS.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: SPACING.md,
  },
  pickerActions: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
});
