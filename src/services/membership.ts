import { useQuery } from '@tanstack/react-query';
import { CacheKey } from './cache';
import { CourseRole } from './courses';
import { supabase } from './supabase';

export interface CourseMember {
  course_id: string;
  user_id: string;
  member_id: string;
  full_name: string;
  avatar_url: string;
  role: CourseRole;
}

export interface GroupedCourseMembers {
  title: CourseRole;
  data: CourseMember[];
}

/**
 * Hook for fetching course members by a course id.
 *
 * @param courseId the id of the course to find members for
 *
 * @returns a query object containing the course members
 */
export const useCourseMembers = (courseId: string) => {
  return useQuery({
    queryKey: [CacheKey.COURSE_MEMBERS, courseId],
    queryFn: async () => {
      const response = await supabase
        .from('course_member_view')
        .select('course_id, member_id, user_id, full_name, avatar_url, role')
        .eq('course_id', courseId)
        .throwOnError();

      return response.data as CourseMember[];
    },
    select: (data: CourseMember[]) => {
      const grouped: Record<CourseRole, CourseMember[]> = {
        [CourseRole.LECTURER]: [],
        [CourseRole.ASSISTANT]: [],
        [CourseRole.STUDENT]: [],
      };

      data.forEach((member) => {
        grouped[member.role].push(member);
      });

      const out: GroupedCourseMembers[] = [];

      if (grouped[CourseRole.LECTURER].length > 0) {
        out.push({
          title: CourseRole.LECTURER,
          data: grouped[CourseRole.LECTURER],
        });
      }

      if (grouped[CourseRole.ASSISTANT].length > 0) {
        out.push({
          title: CourseRole.ASSISTANT,
          data: grouped[CourseRole.ASSISTANT],
        });
      }

      if (grouped[CourseRole.STUDENT].length > 0) {
        out.push({
          title: CourseRole.STUDENT,
          data: grouped[CourseRole.STUDENT],
        });
      }

      return out;
    },
  });
};
