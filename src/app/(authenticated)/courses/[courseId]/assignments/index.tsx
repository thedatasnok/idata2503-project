import Header from '@/components/navigation/Header';
import { useCourse } from '@/services/courses';
import { Text } from '@gluestack-ui/themed';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

const AssignmentsScreen = () => {
  const { courseId } = useLocalSearchParams();
  const { data: course } = useCourse(courseId as string);
  const { t } = useTranslation();

  return (
    <>
      <Header context={course?.course_code} title={t('GENERAL.ASSIGNMENTS')} />
      <Text>todo</Text>
    </>
  );
};
export default AssignmentsScreen;
