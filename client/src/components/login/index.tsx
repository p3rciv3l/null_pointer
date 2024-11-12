import './index.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLoginContext from '../../hooks/useLoginContext';

/**
 * Login Component contains a form that allows users to either sign in with existing credentials
 * or create a new account through Firebase Authentication.
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const { login, signUp } = useLoginContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        if (!email || !password || !username) {
          setError('All fields are required');
          return;
        }
        await signUp(email, password, username);
      } else {
        if (!email || !password) {
          setError('Email and password are required');
          return;
        }
        await login(email, password);
      }
      navigate('/questions');
    } catch (err) {
      console.error('Auth error:', err);
      setError('Authentication failed. Please try again.');
    }
  };

  return (
    <div className='container'>
      <h2>Welcome to FakeStackOverflow!</h2>
      <h4>{isSignUp ? 'Create an account' : 'Sign in to your account'}</h4>
      {error && <div className='error-message'>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          className='input-text'
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='Email'
          required
        />
        <input
          type='password'
          className='input-text'
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='Password'
          required
        />
        {isSignUp && (
          <input
            type='text'
            className='input-text'
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder='Username'
            required
          />
        )}
        <button type='submit' className='submit-button'>
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
        <button
          type='button'
          className='toggle-auth-mode'
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError('');
          }}>
          {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Login;
