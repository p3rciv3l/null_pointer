import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import useLogin from '../../hooks/useLogin';
import './index.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { signUp, loading } = useLogin();
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password, username);
      navigate('/', {
        state: {
          message: 'Account created successfully! Please sign in.',
        },
      });
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        const input = document.querySelector('input[type="email"]') as HTMLInputElement;
        if (err.code === 'auth/email-already-in-use') {
          input.setCustomValidity(
            'This email is already registered. Please try logging in instead.',
          );
          input.reportValidity();
        } else if (err.code === 'auth/weak-password') {
          const passwordInput = document.querySelector(
            'input[type="password"]',
          ) as HTMLInputElement;
          passwordInput.setCustomValidity('Password should be at least 6 characters long.');
          passwordInput.reportValidity();
        } else if (err.code === 'auth/invalid-email') {
          input.setCustomValidity('Please enter a valid email address.');
          input.reportValidity();
        } else {
          input.setCustomValidity('Failed to create account. Please try again.');
          input.reportValidity();
        }
      }
    }
  };

  // reset custom validity when input changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.setCustomValidity('');
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    const passwordInput = e.target as HTMLInputElement;

    if (newPassword) {
      if (newPassword.length < 8) {
        passwordInput.setCustomValidity('Password must be at least 8 characters long');
      } else if (!/[A-Za-z]/.test(newPassword)) {
        passwordInput.setCustomValidity('Password must contain at least one letter');
      } else if (!/[0-9]/.test(newPassword)) {
        passwordInput.setCustomValidity('Password must contain at least one number');
      } else {
        passwordInput.setCustomValidity('');
      }
    } else {
      passwordInput.setCustomValidity('');
    }

    passwordInput.reportValidity();
    setPassword(newPassword);
  };

  return (
    <div className='auth-container'>
      <div className='auth-box'>
        <h2>
          Join{' '}
          <img
            src={`${process.env.PUBLIC_URL}/assets/text_logo.png`}
            alt='Null Pointer'
            className='inline-logo'
          />
        </h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Email</label>
            <input
              type='email'
              value={email}
              onChange={handleEmailChange}
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
              onChange={handlePasswordChange}
              placeholder='8+ characters (at least 1 letter & 1 number)'
              required
              className='auth-input'
            />
          </div>
          <button type='submit' className='auth-button' disabled={loading || !!passwordError}>
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
