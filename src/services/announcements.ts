import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CacheKey } from './cache';
import { useCourseMembership } from './courses';
import { supabase } from './supabase';

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
  fk_course_id: string;
  course_code: string;
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

export interface UseAllAnnouncementsQueryParams {
  limit?: number;
}

/**
 * Hook to fetch announcements for all courses the user is enrolled in
 */
export const useAllAnnouncements = (params: UseAllAnnouncementsQueryParams) => {
  const { limit } = params;

  return useQuery({
    queryKey: [CacheKey.ALL_ANNOUNCEMENTS, limit],
    queryFn: async () => {
      let query = supabase
        .from('course_announcement_view')
        .select(
          'announcement_id, created_by_full_name, created_by_role, created_by_avatar_url, content, title, created_at, fk_course_id, course_code'
        )
        .order('created_at', { ascending: false });

      if (limit) query = query.limit(limit);

      const result = await query.throwOnError();

      return result.data as AnnouncementWithCreatedBy[];
    },
  });
};
