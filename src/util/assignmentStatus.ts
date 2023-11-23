import { AssignmentEvaluation } from '@/services/assignments';

export const enum AssignmentStatus {
  OPEN = 'OPEN',
  NOT_GRADED = 'NOT_GRADED',
  GRADED_NOT_PASSED = 'GRADED_NOT_PASSED',
  GRADED_PASSED = 'GRADED_PASSED',
}

/**
 * Finds the status of an assignment.
 *
 * @param submittedAt the date of submission
 * @param evaluation the evaluation of the assignment
 *
 * @returns the status of the assignment
 */
export const getAssignmentStatus = (
  submittedAt?: string,
  evaluation?: AssignmentEvaluation
) => {
  if (evaluation == null && !submittedAt) return AssignmentStatus.OPEN;
  if (!evaluation?.grade) return AssignmentStatus.NOT_GRADED;
  if (evaluation?.grade < evaluation?.requiredGrade)
    return AssignmentStatus.GRADED_NOT_PASSED;
  return AssignmentStatus.GRADED_PASSED;
};
