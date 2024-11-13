import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { signUp, loading } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password, username);
      navigate('/'); // Redirect to login after successful signup
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div className='container'>
      <h2>Create your FakeStackOverflow Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='Email'
          required
          className='input-text'
        />
        <input
          type='text'
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder='Username'
          required
          className='input-text'
        />
        <input
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='Password'
          required
          className='input-text'
        />
        <button type='submit' className='signup-button' disabled={loading}>
          Sign Up
        </button>
      </form>
      <p>
        Already have an account? <a href='/'>Log in</a>
      </p>
    </div>
  );
};

export default SignUp;
