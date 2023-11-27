import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CacheKey } from './cache';
import { CourseRole } from './courses';
import { supabase } from './supabase';
import { useAuth } from '@/store/global';

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
        .filter('removed_at', 'is', null)
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
    qc.invalidateQueries({ queryKey: [CacheKey.ALL_ASSIGNMENTS, courseId] });
    qc.invalidateQueries({ queryKey: [CacheKey.ALL_ANNOUNCEMENTS, courseId] });
  };

  const signUpMutation = useMutation({
    mutationFn: async () => {
      if (query.data?.course_member_id) throw new Error('Already signed up');

      const newCourseMember = {
        fk_course_id: courseId,
        fk_user_id: session?.user.id,
        role: 'STUDENT',
        removed_at: null,
      };

      await supabase
        .from('course_member')
        .upsert([newCourseMember])
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
