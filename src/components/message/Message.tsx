import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Divider,
  Text,
} from '@gluestack-ui/themed';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import React from 'react';

dayjs.extend(duration);

interface MessageProps {
  content: string;
  created_at: string;
  sender_full_name: string;
  sender_avatar_url?: string;
  previousCreatedAt?: string;
  previousSender?: string;
}

/**
 * Component that displays a message.
 */
const Message: React.FC<MessageProps> = ({
  content,
  created_at,
  sender_full_name,
  sender_avatar_url,
  previousCreatedAt,
  previousSender,
}) => {
  const formattedDate = dayjs(created_at).calendar();
  const isSameSender = sender_full_name === previousSender;
  const isLastMessage = !previousCreatedAt;

  const dateDiff = dayjs(created_at).diff(
    dayjs(previousCreatedAt ?? created_at)
  );

  const moreThanFiveMinutes =
    dayjs.duration(dateDiff).asMinutes() > 5 || isLastMessage || !isSameSender;

  const moreThanOneDay = dayjs.duration(dateDiff).asDays() > 1 || isLastMessage;

  return (
    <Box px='$2' flexDirection='column'>
      {moreThanOneDay && <DividerWithDate date={formattedDate} />}
      <Box flexDirection='row' alignItems='center'>
        <Box width={40} mr='$4' pt='$4'>
          {moreThanFiveMinutes && (
            <Avatar>
              <AvatarFallbackText>{sender_full_name}</AvatarFallbackText>
              {sender_avatar_url && (
                <AvatarImage source={{ uri: sender_avatar_url }} />
              )}
            </Avatar>
          )}
        </Box>
        <Box maxWidth='$5/6'>
          {moreThanFiveMinutes && (
            <Box gap='$1' flexDirection='row' pt='$4'>
              <Text fontWeight='bold' color='$gray950'>
                {sender_full_name}
              </Text>
              <Text color='$gray500' fontSize='$xs'>
                {formattedDate}
              </Text>
            </Box>
          )}
          <Text>{content}</Text>
        </Box>
      </Box>
    </Box>
  );
};

interface DividerWithDateProps {
  date: string;
}

/**
 * Component that displays a divider with a date in the middle.
 */
const DividerWithDate: React.FC<DividerWithDateProps> = ({ date }) => {
  return (
    <Box flexDirection='row' alignItems='center'>
      <Divider flex={1} marginRight='$1' />
      <Text fontSize='$sm'>{date}</Text>
      <Divider flex={1} marginLeft='$1' />
    </Box>
  );
};

export default Message;
