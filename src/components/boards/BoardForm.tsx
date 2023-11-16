import { useUpsertCourseBoard } from '@/services/courses';
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
  const upsertBoard = useUpsertCourseBoard(courseId);
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
      upsertBoard.mutateAsync(data);
      if (boardId) {
        console.log('announcement edited successfully: ', data);
      } else {
        console.log('announcement created successfully: ', data);
      }
      onSuccess();
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  return (
    <Box display='flex' flexDirection='column' flex={1}>
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
                <InputField
                  onChangeText={(val) => onChange(val)}
                  value={value}
                />
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

        {isDirty && (
          <Box pt='$5' alignItems='center'>
            <Button w='100%' onPress={handleSubmit(onSubmit)}>
              <ButtonText>
                {boardId
                  ? t('FEATURES.COURSE_BOARDS.UPDATE_BOARD')
                  : t('FEATURES.COURSE_BOARDS.CREATE_BOARD')}
              </ButtonText>
            </Button>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default BoardForm;
