import CourseAnnouncementCard from '@/components/course/CourseAnnouncementCard';
import CourseAssignmentCard from '@/components/course/CourseAssignmentCard';
import Header from '@/components/navigation/Header';
import { useProfile } from '@/services/auth';
import {
  useAllAnnouncements,
  useAllAssignments,
  useCourses,
} from '@/services/courses';
import {
  Box,
  Divider,
  Heading,
  Icon,
  Text,
  ScrollView,
  Spinner,
} from '@gluestack-ui/themed';
import { router } from 'expo-router';
import { t } from 'i18next';
import { ClipboardIcon, Megaphone } from 'lucide-react-native';
import React from 'react';
import { FlatList } from 'react-native';

const HomeScreen = () => {
  const { data: announcements, isLoading: isLoadingAnnouncements } =
    useAllAnnouncements();
  const { data: courses, isLoading: isLoadingCourses } = useCourses({
    enrolled: true,
  });
  const { data: user } = useProfile();
  const {
    data: assignmentsSortedByDueAt,
    isLoading: isLoadingAssignmentsDueAt,
  } = useAllAssignments(true, 'due_at');

  const {
    data: assignmentsSortedBySubmittedAt,
    isLoading: isLoadingAssignmentsSubmittedAt,
  } = useAllAssignments(true, 'submitted_at');

  const getCourseNameById = (courseId: any) => {
    return (
      courses?.find((course) => course.course_id === courseId)?.course_code ??
      'Unknown Course'
    );
  };

  const upcomingAssignments = assignmentsSortedByDueAt?.filter(
    (assignment) => assignment.submitted_at === null
  );

  const completedAssignments = assignmentsSortedBySubmittedAt?.filter(
    (assignment) => assignment.submitted_at !== null
  );

  const isLoading =
    isLoadingAnnouncements ||
    isLoadingCourses ||
    isLoadingAssignmentsDueAt ||
    isLoadingAssignmentsSubmittedAt;

  if (isLoading) {
    return (
      <Box flex={1} alignItems='center' justifyContent='center'>
        <Spinner size={48} />
      </Box>
    );
  }

  return (
    <ScrollView>
      <Header title={t('NAVIGATION.HOME')} />
      <Box p='$2'>
        <Box
          flexDirection='row'
          alignItems='center'
          justifyContent='space-between'
        >
          <Heading>
            {t('GENERAL.WELCOME')} {user?.full_name}
          </Heading>
        </Box>

        <Divider mb='$2' />
        <Heading fontSize='$md'>{t('GENERAL.ANNOUNCEMENTS')}</Heading>
        {announcements && announcements.length > 0 ? (
          <FlatList
            horizontal={true}
            data={announcements?.slice(0, 3)}
            keyExtractor={(item) => item.announcement_id}
            renderItem={({ item }) => (
              <CourseAnnouncementCard
                courseCode={getCourseNameById(item.fk_course_id)}
                title={item.title}
                content={item.content}
                createdAt={item.created_at}
                author={item.created_by_full_name}
                onPress={() => router.push(`/courses/${item.fk_course_id}/`)}
              />
            )}
          />
        ) : (
          <Box alignItems='center' justifyContent='center'>
            <Icon as={Megaphone} size='3xl' />
            <Text color='$gray950'>
              {t('FEATURES.COURSES.NO_ANNOUNCEMENTS_YET')}
            </Text>
          </Box>
        )}

        <Heading fontSize='$md' pt='$2'>
          {t('FEATURES.ASSIGNMENT.UPCOMING_ASSIGNMENTS')}
        </Heading>
        {upcomingAssignments && upcomingAssignments.length > 0 ? (
          <Box gap='$2' pt='$2'>
            {upcomingAssignments.slice(0, 4).map((assignment) => (
              <CourseAssignmentCard
                key={assignment.assignment_id}
                courseCode={getCourseNameById(assignment.fk_course_id)}
                title={assignment.name}
                evaluation={assignment.evaluation}
                dueDate={assignment.due_at}
                onPress={() =>
                  router.push(
                    `/courses/${assignment.fk_course_id}/assignments/${assignment.assignment_id}`
                  )
                }
              />
            ))}
          </Box>
        ) : (
          <Box alignItems='center' justifyContent='center'>
            <Icon as={ClipboardIcon} size='3xl' />
            <Text color='$gray950'>
              {t('FEATURES.ASSIGNMENT.NO_UPCOMING_ASSIGNMENTS')}
            </Text>
          </Box>
        )}

        <Heading fontSize='$md' pt='$2'>
          {t('FEATURES.ASSIGNMENT.RECENTLY_SUBMITTED_ASSIGNMENTS')}
        </Heading>
        {completedAssignments && completedAssignments.length > 0 ? (
          <Box gap='$2' pt='$2'>
            {completedAssignments.slice(0, 4).map((assignment) => (
              <CourseAssignmentCard
                key={assignment.assignment_id}
                courseCode={getCourseNameById(assignment.fk_course_id)}
                title={assignment.name}
                evaluation={assignment.evaluation}
                submittedAt={assignment.submitted_at}
                dueDate={assignment.due_at}
                onPress={() =>
                  router.push(
                    `/courses/${assignment.fk_course_id}/assignments/${assignment.assignment_id}`
                  )
                }
              />
            ))}
          </Box>
        ) : (
          <Box alignItems='center' justifyContent='center'>
            <Icon as={ClipboardIcon} size='3xl' />
            <Text color='$gray950'>
              {t('FEATURES.ASSIGNMENT.NO_RECENTLY_SUBMITTED_ASSIGNMENTS')}
            </Text>
          </Box>
        )}
      </Box>
    </ScrollView>
  );
};

export default HomeScreen;
