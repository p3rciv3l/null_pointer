import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';
import './index.css';

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
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-box'>
        <h2>Join HuskyFlow</h2>
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
            <label>Username</label>
            <input
              type='text'
              value={username}
              onChange={e => setUsername(e.target.value)}
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
              placeholder='8+ characters (at least 1 letter & 1 number)'
              required
              className='auth-input'
            />
          </div>
          <button type='submit' className='auth-button' disabled={loading}>
            Sign up
          </button>
        </form>
        <p className='auth-footer'>
          Already have an account? <Link to='/'>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
