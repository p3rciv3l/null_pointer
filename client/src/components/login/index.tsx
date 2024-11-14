import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';

const Login = () => {
  console.log('Login component rendering');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Login form submitted');
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className='container'>
      <h2>Welcome to FakeStackOverflow!</h2>
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
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='Password'
          required
          className='input-text'
        />
        <button type='submit' className='login-button' disabled={loading}>
          Log In
        </button>
      </form>
      <p>
        Don&apos;t have an account? <Link to='/signup'>Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
