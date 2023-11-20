import CancellableSearch from '@/components/input/CancellableSearch';
import Header from '@/components/navigation/Header';
import UserProfileListItem from '@/components/users/UserProfileListItem';
import {
  DirectMessageDirection,
  useRecentDirectMessages,
} from '@/services/messaging';
import { usePublicUserProfiles } from '@/services/users';
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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';

const FLATLIST_STYLE = {
  paddingHorizontal: 12,
  paddingTop: 6,
};

const MessagesScreen = () => {
  const { data } = useRecentDirectMessages();
  const router = useRouter();
  const { t } = useTranslation();
  const [isSearching, setIsSearching] = useState(false);
  const [searchString, setSearchString] = useState('');
  const { data: searchedUsers } = usePublicUserProfiles(
    searchString,
    !isSearching
  );

  return (
    <>
      <Header title={t('NAVIGATION.MESSAGES')} />

      <CancellableSearch
        m='$3'
        isSearching={isSearching}
        onSearch={setSearchString}
        onFocus={setIsSearching}
        onCancel={() => setIsSearching(false)}
      />

      {isSearching && (
        <FlatList
          data={searchedUsers}
          style={FLATLIST_STYLE}
          keyExtractor={(user) => user.user_id}
          ItemSeparatorComponent={() => <Divider my='$1' />}
          renderItem={({ item: user }) => (
            <UserProfileListItem
              fullName={user.full_name}
              avatarUrl={user.avatar_url}
              onPress={() => router.push(`/messages/${user.user_id}`)}
            />
          )}
        />
      )}

      {!isSearching && (
        <FlatList
          data={data}
          keyExtractor={(i) => i.direct_message_id}
          style={FLATLIST_STYLE}
          ItemSeparatorComponent={() => <Divider my='$1' />}
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
      )}
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
  const formatAsCalendar = dayjs().diff(createdAt, 'day') < 2;

  return (
    <Pressable
      display='flex'
      flexDirection='row'
      alignItems='center'
      p='$1'
      gap='$2'
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
        {formatAsCalendar ? (
          // replaces the space before the time with a newline
          dayjs(createdAt)
            .calendar()
            .replace(/\s(?=\d)/, '\n')
        ) : (
          <>
            {dayjs(createdAt).format('L')}
            {'\n'}
            {dayjs(createdAt).format('LT')}
          </>
        )}
      </Text>
    </Pressable>
  );
};

export default MessagesScreen;
