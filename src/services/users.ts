import { useAuth } from '@/store/global';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CacheKey } from './cache';
import { supabase } from './supabase';
import { UserRole } from './auth';

export interface JsonUserProfile {
  userId: string;
  fullName: string;
  avatarUrl: string;
}

export interface PublicUserProfile {
  user_id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  common_course: boolean;
}

export const usePublicUserProfiles = (searchString: string, skip?: boolean) => {
  const { session } = useAuth();

  return useQuery({
    enabled: !skip,
    queryKey: [CacheKey.USER_PROFILES, searchString],
    queryFn: async ({ queryKey }) => {
      const [_key, searchString] = queryKey;
      const profiles = await supabase
        .from('public_user_profile_view')
        .select('*')
        .order('common_course', { ascending: false })
        .ilike('full_name', `%${searchString}%`)
        .neq('user_id', session?.user.id)
        .throwOnError();

      return profiles.data as PublicUserProfile[];
    },
  });
};

export interface UserProfile {
  full_name: string;
  email: string;
  avatar_url: string;
  preferences: {};
  role: UserRole;
}

/**
 * Hook to fetch the current user's profile.
 * Will cache the profile details until invalidated.
 */
export const useProfile = () => {
  return useQuery({
    queryKey: [CacheKey.CURRENT_USER_PROFILE],
    staleTime: Infinity,
    queryFn: async () => {
      const result = await supabase
        .from('user_profile_view')
        .select('*')
        .single();

      return result.data as UserProfile;
    },
  });
};

/**
 * Hook to fetch a user profile.
 */
export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: [CacheKey.USER_PROFILES, userId],
    queryFn: async () => {
      const result = await supabase
        .from('user_profile')
        .select('*')
        .eq('fk_user_id', userId)
        .single();

      return result.data as UserProfile;
    },
  });
};

/**
 * Hook to update the current user's profile.
 * Will invalidate the profile cache on success.
 */
export const useUpdateProfileMutation = () => {
  const qc = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (updatedProfile: Partial<UserProfile>) => {
      // Update full_name in user_profile table
      const { error } = await supabase
        .from('user_profile')
        .update({ full_name: updatedProfile.full_name })
        .eq('fk_user_id', session?.user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CacheKey.CURRENT_USER_PROFILE] });
    },
  });
};
