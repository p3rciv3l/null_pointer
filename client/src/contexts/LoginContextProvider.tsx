import { ReactNode, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import auth from '../firebase/config';
import LoginContext from './LoginContext';
import { User } from '../types';

interface LoginProviderProps {
  children: ReactNode;
}

const LoginProvider = ({ children }: LoginProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email!,
          username: user.displayName || 'Anonymous',
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        throw new Error(error.message);
      }
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  const signUp = async (email: string, password: string, username: string): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: username,
      });
      await signOut(auth);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        throw new Error(error.message);
      }
      throw error;
    }
  };

  const value = { currentUser, loading, login, logout, signUp };

  return <LoginContext.Provider value={value}>{children}</LoginContext.Provider>;
};

export default LoginProvider;
