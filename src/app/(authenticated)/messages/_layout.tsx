import { Stack } from 'expo-router';

const SCREEN_OPTIONS = {
  header: () => <></>,
  animation: 'slide_from_right',
} as const;

const MessagesLayout = () => {
  return <Stack screenOptions={SCREEN_OPTIONS} />;
};

export default MessagesLayout;
