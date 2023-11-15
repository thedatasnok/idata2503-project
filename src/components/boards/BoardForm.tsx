import {
  useCourse,
  useCourseBoard,
  useCreateCourseBoard,
  useEditCourseBoard,
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
  Input,
  InputField,
  VStack,
} from '@gluestack-ui/themed';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const boardValidationSchema = z.object({
  name: z.string().min(1, { message: 'name is required' }),
  description: z.string().min(1, { message: 'description is required' }),
});

type BoardFormData = z.infer<typeof boardValidationSchema>;

type BoardFormProps =
  | {
      type: 'edit';
      /**
       * Board id of the board to edit
       */
      boardId: string;
    }
  | {
      type: 'create';
      boardId?: never; // Ensure boardId is undefined when type is 'create'
    };

const BoardForm: React.FC<BoardFormProps> = ({ type, boardId }) => {
  const { courseId } = useLocalSearchParams();
  const { data: course } = useCourse(courseId as string);
  const { data: board } = useCourseBoard(type === 'edit' ? boardId : '');
  const createBoard = useCreateCourseBoard(
    type === 'create' ? (courseId as string) : ''
  );
  const editBoard = useEditCourseBoard(type === 'edit' ? boardId : '');
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BoardFormData>({
    resolver: zodResolver(boardValidationSchema),
    defaultValues: {
      name: type === 'edit' ? board?.name ?? '' : '', // Use fetched value or empty string
      description: type === 'edit' ? board?.description ?? '' : '', // Use fetched value or empty string
    },
  });

  const onSubmit = async (data: BoardFormData) => {
    if (type === 'edit') {
      if (
        data.name === board?.name &&
        data.description === board?.description
      ) {
        console.log('No changes made.');
        return;
      }

      try {
        editBoard.mutateAsync(data);
        console.log('announcement created successfully: ', data);
        // TODO: go back?
        router.back();
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    } else {
      try {
        createBoard.mutateAsync(data);
        console.log('announcement created successfully: ', data);
        // TODO: go back?
        router.back();
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    }
  };

  const onDelete = async () => {
    // TODO: delete
    return;
  };

  return (
    <Box display='flex' flexDirection='column' p='$4' flex={1}>
      <VStack>
        <FormControl isInvalid={'name' in errors}>
          <FormControlLabel>
            <FormControlLabelText color='$gray950'>Name</FormControlLabelText>
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
            Description
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

        <Box pt='$5' alignItems='center'>
          <Button w='100%' onPress={handleSubmit(onSubmit)}>
            <ButtonText>
              {type === 'edit' ? 'Save changes' : 'Create board'}
            </ButtonText>
          </Button>
          {type === 'edit' && (
            <Button bgColor='$error400' w='100%' onPress={onDelete}>
              <ButtonText>Delete</ButtonText>
            </Button>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default BoardForm;
