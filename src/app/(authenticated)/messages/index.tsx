import Header from '@/components/navigation/Header';
import {
  DirectMessageDirection,
  useRecentDirectMessages,
} from '@/services/messaging';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Divider,
  Pressable,
  Text,
} from '@gluestack-ui/themed';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { FlatList } from 'react-native';

const MessagesScreen = () => {
  const { data } = useRecentDirectMessages();
  const router = useRouter();

  return (
    <>
      <Header title='Messages' />
      <FlatList
        data={data}
        keyExtractor={(i) => i.direct_message_id}
        style={{
          paddingHorizontal: 12,
          paddingTop: 6,
        }}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item: message }) => (
          <Message
            direction={message.direction}
            createdAt={message.created_at}
            counterPartName={message.counterpart_full_name}
            content={message.content}
            counterPartAvatarUrl={message.counterpart_avatar_url}
            onPress={() =>
              router.push(`/messages/${message.counterpart_user_id}`)
            }
          />
        )}
      />
    </>
  );
};

interface MessageProps {
  direction: string;
  counterPartName: string;
  content: string;
  createdAt: string;
  counterPartAvatarUrl?: string;
  onPress?: () => void;
}

const Message: React.FC<MessageProps> = ({
  direction,
  counterPartName,
  content,
  createdAt,
  counterPartAvatarUrl,
  onPress,
}) => {
  return (
    <Pressable
      display='flex'
      flexDirection='row'
      alignItems='center'
      px='$1'
      gap='$2'
      my='$1'
      py='$1'
      onPress={onPress}
    >
      <Avatar>
        <AvatarFallbackText>{counterPartName}</AvatarFallbackText>
        {counterPartAvatarUrl && (
          <AvatarImage source={{ uri: counterPartAvatarUrl }} />
        )}
      </Avatar>

      <Box display='flex' flexDirection='column' flexGrow={1}>
        <Text color='$gray600' fontWeight='$semibold' fontSize='$md'>
          {counterPartName}
        </Text>
        <Text fontSize='$xs' numberOfLines={2}>
          {direction === DirectMessageDirection.OUTGOING && 'You: '}
          {content}
        </Text>
      </Box>
      <Text fontSize='$sm' textAlign='center'>
        {dayjs(createdAt).isSame(dayjs())
          ? 'Today'
          : dayjs(createdAt).isSame(dayjs().subtract(1, 'day'))
          ? 'Yesterday'
          : dayjs(createdAt).format('L')}
        {'\n'}
        {dayjs(createdAt).format('LT')}
      </Text>
    </Pressable>
  );
};

export default MessagesScreen;
