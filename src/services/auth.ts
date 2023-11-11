import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';

export interface SignInForm {
  email: string;
  password: string;
}

export const useEmailSignIn = () => {
  return useMutation({
    mutationFn: async ({ email, password }: SignInForm) => {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (response.error) throw response.error;

      return response.data;
    },
  });
};

export const enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface UserProfile {
  full_name: string;
  email: string;
  avatar_url: string;
  preferences: {};
  role: UserRole;
}

const PROFILE_KEY = 'whiteboardapp/profile';

/**
 * Hook to fetch the current user's profile.
 * Will cache the profile details until invalidated.
 */
export const useProfile = () => {
  return useQuery({
    queryKey: [PROFILE_KEY],
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
    queryKey: [PROFILE_KEY, userId],
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

  return useMutation({
    mutationFn: async (updatedProfile: Partial<UserProfile>) => {
      // Update full_name in user_profile table
      const { error } = await supabase
        .from('user_profile')
        .update({ full_name: updatedProfile.full_name })
        .eq('fk_user_id', (await getCurrentUser()).data.user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PROFILE_KEY] });
    },
  });
};

/**
 * Sign out the current user.
 * @returns Returns an error object if there's an error, otherwise undefined.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return error;
}

/**
 * Get the current authenticated user.
 * @returns Returns the user object if authenticated, otherwise null.
 */
export function getCurrentUser() {
  return supabase.auth.getUser();
}
