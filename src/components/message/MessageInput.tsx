import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  InputField,
  ButtonText,
  Spinner,
} from '@gluestack-ui/themed';

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
          onChangeText={(text: any) => setMessageContent(text)}
          placeholder='Type a message'
        />
      </Input>
      <Button onPress={handleSendMessage} width='$20'>
        {isSending ? (
          <Spinner color='$gray300' />
        ) : (
          <ButtonText>Send</ButtonText>
        )}
      </Button>
    </Box>
  );
};
