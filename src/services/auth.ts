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

      if (response.error) throw response.error;

      return response.data;
    },
  });
};

export const enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
