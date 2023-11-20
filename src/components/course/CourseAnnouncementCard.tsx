import { Box, Divider, Heading, Pressable, Text } from '@gluestack-ui/themed';
import dayjs from 'dayjs';

interface CourseAnnouncementCardProps {
  courseCode?: string;
  title: string;
  content: string;
  createdAt: string;
  author: string;
  onPress: () => void;
}

const CourseAnnouncementCard: React.FC<CourseAnnouncementCardProps> = ({
  courseCode,
  title,
  content,
  createdAt,
  author,
  onPress,
}) => {
  const formattedDate = dayjs(createdAt).calendar();

  return (
    <Pressable
      borderWidth='$1'
      borderColor='$gray200'
      backgroundColor='$gray50'
      mr='$2'
      p='$2'
      width='$72'
      height={courseCode ? '$40' : '$32'}
      rounded='$md'
      onPress={onPress}
    >
      {courseCode && (
        <>
          <Heading numberOfLines={1}>{courseCode}</Heading>
          <Divider />
        </>
      )}

      <Heading numberOfLines={1}>{title}</Heading>
      <Box flex={1} justifyContent='space-between'>
        <Text numberOfLines={2} color='$gray950'>
          {content}
        </Text>
        <Text color='$gray950' numberOfLines={1}>
          {formattedDate} | {author}
        </Text>
      </Box>
    </Pressable>
  );
};

export default CourseAnnouncementCard;
