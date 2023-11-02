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

// TODO: Uses announcement_view
export interface Announcement {
  announcement_id: string;
  created_by_full_name: string;
  created_by_role: string;
  created_by_avatar_url: string;
  content: string;
  title: string;
  created_at: string;
}

// TODO: Uses announcement_view
export const useAnnouncements = (courseId: string) => {
  return useQuery({
    queryKey: ['whiteboardapp/announcements', courseId],
    queryFn: async () => {
      const result = await supabase
        .from('course_announcement_view')
        .select(
          'announcement_id, created_by_full_name, created_by_role, created_by_avatar_url, content, title, created_at, fk_course_id'
        )
        .eq('fk_course_id', courseId)
        .order('created_at', { ascending: false })
        .throwOnError();

      return result.data as Announcement[];
    },
  });
};

// TODO: Uses announcement_view
export const useAnnouncement = (announcementId: string) => {
  return useQuery({
    queryKey: ['whiteboardapp/announcement', announcementId],
    queryFn: async () => {
      const result = await supabase
        .from('course_announcement_view')
        .select(
          'announcement_id, created_by_full_name, created_by_role, created_by_avatar_url, content, title, created_at, fk_course_id'
        )
        .eq('announcement_id', announcementId)
        .single()
        .throwOnError();

      return result.data as Announcement;
    },
  });
};

// TODO: do i need to make sure the current user is a member?
export const useMembershipRole = (courseId: string) => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['whiteboardapp/course-member', courseId],
    queryFn: async () => {
      const result = await supabase
        .from('course_member')
        .select('role')
        .eq('fk_course_id', courseId)
        .eq('fk_user_id', session?.user.id)
        .single()
        .throwOnError();

      return result.data;
    },
  });
};
