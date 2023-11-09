import Header from '@/components/navigation/Header';
import { useCourseDescription, useCourseSignUp } from '@/services/courses';
import {
  Box,
  Button,
  ButtonText,
  Divider,
  Icon,
  ScrollView,
  Text,
} from '@gluestack-ui/themed';
import { useLocalSearchParams } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { FlatList } from 'react-native';

/**
 * Description of the course, here you can signup if you are not signed up for the course yet
 */
const CourseDescriptionScreen = () => {
  const { courseId } = useLocalSearchParams();
  const { data: courseDescription } = useCourseDescription(courseId as string);
  const courseSignUp = useCourseSignUp();

  // TODO: Havent tested this function yet
  const signUp = async () => {
    try {
      await courseSignUp.mutateAsync(courseId as string);
    } catch (error) {
      console.error('SignUp error: ', error);
    }
  };

  return (
    <>
      <Header
        context={courseDescription?.course_code}
        title='Course Description'
        back
      />
      <ScrollView px={12}>
        <Box display='flex' flexDirection='row'>
          <Text fontSize='$xl' fontWeight='bold' pt={'$3'}>
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
          ItemSeparatorComponent={() => <Divider />}
          renderItem={({ item: lecturer }) => (
            <Lecturer name={lecturer.name} email={lecturer.email} />
          )}
        />
        {/* TODO: remember to set to !courseDescription?.enrolled */}
        {!courseDescription?.enrolled && (
          <Box py='$5' px={'$20'}>
            <Button bg='$primary400' onPress={() => signUp()}>
              <ButtonText>Sign Up</ButtonText>
            </Button>
          </Box>
        )}
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
    <Box
      display='flex'
      flexDirection='row'
      alignItems='center'
      px='$1'
      gap='$1'
      my='$1'
      py='$1'
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
  );
};

export default CourseDescriptionScreen;
