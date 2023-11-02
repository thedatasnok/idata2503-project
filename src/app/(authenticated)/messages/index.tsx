import Header from '@/components/navigation/Header';
import { useRecentDirectMessages } from '@/services/messaging';
import { Box, Pressable, Text } from '@gluestack-ui/themed';
import dayjs from 'dayjs';
import { FlatList } from 'react-native';

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
        ItemSeparatorComponent={() => <Box h='$px' bg='$gray200' mt='$2' />}
        renderItem={({ item: message }) => (
          <>
            <Message
              direction={message.direction}
              createdAt={message.created_at}
              counterPartName={message.counterpart_full_name}
              content={message.content}
              // onPress={() => router.push(`/announcements/${announcement.id}`)}
            />
          </>
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
  onPress?: () => void;
}

const Message: React.FC<MessageProps> = ({
  direction,
  counterPartName,
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
            {counterPartName}
          </Text>
          <Text fontSize='$xs' numberOfLines={2}>
            {direction === 'OUTGOING' && 'You: '}
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
