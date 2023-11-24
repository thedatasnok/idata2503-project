import { styled } from '@gluestack-ui/themed';
import { ComponentProps } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import ConfiguredKeyboardAvoidingView from './ConfiguredKeyboardAvoidingView';

const StyledKeyboardDismissingView = styled(TouchableWithoutFeedback, {
  flex: 1,
});

export interface KeyboardDismissingViewProps
  extends ComponentProps<typeof StyledKeyboardDismissingView> {}

/**
 * Component that dismisses the keyboard when pressed within.
 * Should be used in combination with a {@link ConfiguredKeyboardAvoidingView}.
 */
const KeyboardDismissingView: React.FC<KeyboardDismissingViewProps> = ({
  children,
  ...rest
}) => (
  <StyledKeyboardDismissingView onPress={Keyboard.dismiss} {...rest}>
    <>{children}</>
  </StyledKeyboardDismissingView>
);

export default KeyboardDismissingView;
