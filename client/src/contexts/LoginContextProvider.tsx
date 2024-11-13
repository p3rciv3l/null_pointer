import { ReactNode, useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import LoginContext from './LoginContext';
import { User } from '../types';

interface LoginProviderProps {
  children: ReactNode;
}

export const LoginProvider = ({ children }: LoginProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { uid, email: userEmail } = userCredential.user;
      // Fetch username from your backend using uid
      const username = 'fetchedUsername'; // Replace with actual API call
      setCurrentUser({ uid, email: userEmail!, username });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;
      // Save username to your backend
      setCurrentUser({ uid, email, username });
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        // Fetch username from your backend using user.uid
        const username = 'fetchedUsername'; // Replace with actual API call
        setCurrentUser({
          uid: user.uid,
          email: user.email!,
          username,
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <LoginContext.Provider value={{ currentUser, loading, login, logout, signUp }}>
      {!loading && children}
    </LoginContext.Provider>
  );
}; 