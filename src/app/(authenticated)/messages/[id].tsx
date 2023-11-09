import Message from '@/components/message/Message';
import { MessageInput } from '@/components/message/MessageInput';
import Header from '@/components/navigation/Header';
import { useUserProfile } from '@/services/auth';
import { useDirectMessages } from '@/services/messaging';
import { Box } from '@gluestack-ui/themed';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList } from 'react-native';

const DirectMessageScreen = () => {
  const { id } = useLocalSearchParams();
  const { messages, isSending, sendMessage } = useDirectMessages(
    id as string,
    true
  );

  const { data: userProfile } = useUserProfile(id as string);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  return (
    <Box flex={1}>
      <Header title={userProfile?.full_name ?? 'Message'} />

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
    </Box>
  );
};

export default DirectMessageScreen;
