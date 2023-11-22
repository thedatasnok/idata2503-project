import Header from '@/components/navigation/Header';
import { useCreateCourseAnnouncement } from '@/services/announcements';
import { useCourse } from '@/services/courses';
import {
  Box,
  Button,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  ScrollView,
  VStack,
} from '@gluestack-ui/themed';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const announcementValidationSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
});

type CreateAnnouncementForm = z.infer<typeof announcementValidationSchema>;

const CreateAnnouncementScreen = () => {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { data: course } = useCourse(courseId);
  const { mutateAsync: createAnnouncement } = useCreateCourseAnnouncement(courseId);
  const router = useRouter();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAnnouncementForm>({
    resolver: zodResolver(announcementValidationSchema),
  });

  const onSubmit = async (data: CreateAnnouncementForm) => {
    try {
      await createAnnouncement(data);
      router.back();
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  return (
    <>
      <Header
        context={course?.course_code}
        title={t('FEATURES.ANNOUNCEMENTS.NEW_ANNOUNCEMENT')}
        back={`/courses/${courseId}/announcements`}
      />

      <ScrollView>
        <Box display='flex' flexDirection='column' p='$4' flex={1}>
          <VStack>
            <FormControl isInvalid={'title' in errors}>
              <FormControlLabel>
                <FormControlLabelText color='$gray950'>
                  {t('FEATURES.ANNOUNCEMENTS.TITLE')}
                </FormControlLabelText>
              </FormControlLabel>

              <Controller
                control={control}
                name='title'
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      onChangeText={(val) => onChange(val)}
                      value={value}
                    />
                  </Input>
                )}
              />

              <FormControlError>
                <FormControlErrorText>
                  {errors.title?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <FormControl isInvalid={'content' in errors}>
              <FormControlLabelText color='$gray950' pt='$2'>
                {t('FEATURES.ANNOUNCEMENTS.CONTENT')}
              </FormControlLabelText>

              <Controller
                control={control}
                name='content'
                render={({ field: { onChange, value } }) => (
                  <Input h='auto'>
                    <InputField
                      onChangeText={(val) => onChange(val)}
                      value={value}
                      multiline
                      py='$1.5'
                      textAlignVertical='top'
                      numberOfLines={10}
                    />
                  </Input>
                )}
              />

              <FormControlError>
                <FormControlErrorText>
                  {errors.content?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <Box pt='$5' alignItems='center'>
              <Button w='100%' onPress={handleSubmit(onSubmit)}>
                <ButtonText>
                  {t('FEATURES.ANNOUNCEMENTS.CREATE_ANNOUNCEMENT')}
                </ButtonText>
              </Button>
            </Box>
          </VStack>
        </Box>
      </ScrollView>
    </>
  );
};

export default CreateAnnouncementScreen;
