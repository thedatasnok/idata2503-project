import { IconType } from '@/icon';
import { Icon, Box, Text } from '@gluestack-ui/themed';
import { ComponentProps } from 'react';

/**
 * Component to display a message when a data set is empty.
 */
interface EmptyStateProps extends ComponentProps<typeof Box> {
  description: string;
  icon?: IconType;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  description,
  icon,
  ...rest
}) => {
  return (
    <Box py='$2' {...rest} alignItems='center' justifyContent='center'>
      <Icon as={icon} size='3xl' color='$gray700' />
      <Text color='$gray700'>{description}</Text>
    </Box>
  );
};

export default EmptyState;
