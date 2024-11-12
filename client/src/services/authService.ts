import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

interface FirebaseAuthError extends Error {
  code: string;
  message: string;
}

export const signUp = async (email: string, password: string, username: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email || '',
      username,
    };
  } catch (error) {
    console.error('Sign up error:', error);
    if (!(error instanceof Error)) {
      throw new Error('Unknown error occurred');
    }

    const authError = error as FirebaseAuthError;
    switch (authError.code) {
      case 'auth/email-already-in-use':
        throw new Error('Email already in use');
      case 'auth/weak-password':
        throw new Error('Password is too weak');
      case 'auth/invalid-email':
        throw new Error('Invalid email address');
      default:
        throw new Error('Error creating new user');
    }
  }
};

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email || '',
      username: email.split('@')[0],
    };
  } catch (error) {
    console.error('Login error:', error);
    if (
      (error as FirebaseAuthError).code === 'auth/user-not-found' ||
      (error as FirebaseAuthError).code === 'auth/wrong-password'
    ) {
      throw new Error('Invalid email or password');
    }
    throw new Error('Error logging in');
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Error logging out');
  }
};
