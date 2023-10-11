import { IconType } from '@/icon';
import { Box, Icon, Text } from '@gluestack-ui/themed';
import { BellIcon, MenuIcon } from 'lucide-react-native';

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
  return (
    <Box
      h='$12'
      bg='$primary600'
      display='flex'
      flexDirection='row'
      alignItems='center'
      justifyContent='space-evenly'
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
