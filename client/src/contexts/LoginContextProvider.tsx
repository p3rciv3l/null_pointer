import { ReactNode, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import auth from '../firebase/config';
import LoginContext from './LoginContext';
import { User } from '../types';

interface LoginProviderProps {
  children: ReactNode;
}

const LoginProvider = ({ children }: LoginProviderProps) => {
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
    // Set the display name
    await updateProfile(userCredential.user, {
      displayName: username,
    });
    // Sign out immediately after signup
    await signOut(auth);
  };

  const value = { currentUser, loading, login, logout, signUp };

  return <LoginContext.Provider value={value}>{children}</LoginContext.Provider>;
};

export default LoginProvider;
