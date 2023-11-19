import { ComponentProps } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import ConfiguredKeyboardAvoidingView from './ConfiguredKeyboardAvoidingView';
import { View } from '@gluestack-ui/themed';

export interface KeyboardDismissingViewProps
  extends ComponentProps<typeof View> {}

/**
 * Component that dismisses the keyboard when pressed within.
 * Should be used in combination with a {@link ConfiguredKeyboardAvoidingView}.
 */
const KeyboardDismissingView: React.FC<KeyboardDismissingViewProps> = ({
  children,
  ...rest
}) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View flex={1} {...rest}>{children}</View>
  </TouchableWithoutFeedback>
);

export default KeyboardDismissingView;
