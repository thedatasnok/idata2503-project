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
  ScrollView
} from '@gluestack-ui/themed';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList } from 'react-native';

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

  const loading =
    isLoadingAnnouncements ||
    isLoadingCourses ||
    isLoadingAssignmentsDueAt ||
    isLoadingAssignmentsSubmittedAt;

  return (
    <ScrollView>
      <Header title='Home' />
      {loading ? (
        <Box flex={1} justifyContent='center' alignItems='center'>
          <ActivityIndicator size='large' />
        </Box>
      ) : (
        <Box p='$2'>
          <Box
            flexDirection='row'
            alignItems='center'
            justifyContent='space-between'
          >
            <Heading>Welcome {user?.full_name}</Heading>
          </Box>

          <Divider mb='$2' />
          <Heading fontSize='$md'>Announcements</Heading>
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

          <Heading fontSize='$md' pt='$2'>
            Upcoming assignments
          </Heading>
          <Box gap='$2' pt='$2'>
            {upcomingAssignments?.slice(0, 4).map((assignment) => (
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

          <Heading fontSize='$md' pt='$2'>
            Recent submitted assignments
          </Heading>
          <Box gap='$2' pt='$2'>
            {completedAssignments
              ?.reverse()
              .slice(0, 4)
              .map((assignment) => (
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

          
        </Box>
      )}
    </ScrollView>
  );
};

export default HomeScreen;
