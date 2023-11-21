import { Stack } from 'expo-router/stack';
import { ComponentProps } from 'react';

type StackScreenOptions = ComponentProps<typeof Stack>['screenOptions'];

export const DEFAULT_STACK_SCREEN_OPTIONS: StackScreenOptions = {
  header: () => <></>,
  animation: 'fade',
  contentStyle: {
    backgroundColor: '#ffffff',
  },
} as const;

/**
 * Default preconfigured stack component that can be used in layouts.
 * It has a transparent header and a fade animation.
 */
export const DefaultStack = () => {
  return (
    <Stack
      initialRouteName='index'
      screenOptions={DEFAULT_STACK_SCREEN_OPTIONS}
    />
  );
};
