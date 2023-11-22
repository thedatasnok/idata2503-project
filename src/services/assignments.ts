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
export const useAllAssignments = (params: UseAllAssignmentsQueryParams) => {
  const {
    sortBy = 'due_at',
    submitted = false,
    ascending = true,
    limit,
  } = params;

  return useQuery({
    queryKey: [CacheKey.ALL_ASSIGNMENTS, sortBy, ascending],
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

/**
 * Hook to fetch course assignments for a specific course
 */
export const useCourseAssignments = (
  courseId: string,
  ascending: boolean = true
) => {
  return useQuery({
    queryKey: [CacheKey.ASSIGNMENTS, courseId, ascending],
    queryFn: async () => {
      const result = await supabase
        .from('current_user_assignment_view')
        .select('*')
        .order('created_at', { ascending: ascending })
        .eq('fk_course_id', courseId)
        .throwOnError();

      return result.data as CourseAssignment[];
    },
  });
};

/**
 * Hook to fetch a single course assignment
 */
export const useCourseAssignment = (assignmentId: string) => {
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
