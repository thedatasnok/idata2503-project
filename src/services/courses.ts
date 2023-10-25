import { useQuery } from '@tanstack/react-query';
import { supabase } from './supabase';

export interface UseCoursesParams {
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
export const useCourses = (params: UseCoursesParams) => {
  const { active, enrolled, limit, searchString } = params;

  return useQuery({
    queryKey: ['whiteboardapp/courses', active, enrolled, limit, searchString],
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
export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['whiteboardapp/course', courseId],
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
