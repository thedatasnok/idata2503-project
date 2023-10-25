import Header from '@/components/navigation/Header';
import { useCourse } from '@/services/courses';
import { Text } from '@gluestack-ui/themed';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { InfoIcon } from 'lucide-react-native';

const CourseScreen = () => {
  const router = useRouter();
  const { courseId } = useLocalSearchParams();
  const { data: course } = useCourse(courseId as string);

  return (
    <>
      <Header
        title={course?.course_code ?? 'Loading...'}
        rightIcon={InfoIcon}
        onRightIconPress={() => router.push(`/courses/${courseId}/description`)}
      />
      <Text>Course {courseId}</Text>

      {/* @ts-ignore this should have been a valid type */}
      <Link href={`/courses/${courseId}/announcements`}>
        <Text>Announcements</Text>
      </Link>
    </>
  );
};

export default CourseScreen;
