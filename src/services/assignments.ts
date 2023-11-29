import { useQuery } from '@tanstack/react-query';
import { CacheKey } from './cache';
import { supabase } from './supabase';
import { JsonUserProfile } from './users';

interface UseAllAssignmentsQueryParams {
  sortBy?: 'due_at' | 'submitted_at';
  submitted?: boolean;
  ascending?: boolean;
  limit?: number;
}

/**
 * Hook to fetch all assignments for all courses the user is enrolled in
 */
export const useAllAssignmentsQuery = (
  params: UseAllAssignmentsQueryParams
) => {
  const {
    sortBy = 'due_at',
    submitted = false,
    ascending = true,
    limit,
  } = params;

  return useQuery({
    queryKey: [CacheKey.ALL_ASSIGNMENTS, sortBy, ascending, limit],
    queryFn: async () => {
      let query = supabase
        .from('current_user_assignment_view')
        .select('*')
        .order(sortBy, { ascending });

      if (submitted) query = query.not('submitted_at', 'is', null);
      else query = query.filter('submitted_at', 'is', null);

      if (limit) query = query.limit(limit);

      const result = await query.throwOnError();

      return result.data as CourseAssignment[];
    },
  });
};

export interface AssignmentEvaluation {
  comment: string;
  grade: number;
  requiredGrade: number;
  maxGrade: number;
}

export interface CourseAssignment {
  assignment_id: string;
  name: string;
  description: string;
  created_at: string;
  due_at: string;
  fk_course_id: string;
  course_code: string;
  evaluation: AssignmentEvaluation;
  submitted_at: string;
  evaluted_at: string;
  evaluator: JsonUserProfile;
  created_by: JsonUserProfile;
}

export interface UseCourseAssignmentsQueryParams {
  courseId: string;
  submitted?: boolean;
  ascending?: boolean;
  limit?: number;
}

/**
 * Hook to fetch course assignments for a specific course
 *
 * @param courseId the course id
 * @param ascending whether to sort ascending or descending, defaults to ascending (true)
 * @param submitted whether to filter by submitted or not submitted, defaults to undefined (no filter)
 * @param limit the maximum number of assignments to fetch
 */
export const useCourseAssignmentsQuery = (
  params: UseCourseAssignmentsQueryParams
) => {
  const { courseId, submitted, ascending = true, limit } = params;

  return useQuery({
    queryKey: [CacheKey.ASSIGNMENTS, courseId, ascending, submitted, limit],
    queryFn: async () => {
      let query = supabase
        .from('current_user_assignment_view')
        .select('*')
        .order('due_at', { ascending })
        .eq('fk_course_id', courseId);

      if (submitted !== undefined) {
        if (submitted) {
          query = query.not('submitted_at', 'is', null);
        } else {
          query = query.filter('submitted_at', 'is', null);
        }
      }

      if (limit) query = query.limit(limit);

      const result = await query.throwOnError();

      return result.data as CourseAssignment[];
    },
  });
};

/**
 * Hook to fetch a single course assignment
 *
 * @param assignmentId the assignment id
 */
export const useCourseAssignmentQuery = (assignmentId: string) => {
  return useQuery({
    queryKey: [CacheKey.INDIVIDUAL_ASSIGNMENT, assignmentId],
    queryFn: async () => {
      const result = await supabase
        .from('current_user_assignment_view')
        .select('*')
        .eq('assignment_id', assignmentId)
        .single()
        .throwOnError();

      return result.data as CourseAssignment;
    },
  });
};
