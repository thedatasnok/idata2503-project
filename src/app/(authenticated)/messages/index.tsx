import Header from '@/components/navigation/Header';
import { useRecentDirectMessages } from '@/services/messaging';
import { Box, Pressable, Text } from '@gluestack-ui/themed';
import dayjs from 'dayjs';
import { FlatList } from 'react-native';

// TODO: Replace these with data loaded from backend
const messages = [
  {
    id: 'temp',
    receiverUserId: 'MyId',
    senderUserId: 'SenderId1',
    content: 'Hello man',
    attachments: 'This is a picture, trust',
    createdAt: dayjs('2023-10-15 08:15').toDate(),
  },
  {
    id: 'temp2',
    receiverUserId: 'MyId',
    senderUserId: 'SenderId1',
    content: 'Hello man from the other side',
    attachments: 'This is several dog a pictures, trust',
    createdAt: dayjs('2023-10-16 08:15').toDate(),
  },
  {
    id: 'temp3',
    receiverUserId: 'MyId',
    senderUserId: 'SenderId2',
    content:
      'Third message that is a very long message because i need to check the styling is correct bla bla bladiak qwwiojdaluwbdiaubufadjv ay gdjafy fd',
    attachments: 'This is several cat a pictures, trust',
    createdAt: dayjs('2023-10-16 07:15').toDate(),
  },
] as const;

const MessagesScreen = () => {
  const { data, isLoading } = useRecentDirectMessages();

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
        renderItem={({ item: message, index: i }) => (
          <>
            <Message
              key={message.direct_message_id}
              direction={message.direction}
              createdAt={message.created_at}
              senderName={message.sender_full_name}
              content={message.content}
              // onPress={() => router.push(`/announcements/${announcement.id}`)}
            />
            {data?.[i + 1] && (
              <Box h='$px' w='$full' bgColor='$gray200' mt='$2' />
            )}
          </>
        )}
      />
    </>
  );
};

interface MessageProps {
  direction: string;
  senderName: string;
  content: string;
  createdAt: string;
  onPress?: () => void;
}

const Message: React.FC<MessageProps> = ({
  direction,
  senderName,
  content,
  createdAt,
  onPress,
}) => {
  return (
    <Pressable
      display='flex'
      flexDirection='row'
      alignItems='center'
      px='$1'
      gap='$1'
      my='$1'
      onPress={onPress}
    >
      <Box
        flex={1}
        gap={-4}
        display='flex'
        flexDirection='row'
        alignItems='center'
      >
        <Box display='flex' flexDirection='column' flexGrow={1}>
          <Text color='$gray600' fontWeight='$semibold' fontSize='$md'>
            {direction === 'INGOING' ? senderName : 'You | ' + senderName}
          </Text>
          <Text fontSize='$xs' numberOfLines={2}>
            {content}
          </Text>
        </Box>
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
