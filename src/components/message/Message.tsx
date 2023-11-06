import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Divider,
  Text,
} from '@gluestack-ui/themed';
import dayjs from 'dayjs';

interface MessageProps {
  content: string;
  createdAt: string;
  senderFullName: string;
  senderAvatarUrl?: string;
  previousCreatedAt?: string;
  /**
   * Whether or not the sender of the message is the same as the previous one.
   */
  sameSender?: boolean;
}

/**
 * Component that displays a message.
 */
const Message: React.FC<MessageProps> = ({
  content,
  createdAt,
  senderFullName,
  senderAvatarUrl,
  previousCreatedAt,
  sameSender,
}) => {
  const formattedDate = dayjs(createdAt).calendar();
  const isLastMessage = !previousCreatedAt;

  const dateDiff = dayjs(createdAt).diff(dayjs(previousCreatedAt ?? createdAt));

  const displayAuthor =
    dayjs.duration(dateDiff).asMinutes() > 5 || isLastMessage || !sameSender;

  const displayDateHeader =
    dayjs.duration(dateDiff).asDays() > 1 || isLastMessage;

  return (
    <>
      <Box flexDirection='row' alignItems='center' px='$2'>
        <Box width={40} mr='$4' pt='$4'>
          {displayAuthor && (
            <Avatar>
              <AvatarFallbackText>{senderFullName}</AvatarFallbackText>
              {senderAvatarUrl && (
                <AvatarImage source={{ uri: senderAvatarUrl }} />
              )}
            </Avatar>
          )}
        </Box>
        <Box maxWidth='$5/6'>
          {displayAuthor && (
            <Box gap='$1' flexDirection='row' pt='$4'>
              <Text fontWeight='bold' color='$gray950'>
                {senderFullName}
              </Text>
              <Text color='$gray500' fontSize='$xs'>
                {formattedDate}
              </Text>
            </Box>
          )}
          <Text>{content}</Text>
        </Box>
      </Box>
      {displayDateHeader && <DividerWithDate date={formattedDate} />}
    </>
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
    <Box flexDirection='row' alignItems='center' mx='$2'>
      <Divider flex={1} marginRight='$1' />
      <Text fontSize='$sm'>{date}</Text>
      <Divider flex={1} marginLeft='$1' />
    </Box>
  );
};

export default Message;
