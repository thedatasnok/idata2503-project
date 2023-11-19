import { AssignmentEvaluation } from '@/services/courses';
import { AssignmentStatus, getAssignmentStatus } from '@/util/assignmentStatus';
import { styled } from '@gluestack-style/react';
import { Box, Text } from '@gluestack-ui/themed';
import React from 'react';

export interface CourseAssignmentGradePillProps {
  submittedAt?: string;
  evaluation?: AssignmentEvaluation;
}

const CourseAssignmentGradePill: React.FC<CourseAssignmentGradePillProps> = ({
  submittedAt,
  evaluation,
}) => {
  const status = getAssignmentStatus(submittedAt, evaluation);
  const receivedGrade = evaluation?.grade ?? '--';
  const maxPossibleGrade = evaluation?.maxGrade ?? '--';

  return (
    <PillContainer status={status}>
      <PillText status={status}>
        {receivedGrade} / {maxPossibleGrade}
      </PillText>
    </PillContainer>
  );
};

const PillContainer = styled(Box, {
  bg: '$gray100',
  borderColor: '$gray700',
  rounded: '$full',
  borderWidth: '$1',
  px: '$2',
  py: '$1',
  variants: {
    status: {
      [AssignmentStatus.OPEN]: {},
      [AssignmentStatus.NOT_GRADED]: {},
      [AssignmentStatus.GRADED_NOT_PASSED]: {
        bg: '$error100',
        borderColor: '$error700',
      },
      [AssignmentStatus.GRADED_PASSED]: {
        bg: '$success100',
        borderColor: '$success700',
      },
    },
  },
});

const PillText = styled(Text, {
  fontWeight: '$medium',
  variants: {
    status: {
      [AssignmentStatus.OPEN]: {},
      [AssignmentStatus.NOT_GRADED]: {},
      [AssignmentStatus.GRADED_NOT_PASSED]: {
        color: '$error800',
      },
      [AssignmentStatus.GRADED_PASSED]: {
        color: '$success800',
      },
    },
  },
});

export default CourseAssignmentGradePill;
