import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../utils/useTheme';
import { Button } from './Button';
import { SPACING, RADIUS, FONT_SIZES } from '../constants/theme';

interface DateInputProps {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

function formatDateForDisplay(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = String(date.getFullYear());
  return `${mm}/${dd}/${yyyy}`;
}

/** Inserts slashes as the user types raw digits: "12252000" -> "12/25/2000" */
function maskDigits(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  return parts.join('/');
}

/** Parses a complete MM/DD/YYYY string into a real, calendar-valid Date, or null. */
function parseTyped(text: string, minimumDate?: Date, maximumDate?: Date): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!match) return null;

  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12) return null;
  if (year < 1900 || year > 2100) return null;

  const date = new Date(year, month - 1, day);
  // Reject overflowed dates (e.g. Feb 30 -> rolls into March)
  if (date.getMonth() !== month - 1 || date.getDate() !== day || date.getFullYear() !== year) {
    return null;
  }
  if (minimumDate && date < minimumDate) return null;
  if (maximumDate && date > maximumDate) return null;
  return date;
}

/**
 * Cross-platform, directly editable date field. Typing "MM/DD/YYYY" is the
 * primary interaction everywhere (including web, where the native
 * community date picker has inconsistent support). On iOS/Android a small
 * calendar button additionally opens the native picker in a modal overlay
 * as a shortcut — it never affects page layout since it's presented over
 * the screen rather than inline.
 */
export function DateInput({
  value,
  onChange,
  placeholder = 'MM/DD/YYYY',
  maximumDate,
  minimumDate,
}: DateInputProps) {
  const { colors } = useTheme();
  const [text, setText] = useState(value ? formatDateForDisplay(value) : '');
  const [touched, setTouched] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [draftPickerDate, setDraftPickerDate] = useState(value ?? new Date(2000, 0, 1));

  // Keep the typed text in sync if the value changes from outside (e.g. the
  // native picker, or a parent resetting the form).
  useEffect(() => {
    setText(value ? formatDateForDisplay(value) : '');
  }, [value]);

  const parsed = text.length === 10 ? parseTyped(text, minimumDate, maximumDate) : null;
  const isInvalid = touched && text.length === 10 && !parsed;

  function handleChangeText(raw: string) {
    const masked = maskDigits(raw);
    setText(masked);
    if (masked.length === 10) {
      const date = parseTyped(masked, minimumDate, maximumDate);
      if (date) onChange(date);
    }
  }

  function openNativePicker() {
    setDraftPickerDate(value ?? new Date(2000, 0, 1));
    setPickerVisible(true);
  }

  function confirmNativePicker(date: Date) {
    onChange(date);
    setText(formatDateForDisplay(date));
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
          maxLength={10}
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
            <Text style={{ fontSize: FONT_SIZES.lg }}>{'\u{1F4C5}'}</Text>
          </Pressable>
        )}
      </View>
      {isInvalid && (
        <Text style={[styles.errorText, { color: colors.danger }]}>
          Enter a valid date as MM/DD/YYYY.
        </Text>
      )}

      {showPickerButton && (
        <Modal visible={pickerVisible} transparent animationType="fade">
          <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
            <View style={[styles.pickerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <DateTimePicker
                value={draftPickerDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                onChange={(event, selected) => {
                  if (Platform.OS === 'android') {
                    // Android's picker is itself a dialog; a selection or
                    // dismissal both close it immediately.
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
