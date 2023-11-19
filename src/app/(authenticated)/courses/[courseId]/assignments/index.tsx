import CourseAssignmentCard from '@/components/course/CourseAssignmentCard';
import Header from '@/components/navigation/Header';
import { useCourse, useCourseAssignments } from '@/services/courses';
import { Box, Divider } from '@gluestack-ui/themed';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeftIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';

const AssignmentsScreen = () => {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { data: course } = useCourse(courseId);
  const { t } = useTranslation();
  const { data: assignments } = useCourseAssignments(courseId);

  const onBack = () => {
    router.push(`/courses/${courseId}/`);
  };

  return (
    <>
      <Header
        context={course?.course_code}
        title={t('GENERAL.ASSIGNMENTS')}
        leftIcon={ArrowLeftIcon}
        onLeftIconPress={onBack}
      />

      <Box px='$4' pt='$4'>
        <FlatList
          data={assignments}
          ItemSeparatorComponent={() => <Divider my='$3' />}
          renderItem={({ item: assignment }) => (
            <CourseAssignmentCard
              key={assignment.assignment_id}
              title={assignment.name}
              evaluation={assignment.evaluation}
              submittedAt={assignment.submitted_at}
              dueDate={assignment.due_at}
              onPress={() =>
                router.push(
                  `/courses/${courseId}/assignments/${assignment.assignment_id}`
                )
              }
            />
          )}
        />
      </Box>
    </>
  );
};

export default AssignmentsScreen;
