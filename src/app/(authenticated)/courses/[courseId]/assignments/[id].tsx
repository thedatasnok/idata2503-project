import CourseAssignmentGradePill from '@/components/course/CourseAssignmentGradePill';
import Header from '@/components/navigation/Header';
import { useCourseAssignment } from '@/services/assignments';
import { useCourse } from '@/services/courses';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Divider,
  Heading,
  Icon,
  Pressable,
  ScrollView,
  Text,
} from '@gluestack-ui/themed';
import dayjs from 'dayjs';
import { useLocalSearchParams } from 'expo-router';
import { t } from 'i18next';
import { ClockIcon, FileIcon } from 'lucide-react-native';

const AssignmentScreen = () => {
  const { courseId, id: assignmentId } = useLocalSearchParams<{
    courseId: string;
    id: string;
  }>();
  const { data: course } = useCourse(courseId);
  const { data: assignment } = useCourseAssignment(assignmentId);

  return (
    <>
      <Header
        context={course?.course_code ?? ''}
        title={assignment?.name ?? ''}
        back={`/courses/${courseId}/assignments`}
      />

      <ScrollView px='$3'>
        <Box display='flex' flexDirection='column'>
          <Text fontSize='$xl' fontWeight='bold' pt={'$3'}>
            {assignment?.name}
          </Text>
          <Box flexDirection='row' alignItems='center' gap='$1' pt='$1'>
            <Avatar size='xs'>
              <AvatarFallbackText>
                {assignment?.created_by.fullName}
              </AvatarFallbackText>
              {assignment?.created_by.avatarUrl && (
                <AvatarImage
                  source={{ uri: assignment?.created_by.avatarUrl }}
                />
              )}
            </Avatar>
            <Box gap='$1' flexDirection='row'>
              <Text fontSize='$xs'>{assignment?.created_by.fullName}</Text>
              <Text fontSize='$xs'>
                {dayjs(assignment?.created_at).format('L LT')}
              </Text>
            </Box>
          </Box>
        </Box>

        <Divider mt='$2' />

        {assignment?.evaluation && (
          <Box flexDirection='column'>
            <Heading pt='$2' fontSize='$xl'>
              {t('FEATURES.ASSIGNMENT.ASSIGNMENT_GRADED')}
            </Heading>
            <Box
              flexDirection='row'
              alignItems='center'
              justifyContent='space-between'
            >
              <Box flexDirection='row' alignItems='center' pt='$1'>
                <Avatar size='sm'>
                  <AvatarFallbackText>
                    {assignment?.evaluator.fullName}
                  </AvatarFallbackText>
                  {assignment?.evaluator.avatarUrl && (
                    <AvatarImage
                      source={{ uri: assignment?.evaluator.avatarUrl }}
                    />
                  )}
                </Avatar>
                <Text fontSize='$md' fontWeight='bold' ml='$2'>
                  {assignment.evaluator?.fullName}
                </Text>
              </Box>
              <CourseAssignmentGradePill
                evaluation={assignment?.evaluation}
                submittedAt={assignment?.created_at}
              />
            </Box>

            <Text mt='$2'>{assignment?.evaluation?.comment}</Text>
          </Box>
        )}

        {assignment?.submitted_at && (
          <>
            <Heading pt='$2' fontSize='$md'>
              {t('FEATURES.ASSIGNMENT.YOUR_SUBMISSION')}
            </Heading>

            <Pressable
              flexDirection='row'
              justifyContent='space-between'
              alignItems='center'
              px='$2'
              py='$2'
              backgroundColor='$gray100'
              borderColor='$gray300'
              borderWidth='$1'
              rounded='$md'
            >
              <Box flexDirection='column'>
                <Box flexDirection='row' gap='$1' alignItems='center'>
                  <Icon as={FileIcon} />
                  <Text fontWeight='$medium'>report.pdf</Text>
                </Box>
              </Box>
            </Pressable>
          </>
        )}

        {assignment?.submitted_at && <Divider mt='$2' />}

        <Heading fontSize='$md'>{t('FEATURES.ASSIGNMENT.ASSIGNMENT')}</Heading>
        <Text fontSize='$md'>{assignment?.description}</Text>
      </ScrollView>
    </>
  );
};

export default AssignmentScreen;
