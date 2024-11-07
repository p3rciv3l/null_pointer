import { createContext } from 'react';
import { User } from '../types';

/**
 * Interface representing the context type for user login management.
 *
 * - setUser - A function to update the current user in the context,
 *             which take User object representing the logged-in user or null
 *             to indicate no user is logged in.
 * - login - A function to log in a user with email and password.
 * - logout - A function to log out the current user.
 * - signUp - A function to sign up a new user with email, password, and username.
 * - currentUser - The current user in the context.
 * - loading - A boolean indicating whether the context is loading.
 */
export interface LoginContextType {
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  currentUser: User | null;
  loading: boolean;
}

const LoginContext = createContext<LoginContextType | null>(null);

export default LoginContext;
