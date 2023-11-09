import Constants from 'expo-constants';
import { OneSignal } from 'react-native-onesignal';

OneSignal.initialize(Constants.expoConfig?.extra?.oneSignalAppId);

/**
 * Requests the user for push notification permissions.
 *
 * @returns a promise that resolves to a boolean indicating whether the user granted permissions or not.
 */
export const requestNotificationPermissions = async () => {
  return await OneSignal.Notifications.requestPermission(true);
};

/**
 * Associates the users id with OneSignal.
 *
 * @param userId the users id
 */
export const associateUserId = (userId: string) => {
  OneSignal.login(userId);
};
