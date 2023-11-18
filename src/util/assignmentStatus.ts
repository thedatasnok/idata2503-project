import { AssignmentEvaluation } from '@/services/courses';

export const enum AssigmentStatus {
  OPEN,
  NOT_GRADED,
  GRADED_NOT_PASSED,
  GRADED_PASSED,
}

export const getAssignmentStatus = (
  submittedAt?: string,
  evaluation?: AssignmentEvaluation
) => {
  if (evaluation == null && !submittedAt) return AssigmentStatus.OPEN;
  if (!evaluation?.grade) return AssigmentStatus.NOT_GRADED;
  if (evaluation?.grade < evaluation?.requiredGrade)
    return AssigmentStatus.GRADED_NOT_PASSED;
  return AssigmentStatus.GRADED_PASSED;
};