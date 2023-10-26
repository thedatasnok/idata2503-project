import Header from '@/components/navigation/Header';
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
  return (
    <>
      <Header title='Messages' />
      <FlatList
        data={messages}
        keyExtractor={(i) => i.id}
        style={{
          paddingHorizontal: 12,
        }}
        renderItem={({ item: message, index: i }) => (
          <>
            <Message
              key={message.id}
              createdAt={message.createdAt}
              senderName={message.senderUserId}
              content={message.content}
              // onPress={() => router.push(`/announcements/${announcement.id}`)}
            />
            {messages[i + 1] && (
              <Box h='$px' w='$full' bgColor='$gray200' mt='$2' />
            )}
          </>
        )}
      />
    </>
  );
};

interface MessageProps {
  senderName: string;
  content: string;
  createdAt: Date;
  onPress?: () => void;
}

const Message: React.FC<MessageProps> = ({
  senderName,
  content,
  createdAt,
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
        <Box
          flex={1}
          gap={-4}
          display='flex'
          flexDirection='row'
          alignItems='center'
        >
          <Box display='flex' flexDirection='column' flexGrow={1}>
            <Text color='$gray600' fontWeight='$semibold' fontSize='$md'>
              {senderName}
            </Text>
            <Text fontSize='$xs' numberOfLines={2}>
              {content}
            </Text>
          </Box>
        </Box>
        <Text fontSize='$sm' textAlign='center'>
          {dayjs(createdAt).format('L')}
          {'\n'}
          {dayjs(createdAt).format('LT')}
        </Text>
      </Pressable>
    </>
  );
};

export default MessagesScreen;
