import { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

export interface GlobalState {
  showDrawer: boolean;
  authenticated: boolean;
  session: Session | null;
}

export interface GlobalActions {
  setShowDrawer: (value: boolean) => void;
  setAuthenticated: (value: boolean) => void;
  setSession: (value: Session | null) => void;
}

export type GlobalStore = GlobalState & GlobalActions;

/**
 * Global store for the application.
 * Contains universal state and actions.
 */
const useGlobalStore = create<GlobalStore>((set, _get) => ({
  showDrawer: false,
  authenticated: false,
  session: null,
  setShowDrawer: (value) => set(() => ({ showDrawer: value })),
  setAuthenticated: (value) => set(() => ({ authenticated: value })),
  setSession: (value) => set(() => ({ session: value })),
}));

/**
 * Hook for accessing the global drawer state.
 *
 * @returns an object with the drawer state and functions for opening and closing the drawer.
 */
export const useDrawer = () => {
  const show = useGlobalStore((s) => s.showDrawer);
  const toggleDrawer = useGlobalStore((s) => s.setShowDrawer);

  const open = () => toggleDrawer(true);
  const close = () => toggleDrawer(false);

  return { show, open, close };
};

/**
 * Hook for accessing the global authentication state.
 *
 * @returns an object with the authentication state and functions for logging in and out.
 */
export const useAuth = () => {
  const authenticated = useGlobalStore((s) => s.authenticated);
  const session = useGlobalStore((s) => s.session);
  const setAuthenticated = useGlobalStore((s) => s.setAuthenticated);
  const setSession = useGlobalStore((s) => s.setSession);

  const login = (session: Session) => {
    setAuthenticated(true);
    setSession(session);
  };

  const logout = () => {
    setAuthenticated(false);
    setSession(null);
  };

  return { authenticated, session, login, logout };
};
