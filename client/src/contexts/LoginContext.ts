import { createContext } from 'react';
import { User } from '../types';

/**
 * Interface representing the context type for user login management.
 *
 * - setUser - A function to update the current user in the context,
 *             which take User object representing the logged-in user or null
 *             to indicate no user is logged in.
 * - currentUser - The current user in the context.
 * - loading - A boolean indicating whether the login process is in progress.
 * - login - A function to log in a user.
 * - logout - A function to log out the current user.
 * - signUp - A function to sign up a new user.
 */
export interface LoginContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
}

const LoginContext = createContext<LoginContextType>({
  currentUser: null,
  loading: false,
  login: async () => {},
  logout: async () => {},
  signUp: async () => {},
});

export default LoginContext;
