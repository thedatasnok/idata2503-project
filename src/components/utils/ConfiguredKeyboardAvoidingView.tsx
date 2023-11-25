import { KeyboardAvoidingView } from '@gluestack-ui/themed';
import { ComponentProps } from 'react';
import { Platform } from 'react-native';

export interface ConfiguredKeyboardAvoidingViewProps
  extends ComponentProps<typeof KeyboardAvoidingView> {
  children: React.ReactNode;
}

/**
 * Preconfigured KeyboardAvoidingView component with behavior set to 'padding' on iOS and 'height' on Android.
 */
const ConfiguredKeyboardAvoidingView: React.FC<
  ConfiguredKeyboardAvoidingViewProps
> = ({ children, ...rest }) => (
  <KeyboardAvoidingView
    flex={1}
    {...rest}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    {children}
  </KeyboardAvoidingView>
);

export default ConfiguredKeyboardAvoidingView;
