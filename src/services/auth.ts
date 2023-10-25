import { useMutation } from '@tanstack/react-query';
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

      return response.data;
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
