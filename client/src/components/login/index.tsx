import './index.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLoginContext from '../../hooks/useLoginContext';

/**
 * Login Component contains a form that allows the user to input their username, which is then submitted
 * to the application's context through the useLoginContext hook.
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
        await signUp(email, password, username);
      } else {
        await login(email, password);
      }
      navigate('/home');
    } catch (error) {
      setError('Authentication failed. Please try again.');
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className='container'>
      <h2>Welcome to FakeStackOverflow!</h2>
      <h4>{isSignUp ? 'Create an account' : 'Sign in to your account'}</h4>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='Email'
          required
        />
        <input
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='Password'
          required
        />
        {isSignUp && (
          <input
            type='text'
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder='Username'
            required
          />
        )}
        <button type='submit'>{isSignUp ? 'Sign Up' : 'Login'}</button>
        <button type='button' onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Login;
