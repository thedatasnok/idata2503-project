import CancellableSearch from '@/components/input/CancellableSearch';
import Header from '@/components/navigation/Header';
import UserProfileListItem from '@/components/users/UserProfileListItem';
import ConfiguredKeyboardAvoidingView from '@/components/utils/ConfiguredKeyboardAvoidingView';
import EmptyState from '@/components/utils/EmptyState';
import KeyboardDismissingView from '@/components/utils/KeyboardDismissingView';
import {
  DirectMessageDirection,
  useRecentDirectMessagesQuery,
} from '@/services/messaging';
import { usePublicUserProfilesQuery } from '@/services/users';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Divider,
  Pressable,
  Spinner,
  Text,
} from '@gluestack-ui/themed';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { MessageSquareDashed } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';

const FLATLIST_STYLE = {
  paddingHorizontal: 12,
  paddingTop: 6,
};

const MessagesScreen = () => {
  const { data, isLoading } = useRecentDirectMessagesQuery();
  const router = useRouter();
  const { t } = useTranslation();
  const [isSearching, setIsSearching] = useState(false);
  const [searchString, setSearchString] = useState('');
  const { data: searchedUsers } = usePublicUserProfilesQuery(
    searchString,
    !isSearching
  );

  const noSearchResults = searchedUsers?.length === 0;

  return (
    <ConfiguredKeyboardAvoidingView>
      <KeyboardDismissingView>
        <Header title={t('NAVIGATION.MESSAGES')} />

        <CancellableSearch
          m='$3'
          isSearching={isSearching}
          onSearch={setSearchString}
          onFocus={setIsSearching}
          onCancel={() => setIsSearching(false)}
        />

        {isLoading && (
          <Box flex={1} alignItems='center' justifyContent='center'>
            <Spinner size="large" />
          </Box>
        )}
        {isSearching && (
          <FlatList
            data={searchedUsers}
            style={FLATLIST_STYLE}
            ListEmptyComponent={() =>
              noSearchResults && (
                <EmptyState description='Could not find any users matching your search' />
              )
            }
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

        {!isSearching && !isLoading && (
          <FlatList
            data={data}
            keyExtractor={(i) => i.direct_message_id}
            style={FLATLIST_STYLE}
            ListEmptyComponent={() => (
              <EmptyState
                description={t('FEATURES.DIRECT_MESSAGES.NO_DIRECT_MESSAGES')}
                icon={MessageSquareDashed}
              />
            )}
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
      </KeyboardDismissingView>
    </ConfiguredKeyboardAvoidingView>
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
  const formatAsCalendar =
    dayjs().subtract(1, 'day').isSame(createdAt, 'day') ||
    dayjs().isSame(createdAt, 'day');

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

      <Text fontSize='$sm' textAlign='center' w='$20'>
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
