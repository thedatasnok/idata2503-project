import { DEFAULT_STACK_SCREEN_OPTIONS } from '@/util/screen';
import { Stack } from 'expo-router';

const CoursesLayout: React.FC = () => {
  return <Stack screenOptions={DEFAULT_STACK_SCREEN_OPTIONS} />;
};

export default CoursesLayout;
