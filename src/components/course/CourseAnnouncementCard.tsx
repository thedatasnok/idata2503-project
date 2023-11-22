import { Box, Heading, Pressable, Text } from '@gluestack-ui/themed';
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
      width='$72'
      borderTopLeftRadius={courseCode ? '$lg' : '$md'}
      borderTopRightRadius={courseCode ? '$lg' : '$md'}
      height={courseCode ? '$40' : '$32'}
      rounded='$md'
      onPress={onPress}
    >
      {courseCode && (
        <Box
          px='$2'
          backgroundColor='$gray700'
          borderColor='$gray200'
          borderBottomWidth='$1'
          borderTopLeftRadius='$lg'
          borderTopRightRadius='$lg'
        >
          <Heading fontSize='$lg' numberOfLines={1} color='$white'>
            {courseCode}
          </Heading>
        </Box>
      )}

      <Box p='$2' flex={1} justifyContent='space-between'>
        <Heading numberOfLines={1}>{title}</Heading>
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
