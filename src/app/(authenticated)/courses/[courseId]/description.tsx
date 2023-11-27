import Lecturer from '@/components/course/Lecturer';
import Header from '@/components/navigation/Header';
import { useCourseDescriptionQuery } from '@/services/courses';
import { useCourseMembership } from '@/services/membership';
import {
  Box,
  Button,
  ButtonSpinner,
  ButtonText,
  Divider,
  Heading,
  ScrollView,
  Spinner,
  Text,
} from '@gluestack-ui/themed';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';

/**
 * Description of the course, here you can signup if you are not signed up for the course yet
 */
const CourseDescriptionScreen = () => {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { data: courseDescription, isLoading } = useCourseDescriptionQuery(courseId);
  const { signUp, isSigningUp } = useCourseMembership(courseId);
  const { t } = useTranslation();
  const router = useRouter();
  const qc = useQueryClient();

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
        back={`/courses/${courseId}/`}
      />

      {isLoading ? (
        <Box flex={1} alignItems='center' justifyContent='center'>
          <Spinner size="large" />
        </Box>
      ) : (
        <ScrollView p='$3' flex={1}>
          <Heading>
            {courseDescription?.course_code} {courseDescription?.name}
          </Heading>

          <Heading size='sm'>
            {t('FEATURES.COURSES.COURSE_DESCRIPTION')}
          </Heading>

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
              <Lecturer
                name={lecturer.name}
                email={lecturer.email}
                avatarUrl={lecturer.avatar_url}
                onPress={() => {
                  router.push(`/messages/${lecturer.user_id}`);
                }}
              />
            )}
          />

          <Box h='$5' />
        </ScrollView>
      )}

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

export default CourseDescriptionScreen;
