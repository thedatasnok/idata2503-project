import {
  TransitionPresets,
  createStackNavigator
} from '@react-navigation/stack';

import { withLayoutContext } from 'expo-router';

const { Navigator } = createStackNavigator();

// NOTE: We use a JS stack here because we want to use the modal presentation
//       on both platforms. This is not possible with the native stack.
//       This is a one-off case, the rest should be native stacks.
const JsStack = withLayoutContext(
  Navigator
);

const ScheduleLayout = () => {
  return (
    <JsStack
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      <JsStack.Screen
        name='[id]'
        options={{
          ...TransitionPresets.ModalPresentationIOS,
          presentation: 'modal',
          animationEnabled: true,
          gestureEnabled: true,
        }}
      />
    </JsStack>
  );
};

export default ScheduleLayout;
