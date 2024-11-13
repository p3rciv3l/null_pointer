import { useContext } from 'react';
import LoginContext, { LoginContextType } from '../contexts/LoginContext';

export const useLogin = (): LoginContextType => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error('useLogin must be used within a LoginProvider');
  }
  return context;
};