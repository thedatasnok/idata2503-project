import GradePill from '@/components/course/Grade/GradePill';
import Header from '@/components/navigation/Header';
import { useCourseAssignment } from '@/services/courses';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Divider,
  Heading,
  Icon,
  Pressable,
  ScrollView,
  Text,
} from '@gluestack-ui/themed';
import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeftIcon, ClockIcon } from 'lucide-react-native';

const AssignmentScreen = () => {
  const { courseId, id: _assignmentId } = useLocalSearchParams<{
    courseId: string;
    id: string;
  }>();
  const router = useRouter();
  const { data: assignment } = useCourseAssignment(_assignmentId);

  const onBack = () => {
    // @ts-ignore
    router.push(`/courses/${courseId}/assignments`);
  };

  return (
    <>
      <Header
        context='COURSE'
        title={assignment?.name || ''}
        leftIcon={ArrowLeftIcon}
        onLeftIconPress={onBack}
      />
      <ScrollView px='$3'>
        <Box display='flex' flexDirection='column'>
          <Text fontSize='$xl' fontWeight='bold' pt={'$3'}>
            {assignment?.name}
          </Text>
          <Box flexDirection='row' alignItems='center' gap='$1' pt='$1'>
            <Avatar size='xs'>
              <AvatarFallbackText>
                {assignment?.created_by.fullName}
              </AvatarFallbackText>
              {assignment?.created_by.avatarUrl && (
                <AvatarImage
                  source={{ uri: assignment?.created_by.avatarUrl }}
                />
              )}
            </Avatar>
            <Box gap='$1' flexDirection='row'>
              <Text fontSize='$xs'>{assignment?.created_by.fullName}</Text>
              <Text fontSize='$xs'>
                {dayjs(assignment?.created_at).format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            </Box>
          </Box>
        </Box>

        <Divider mt='$2' />

        {assignment?.evaluation && (
          <Box flexDirection='column'>
            <Heading pt='$2' fontSize='$xl'>
              Assignment Graded:
            </Heading>
            <Box
              flexDirection='row'
              alignItems='center'
              justifyContent='space-between'
            >
              <Box flexDirection='row' alignItems='center' pt='$1'>
                <Avatar size='sm'>
                  <AvatarFallbackText>
                    {assignment?.evaluator.fullName}
                  </AvatarFallbackText>
                  {assignment?.evaluator.avatarUrl && (
                    <AvatarImage
                      source={{ uri: assignment?.evaluator.avatarUrl }}
                    />
                  )}
                </Avatar>
                <Text fontSize='$md' fontWeight='bold' ml='$2'>
                  {assignment.evaluator?.fullName}
                </Text>
              </Box>
              <GradePill
                evaluation={assignment?.evaluation}
                submittedAt={assignment?.created_at}
              />
            </Box>

            <Text mt='$2'>{assignment?.evaluation?.comment}</Text>
          </Box>
        )}

        {assignment?.submitted_at && (
          <>
            <Heading pt='$2' fontSize='$md'>
              Your Submission:
            </Heading>
            <Pressable
              flexDirection='row'
              justifyContent='space-between'
              alignItems='center'
              pl='$3'
              py='$2'
              backgroundColor='$gray100'
              rounded='$full'
              //onPress={} to the submission
            >
              <Box flexDirection='column'>
                <>
                  {assignment?.submitted_at && !assignment?.evaluation && (
                    <Box flexDirection='row' gap='$1' alignItems='center'>
                      <Icon as={ClockIcon} />
                      <Text>Currently waiting for grading</Text>
                    </Box>
                  )}

                  <Text>{assignment.name}</Text>
                </>
              </Box>
              <GradePill
                evaluation={assignment?.evaluation}
                submittedAt={assignment?.created_at}
              />
            </Pressable>
          </>
        )}

        {assignment?.submitted_at && <Divider mt='$2' />}

        <Heading fontSize='$md'>Assignment:</Heading>
        <Text fontSize='$md'>{assignment?.description}</Text>
      </ScrollView>
    </>
  );
};

export default AssignmentScreen;
