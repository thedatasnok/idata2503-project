import { useAuth } from '@/store/global';
import { useQuery } from '@tanstack/react-query';
import { CacheKey } from './cache';
import { supabase } from './supabase';

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
