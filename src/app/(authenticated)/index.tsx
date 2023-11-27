import CourseAnnouncementCard from '@/components/course/CourseAnnouncementCard';
import CourseAssignmentCard from '@/components/course/CourseAssignmentCard';
import Header from '@/components/navigation/Header';
import EmptyState from '@/components/utils/EmptyState';
import { useAllAnnouncements } from '@/services/announcements';
import { useAllAssignments } from '@/services/assignments';
import { useProfile } from '@/services/users';
import {
  Box,
  Divider,
  Heading,
  Icon,
  ScrollView,
  Spinner,
  Text,
} from '@gluestack-ui/themed';
import { router } from 'expo-router';
import { t } from 'i18next';
import {
  ClipboardListIcon,
  Megaphone,
  PalmtreeIcon,
} from 'lucide-react-native';
import React from 'react';
import { FlatList } from 'react-native';

const HomeScreen = () => {
  const { data: announcements, isLoading: isLoadingAnnouncements } =
    useAllAnnouncements({ limit: 4 });
  const { data: user } = useProfile();

  const {
    data: completedAssignments,
    isLoading: isLoadingCompletedAssignments,
  } = useAllAssignments({
    limit: 4,
    sortBy: 'submitted_at',
    ascending: true,
    submitted: true,
  });

  const { data: upcomingAssignments, isLoading: isLoadingUpcomingAssignments } =
    useAllAssignments({
      limit: 4,
      sortBy: 'due_at',
      ascending: true,
      submitted: false,
    });

  const isLoading =
    isLoadingAnnouncements ||
    isLoadingCompletedAssignments ||
    isLoadingUpcomingAssignments;

  return (
    <>
      <Header title={t('NAVIGATION.HOME')} />

      {isLoading ? (
        <Box flex={1} alignItems='center' justifyContent='center'>
          <Spinner size={48} />
        </Box>
      ) : (
        <ScrollView>
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
            <Heading fontSize='$md' mb='$0'>
              {t('FEATURES.ANNOUNCEMENTS.RECENT_ANNOUNCEMENTS')}{' '}
            </Heading>
            {announcements && announcements.length > 0 ? (
              <FlatList
                horizontal={true}
                data={announcements}
                keyExtractor={(item) => item.announcement_id}
                renderItem={({ item }) => (
                  <CourseAnnouncementCard
                    courseCode={item.course_code}
                    title={item.title}
                    content={item.content}
                    createdAt={item.created_at}
                    author={item.created_by_full_name}
                    onPress={() =>
                      router.push(`/courses/${item.fk_course_id}/`)
                    }
                  />
                )}
              />
            ) : (
              <EmptyState
                description={t('FEATURES.COURSES.NO_ANNOUNCEMENTS_YET')}
                icon={Megaphone}
              />
            )}

            <Heading fontSize='$md' pt='$2'>
              {t('FEATURES.ASSIGNMENT.UPCOMING_ASSIGNMENTS')}
            </Heading>
            {upcomingAssignments && upcomingAssignments.length > 0 ? (
              <Box gap='$2' pt='$2'>
                {upcomingAssignments.map((assignment) => (
                  <CourseAssignmentCard
                    key={assignment.assignment_id}
                    courseCode={assignment.course_code}
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
              <EmptyState
                description={t('FEATURES.ASSIGNMENT.NO_UPCOMING_ASSIGNMENTS')}
                icon={PalmtreeIcon}
              />
            )}

            <Heading fontSize='$md' pt='$2'>
              {t('FEATURES.ASSIGNMENT.RECENTLY_SUBMITTED_ASSIGNMENTS')}
            </Heading>
            {completedAssignments && completedAssignments.length > 0 ? (
              <Box gap='$2' pt='$2'>
                {completedAssignments.map((assignment) => (
                  <CourseAssignmentCard
                    key={assignment.assignment_id}
                    courseCode={assignment.course_code}
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
              <EmptyState
                description={t(
                  'FEATURES.ASSIGNMENT.NO_RECENTLY_SUBMITTED_ASSIGNMENTS'
                )}
                icon={ClipboardListIcon}
              />
            )}
          </Box>
        </ScrollView>
      )}
    </>
  );
};

export default HomeScreen;
