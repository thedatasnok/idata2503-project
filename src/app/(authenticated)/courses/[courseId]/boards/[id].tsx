import Message from '@/components/message/Message';
import { MessageInput } from '@/components/message/MessageInput';
import Header from '@/components/navigation/Header';
import ConfiguredKeyboardAvoidingView from '@/components/utils/ConfiguredKeyboardAvoidingView';
import KeyboardDismissingView from '@/components/utils/KeyboardDismissingView';
import { useCourseBoard, useCourseDescription } from '@/services/courses';
import { useCourseBoardMessages } from '@/services/messaging';
import { Box, Text } from '@gluestack-ui/themed';
import { useLocalSearchParams } from 'expo-router';
import { t } from 'i18next';
import React from 'react';
import { FlatList } from 'react-native';

const BoardMessageScreen = () => {
  const { id, courseId } = useLocalSearchParams<{
    courseId: string;
    id: string;
  }>();

  const { messages, isSending, sendMessage } = useCourseBoardMessages(id, true);
  const { data: courseDescription } = useCourseDescription(courseId);
  const { data: board } = useCourseBoard(id);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  return (
    <ConfiguredKeyboardAvoidingView flex={1}>
      <KeyboardDismissingView>
        <Box flex={1}>
          <Header
            back={`/courses/${courseId}/`}
            context={courseDescription?.course_code}
            title={board === undefined ? 'board' : `#${board.name}`}
          />

          {messages?.length === 0 ? (
            <Box flex={1} justifyContent='flex-end' alignItems='center' pb='$4'>
              <Text>
                {t('FEATURES.COURSE_BOARDS.WELCOME_TO_THE_BOARD_FOR')}
              </Text>
              <Text color='$gray950' fontSize='$xl' fontWeight='bold'>
                #{board?.name}
              </Text>
              <Text fontStyle='italic' pt='$4' width='$4/6' textAlign='center'>
                {t('FEATURES.COURSE_BOARDS.BEGINNING_OF_BOARD', {
                  board: board?.name,
                })}
              </Text>
            </Box>
          ) : (
            <FlatList
              data={messages}
              inverted
              keyExtractor={(i) => i.course_board_message_id}
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
          )}

          <MessageInput isSending={isSending} sendMessage={handleSendMessage} />
        </Box>
      </KeyboardDismissingView>
    </ConfiguredKeyboardAvoidingView>
  );
};

export default BoardMessageScreen;
