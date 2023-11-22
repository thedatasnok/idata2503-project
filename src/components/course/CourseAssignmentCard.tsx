import { IconType } from '@/icon';
import { AssignmentEvaluation } from '@/services/courses';
import { getToken } from '@/theme';
import { AssignmentStatus, getAssignmentStatus } from '@/util/assignmentStatus';
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
import CourseAssignmentGradePill from './CourseAssignmentGradePill';

const getAssignmentIcon = (status: AssignmentStatus): IconType => {
  switch (status) {
    case AssignmentStatus.OPEN:
      return ClockIcon;
    case AssignmentStatus.NOT_GRADED:
      return ClipboardListIcon;
    case AssignmentStatus.GRADED_NOT_PASSED:
      return XIcon;
    case AssignmentStatus.GRADED_PASSED:
      return CheckCircleIcon;
  }
};

const formatAssignmentStatus = (status: AssignmentStatus): string => {
  switch (status) {
    case AssignmentStatus.OPEN:
      return 'Open';
    case AssignmentStatus.NOT_GRADED:
      return 'Not graded yet';
    case AssignmentStatus.GRADED_NOT_PASSED:
      return 'Failed';
    case AssignmentStatus.GRADED_PASSED:
      return 'Passed';
    default:
      return 'Unknown Status';
  }
};

interface CourseAssignmentsProps {
  courseCode?: string;
  title: string;
  dueDate: string;
  submittedAt?: string;
  evaluation?: AssignmentEvaluation;
  onPress: () => void;
}

const CourseAssignmentCard: React.FC<CourseAssignmentsProps> = ({
  courseCode,
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
    case AssignmentStatus.OPEN:
      if (dayjs(dueDate).diff(dayjs(), 'day') < 2) {
        color = getToken('colors', 'error500'); // Less than two days left
      }
      break;
    case AssignmentStatus.NOT_GRADED:
      break;
    case AssignmentStatus.GRADED_NOT_PASSED:
      color = getToken('colors', 'error600');
      break;
    case AssignmentStatus.GRADED_PASSED:
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
        {courseCode && (
          <Text color={color} fontSize='$lg' fontWeight='$bold'>
            {courseCode}
          </Text>
        )}
        <Text fontSize='$lg' fontWeight='$bold' numberOfLines={1} color={color}>
          {title}
        </Text>
        <Box flexDirection='row'>
          {!submittedAt && (
            <Text fontSize='$sm' color={color} numberOfLines={1}>
              {formattedDate} - {timeLeft}
            </Text>
          )}
        </Box>
        {submittedAt && (
          <Text fontSize='$sm' color={color} numberOfLines={1}>
            status: {formatAssignmentStatus(status)}
          </Text>
        )}
      </Box>
      {(submittedAt && (
        <CourseAssignmentGradePill
          submittedAt={submittedAt}
          evaluation={evaluation}
        />
      )) || <Icon as={ChevronRight} color={color} />}
    </Pressable>
  );
};

export default CourseAssignmentCard;
