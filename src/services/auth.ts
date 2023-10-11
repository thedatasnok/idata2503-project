import { supabase } from './supabase';

/**
 * Sign in with email with Supabase Auth.
 * @returns Returns an error object if there's an error, otherwise undefined.
 */
export async function signInWithEmail(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  return error;
}

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
