import Header from '@/components/navigation/Header';
import { Box, Text } from '@gluestack-ui/themed';

const enum CourseRole {
  STUDENT = 'STUDENT',
  ASSISTANT = 'ASSISTANT',
  LECTURER = 'LECTURER',
}

// TODO: Replace these with data loaded from backend (from courses props?)
const course = {
  id: 'temp',
  courseCode: 'IDATA2503',
  name: 'Mobile Applications',
  description: 'Description',
};

/**
 * Description of the course, here you can signup if you are not signed up for the course yet
 */
const CourseDescriptionScreen = () => {
  return (
    <>
      <Header title='COURSE_CODE' />
      <Text>Courses</Text>
      <Box display='flex' flexDirection='row'>
        <Text>{course.courseCode}</Text>
        <Text>{course.name}</Text>
      </Box>
      <Text>{course.description}</Text>
    </>
  );
};

export default CourseDescriptionScreen;
