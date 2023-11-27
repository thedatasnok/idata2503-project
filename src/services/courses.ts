import { useAuth } from '@/store/global';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CacheKey } from './cache';
import { supabase } from './supabase';

export interface UseCoursesQueryParams {
  active?: boolean;
  enrolled?: boolean;
  limit?: number;
  searchString?: string;
}

export interface CourseListItem {
  course_id: string;
  course_code: string;
  name: string;
  starts_at: string;
  ends_at: string;
  active: boolean;
  enrolled: boolean;
}

/**
 * Hook to fetch courses from Supabase.
 */
export const useCoursesQuery = (params: UseCoursesQueryParams) => {
  const { active, enrolled, limit, searchString } = params;

  return useQuery({
    queryKey: [CacheKey.COURSES, active, enrolled, limit, searchString],
    queryFn: async () => {
      let query = supabase
        .from('course_membership_view')
        .select(
          'course_id, course_code, name, starts_at, ends_at, active, enrolled'
        );

      if (active !== undefined) query = query.eq('active', active);
      if (enrolled !== undefined) query = query.eq('enrolled', enrolled);

      query = query.ilike('searchable_name', `%${searchString ?? ''}%`);

      if (limit !== undefined) query = query.limit(limit);

      const result = await query.throwOnError();

      return result.data as CourseListItem[];
    },
  });
};

export interface CourseDetails {
  course_id: string;
  course_code: string;
}

/**
 * Hook to fetch a single course from Supabase.
 *
 * @param courseId the course id
 *
 * @returns a query object with the result of the query
 */
export const useCourseQuery = (courseId: string) => {
  return useQuery({
    queryKey: [CacheKey.INDIVIDUAL_COURSE, courseId],
    queryFn: async () => {
      const result = await supabase
        .from('course')
        .select('*')
        .eq('course_id', courseId)
        .single()
        .throwOnError();

      return result.data as CourseDetails;
    },
  });
};

export const enum CourseRole {
  STUDENT = 'STUDENT',
  ASSISTANT = 'ASSISTANT',
  LECTURER = 'LECTURER',
}

export interface CourseMember {
  user_id: string;
  name: string;
  email: string;
  avatar_url: string;
  role: CourseRole;
}

export interface CourseDescription {
  course_id: string;
  course_code: string;
  name: string;
  description: string;
  enrolled: boolean;
  starts_at: string;
  ends_at: string;
  staff: CourseMember[];
}

/**
 * Hook to fetch a course's description from Supabase.
 *
 * @param courseId the course id
 *
 * @returns a query object with the result of the query
 */
export const useCourseDescriptionQuery = (courseId: string) => {
  return useQuery({
    queryKey: [CacheKey.COURSE_DESCRIPTION, courseId],
    queryFn: async () => {
      const result = await supabase
        .from('current_user_course_description')
        .select('*')
        .eq('course_id', courseId)
        .single()
        .throwOnError();

      return result.data as CourseDescription;
    },
  });
};

export interface CourseBoard {
  course_board_id: string;
  name: string;
  description: string;
  created_at: string;
  created_by_member_id: string;
  course_id: string;
}

/**
 * Hook to fetch the course boards for a course
 *
 * @param courseId the course id
 * @returns a query object with the result of the query
 */
export const useCourseBoards = (courseId: string) => {
  return useQuery({
    queryKey: [CacheKey.COURSE_BOARDS, courseId],
    queryFn: async () => {
      const result = await supabase
        .from('course_board')
        .select('*')
        .eq('fk_course_id', courseId)
        .throwOnError();

      return result.data as CourseBoard[];
    },
  });
};

/**
 * Hook to fetch a single course board
 *
 * @param boardId the course board id
 * @returns a single course board object
 */
export const useCourseBoard = (boardId: string) => {
  return useQuery({
    queryKey: [CacheKey.INDIVIDUAL_COURSE_BOARD, boardId],
    queryFn: async () => {
      const result = await supabase
        .from('course_board')
        .select('*')
        .eq('course_board_id', boardId)
        .single()
        .throwOnError();

      return result.data as CourseBoard;
    },
  });
};

export interface CourseBoardFormData {
  id?: string;
  name: string;
  description: string;
}

/**
 * Hook for upserting a course board and updating the course boards list.
 *
 * @param courseId the id of the course to upsert a board in
 *
 * @returns a mutation object with methods for upserting a course board.
 */
export const useUpsertCourseBoardMutation = (courseId: string) => {
  const qc = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (data: CourseBoardFormData) => {
      let courseBoard: any = {
        fk_course_id: courseId,
        name: data.name,
        description: data.description,
      };

      if (data.id) courseBoard.course_board_id = data.id;
      if (!data.id) courseBoard.fk_created_by_user_id = session?.user.id;

      await supabase
        .from('course_board')
        .upsert([courseBoard], {
          onConflict: 'course_board_id',
        })
        .throwOnError();
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: [CacheKey.COURSE_BOARDS, courseId],
      });
    },
  });
};

/**
 * Hook for deleting a course board and updating the course boards list.
 *
 * @returns a mutation object with methods for deleting a course board.
 */
export const useDeleteCourseBoardMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (boardId: string) => {
      await supabase
        .from('course_board')
        .delete()
        .eq('course_board_id', boardId)
        .throwOnError();
    },
    onSuccess: (_data, boardId) => {
      qc.invalidateQueries({
        queryKey: [CacheKey.COURSE_BOARDS],
      });
      qc.invalidateQueries({
        queryKey: [CacheKey.INDIVIDUAL_COURSE_BOARD, boardId],
      });
    },
  });
};
