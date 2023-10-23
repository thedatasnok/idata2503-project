import { IconType } from '@/icon';
import { getToken } from '@/theme';
import { Box, Icon, Text } from '@gluestack-ui/themed';
import { BellIcon, MenuIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface HeaderProps {
  leftIcon?: IconType;
  rightIcon?: IconType;
  context?: string;
  title: string;
}

const Header: React.FC<HeaderProps> = ({
  leftIcon,
  rightIcon,
  context,
  title,
}) => {
  const insets = useSafeAreaInsets();
  const height = (getToken('space', '12') as number) + insets.top;

  return (
    <Box
      bg='$primary600'
      display='flex'
      flexDirection='row'
      h={height}
      alignItems='center'
      justifyContent='space-evenly'
      pt={insets.top}
      pb='$2'
      px='$4'
    >
      <Icon as={leftIcon ?? MenuIcon} color='$primary50' />

      <Box flex={1} display='flex' alignItems='center' gap={-6}>
        {context && (
          <Text color='$primary100' fontSize='$xs'>
            {context}
          </Text>
        )}
        <Text color='$primary50' fontWeight='$semibold' fontSize='$md'>
          {title}
        </Text>
      </Box>

      <Icon as={rightIcon ?? BellIcon} color='$primary50' />
    </Box>
  );
};

export default Header;
