import {
  Box,
  Button,
  ButtonText,
  Input,
  InputField,
  Spinner,
} from '@gluestack-ui/themed';
import { t } from 'i18next';
import React, { useState } from 'react';

interface MessageInputProps {
  isSending: boolean;
  sendMessage: (content: string) => Promise<void>;
}

/**
 * Input component for sending a message.
 */
export const MessageInput: React.FC<MessageInputProps> = ({
  isSending,
  sendMessage,
}) => {
  const [messageContent, setMessageContent] = useState<string>('');

  const handleSendMessage = async () => {
    if (messageContent.trim() !== '') {
      await sendMessage(messageContent);
      setMessageContent('');
    }
  };

  return (
    <Box flexDirection='row' p='$2' gap='$2'>
      <Input flex={1}>
        <InputField
          value={messageContent}
          onSubmitEditing={handleSendMessage}
          enterKeyHint='send'
          onChangeText={(text: any) => setMessageContent(text)}
          placeholder={t('FEATURES.DIRECT_MESSAGES.SEND_MESSAGE')}
        />
      </Input>
      <Button onPress={handleSendMessage} width='$20'>
        {isSending ? (
          <Spinner color='$gray300' />
        ) : (
          <ButtonText>{t('FEATURES.DIRECT_MESSAGES.SEND')}</ButtonText>
        )}
      </Button>
    </Box>
  );
};
