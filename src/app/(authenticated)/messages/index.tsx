import Header from '@/components/navigation/Header';
import { Box, Pressable, Text } from '@gluestack-ui/themed';
import dayjs from 'dayjs';
import { FlatList } from 'react-native';

// TODO: Replace these with data loaded from backend
const lastMessages = [
  {
    id: 'temp',
    receiverUserId: 'MyId',
    senderUserId: 'YourId',
    content: 'Hello man',
    attachments: 'This is a picture, trust',
    createdAt: dayjs('2023-10-16 08:15').toDate(),
  },
] as const;

const MessagesScreen = () => {
  return (
    <>
      <Header title='Messages' />
      <Text>Messages</Text>
      <FlatList
        data={lastMessages}
        keyExtractor={(i) => i.id}
        style={{
          paddingHorizontal: 12,
        }}
        renderItem={({ item: message, index: i }) => (
          <Message
            key={message.id}
            senderName={message.senderUserId}
            lastMessageContent={message.content}
            // onPress={() => router.push(`/announcements/${announcement.id}`)}
          />
        )}
      />
    </>
  );
};

interface MessageProps {
  senderName: string;
  lastMessageContent: string;
  lastMessageCreatedAt?: Date;
  onPress?: () => void;
}

const Message: React.FC<MessageProps> = ({
  senderName,
  lastMessageContent,
  lastMessageCreatedAt,
  onPress,
}) => {
  return (
    <>
      <Pressable
        display='flex'
        flexDirection='row'
        alignItems='center'
        px='$1'
        gap='$1'
        my='$1'
        onPress={onPress}
      >
        <Box flex={1} gap={-4}>
          <Box display='flex' flexDirection='row'>
            <Text fontSize='$xs'>{senderName}</Text>
            <Text fontSize='$xs'>{lastMessageContent}</Text>
          </Box>
          <Text color='$primary600' fontWeight='$semibold' fontSize='$md'>
            {dayjs(lastMessageCreatedAt).format('LT')}
          </Text>
        </Box>
      </Pressable>
    </>
  );
};

export default MessagesScreen;
