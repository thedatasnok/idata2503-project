import { Stack } from 'expo-router';
import { ComponentProps } from 'react';

type StackScreenOptions = ComponentProps<typeof Stack>['screenOptions'];

export const DEFAULT_STACK_SCREEN_OPTIONS: StackScreenOptions = {
  header: () => <></>,
  animation: 'slide_from_right',
  contentStyle: {
    backgroundColor: '#ffffff',
  },
} as const;
