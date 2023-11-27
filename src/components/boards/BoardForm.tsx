import { useUpsertCourseBoardMutation } from '@/services/courses';
import {
  Button,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  VStack,
} from '@gluestack-ui/themed';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const boardValidationSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, { message: 'name is required' }),
  description: z.string().min(1, { message: 'description is required' }),
});

type BoardFormData = z.infer<typeof boardValidationSchema>;

type BoardFormProps = {
  courseId: string;
  boardId?: string;
  boardName?: string;
  boardDescription?: string;
  onSuccess: () => void;
};

const BoardForm: React.FC<BoardFormProps> = ({
  courseId,
  boardId,
  boardName,
  boardDescription,
  onSuccess,
}) => {
  const { mutateAsync: upsertBoard } = useUpsertCourseBoardMutation(courseId);
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<BoardFormData>({
    resolver: zodResolver(boardValidationSchema),
    defaultValues: {
      id: boardId,
      name: boardName ?? '',
      description: boardDescription ?? '',
    },
  });

  const onSubmit = async (data: BoardFormData) => {
    if (data.name === boardName && data.description === boardDescription) {
      console.log('No changes made.');
      return;
    }

    try {
      await upsertBoard(data);
      onSuccess();
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  return (
    <VStack>
      <FormControl isInvalid={'name' in errors}>
        <FormControlLabel>
          <FormControlLabelText color='$gray950'>
            {t('FEATURES.COURSE_BOARDS.BOARD_NAME')}
          </FormControlLabelText>
        </FormControlLabel>

        <Controller
          control={control}
          name='name'
          render={({ field: { onChange, value } }) => (
            <Input>
              <InputField onChangeText={(val) => onChange(val)} value={value} />
            </Input>
          )}
        />

        <FormControlError>
          <FormControlErrorText>{errors.name?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl isInvalid={'description' in errors}>
        <FormControlLabelText color='$gray950' pt='$2'>
          {t('FEATURES.COURSE_BOARDS.BOARD_DESCRIPTION')}
        </FormControlLabelText>

        <Controller
          control={control}
          name='description'
          render={({ field: { onChange, value } }) => (
            <Input h='auto'>
              <InputField
                onChangeText={(val) => onChange(val)}
                value={value}
                multiline
                py='$1.5'
                textAlignVertical='top'
                numberOfLines={3}
              />
            </Input>
          )}
        />

        <FormControlError>
          <FormControlErrorText>
            {errors.description?.message}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      <Button mt='$4' onPress={handleSubmit(onSubmit)} isDisabled={!isDirty}>
        <ButtonText>
          {boardId
            ? t('FEATURES.COURSE_BOARDS.UPDATE_BOARD')
            : t('FEATURES.COURSE_BOARDS.CREATE_BOARD')}
        </ButtonText>
      </Button>
    </VStack>
  );
};

export default BoardForm;
