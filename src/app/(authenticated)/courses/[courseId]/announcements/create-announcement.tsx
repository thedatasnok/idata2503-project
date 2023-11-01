import Header from '@/components/navigation/Header';
import { useAnnouncements, useCourse } from '@/services/courses';
import {
  Box,
  Pressable,
  Text,
  Icon,
  Button,
  styled,
} from '@gluestack-ui/themed';
import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList } from 'react-native';
import { Dot, PlusCircle } from 'lucide-react-native';

const CreateAnnouncementScreen = () => {
  const { courseId } = useLocalSearchParams();
  const { data: course } = useCourse(courseId as string);
  const router = useRouter();

  const createAnnouncement = () => {
    // TODO: add announcement to database, and go back to announcements screen
    router.back();
    return;
  };

  return (
    <>
      <Header context={course?.course_code} title='Create Announcement' back />

      <Text>Create Announcement Screen</Text>
    </>
  );
};

export default CreateAnnouncementScreen;
