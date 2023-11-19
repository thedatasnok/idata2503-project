import Message from '@/components/message/Message';
import { MessageInput } from '@/components/message/MessageInput';
import Header from '@/components/navigation/Header';
import ConfiguredKeyboardAvoidingView from '@/components/utils/ConfiguredKeyboardAvoidingView';
import KeyboardDismissingView from '@/components/utils/KeyboardDismissingView';
import { useUserProfile } from '@/services/auth';
import { useDirectMessages } from '@/services/messaging';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';

const DirectMessageScreen = () => {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const { messages, isSending, sendMessage } = useDirectMessages(
    id as string,
    true
  );

  const { data: userProfile } = useUserProfile(id as string);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  return (
    <ConfiguredKeyboardAvoidingView flex={1}>
      <KeyboardDismissingView>
        <Header
          back
          context={t('NAVIGATION.MESSAGES')}
          title={userProfile?.full_name ?? 'Message'}
        />

        <FlatList
          data={messages}
          inverted
          keyExtractor={(i) => i.direct_message_id}
          renderItem={({ item: message, index: i }) => (
            <Message
              content={message.content}
              createdAt={message.created_at}
              previousCreatedAt={messages?.[i + 1]?.created_at}
              senderFullName={message.sender_full_name}
              senderAvatarUrl={message.sender_avatar_url}
              sameSender={
                messages?.[i + 1]?.sender_user_id === message.sender_user_id
              }
            />
          )}
        />

        <MessageInput isSending={isSending} sendMessage={handleSendMessage} />
      </KeyboardDismissingView>
    </ConfiguredKeyboardAvoidingView>
  );
};

export default DirectMessageScreen;
