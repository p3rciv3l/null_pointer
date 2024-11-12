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
  setUser: (user: User | null) => void;
  currentUser: User | null;
  loading: boolean;
  login: (username: string) => void;
  logout: () => void;
  signUp: (username: string) => void;
}

const LoginContext = createContext<LoginContextType | null>(null);

export default LoginContext;
