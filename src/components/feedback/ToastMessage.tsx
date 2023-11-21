import { styled } from '@gluestack-style/react';
import {
  Box,
  Heading,
  Icon,
  Pressable,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  InfoIcon,
  XCircleIcon,
  XIcon,
} from 'lucide-react-native';
import { useWindowDimensions } from 'react-native';

export const enum Severity {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

const getSeverityIcon = (severity: Severity) => {
  switch (severity) {
    case Severity.SUCCESS:
      return CheckCircleIcon;
    case Severity.ERROR:
      return XCircleIcon;
    case Severity.WARNING:
      return AlertTriangleIcon;
    case Severity.INFO:
      return InfoIcon;
  }
};

export interface ToastMessageProps {
  /**
   * Severity of the toast message.
   */
  severity: Severity;
  /**
   * Header of the toast message.
   */
  header: string;
  /**
   * Message of the toast message.
   */
  message: string;
  /**
   * Callback that is called when the 'x' button is pressed.
   * If the callback is not provided, the 'x' button will not be rendered.
   */
  onClose?: () => void;
}

/**
 * Toast message component that can be rendered using the `useToast` hook.
 */
const ToastMessage: React.FC<ToastMessageProps> = ({
  severity,
  header,
  message,
  onClose,
}) => {
  // ideally we would use something like 80% of the screen width,
  // this is good enough for now as using 80% does not work.
  const { width } = useWindowDimensions();

  return (
    <StyledToastContainer severity={severity} width={width - 40}>
      {/* @ts-ignore */}
      <StyledToastIcon as={getSeverityIcon(severity)} severity={severity} />

      <VStack flex={1}>
        <Heading size='md' mb='-$1'>
          {header}
        </Heading>
        <Text>{message}</Text>
      </VStack>

      {onClose && (
        <Pressable onPress={onClose}>
          <Icon as={XIcon} size='sm' color='$gray500' />
        </Pressable>
      )}
    </StyledToastContainer>
  );
};

const StyledToastContainer = styled(Box, {
  borderWidth: '$1',
  bg: '$gray50',
  rounded: '$md',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$2',
  mb: '$2',
  p: '$2',
  variants: {
    severity: {
      [Severity.SUCCESS]: {
        borderColor: '$success500',
        bg: '$success100',
      },
      [Severity.ERROR]: {
        borderColor: '$error500',
        bg: '$error100',
      },
      [Severity.WARNING]: {
        borderColor: '$warning500',
        bg: '$warning100',
      },
      [Severity.INFO]: {
        borderColor: '$primary500',
        bg: '$primary100',
      },
    },
  },
});

// @ts-ignore
const StyledToastIcon = styled(Icon, {
  variants: {
    severity: {
      [Severity.SUCCESS]: {
        color: '$success500',
      },
      [Severity.ERROR]: {
        color: '$error500',
      },
      [Severity.WARNING]: {
        color: '$warning500',
      },
      [Severity.INFO]: {
        color: '$primary500',
      },
    },
  },
});

export default ToastMessage;
