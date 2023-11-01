import { useAuth } from '@/store/global';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

const DESCRIPTION_KEY = 'whiteboardapp/course-description';

/**
 * Hook to fetch a course's description from Supabase.
 *
 * @param courseId the course id
 *
 * @returns a query object with the result of the query
 */
export const useCourseDescription = (courseId: string) => {
  return useQuery({
    queryKey: [DESCRIPTION_KEY, courseId],
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

// TODO: idk if implemented in a good way or not
/**
 * Hook for signing up a user for a course and updating the course member list.
 *
 * @returns {UseMutation} A mutation object with methods for signing up for a course.
 */
export const useCourseSignUp = () => {
  const qc = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const newCourseMember = {
        fk_course_id: courseId,
        fk_user_id: session?.user.id,
        role: 'STUDENT',
      };

      await supabase
        .from('course_member')
        .insert([newCourseMember])
        .throwOnError();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [DESCRIPTION_KEY] });
    },
  });
};

// TODO: idk if implemented in a good way or not
/**
 * Hook to fetch a course's announcements from Supabase.
 *
 * @param courseId the course id
 * @returns a query object with the result of the query
 */
export const useAnnouncements = (courseId: string) => {
  return useQuery({
    queryKey: ['whiteboardapp/announcements', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_announcement')
        .select(
          'announcement_id, title, content, created_at, fk_created_by_member_id'
        )
        .eq('fk_course_id', courseId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch the 'created_by' information by joining with 'course_member' and 'user_profile' tables
      const announcementsWithCreatedBy = await Promise.all(
        data.map(async (announcement) => {
          const memberData = await supabase
            .from('course_member')
            .select('fk_user_id, role')
            .eq('course_member_id', announcement.fk_created_by_member_id)
            .single();

          if (!memberData) {
            return {
              ...announcement,
              created_by: 'Unknown User',
              avatar: 'default_avatar_url',
              role: 'Unknown Role',
            };
          }

          const userData = await supabase
            .from('user_profile')
            .select('full_name, avatar_url')
            .eq('fk_user_id', memberData.data?.fk_user_id)
            .single();

          return {
            ...announcement,
            created_by: userData.data?.full_name || 'Unknown User',
            avatar: userData.data?.avatar_url || 'default_avatar_url',
            role: memberData.data?.role || 'Unknown Role',
          };
        })
      );

      return announcementsWithCreatedBy;
    },
  });
};
