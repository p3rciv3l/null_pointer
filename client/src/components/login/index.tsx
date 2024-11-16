import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './index.css';
import useLogin from '../../hooks/useLogin';

const Login = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useLogin();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // show success message if redirected from signup
    const state = location.state as { message?: string };
    if (state?.message) {
      setSuccessMessage(state.message);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-box'>
        <h2>Welcome to HuskyFlow</h2>
        {successMessage && <div className='success-message'>{successMessage}</div>}
        {error && <div className='error-message'>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Email</label>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className='auth-input'
            />
          </div>
          <div className='form-group'>
            <label>Password</label>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className='auth-input'
            />
          </div>
          <button type='submit' className='auth-button' disabled={loading}>
            Log in
          </button>
        </form>
        <p className='auth-footer'>
          Don&apos;t have an account? <Link to='/signup'>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
