import { useAuth } from '@/store/global';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';
import { CacheKey } from './cache';

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
export const useCourse = (courseId: string) => {
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
export const useCourseDescription = (courseId: string) => {
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

export interface Announcement {
  title: string;
  content: string;
}

/**
 * Hook for creating a new announcement and updating the announcements list.
 *
 * @param courseId the id of the course to create an announcement for
 *
 * @returns a mutation object with methods for creating an announcement.
 */
export const useCreateCourseAnnouncement = (courseId: string) => {
  const qc = useQueryClient();
  const { data: membership } = useCourseMembership(courseId);

  return useMutation({
    mutationFn: async (announcement: Announcement) => {
      const newAnnouncement = {
        fk_course_id: courseId,
        fk_created_by_member_id: membership?.course_member_id,
        title: announcement.title,
        content: announcement.content,
      };

      await supabase
        .from('course_announcement')
        .insert([newAnnouncement])
        .throwOnError();
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: [CacheKey.ANNOUNCEMENTS, courseId],
      });
    },
  });
};

export interface AnnouncementWithCreatedBy {
  announcement_id: string;
  created_by_full_name: string;
  created_by_role: string;
  created_by_avatar_url: string;
  content: string;
  title: string;
  created_at: string;
}

/**
 * Hook to fetch announcements for a course
 *
 * @param courseId the course id
 * @returns a query object with the result of the query
 */
export const useAnnouncements = (courseId: string) => {
  return useQuery({
    queryKey: [CacheKey.ANNOUNCEMENTS, courseId],
    queryFn: async () => {
      const result = await supabase
        .from('course_announcement_view')
        .select(
          'announcement_id, created_by_full_name, created_by_role, created_by_avatar_url, content, title, created_at, fk_course_id'
        )
        .eq('fk_course_id', courseId)
        .order('created_at', { ascending: false })
        .throwOnError();

      return result.data as AnnouncementWithCreatedBy[];
    },
  });
};

/**
 * Hook to fetch a single announcement
 *
 * @param announcementId the announcement id
 * @returns a query object with the result of the query
 */
export const useAnnouncement = (announcementId: string) => {
  return useQuery({
    queryKey: [CacheKey.INDIVIDUAL_ANNOUNCEMENT, announcementId],
    queryFn: async () => {
      const result = await supabase
        .from('course_announcement_view')
        .select(
          'announcement_id, created_by_full_name, created_by_role, created_by_avatar_url, content, title, created_at, fk_course_id'
        )
        .eq('announcement_id', announcementId)
        .single()
        .throwOnError();

      return result.data as AnnouncementWithCreatedBy;
    },
  });
};

export interface CourseMembership {
  role: CourseRole;
  course_member_id: string;
}

/**
 * Hook to fetch a users membership for a given course, with methods for signing up and leaving the course.
 *
 * @param courseId the course id
 *
 * @returns a query object with the result of the query, and two helper functions for signing up and leaving the course
 */
export const useCourseMembership = (courseId: string) => {
  const { session } = useAuth();
  const queryKey = [CacheKey.INDIVIDUAL_COURSE_MEMBER, courseId];
  const qc = useQueryClient();

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await supabase
        .from('course_member')
        .select('role, course_member_id')
        .eq('fk_course_id', courseId)
        .eq('fk_user_id', session?.user.id)
        .not('removed_at', 'is', null)
        .single()
        .throwOnError();

      return result.data as CourseMembership;
    },
  });

  const onMembershipMutated = () => {
    qc.invalidateQueries({ queryKey: [CacheKey.COURSES] });
    qc.invalidateQueries({ queryKey });
    qc.invalidateQueries({ queryKey: [CacheKey.EVENTS] });
    qc.invalidateQueries({ queryKey: [CacheKey.COURSE_DESCRIPTION, courseId] });
  };

  const signUpMutation = useMutation({
    mutationFn: async () => {
      if (query.data?.course_member_id) throw new Error('Already signed up');

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
    onSuccess: onMembershipMutated,
  });

  const leaveMutation = useMutation({
    mutationFn: async () => {
      if (!query.data?.course_member_id) throw new Error('Not signed up');

      await supabase
        .from('course_member')
        .update({ removed_at: new Date().toISOString() })
        .eq('course_member_id', query.data.course_member_id)
        .throwOnError();
    },
    onSuccess: onMembershipMutated,
  });

  return {
    ...query,
    signUp: signUpMutation.mutateAsync,
    isSigningUp: signUpMutation.isPending,
    leave: leaveMutation.mutateAsync,
    isLeaving: leaveMutation.isPending,
  };
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
export const useUpsertCourseBoard = (courseId: string) => {
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
 * @param boardId the id of the board to delete
 *
 * @returns a mutation object with methods for deleting a course board.
 */
export const useDeleteCourseBoard = (courseId: string) => {
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
