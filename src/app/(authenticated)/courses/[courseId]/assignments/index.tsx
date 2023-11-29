import CourseAssignmentCard from '@/components/course/CourseAssignmentCard';
import Header from '@/components/navigation/Header';
import EmptyState from '@/components/utils/EmptyState';
import { useCourseAssignmentsQuery } from '@/services/assignments';
import { useCourseQuery } from '@/services/courses';
import { Box, Divider, Spinner } from '@gluestack-ui/themed';
import { router, useLocalSearchParams } from 'expo-router';
import { ClipboardListIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';

const AssignmentsScreen = () => {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { data: course } = useCourseQuery(courseId);
  const { t } = useTranslation();
  const { data: assignments, isLoading } = useCourseAssignmentsQuery({
    courseId: courseId,
    ascending: true,
  });

  return (
    <>
      <Header
        context={course?.course_code}
        title={t('GENERAL.ASSIGNMENTS')}
        back={`/courses/${courseId}`}
      />

      {isLoading ? (
        <Box flex={1} alignItems='center' justifyContent='center'>
          <Spinner size='large' />
        </Box>
      ) : (
        <Box px='$4' pt='$4'>
          <FlatList
            data={assignments}
            ItemSeparatorComponent={() => <Divider my='$3' />}
            ListEmptyComponent={() => (
              <EmptyState
                description={t('FEATURES.ASSIGNMENT.NO_ASSIGNMENTS')}
                icon={ClipboardListIcon}
              />
            )}
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
      )}
    </>
  );
};

export default AssignmentsScreen;
