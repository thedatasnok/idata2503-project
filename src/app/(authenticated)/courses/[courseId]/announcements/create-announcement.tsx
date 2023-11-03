import Header from '@/components/navigation/Header';
import {
  useAnnouncements,
  useCourse,
  useCourseMembership,
  useCreateAnnouncement,
  Announcement,
} from '@/services/courses';
import {
  Box,
  Button,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  Input,
  InputField,
  ScrollView,
  VStack,
} from '@gluestack-ui/themed';
import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const announcementValidationSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
});

type CreateAnnouncementForm = z.infer<typeof announcementValidationSchema>;

const CreateAnnouncementScreen = () => {
  const { courseId } = useLocalSearchParams();
  const { data: course } = useCourse(courseId as string);
  const { data: memberShip } = useCourseMembership(courseId as string);
  const createAnnouncement = useCreateAnnouncement();
  const router = useRouter();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateAnnouncementForm>({
    resolver: zodResolver(announcementValidationSchema),
  });

  const onSubmit = async (data: CreateAnnouncementForm) => {
    const announcement: Announcement = {
      course_id: courseId as string,
      created_by_member_id: memberShip?.course_member_id,
      title: data.title,
      content: data.content,
    };

    try {
      createAnnouncement.mutateAsync(announcement);
      console.log('announcement created successfully: ', data);
      // TODO: go back?
      router.back();
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  return (
    <>
      <Header context={course?.course_code} title='Create Announcement' back />

      <ScrollView>
        <Box display='flex' flexDirection='column' p='$4' flex={1}>
          {/* <Heading pb='$2'>{t('FEATURES.SETTINGS.USER_PROFILE')}</Heading> */}
          <Heading pb='$2'>Create Announcement</Heading>

          <VStack>
            <FormControl isInvalid={'title' in errors}>
              <FormControlLabel>
                <FormControlLabelText color='$gray950'>
                  {/* {t('FEATURES.SETTINGS.FULL_NAME')} */}
                  Title
                </FormControlLabelText>
              </FormControlLabel>

              <Controller
                control={control}
                name='title'
                render={({ field: { onChange, value } }) => (
                  <Input
                    borderColor='$gray400'
                    borderWidth='$1'
                    borderRadius='$sm'
                    width='100%'
                    p='$1.5'
                    h='auto'
                  >
                    <InputField
                      onChangeText={(val) => onChange(val)}
                      value={value}
                      multiline
                      textAlignVertical='top'
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
                {/* {t('FEATURES.SETTINGS.content')} */}
                Content
              </FormControlLabelText>

              <Controller
                control={control}
                name='content'
                render={({ field: { onChange, value } }) => (
                  <Input
                    borderColor='$gray400'
                    borderWidth='$1'
                    borderRadius='$sm'
                    width='100%'
                    p='$1.5'
                    h='auto'
                  >
                    <InputField
                      onChangeText={(val) => onChange(val)}
                      value={value}
                      multiline
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

            <Box pt='$5' flex={1}>
              <Button onPress={handleSubmit(onSubmit)}>
                <ButtonText>
                  {/* {t('FEATURES.SETTINGS.UPDATE_PROFILE')} */}
                  Create announcement
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
