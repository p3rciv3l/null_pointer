import { ReactNode, useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import LoginContext from './LoginContext';
import { User } from '../types';

interface LoginProviderProps {
  children: ReactNode;
}

export const LoginProvider = ({ children }: LoginProviderProps) => {
  console.log('LoginProvider initialized');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('LoginProvider useEffect running');
    const unsubscribe = onAuthStateChanged(auth, user => {
      console.log('Auth state changed:', user);
      if (user) {
        // Set user data from Firebase
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

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const signUp = async (email: string, password: string, username: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Here you might want to store additional user data in your backend
  };

  return (
    <LoginContext.Provider value={{ currentUser, loading, login, logout, signUp }}>
      {!loading && children}
    </LoginContext.Provider>
  );
};
