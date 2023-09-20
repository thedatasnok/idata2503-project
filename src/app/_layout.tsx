import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ComponentProps } from 'react';
import { Text, View } from 'react-native';

const STACK_SCREEN_OPTIONS: ComponentProps<typeof Stack>['screenOptions'] = {};

const RootLayout = () => {
  return (
    <View>
      <Stack screenOptions={STACK_SCREEN_OPTIONS} />
      <Text>whiteboardapp</Text>
      <StatusBar />
    </View>
  );
};

export default RootLayout;
