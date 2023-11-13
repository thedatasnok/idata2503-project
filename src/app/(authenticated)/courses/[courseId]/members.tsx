import Header from '@/components/navigation/Header';
import { useCourse } from '@/services/courses';
import { Text } from '@gluestack-ui/themed';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

const CourseMembersScreen = () => {
  const { courseId } = useLocalSearchParams();
  const { data: course } = useCourse(courseId as string);
  const { t } = useTranslation();

  return (
    <>
      <Header back context={course?.course_code} title={t('GENERAL.MEMBERS')} />

      <Text>TODO</Text>
    </>
  );
};

export default CourseMembersScreen;
