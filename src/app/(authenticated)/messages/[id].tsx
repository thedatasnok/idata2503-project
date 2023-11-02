import Message from '@/components/message/Message';
import { MessageInput } from '@/components/message/MessageInput';
import Header from '@/components/navigation/Header';
import { DirectMessage, useDirectMessages } from '@/services/messaging';
import { Box } from '@gluestack-ui/themed';
import { useLocalSearchParams } from 'expo-router';
import React, { useRef } from 'react';
import { FlatList } from 'react-native';

const DirectMessageScreen = () => {
  const { id } = useLocalSearchParams();
  const { messages, isSending, sendMessage } = useDirectMessages(id as string);

  const flatListRef = useRef<FlatList<DirectMessage>>(null);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  return (
    <Box flex={1}>
      <Header title={'Message'} />

      <FlatList
        ref={flatListRef}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        data={messages}
        keyExtractor={(i) => i.direct_message_id}
        renderItem={({ item: message, index: i }) => (
          <Message
            content={message.content}
            createdAt={message.created_at}
            previousCreatedAt={messages?.[i - 1]?.created_at}
            senderFullName={message.sender_full_name}
            senderAvatarUrl={message.sender_avatar_url}
            sameSender={messages?.[i - 1]?.sender_user_id === message.sender_user_id}
          />
        )}
      />

      <MessageInput isSending={isSending} sendMessage={handleSendMessage} />
    </Box>
  );
};

export default DirectMessageScreen;
