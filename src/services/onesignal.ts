import Constants, { AppOwnership } from 'expo-constants';
import type { OneSignal } from 'react-native-onesignal';

let os: typeof OneSignal | null;

// ignores onesignal when running through Expo Go
if (Constants.appOwnership !== AppOwnership.Expo) {
  import('react-native-onesignal').then((mod) => {
    os = mod.OneSignal;
    os?.initialize(Constants.expoConfig?.extra?.oneSignalAppId);
  });
} else {
  os = null;
}

/**
 * Helper function to wait for OneSignal state to be determined.
 */
const waitForOneSignal = async () => {
  if (os !== undefined) return;
  await new Promise((resolve) => setTimeout(resolve, 50));
  await waitForOneSignal();
};

/**
 * Requests the user for push notification permissions.
 *
 * @returns a promise that resolves to a boolean indicating whether the user granted permissions or not.
 */
export const requestNotificationPermissions = async () => {
  await waitForOneSignal();
  if (os === null) return false;
  return await os.Notifications.requestPermission(true);
};

/**
 * Associates the users id with OneSignal.
 *
 * @param userId the users id
 */
export const associateUserId = async (userId: string) => {
  await waitForOneSignal();
  if (os === null) return;
  os.login(userId);
};

/**
 * Disassociates the users id with OneSignal.
 */
export const disassociateUserId = async () => {
  await waitForOneSignal();
  if (os === null) return;
  os.logout();
};
