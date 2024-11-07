import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import FakeStackOverflow from './components/fakestackoverflow';
import { FakeSOSocket, User } from './types';
import LoginContext, { LoginContextType } from './contexts/LoginContext';
import {
  login as loginService,
  logout as logoutService,
  signUp as signUpService,
} from './services/authService';
import { auth } from './config/firebase';

const App = () => {
  const [socket, setSocket] = useState<FakeSOSocket | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const serverURL = process.env.REACT_APP_SERVER_URL;

  if (serverURL === undefined) {
    throw new Error("Environment variable 'REACT_APP_SERVER_URL' must be defined");
  }

  // handle Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email || '',
          username: user.email?.split('@')[0] || '',
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Socket connection
  useEffect(() => {
    if (!socket) {
      setSocket(io(serverURL));
    }

    return () => {
      if (socket !== null) {
        socket.disconnect();
      }
    };
  }, [socket, serverURL]);

  const loginContextValue: LoginContextType = {
    currentUser,
    loading,
    setUser: setCurrentUser,
    login: async (email: string, password: string) => {
      setLoading(true);
      try {
        const user = await loginService(email, password);
        setCurrentUser(user);
      } finally {
        setLoading(false);
      }
    },
    signUp: async (email: string, password: string, username: string) => {
      setLoading(true);
      try {
        const user = await signUpService(email, password, username);
        setCurrentUser(user);
      } finally {
        setLoading(false);
      }
    },
    logout: async () => {
      setLoading(true);
      try {
        await logoutService();
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    },
  };

  return (
    <Router>
      <LoginContext.Provider value={loginContextValue}>
        <FakeStackOverflow socket={socket} />
      </LoginContext.Provider>
    </Router>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}
