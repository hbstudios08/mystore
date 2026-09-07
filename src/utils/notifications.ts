import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { addHours, addDays } from './dateUtils';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('efficacy-followups', {
      name: 'Efficacy Follow-ups',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return finalStatus === 'granted';
}

export type FollowUpInterval = '2h' | '12h' | '24h';

/**
 * Schedules a local notification prompting the user to rate how a cell
 * salt worked, at the given interval after the log's start time.
 */
export async function scheduleFollowUpReminder(
  logId: string,
  cellSaltName: string,
  interval: FollowUpInterval,
  startDateTime: Date
): Promise<string | null> {
  const granted = await requestNotificationPermissions();
  if (!granted) return null;

  let triggerDate: Date;
  switch (interval) {
    case '2h':
      triggerDate = addHours(startDateTime, 2);
      break;
    case '12h':
      triggerDate = addHours(startDateTime, 12);
      break;
    case '24h':
      triggerDate = addDays(startDateTime, 1);
      break;
  }

  // Don't schedule reminders in the past
  if (triggerDate.getTime() <= Date.now()) return null;

  const secondsFromNow = Math.max(1, Math.round((triggerDate.getTime() - Date.now()) / 1000));

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'How are you feeling?',
      body: `Rate how well ${cellSaltName} worked for your symptoms.`,
      data: { logId, interval },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: secondsFromNow,
    },
  });

  return id;
}

export async function cancelReminder(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
