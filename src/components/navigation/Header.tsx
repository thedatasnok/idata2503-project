import { IconType } from '@/icon';
import { useDrawer } from '@/store/global';
import { getToken } from '@/theme';
import { Box, Icon, Pressable, Text } from '@gluestack-ui/themed';
import { BellIcon, MenuIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface HeaderProps {
  leftIcon?: IconType;
  rightIcon?: IconType;
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;
  context?: string;
  title: string;
}

const Header: React.FC<HeaderProps> = ({
  leftIcon,
  rightIcon,
  onLeftIconPress,
  onRightIconPress,
  context,
  title,
}) => {
  const { open: openDrawer } = useDrawer();
  const insets = useSafeAreaInsets();
  const height = (getToken('space', '12') as number) + insets.top;
  const onLeftPressed = onLeftIconPress ?? openDrawer;
  const paddingTop = insets.top || (getToken('space', '2') as number);
  const onRightPressed = onRightIconPress;

  return (
    <Box
      bg='$primary600'
      display='flex'
      flexDirection='row'
      h={height}
      alignItems='center'
      justifyContent='space-evenly'
      pt={paddingTop}
      pb='$2'
    >
      <Pressable onPress={onLeftPressed} px='$4'>
        <Icon as={leftIcon ?? MenuIcon} color='$primary50' />
      </Pressable>

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

      <Pressable onPress={onRightPressed} px='$4'>
        <Icon as={rightIcon ?? BellIcon} color='$primary50' />
      </Pressable>
    </Box>
  );
};

export default Header;
