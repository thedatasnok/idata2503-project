import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';
import { useAuth } from '@/store/global';

export interface SignInForm {
  email: string;
  password: string;
}

/**
 * Hook for signing in with email and password.
 */
export const useEmailSignInMutation = () => {
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

/**
 * Hook for signing out the current user.
 * Invalidates all queries on success.
 */
export const useSignoutMutation = () => {
  const qc = useQueryClient();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: async () => {
      await supabase.auth.signOut();
      logout();
    },
    onSuccess: () => {
      // invalidates any cache entries
      qc.invalidateQueries();
    },
  });
};
