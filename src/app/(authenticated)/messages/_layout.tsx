import { DEFAULT_STACK_SCREEN_OPTIONS } from '@/util/screen';
import { Stack } from 'expo-router';

const MessagesLayout = () => {
  return <Stack screenOptions={DEFAULT_STACK_SCREEN_OPTIONS} />;
};

export default MessagesLayout;
