import Header from '@/components/navigation/Header';
import { useAnnouncement, useCourse } from '@/services/courses';
import { Box, ScrollView, Text } from '@gluestack-ui/themed';
import dayjs from 'dayjs';
import { useLocalSearchParams } from 'expo-router';

const AnnouncementScreen = () => {
  const { courseId, id: announcementId } = useLocalSearchParams();
  const { data: course } = useCourse(courseId as string);
  const { data: announcement } = useAnnouncement(announcementId as string);

  return (
    <>
      <Header context={course?.course_code} title='Announcement' back />

      <ScrollView px='$3'>
        <Box display='flex' flexDirection='column'>
          <Text fontSize='$xl' fontWeight='bold' pt={'$3'}>
            {announcement?.title}
          </Text>
          <Text fontSize='$xs'>
            {announcement?.created_by_full_name} |{' '}
            {dayjs(announcement?.created_at).format('L LT')}
          </Text>
        </Box>
        <Box h='$px' w='$full' bgColor='$gray200' mt='$2' />
        <Text fontSize='$md'>{announcement?.content}</Text>
      </ScrollView>
    </>
  );
};

export default AnnouncementScreen;
