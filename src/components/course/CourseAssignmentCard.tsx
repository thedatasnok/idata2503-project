import { IconType } from '@/icon';
import { AssignmentEvaluation } from '@/services/courses';
import { getToken } from '@/theme';
import { AssigmentStatus, getAssignmentStatus } from '@/util/assignmentStatus';
import { Box, Icon, Pressable, Text } from '@gluestack-ui/themed';
import dayjs from 'dayjs';
import {
  CheckCircleIcon,
  ChevronRight,
  ClipboardListIcon,
  ClockIcon,
  XIcon,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import GradePill from './Grade/GradePill';

const getAssignmentIcon = (status: AssigmentStatus): IconType => {
  switch (status) {
    case AssigmentStatus.OPEN:
      return ClockIcon;
    case AssigmentStatus.NOT_GRADED:
      return ClipboardListIcon;
    case AssigmentStatus.GRADED_NOT_PASSED:
      return XIcon;
    case AssigmentStatus.GRADED_PASSED:
      return CheckCircleIcon;
  }
};

interface CourseAssignmentsProps {
  title: string;
  dueDate: string;
  submittedAt?: string;
  evaluation?: AssignmentEvaluation;
  onPress: () => void;
}

const CourseAssignmentCard: React.FC<CourseAssignmentsProps> = ({
  title,
  dueDate,
  submittedAt,
  evaluation,
  onPress,
}) => {
  const formattedDate = dayjs(dueDate).calendar();
  const [timeLeft, setTimeLeft] = useState(dayjs(dueDate).fromNow());
  const status = getAssignmentStatus(submittedAt, evaluation);

  const icon = getAssignmentIcon(status);
  let color = getToken('colors', 'gray950'); // Default color

  switch (status) {
    case AssigmentStatus.OPEN:
      if (dayjs(dueDate).diff(dayjs(), 'day') < 2) {
        color = getToken('colors', 'error500'); // Less than two days left
      }
      break;
    case AssigmentStatus.NOT_GRADED:
      break;
    case AssigmentStatus.GRADED_NOT_PASSED:
      color = getToken('colors', 'error600');
      break;
    case AssigmentStatus.GRADED_PASSED:
      color = getToken('colors', 'success600');
      break;
  }

  // Create an interval to update the time left every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(dayjs(dueDate).fromNow());
    }, 10000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [dueDate]);

  return (
    <Pressable
      rounded='$md'
      onPress={onPress}
      flexDirection='row'
      alignItems='center'
      justifyContent='space-between'
    >
      <Icon as={icon} color={color} mr='$3' size='xl' />
      <Box flex={1}>
        <Text fontSize='$lg' fontWeight='$bold' numberOfLines={1} color={color}>
          {title}
        </Text>
        <Box flexDirection='row'>
          <Text fontSize='$sm' color={color} numberOfLines={1}>
            {formattedDate} - {timeLeft}
          </Text>
        </Box>
      </Box>
      {(submittedAt && (
        <GradePill submittedAt={submittedAt} evaluation={evaluation} />
      )) || <Icon as={ChevronRight} color={color} />}
    </Pressable>
  );
};

export default CourseAssignmentCard;
