import { AssignmentEvaluation } from '@/services/courses';
import { getToken } from '@/theme';
import { AssigmentStatus, getAssignmentStatus } from '@/util/assignmentStatus';
import { Box, Text } from '@gluestack-ui/themed';

interface GradePillProps {
  submittedAt?: string;
  evaluation?: AssignmentEvaluation;
}

const GradePill: React.FC<GradePillProps> = ({ submittedAt, evaluation }) => {
  const status = getAssignmentStatus(submittedAt, evaluation);
  let pillTextColor = getToken('colors', 'gray800'); //Default color
  let pillBg = getToken('colors', 'gray100'); //Default bg
  let borderColor = getToken('colors', 'gray700');
  let textContent = '-- / --';

  switch (status) {
    case AssigmentStatus.GRADED_PASSED:
      pillTextColor = getToken('colors', 'success800');
      borderColor = getToken('colors', 'success700');
      pillBg = getToken('colors', 'success100');
      textContent = `${evaluation?.grade} / ${evaluation?.maxGrade}`;
      break;
    case AssigmentStatus.GRADED_NOT_PASSED:
      pillTextColor = getToken('colors', 'error800');
      borderColor = getToken('colors', 'error700');
      pillBg = getToken('colors', 'error100');
      textContent = `${evaluation?.grade} / ${evaluation?.maxGrade}`;
      break;
  }

  return (
    <Box
      borderWidth='$1'
      bg={pillBg}
      borderColor={borderColor}
      rounded='$full'
      px='$2'
      py='$1'
    >
      <Text color={pillTextColor} fontSize='$xl' fontWeight='$medium'>
        {textContent}
      </Text>
    </Box>
  );
};

export default GradePill;
