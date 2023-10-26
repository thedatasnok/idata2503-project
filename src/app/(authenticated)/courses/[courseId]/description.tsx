import Header from '@/components/navigation/Header';
import {
  CourseDescription,
  CourseMember,
  useCourseDescription,
} from '@/services/courses';
import { Box, Text, Icon } from '@gluestack-ui/themed';
import { useLocalSearchParams } from 'expo-router';
import { FlatList, ScrollView, StyleSheet } from 'react-native';
import { Mail } from 'lucide-react-native';

/**
 * Description of the course, here you can signup if you are not signed up for the course yet
 */
const CourseDescriptionScreen = () => {
  const { courseId } = useLocalSearchParams();
  const { data: courseDescription } = useCourseDescription(courseId as string);
  return (
    <>
      <Header
        context={courseDescription?.course_code}
        title='Course Description'
        back
      />
      {/* TODO: Inline styles no good? */}
      <ScrollView style={styles.screenContainer}>
        <Box display='flex' flexDirection='row'>
          <Text fontSize={20} fontWeight='bold' paddingTop={10}>
            {courseDescription?.course_code} {courseDescription?.name}
          </Text>
        </Box>
        <Text fontWeight='$bold'>Course Description</Text>
        <Text>{courseDescription?.description}</Text>

        <Text fontWeight='$bold'>Lecturers</Text>
        <FlatList
          data={courseDescription?.staff}
          scrollEnabled={false}
          keyExtractor={(i) => i.user_id}
          renderItem={({ item: lecturer, index: i }) => (
            <>
              <Lecturer
                key={lecturer.user_id}
                name={lecturer.name}
                email={lecturer.email}
              />
              {courseDescription?.staff[i + 1] && (
                <Box h='$px' w='$full' bgColor='$gray200' mt='$2' />
              )}
            </>
          )}
        />
      </ScrollView>
    </>
  );
};

interface LecturerProps {
  name: string;
  email: string;
}

const Lecturer: React.FC<LecturerProps> = ({ name, email }) => {
  return (
    <>
      <Box
        display='flex'
        flexDirection='row'
        alignItems='center'
        px='$1'
        gap='$1'
        my='$1'
      >
        <Box
          flex={1}
          gap={-4}
          display='flex'
          flexDirection='row'
          alignItems='center'
        >
          <Box display='flex' flexDirection='column' flexGrow={1}>
            <Text color='$gray600' fontWeight='$semibold' fontSize='$md'>
              {name}
            </Text>
            <Text fontSize='$xs'>{email}</Text>
          </Box>
        </Box>
        <Icon as={Mail} />
      </Box>
    </>
  );
};

export default CourseDescriptionScreen;

const styles = StyleSheet.create({
  screenContainer: {
    paddingHorizontal: 12,
  },
});
