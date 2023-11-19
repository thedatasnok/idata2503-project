import Header from '@/components/navigation/Header';
import { useCourseDescription, useCourseMembership } from '@/services/courses';
import {
  Box,
  Button,
  ButtonSpinner,
  ButtonText,
  Divider,
  Heading,
  Icon,
  ScrollView,
  Text,
} from '@gluestack-ui/themed';
import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';

/**
 * Description of the course, here you can signup if you are not signed up for the course yet
 */
const CourseDescriptionScreen = () => {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { data: courseDescription } = useCourseDescription(courseId);
  const { signUp, isSigningUp } = useCourseMembership(courseId);
  const { t } = useTranslation();
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      await signUp();
      router.replace(`/courses/${courseId}/`);
    } catch (error) {
      console.error('SignUp error: ', error);
    }
  };

  const canSignUp =
    courseDescription &&
    dayjs(courseDescription.starts_at).isBefore() &&
    !courseDescription.enrolled;

  return (
    <>
      <Header
        context={courseDescription?.course_code}
        title={t('FEATURES.COURSES.COURSE_DESCRIPTION')}
        back
      />

      <ScrollView p='$3' flex={1}>
        <Heading>
          {courseDescription?.course_code} {courseDescription?.name}
        </Heading>

        <Heading size='sm'>{t('FEATURES.COURSES.COURSE_DESCRIPTION')}</Heading>

        <Text>{courseDescription?.description}</Text>

        <Heading size='sm' mt='$2'>
          {t('GENERAL.LECTURERS')}
        </Heading>

        <FlatList
          data={courseDescription?.staff}
          scrollEnabled={false}
          keyExtractor={(i) => i.user_id}
          ItemSeparatorComponent={() => <Divider />}
          ListEmptyComponent={() => (
            <Text color='$gray600'>
              {t('FEATURES.COURSES.NO_LECTURERS_ASSIGNED')}
            </Text>
          )}
          renderItem={({ item: lecturer }) => (
            <Lecturer name={lecturer.name} email={lecturer.email} />
          )}
        />

        <Box h='$4' />
      </ScrollView>

      {canSignUp && (
        <Button
          mx='$3'
          mb='$3'
          bg='$primary400'
          disabled={isSigningUp}
          onPress={handleSignUp}
        >
          {isSigningUp && <ButtonSpinner />}
          <ButtonText>{t('FEATURES.COURSES.SIGN_UP')}</ButtonText>
        </Button>
      )}
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
