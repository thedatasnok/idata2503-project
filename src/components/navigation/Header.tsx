import { IconType } from '@/icon';
import { useDrawer } from '@/store/global';
import { getToken } from '@/theme';
import { Box, Icon, Pressable, Text } from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon, BellIcon, MenuIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface HeaderProps {
  /**
   * Customizable icon for the left most button.
   * Defaults to a menu icon.
   */
  leftIcon?: IconType;
  /**
   * Icon for the right part of the header.
   * Defaults to a bell icon.
   */
  rightIcon?: IconType;
  /**
   * Callback for when the left icon is pressed.
   */
  onLeftIconPress?: () => void;
  /**
   * Callback for when the right icon is pressed.
   */
  onRightIconPress?: () => void;
  /**
   * If true, the left icon will be substituted with a back icon, and the press handler will
   * call `router.back()` to return to the previous screen.
   */
  back?: boolean;
  /**
   * The context in which the header is displayed.
   * If set, a small text will be displayed above the title.
   */
  context?: string;
  /**
   * The title of the header.
   */
  title: string;
}

const Header: React.FC<HeaderProps> = ({
  leftIcon: passedLeftIcon,
  rightIcon,
  onLeftIconPress,
  onRightIconPress,
  back,
  context,
  title,
}) => {
  const { open: openDrawer } = useDrawer();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const height = (getToken('space', '12') as number) + insets.top;
  const paddingTop = insets.top || (getToken('space', '2') as number);

  const leftIcon = back ? ArrowLeftIcon : passedLeftIcon ?? MenuIcon;
  const onLeftPressed = back
    ? () => router.back()
    : onLeftIconPress ?? openDrawer;

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
        <Icon as={leftIcon} color='$primary50' />
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
        {rightIcon ? (
          <Icon as={rightIcon} color='$primary50' />
        ) : (
          // i am transparent. i am invisible. i am the bell icon.
          <Icon as={BellIcon} color='$primary600' />
        )}
      </Pressable>
    </Box>
  );
};

export default Header;
