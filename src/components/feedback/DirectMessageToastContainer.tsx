import { useDirectMessagesSubscription } from '@/services/messaging';
import { getToken } from '@/theme';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Heading,
  Pressable,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MESSAGE_QUEUE_DURATION_MS = 2000;

/**
 * Toast container that will render a toast for received direct messages when the app is open.
 * Will not render on a thread screen.
 */
const DirectMessageToastContainer: React.FC = () => {
  const path = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { messagesQueue } = useDirectMessagesSubscription();
  const paddingTop = (getToken('space', '2') as number) + insets.top;

  const shouldRender = messagesQueue.length > 0;

  if (!shouldRender) return null;

  const messageToRender = messagesQueue[0].message;
  const pop = messagesQueue[0].pop;

  // if the user is already on the thread, don't render the toast and pop it from the queue
  if (path === `/messages/${messageToRender.sender_user_id}`) {
    pop();
    return null;
  }

  return (
    <VStack position='absolute' w='$full' px='$2' pt={paddingTop}>
      <DirectMessageToast
        key={messageToRender.direct_message_id}
        content={messageToRender.content}
        senderName={messageToRender.sender_full_name}
        senderAvatarUrl={messageToRender.sender_avatar_url}
        onDismiss={pop}
        onPress={() => {
          router.push(`/messages/${messageToRender.sender_user_id}`);
          pop();
        }}
      />
    </VStack>
  );
};

interface DirectMessageToastProps {
  content: string;
  senderName: string;
  senderAvatarUrl: string;
  onDismiss: () => void;
  onPress: () => void;
}

const DirectMessageToast: React.FC<DirectMessageToastProps> = ({
  content,
  senderName,
  senderAvatarUrl,
  onDismiss,
  onPress,
}) => {
  const progress = useSharedValue(1); // Initial width value

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: '100%',
      width: `${progress.value * 100}%`,
    };
  });

  // Animate the width from 100% to 0% when the component mounts
  // on completion of the animation, call the onDismiss callback.
  // Note that the callback has to be run in the JS thread, hence the runOnJS
  useEffect(() => {
    progress.value = withTiming(
      0,
      { duration: MESSAGE_QUEUE_DURATION_MS },
      () => runOnJS(onDismiss)()
    );
  }, []);

  return (
    <Pressable
      bg='$gray50'
      rounded='$md'
      borderWidth='$1'
      borderColor='$gray300'
      hardShadow='1'
      onPress={onPress}
      sx={{ ':active': { bg: '$gray200' } }}
    >
      <Box flexDirection='row' gap='$2' p='$2'>
        <Avatar>
          <AvatarFallbackText>{senderName}</AvatarFallbackText>
          {senderAvatarUrl.length > 0 && (
            <AvatarImage source={{ uri: senderAvatarUrl }} />
          )}
        </Avatar>

        <VStack gap='-$1'>
          <Heading size='sm'>{senderName}</Heading>
          <Text fontSize='$sm' numberOfLines={1}>
            {content}
          </Text>
        </VStack>
      </Box>

      <Box
        h='$1'
        bg='$gray300'
        borderBottomLeftRadius='$lg'
        borderBottomRightRadius='$lg'
        overflow='hidden'
      >
        <Animated.View style={animatedStyle}>
          <Box h='$full' bg='$primary500' />
        </Animated.View>
      </Box>
    </Pressable>
  );
};

export default DirectMessageToastContainer;
