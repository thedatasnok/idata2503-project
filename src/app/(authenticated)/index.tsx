import React from 'react';
import CourseAnnouncementCard from '@/components/course/CourseAnnouncementCard';
import Header from '@/components/navigation/Header';
import { useAllAnnouncements, useCourses } from '@/services/courses';
import { FlatList, ActivityIndicator } from 'react-native';
import { Box, Divider, Heading, Spinner, Text } from '@gluestack-ui/themed';
import { router } from 'expo-router';
import { useProfile } from '@/services/auth';

const HomeScreen = () => {
  const { data: announcements, isLoading: isLoadingAnnouncements } =
    useAllAnnouncements();
  const { data: courses, isLoading: isLoadingCourses } = useCourses({
    enrolled: true,
  });
  const { data: user } = useProfile();

  /**
   * Function to get course code by course id
   */
  const getCourseNameById = (courseId: any) => {
    return (
      courses?.find((course) => course.course_id === courseId)?.course_code ||
      'Unknown Course'
    );
  };

  const loading = isLoadingAnnouncements || isLoadingCourses;

  return (
    <>
      <Header title='Home' />
      {loading ? (
        <Box flex={1} justifyContent='center'>
          <Spinner size='large' />
        </Box>
      ) : (
        <Box p='$2'>
          <Heading>Welcome {user?.full_name}</Heading>
          <Divider mb='$2' />
          <Heading>Announcements</Heading>
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
                onPress={() => {
                  router.push(`/courses/${item.fk_course_id}/`);
                }}
              />
            )}
          />
        </Box>
      )}
    </>
  );
};

export default HomeScreen;
